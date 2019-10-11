import fs = require("fs");
import open = require("open");
import { CrmOrganisationService } from "./services/CrmOrganisationService";
import { Authenticator } from "./util/authenticator";

function escapeJSON(val: string) {
  return val
    .replace(/[\\]/g, "\\\\")
    .replace(/[\/]/g, "\\/")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t")
    ;
}

async function Startup(): Promise<void> {
  try {

    let sourceAuthorityUrl: string;
    let sourceResourceUrl: string;
    let sourceClientId: string;
    let sourceClientSecret: string;
    let sourceWebAPIUrl: string;

    let destinationAuthorityUrl: string;
    let destinationResourceUrl: string;
    let destinationClientId: string;
    let destinationClientSecret: string;
    let destinationWebAPIUrl: string;

    require("dotenv").config();
    if (process.argv.length !== 4 && process.argv.length !== 14) {
      throw Error("usage: node index.js keyword outputFile soure_authorityUrl soure_resource soure_clientId soure_clientSecret soure_webAPIUrl destination_authorityUrl destination_resource destination_clientId destination_clientSecret destination_webAPIUrl");
    } else if (process.argv.length === 14) {
      sourceAuthorityUrl = process.argv[4];
      sourceResourceUrl = process.argv[5];
      sourceClientId = process.argv[6];
      sourceClientSecret = process.argv[7];
      sourceWebAPIUrl = process.argv[8];

      destinationAuthorityUrl = process.argv[9];
      destinationResourceUrl = process.argv[10];
      destinationClientId = process.argv[11];
      destinationClientSecret = process.argv[12];
      destinationWebAPIUrl = process.argv[13];
    } else {
      sourceAuthorityUrl = String(process.env.SOURCE_AUTHORITYURL);
      sourceResourceUrl = String(process.env.SOURCE_RESOURCEURL);
      sourceClientId = String(process.env.SOURCE_CLIENTID);
      sourceClientSecret = String(process.env.SOURCE_CLIENTSECRET);
      sourceWebAPIUrl = String(process.env.SOURCE_WEBAPIURL);

      destinationAuthorityUrl = String(process.env.DESTINATION_AUTHORITYURL);
      destinationResourceUrl = String(process.env.DESTINATION_RESOURCEURL);
      destinationClientId = String(process.env.DESTINATION_CLIENTID);
      destinationClientSecret = String(process.env.DESTINATION_CLIENTSECRET);
      destinationWebAPIUrl = String(process.env.DESTINATION_WEBAPIURL);
    }

    const keyword: string = process.argv[2];
    const outputFile: string = process.argv[3];

    const sourceAuthenticator = new Authenticator(
      sourceAuthorityUrl,
      sourceResourceUrl,
      sourceClientId,
      sourceClientSecret,
    );

    console.log("Retrieving the Source artefacts...");
    const sourceOrganisationService =
      new CrmOrganisationService(sourceAuthenticator, "Source", sourceWebAPIUrl);
    const sourceArtefacts = await sourceOrganisationService.retrieveArtefacts(keyword);
    const sourceRepresentation: string = JSON.stringify(sourceArtefacts, null, 2);

    const destinationAuthenticator = new Authenticator(
      destinationAuthorityUrl,
      destinationResourceUrl,
      destinationClientId,
      destinationClientSecret,
    );

    console.log("Retrieving the Destination artefacts...");
    const destinationOrganisationService =
      new CrmOrganisationService(destinationAuthenticator, "Destination", destinationWebAPIUrl);
    const destinationArtefacts = await destinationOrganisationService.retrieveArtefacts(keyword);
    const destinationRepresenation: string = JSON.stringify(destinationArtefacts, null, 2);

    let htmlContent: string = fs.readFileSync("lib/template/index.html", "utf8");
    htmlContent = htmlContent.replace("{___A___}", escapeJSON(sourceRepresentation));
    htmlContent = htmlContent.replace("{___B___}", escapeJSON(destinationRepresenation));

    fs.writeFile("lib/out/" + outputFile, htmlContent, (err: any) => {
      if (err) { throw err; }
    });

    // Opens the html report in the default browser.
    await open("lib/out/" + outputFile);

  } catch (error) {
    console.log(error);
  }
}

Startup();
