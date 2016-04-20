import {expect} from 'chai';
import facebookAPI from '../../../src/core/facebookAPI';
import createTestEnvironment from '../../createTestEnvironment';

describe.skip('/auth', () => {
  let client;
  let tearDown;
  let clearDatabase;

  before(async () => {
    const testEnvironment = await createTestEnvironment();
    client = testEnvironment.client;
    tearDown = testEnvironment.tearDown;
    clearDatabase = testEnvironment.clearDatabase;
  });

  beforeEach(async () => {
    return await clearDatabase();
  });

  after(async () => {
    await tearDown();
  });

  it.only('responds 405 on GET, PUT, DELETE (only POST is expected)', async () => {
    const getResponse = await client.get('/auth');
    const putResponse = await client.put('/auth');
    const deleteResponse = await client.del('/auth');

    [getResponse, putResponse, deleteResponse].forEach((response) => {
      expect(response, `for ${response.req.method}`)
        .to.have.property('statusCode')
        .equal(405);
    });
  });

  describe('validation', () => {

    it('responds with 400 without provider', async () => {
      const response = await client.post('/auth', {});

      expect(response).to.have.property('statusCode').equal(400);
    });

  });

  describe('POST with provider = "facebook"', () => {

    afterEach(function() {

    });

    it('responds with token', async () => {
      const testUserCredentials = {
        password: 'uUfqF7+;3m-$<kuB',
        email: 'sxmakwg_vijayvergiyawitz_1460578907@tfbnw.net'
      };

      const facebookTestUserResponse = await facebookAPI('/v2.6/APP_ID/accounts/test-users', null);
      console.log(facebookTestUserResponse);
      console.log(facebookTestUserResponse.body);

      const response = await client.post('/auth', {}, {
        provider: 'facebook'
      });
      // expect(.body).to.be.an('object');
    });

  });

});
