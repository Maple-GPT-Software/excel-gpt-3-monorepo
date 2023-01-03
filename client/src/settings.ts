const isDev = import.meta.env.DEV;

// base urls for production
let promptBaseUrl = "https:SOME_BASE_URL.com/prompt";
let authorizationBaseUrl = "https:SOME_BASE_URL.com/authorization";

// base urls for development
if (isDev) {
  promptBaseUrl = "http://127.0.0.1:9000/prompt";
  authorizationBaseUrl = "http://127.0.0.1:9000/auth";
}

export default {
  promptBaseUrl,
  authorizationBaseUrl,
};
