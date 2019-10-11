import { AuthenticationContext } from "adal-node";
import DynamicsWebApi = require("dynamics-web-api");

export class Authenticator {
  private authorityUrl: string;
  private resource: string;
  private clientId: string;
  private clientSecret: string;
  private adalContext: AuthenticationContext;

  constructor(
    authorityUrl: string,
    resource: string,
    clientId: string,
    clientSecret: string,
  ) {
    this.authorityUrl = authorityUrl;
    this.resource = resource;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.adalContext = new AuthenticationContext(authorityUrl);
    // this.acquireToken = this.acquireToken.bind(this)
  }

  public acquireToken = (dynamicsWebApiCallback: any): void => {
    function adalCallback(error: any, token: any) {
      if (!error) {
        dynamicsWebApiCallback(token);
      } else {
        throw Error("Token has not been retrieved. Error: " + error.stack);
      }
    }
    // call a necessary function in adal-node object to get a token
    this.adalContext.acquireTokenWithClientCredentials(this.resource,
      this.clientId,
      this.clientSecret,
      adalCallback);
  }
}
