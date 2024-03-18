const { Verifier } = require('@pact-foundation/pact');
const { importData, movies, server } = require('./provider')

// const port = '3001';
// const app = server.listen(port, () => console.log(`Listening on port ${port}...`));

importData();

const options = {
  provider: 'MoviesAPI',
  // base url of the api server
  providerBaseUrl: `http://localhost:3001`,
  // pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  pactBrokerUrl: 'https://usamaajmal.pactflow.io/',
  pactBrokerToken: '-XEd8h3t7zMCafQqffbkxw',
  providerVersion: '1.0.0',
  publishVerificationResult: true,
  consumerVersionTags: ['main'],
  // stateHandlers: {
  //   'Has a movie with specific ID': (parameters) => {
  //     movies.getFirstMovie().id = parameters.id;
  //     return Promise.resolve({ description: `Movie with ID ${parameters.id} added!` });
  //   }
  // }
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of movie-consumer', () => {
    return verifier
      .verifyProvider()
      .then(output => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
        // app.close();
      })
  });
});
