
import DynamicsWebApi = require("dynamics-web-api");
import { Authenticator } from "../../util/authenticator";

export class CrmServiceBase {
  public dynamicsWebApi: DynamicsWebApi;

  constructor(authenticator: Authenticator,
              webApiUrl: string ) {
    this.dynamicsWebApi = new DynamicsWebApi({
      onTokenRefresh: authenticator.acquireToken,
      webApiUrl,
    });
  }

}
