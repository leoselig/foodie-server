import {UnauthorizedError} from 'restify';

export default class ExternalOAuthError extends UnauthorizedError {

  constructor({provider, message, ...options}) {
    super({
      restCode: 'ExternalOAuthError',
      message: `Provider "${provider}" denied authorization with "${message}"`,
      ...options
    });
  }

}
