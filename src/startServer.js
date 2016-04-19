import npmlog from 'npmlog';
import {defer} from 'q';
import restify from 'restify';
import {registerResources} from 'restify-resourcify';
import passport from 'passport';
import setupResources from './resources/setup';

export default async (sequelize) => {
  const server = restify.createServer();

  server.pre(restify.CORS());
  server.use(restify.CORS());
  server.use(restify.fullResponse());
  server.use(restify.bodyParser());
  server.use(passport.initialize());

  registerResources(server, setupResources(sequelize));

  server.listen(8880, () => {
    npmlog.info('server', `${server.name} listening at ${server.url}`);
  });

  return {
    async stop() {
      npmlog.info('server', 'Closing connection...');
      const deferred = defer();
      server.close(() => {
        npmlog.info('server', 'Closed connection');
        deferred.resolve();
      });
      return deferred.promise;
    }
  };

};
