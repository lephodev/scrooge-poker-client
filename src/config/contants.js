import config from './config.json'
// const env = {
//   dev: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "http://localhost:3003",
//     landingClient: "http://localhost:3000",
//   },
//   production: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "https://poker-api.scrooge.casino",
//     landingClient: "https://scrooge.casino",
//   },
//   client: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "https://poker-api.scrooge.casino",
//     landingClient: "http://localhost:3000",
//   },
// };
// export default env.dev;
const contants = config[process.env.REACT_APP_ENV];
export default contants

