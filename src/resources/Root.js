import {path, GET} from 'restify-resourcify';

@path('/')
export default class RootResource {

  @GET
  async welcome() {
    return {
      data: {

      }
    };
  }

}
