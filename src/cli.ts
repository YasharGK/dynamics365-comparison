#!/usr/bin/env node

import * as spinner from "cli-spinner";
import * as fs from "fs";
import * as open from "open";
import * as optimist from "optimist";
import { CrmOrganisationService } from "./services/CrmOrganisationService";
import { Authenticator } from "./util/authenticator";
import * as HtmlHelper from "./util/htmlHelper";

let stdin: NodeJS.ReadStream;

const argv = optimist
    .usage("\n\nUsage: $0 [-k keyword] [-o outputReportFile] [-s sourceOutputFile] [-d destinationOutputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret destination_authorityUrl destination_resource destination_clientId destination_clientSecret")
    .default("k", "Microsoft")
    .default("o", "output.html")
    .default("s", "source.json")
    .default("d", "destination.json")
    .describe({
        k: "Only plug-ins containing this keyword will be included in the comparison",
        o: "Path of the HTML report that is generated",
        s: "Path of the JSON file with the Source artefacts representation",
        d: "Path of the JSON file with the Destination artefacts representation",

        soure_authorityUrl: "Source OAuth Token Endpoint (https://login.microsoftonline.com/00000000-0000-0000-0000-000000000011/oauth2/token)",
        soure_resource: "Source CRM Organization URL (https://myorg.crm.dynamics.com)",
        soure_clientId: "Source Dynamics 365 Client Id (registered in Azure App Registrations)('00000000-0000-0000-0000-000000000001')",
        soure_clientSecret: "Source ClientSecret for given ClientId",

        destination_authorityUrl: "Destination OAuth Token Endpoint (https://login.microsoftonline.com/00000000-0000-0000-0000-000000000011/oauth2/token)",
        destination_resource: "Destination CRM Organization URL (https://myorg.crm.dynamics.com)",
        destination_clientId: "Destination Dynamics 365 Client Id (registered in Azure App Registrations) ('00000000-0000-0000-0000-000000000001')",
        destination_clientSecret: "Destination ClientSecret for given ClientId",
    })
    .argv;

if (argv._.length == 8) {
     StartUp().then(() => {
        console.log("Press any key to exit...");
        stdin = process.stdin;
        stdin.on("data", function() {
            process.exit();
        });
    });
} else {
    showHelp();
}

async function StartUp(): Promise<void> {
    const statusSpinner = new spinner.Spinner("%s Initializing...");
    try {
        statusSpinner.setSpinnerString(3);
        statusSpinner.start();

        const sourceAuthorityUrl: string = argv._[0];
        const sourceResourceUrl: string = argv._[1];
        const sourceClientId: string = argv._[2];
        const sourceClientSecret: string = argv._[3];
        const sourceWebAPIUrl: string = sourceResourceUrl + "/api/data/v9.0/";

        const destinationAuthorityUrl: string = argv._[4];
        const destinationResourceUrl: string = argv._[5];
        const destinationClientId: string = argv._[6];
        const destinationClientSecret: string = argv._[7];
        const destinationWebAPIUrl: string = destinationResourceUrl + "/api/data/v9.0/";

        const keyword: string = argv.k;
        const outputSourceFile: string = argv.s;
        const outputDestinationFile: string = argv.d;
        const outputReportFile: string = argv.o;

        statusSpinner.setSpinnerTitle("%s Retrieving the Source artefacts...");
        const sourceAuthenticator = new Authenticator(
            sourceAuthorityUrl,
            sourceResourceUrl,
            sourceClientId,
            sourceClientSecret,
        );
        const sourceOrganisationService =
            new CrmOrganisationService(sourceAuthenticator, "Source", sourceWebAPIUrl);
        const sourceArtefacts = await sourceOrganisationService.retrieveArtefacts(keyword);
        const sourceRepresentation: string = JSON.stringify(sourceArtefacts, null, 2);
        fs.writeFile(outputSourceFile, sourceRepresentation, (err: any) => {
            if (err) { throw err; }
        });

        statusSpinner.setSpinnerTitle("%s Retrieving the Destination artefacts...");
        const destinationAuthenticator = new Authenticator(
            destinationAuthorityUrl,
            destinationResourceUrl,
            destinationClientId,
            destinationClientSecret,
        );
        const destinationOrganisationService =
            new CrmOrganisationService(destinationAuthenticator, "Destination", destinationWebAPIUrl);
        const destinationArtefacts = await destinationOrganisationService.retrieveArtefacts(keyword);
        const destinationRepresenation: string = JSON.stringify(destinationArtefacts, null, 2);
        fs.writeFile(outputDestinationFile, destinationRepresenation, (err: any) => {
            if (err) { throw err; }
        });

        statusSpinner.setSpinnerTitle("%s Generating report...");
        let htmlContent: string = fs.readFileSync(__dirname + "/template/index.html", "utf8");
        htmlContent = htmlContent.replace("{___A___}", HtmlHelper.escapeJSON(sourceRepresentation));
        htmlContent = htmlContent.replace("{___B___}", HtmlHelper.escapeJSON(destinationRepresenation));
        fs.writeFile(outputReportFile, htmlContent, (err: any) => {
            if (err) { throw err; }
        });

        console.log("\n\n\x1b[32m%s\x1b[0m", "Report file is created: " + outputReportFile);
        console.log("\nTrying to open Report in default browser (might not work in Windows)...");
        await open(outputReportFile);
        statusSpinner.stop(true);

    } catch (error) {
        console.log("An error occured: " + error);
    } finally {
        statusSpinner.stop(false);
    }
}

function showHelp() {
    optimist.showHelp();
}
