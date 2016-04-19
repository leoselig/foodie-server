import RootResource from './Root';
import AuthResource from './Auth';
import UserResource from './User';

export default function(sequelize) {
  return [
    new RootResource(sequelize),
    new AuthResource(sequelize),
    new UserResource(sequelize)
  ];
}
