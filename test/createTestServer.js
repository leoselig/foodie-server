import {defer} from 'q';
import startServer from '../src/startServer';
import findFreePort from './findFreePort';

export default async (sequelize) => {
  const port = await findFreePort();
  
  const {stop} = await startServer({sequelize, port});

  return {stop, port};
};
