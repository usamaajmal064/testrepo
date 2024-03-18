const path = require('path');
const { getMovies, getMovieById } = require('./graphql-client.js')
const { Pact, GraphQLInteraction, Matchers } = require('@pact-foundation/pact');
const { eachLike } = Matchers;

const provider = new Pact({
    port: 4000,
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'GraphQLConsumerByID',
    provider: 'GraphQLProvider',
  });


  const EXPECTED_BODY = { id: 1, name: "My GraphQL movie", year: 1999 };

describe('GraphQL example', () => {
  // Setup the provider
  beforeAll(() => provider.setup());

  // Generate contract when all tests done
  afterAll(() => provider.finalize());

  // Verify the consumer expectations
  afterEach(() => provider.verify());

  describe('When a query to list a movie with id 1 is made', () => {
    beforeAll(() => {
      const graphqlQuery = new GraphQLInteraction()
      //var movieId =1
        .uponReceiving('a movies request')
        .withQuery(
          `
          query Movie($movieId: Int!) {
            movie(movieId: $movieId) {
              id
              name
              year
            }
          },
        `,
        {
            movieId: 1, // Change this to the desired movie ID
          },
        )
        .withOperation('Movie')
        .withVariables({})
        .withRequest({
          method: 'POST',
          path: '/graphql',
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: {
            data: {
              movies: eachLike(EXPECTED_BODY),
            },
          },
        });
      return provider.addInteraction(graphqlQuery);
    })

    test('returns the correct response', async () => {
      const response = await getMovieById();
      console.log(response)
      expect(response.movies).toEqual(EXPECTED_BODY);
    });
  });
});