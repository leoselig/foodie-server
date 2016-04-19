import {path, filter, GET, POST} from 'restify-resourcify';
import createErrorResponse from '../errors/createErrorResponse';

@path('/user')
export default class UserResource {

  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  @GET
  async getAllUsers() {
    const User = this.sequelize.model('User');
    const users = await User.findAll();
    return {
      data: users
    };
  }

  @POST
  async createUser(request) {
    const User = this.sequelize.model('User');
    try {
      const user = await User.create({
      ...request.body
      });
      return {
        data: user
      };
    } catch (error) {
      return createErrorResponse(error);
    }
  }

}
