const path = require('path');
const { fetchMovies, fetchSingleMovie, getLatestMovie, addNewMovie } = require('./consumer');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like } = require('@pact-foundation/pact/src/dsl/matchers');
const { equal } = require('joi');

const {
  eachLike,
  integer,
  string,
} = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'WebConsumer',
  provider: 'MoviesAPI',
});

const EXPECTED_BODY = { id: 1, name: "The Shawshank Redemption", year:  1994 };
const EXPECTED_BODY_2 = "Movie not found"


// const EXPECTED_BODY_3 = { id: 1, name: "My movie", year: 1999 };

describe('Given Movies Service', () => {
  describe('When a GET request is made to /movies', () => {
    test('it should return all movies', async () => {
      provider
        .uponReceiving('a request to all movies')
        .withRequest({
          method: 'GET',
          path: '/movies',
        })
        .willRespondWith({
          status: 200,
          body: eachLike(EXPECTED_BODY),
        });

      await provider.executeTest(async mockProvider => {
        
        const movies = await fetchMovies(mockProvider.url);
        expect(movies[0]).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a GET request is made to a specific movie ID', () => {
    test('it should return a specific movie', async () => {
      const testId = 1;
      EXPECTED_BODY.id = testId;

      provider
        .given('Has a movie with specific ID', { id: testId })
        .uponReceiving('a request to a specific movie')
        .withRequest({
          method: 'GET',
          path: `/movie/${testId}`,
        })
        .willRespondWith({
          status: 200,
          body: {
            id: integer(testId),
            name: string(EXPECTED_BODY.name),
            year: integer(EXPECTED_BODY.year)
          }
        });

      await provider.executeTest(async mockProvider => {
        const movies = await fetchSingleMovie(mockProvider.url, testId);
        expect(movies).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a a GET request is made to a wrong movie ID', () => {
    test('it should return an error message saying movie not found', async () => {
      const testId = 100;
      EXPECTED_BODY_2.id = testId;

      provider
        .given('Has a movie with specific ID', { id: testId })
        .uponReceiving('a request with wrong id')
        .withRequest({
          method: 'GET',
          path: `/movie/${testId}`,
        })
        .willRespondWith({
          status: 404,
          contentType: 'text/html; charset=utf-8',
          body: EXPECTED_BODY_2
        });

      await provider.executeTest(async mockProvider => {
        console.log("no url", mockProvider.url)
        const movies = await fetchSingleMovie(mockProvider.url, testId);
        console.log("movies ", movies)
        expect(movies.data).toEqual(EXPECTED_BODY_2);
      });
    });
  });

  
  describe('When a new POST request is made to create a movie', () => {
    test('It should create a new movie', async () => {
   
      const payload = {
        name: "test movie",
        year: 2001
      }

      provider
        .given('movie doesnot exist')
        .uponReceiving('upon recieving a new POST request')
        .withRequest({
          method: 'POST',
          path: `/movies/create`,
          
          body : payload
        })
        .willRespondWith({
          status: 200,
          contentType: 'text/html; charset=utf-8',
          body: "new movie created"
        });
       
      await provider.executeTest(async mockProvider => {
       
        const response = await addNewMovie(mockProvider.url, payload.name, payload.year);
      
        expect(response).toEqual("new movie created")
       
       
       
      });
    });
  });

  
});