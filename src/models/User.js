import {STRING, ENUM} from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
    firstName: {
      type: STRING
    },
    lastName: {
      type: STRING
    },
    email: {
      type: STRING,
      validate: {
        isEmail: true
      }
    },
    provider: {
      type: ENUM('facebook')
    },
    providerID: {
      type: STRING
    },
    gender: {
      type: ENUM('male', 'female')
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
};
