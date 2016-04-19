import {createHmac} from 'crypto';
import {DATE} from 'sequelize';

const KEY = 'dj2wmukvpexnitnq8qjymtrj76581sgz';

function generateToken(user) {
  const userID = user.get('id');
  return createHmac('sha1', KEY)
    .update((userID + new Date().getTime()).toString())
    .digest('hex');
}

export default (sequelize) => {
  return sequelize.define('AuthToken', {
    expires: {
      type: DATE
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      async createForUser(user) {
        return await this.create({
          expires: new Date(),
          token: generateToken(user),
          User: user
        });
      }
    }
  });
};
