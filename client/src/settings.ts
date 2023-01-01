const isDev = import.meta.env.DEV;

// base urls for production
let promptBaseUrl = "https:SOME_BASE_URL.com/prompt";
let authorizationBaseUrl = "https:SOME_BASE_URL.com/authorization";

// base urls for development
if (isDev) {
  promptBaseUrl = "localhost:9000/prompt";
  authorizationBaseUrl = "localhost:9000/authorization";
}

export default {
  promptBaseUrl,
  authorizationBaseUrl,
};
