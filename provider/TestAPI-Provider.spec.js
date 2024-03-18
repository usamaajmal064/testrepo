const { Verifier } = require('@pact-foundation/pact');

const options = {
    // provider: 'TestProvider',
    // providerBaseUrl: `https://reqres.in`,
    // // pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    // // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    // pactBrokerUrl: 'https://usamaajmal.pactflow.io/',
    // pactBrokerToken: '-XEd8h3t7zMCafQqffbkxw',
    // //providerVersion: '1.0.0',
    // publishVerificationResult: true,
    // consumerVersion: ['main'],
    // stateHandlers: {
    //   'test api': async (parameters) => {
    //     const response = await axios.get("https://reqres.in/api/users/2", { timeout: 5000 });
    //     return response;
    //   }
    // }
    provider: 'TestProvider',
    providerBaseUrl: 'https://reqres.in/api/users/2',
    pactUrls: ['https://usamaajmal.pactflow.io/pacts/provider/TestProvider/consumer/TestAPI/latest'],
    publishVerificationResult: true, // Optionally publish verification results to the Pact Broker
    providerVersion: '1.0.0',
    pactBrokerUrl: 'https://usamaajmal.pactflow.io/',
    pactBrokerToken: '-XEd8h3t7zMCafQqffbkxw',
    publishVerificationResult: true, // Optionally publish verification results to the Pact Broker
  // You might need other options depending on your specific setup
  stateHandlers: {
      'test api': async (parameters) => {
        const response = await axios.get("https://reqres.in/api/users/2", { timeout: 5000 });
        return response.data;
      }}
  };

  const verifier = new Verifier(options);


  describe('Pact Verification', () => {
    test('should validate test API', () => {
      return verifier
        .verifyProvider()
        .then(output => {
          console.log('Pact Verification Complete!');
          console.log('Result:', output);
          //app.close();
        })
    });
  });
  