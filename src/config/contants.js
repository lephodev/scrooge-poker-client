const env = {
  dev: {
    landingServerUrl: "http://localhost:3002",
    serverUrl: "http://localhost:3002",
    landingClient: "http://localhost:3000",
  },
  production: {
    landingServerUrl: "https://api.scrooge.casino/v1",
    serverUrl: "https://poker-api.scrooge.casino",
    landingClient: "https://scrooge.casino",
  },
  client: {
    landingServerUrl: "https://api.scrooge.casino/v1",
    serverUrl: "https://poker-api.scrooge.casino",
    landingClient: "http://localhost:3000",
  },
};

export default env.production;
