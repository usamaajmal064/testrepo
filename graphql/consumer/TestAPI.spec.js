const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

const provider = new Pact({
  port: 1234,
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'TestAPI',
  provider: 'TestProvider',
});

describe('Pact with Reqres API', () => {
   
  beforeAll(() => provider.setup());

  afterAll(() => provider.finalize());

  afterEach(() => provider.verify());

  describe('when a request to retrieve user is made', () => {
    beforeAll(async () => {
      await provider.addInteraction({
        state: 'user 2 exists',
        uponReceiving: 'a request to retrieve user',
        withRequest: {
          method: 'GET',
          path: '/api/users/2',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
              "data": {
                  "id": 2,
                  "email": "janet.weaver@reqres.in",
                  "first_name": "Janet",
                  "last_name": "Weaver",
                  "avatar": "https://reqres.in/img/faces/2-image.jpg"
              },
              "support": {
                  "url": "https://reqres.in/#support-heading",
                  "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
              }
          
          },
        },
      });
    });

    test('returns the correct response', async () => {
      const response = await axios.get('http://localhost:1234/api/users/2');
      console.log(response)
      expect(response.status).toEqual(200);
    });
  });
});