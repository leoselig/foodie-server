import createClient from './createTestClient';
import createServer from './createTestServer';
import startDatabase from '../src/startDatabase';
import {database} from '../src/config';

export default async () => {
  const sequelize = await startDatabase(database);
  const {stop, port} = await createServer(sequelize);
  const client = createClient({port});

  async function clearDatabase() {
    await sequelize.sync({
      force: true
    });
  }

  return {
    client,
    clearDatabase,
    tearDown: stop
  };
};
