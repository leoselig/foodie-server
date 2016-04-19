import npmlog from 'npmlog';
import facebookAPI from '../core/facebookAPI';
import nock from 'nock';
import {path, schema, use, POST} from 'restify-resourcify';
import {authSchema} from '../schemas';
import ExternalOAuthError from '../errors/ExternalOAuthError';
import FacebookTokenStrategy from 'passport-facebook-token';
import passport from 'passport';

passport.use(new FacebookTokenStrategy({
  clientID: 'FACEBOOK_APP_ID',
  clientSecret: 'FACEBOOK_APP_SECRET'
},
function(accessToken, refreshToken, profile, done) {
  console.log('STRATEGY');
  done();
}));

@path('/auth')
export default class AuthResource {

  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  @POST
  @schema(authSchema)
  // @use(passport.authenticate('facebook-token'))
  async authenticate(request) {
    const providerStrategies = {
      'facebook': ::this.fetchFacebookUser
    };
    const providerStrategy = providerStrategies[request.body.provider];

    if (!providerStrategy) {
      return new Error();
    }

    const {provider, providerID, ...externalUser} = await providerStrategy(request);
    const user = await this.findOrCreateExternalUser(
      provider, providerID, externalUser);
    const AuthToken = this.sequelize.model('AuthToken');
    const authToken = await AuthToken.createForUser(user);
    return {
      data: authToken.get()
    };
  }

  async fetchFacebookUser(request) {
    const facebookResponse = await facebookAPI(
      '/me', request.body.accessToken, {
        fields: ['id', 'first_name', 'email', 'last_name', 'gender']
    });

    if (facebookResponse.error) {
      throw new ExternalOAuthError({
        message: facebookResponse.error.message,
        provider: 'facebook'
      });
    }

    const {
      id,
      first_name,
      last_name,
      gender,
      email
    } = facebookResponse;

    return {
      provider: 'facebook',
      providerID: id,
      firstName: first_name,
      lastName: last_name,
      gender,
      email
    };
  }

  async findOrCreateExternalUser(provider, providerID, userInfo) {
    const User = this.sequelize.model('User');
    const [user] = await User.findOrCreate({
      where: {
        provider,
        providerID
      },
      defaults: userInfo
    });
    return user;
  }

}
