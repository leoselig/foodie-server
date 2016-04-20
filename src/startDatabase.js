import Sequelize from 'sequelize';
import npmlog from 'npmlog';
import defineModels from './models';

const DB_NAME = 'foodie';

export default async function({username, password, database, host, port}) {
  npmlog.info('db', `Initializing connection to ${database} at ${host}:${port}`);

  const sequelize = new Sequelize(
    database, username, password, {

      host, port,
      dialect: 'mysql',

      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },

      logging(message) {
        npmlog.silly('sequelize', message);
      }

    });

  try {
    await sequelize.validate();
  } catch (error) {
    if (error.parent.code === 'ER_BAD_DB_ERROR') {
      npmlog.error('db', `Could not access database '${DB_NAME}'`);
    } else if (error.parent.code === 'ECONNREFUSED') {
      npmlog.error('db', `Could not connect to DB server ${sequelizeToString(sequelize)}`);
    }
    npmlog.error(error);
    throw error;
  }

  await sequelize.sync({
    force: true
  });

  npmlog.info('db', 'Syncing models');

  const models = defineModels(sequelize);

  try {
    models.forEach(async (model) => {
      npmlog.info('db', 'Register model ' + model.name);
      await model.sync({
        force: true
      });
    });
    npmlog.info('db', 'All models synced successfully');
    return sequelize;
  } catch (error) {
    npmlog.error('db', 'Syncing models failed');
    npmlog.error('db', error);
    throw error;
  }
}

function sequelizeToString(sequelize) {
  const dbOptions = sequelize.options;
  return `${dbOptions.dialect}://${dbOptions.host}:${dbOptions.port}`;
}
