import createClient from './createTestClient';
import createServer from './createTestServer';
import startDatabase from '../src/startDatabase';

export default async () => {
  const sequelize = await startDatabase();
  const {stop} = await createServer(sequelize);
  const client = createClient();

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
