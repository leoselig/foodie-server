import freeport from 'freeport';
import {defer} from 'q';

export default function findFreePort() {
  const {promise, resolve, reject} = defer();

  freeport((error, port) => {
    error ? reject(error) : resolve(port);
  });

  return promise;
}
