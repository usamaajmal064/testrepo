const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { default: axios } = require('axios');
const path = require('path');


const {
    eachLike,
    integer,
    string,
  } = MatchersV3;
  
  const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'TestAPI',
    provider: 'TestProvider',
  });

  const EXPECTED_BODY = { 
    data: {
        avatar: "https://reqres.in/img/faces/2-image.jpg",
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        id: 2,
        last_name: "Weaver"
      },
      support: {
        text: "To keep ReqRes free, contributions towards server costs are appreciated!",
        url: "https://reqres.in/#support-heading"
      }
};

describe('Test API', () => {
    describe('When a GET request is made to Test API', () => {
      test('it should return correct data', async () => {
        provider
          .uponReceiving('a request to test API')
          .withRequest({
            method: 'GET',
            path: '/api/users/2',
          })
          .willRespondWith({
            status: 200,
            data: eachLike(EXPECTED_BODY),
          });
  
        await provider.executeTest(async () => {
          try {
            const response = await axios.get("https://reqres.in/api/users/2", { timeout: 5000 }); // Set a timeout of 5 seconds
            console.log(response.data);
             expect(response.status).toEqual(200);
             expect(response.data).toEqual(EXPECTED_BODY);
          } catch (error) {
            console.error("Error:", error);
            throw error; // Rethrow the error to fail the test
          }
        });
      });
    });
  });
