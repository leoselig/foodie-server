import Q from 'q';
import startServer from './startServer';
import startDatabase from './startDatabase';

Q(startServer(startDatabase())).done();
