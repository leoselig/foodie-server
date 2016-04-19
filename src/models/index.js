import defineUser from './User';
import defineAuthToken from './AuthToken';

export default (sequelize) => {
  const User = defineUser(sequelize);
  const AuthToken = defineAuthToken(sequelize);

  AuthToken.belongsTo(User);
  User.hasMany(AuthToken);

  return [User, AuthToken];
};
