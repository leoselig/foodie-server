import {expect} from 'chai';
import createTestEnvironment from '../../createTestEnvironment';

describe.skip('/user', () => {

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

  describe('GET', () => {

    describe('without users', () => {

      it('returns empty array when no users exist', async () => {
        const response = await client.get('/user');
        expect(response.body).to.deep.equal([]);
      });

    });

    describe('with one user', () => {

      beforeEach(async () => {
        await createUser({
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@mustermann.com',
          provider: 'facebook',
          providerID: 'abc123',
          gender: 'male'
        });
      });

      it('returns array with one object ', async () => {
        const response = await client.get('/user');
        expect(response.body).to.have.length(1);
      });

      it('has exactly all the expected types of fields', async () => {
        const response = await client.get('/user');
        expectUserFields(response.body[0]);
      });

    });

  });

  describe('POST', () => {

    let response;

    beforeEach(async () => {
      response = await createUser({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@mustermann.com',
        provider: 'facebook',
        providerID: 'abc123',
        gender: 'male'
      });
    });

    it('returns a single object (not an array)', async () => {
      expect(response.body).to.be.an('object');
    });

    it('has exactly all the expected types of fields', async () => {
      expectUserFieldValues(response.body, {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@mustermann.com',
        provider: 'facebook',
        providerID: 'abc123',
        gender: 'male'
      });
    });

  });

  describe('validation', function() {

    const VALID_USER_PAYLOAD = {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@mustermann.com',
      provider: 'facebook',
      providerID: 'abc123',
      gender: 'male'
    };

    function expectValidationError(response, expectedErrors) {
      expect(response.statusCode).to.equal(422);
      expect(Object.keys(response.body)).to.deep.equal(['code', 'message', 'validationErrors']);
      expect(response.body.validationErrors).to.deep.equal(expectedErrors);
    }

    it('rejects invalid email with 400 "email "', async () => {
      const response = await createUser({
        ...VALID_USER_PAYLOAD,
        email: 'invalidqemail.com'
      });
      expectValidationError(response, ['email']);
    });

  });

  async function createUser(fields) {
    return await client.post('/user', {}, fields);
  }

});

function expectUserFields(user) {
  expect(user).to.be.a('object', 'user must be an object');
  expect(Object.keys(user)).to.have.length(9);
  expect(user.firstName).to.be.a('string');
  expect(user.lastName).to.be.a('string');
  expect(user.email).to.be.a('string');
  expect(user.provider).to.be.a('string');
  expect(user.providerID).to.be.a('string');
  expect(user.gender).to.be.a('string');
  expect(user.id).to.be.a('number');
  expect(user.createdAt).to.be.a('string');
  expect(user.updatedAt).to.be.a('string');
}

function expectUserFieldValues(user, values) {
  Object.keys(values).forEach((key) => {
    expect(user).to.have.property(key, values[key]);
  });
}
