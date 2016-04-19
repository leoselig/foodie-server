import {defer} from 'q';
import startServer from '../src/startServer';

export default async (sequelize) => {
  const {stop} = await startServer(sequelize);

  return {
    stop
  };
};
