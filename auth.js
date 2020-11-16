const okta = require("@okta/okta-sdk-nodejs");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
require('dotenv').config();

// Define an Okta client so any user management tasks can be performed
const oktaClient = new okta.Client({
  orgUrl: process.env.OKTA_ORG_URL,
  token: process.env.OKTA_TOKEN
});

// Define the OpenID Connect client
const oidc = new ExpressOIDC({

  issuer: process.env.OKTA_ORG_URL + "/oauth2/default",
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: process.env.OKTA_CALLBACK_URI || "http://localhost:3000/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/"
    }
  }

});


module.exports = { oidc, oktaClient };
