import {defer} from 'q';
import {createJSONClient} from 'restify';

export default function createClient() {
  const client = createJSONClient({
    url: 'http://localhost:8880',
    connectTimeout: 2000,
    retry: false
  });

  return {
    get: wrapClientHTTPMethodWithPromise(::client.get),
    put: wrapClientHTTPMethodWithPromise(::client.put),
    post: wrapClientHTTPMethodWithPromise(::client.post),
    del: wrapClientHTTPMethodWithPromise(::client.del),
    head: wrapClientHTTPMethodWithPromise(::client.head)
  };
}

function wrapClientHTTPMethodWithPromise(method) {
  return async function (path, params = {}, body = null) {
    const deferred = defer();
    method({
      ...params,
      path,
      headers: {
        Connection: 'close'
      }
    }, ...(body ? [body] : []), (error, request, response, ...args) => {
      const isJSON = response.headers['content-type'] === 'application/json';
      response.body = (isJSON) ? JSON.parse(response.body) : response.body;
      deferred.resolve(response);
    });
    return deferred.promise;
  };
}
