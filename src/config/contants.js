const env = {
  dev: {
    landingServerUrl: "https://api.scrooge.casino/v1",
    serverUrl: "http://localhost:3002",
    landingClient: "http://localhost:3000",
  },
  production: {
    landingServerUrl: "https://api.scrooge.casino/v1",
    serverUrl: "https://poker-api.scrooge.casino",
    landingClient: "https://scrooge.casino",
  },
};

export default env.production;
