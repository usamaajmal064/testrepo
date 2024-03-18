# PactJS Contract Testing Example

An example test framework using Pact-js to validate contract testing between consumer and provider. The application that we are testing is a simple movies API which returns a list of movies.

## Running the Movies API locally

Install dependencies:
`npm i`

Run the movies API:
`npm run start:provider`

## Running the GraphQL server

On another terminal, run:

`npm run start:graphql:server`

## Running the web consumer tests

I am using [Pactflow](https://pactflow.io/) as my broker. To use Pactflow , register for their free developer plan and export your Pactflow Broker URL and API token:

```
export PACT_BROKER_URL=<PACT_BROKER_URL here>
export PACT_API_TOKEN=<API_TOKEN here>
```

Run the web consumer tests:
`npm run test:web:consumer`

Publish the contract to your pact broker:
`npm run publish:pact`

Run the provider tests:
`npm run test:provider`

## Running the GraphQL consumer tests

Run the GraphQL consumer tests:
`npm run test:graphql:consumer`

## View the allure reports

Run command to serve allure report:  
`npm run show:report`