import {defer} from 'q';
import FB from 'fb';

export default async function facebookAPI(endpoint, accessToken, options = {}) {
  const deferred = defer();
  FB.api(endpoint, {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
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
