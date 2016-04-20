import startServer from './startServer';
import startDatabase from './startDatabase';
import {database} from './config';

(async () => {
  try {
    startServer(await startDatabase(database));
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    process.exit(1);
  }
})();
