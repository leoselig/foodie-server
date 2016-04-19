import {defer} from 'q';
import FB from 'fb';

export default async function facebookAPI(endpoint, accessToken, options = {}) {
  const deferred = defer();
  FB.api(endpoint, {
    client_id: '',
    client_secret: '',
    access_token: accessToken,
    ...options
  }, (response) => {
    if (!response || response.error_msg) {
      deferred.reject(new Error(response ? (response.error_msg || '') : ''));
    }
    deferred.resolve(response);
  });
  return deferred.promise;
}
