#!/usr/bin/env node

import fs = require("fs");
import open = require("open");
import { CrmOrganisationService } from "./services/CrmOrganisationService";
import { Authenticator } from "./util/authenticator";

var stdin: NodeJS.ReadStream;

var argv = require("optimist")
    .usage("\n\nUsage: $0 [-k keyword] [-o outputReportFile] [-s sourceOutputFile] [-d destinationOutputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret destination_authorityUrl destination_resource destination_clientId destination_clientSecret")
    .default('k', 'Microsoft')
    .default('o', 'output.html')
    .default('s', 'source.json')
    .default('d', 'destination.json')
    .describe({
        "k": "Only plug-ins containing this keyword will be included in the comparison",
        "o": "Path of the HTML report that is generated",
        "s": "Path of the JSON file with the Source artefacts representation",
        "d": "Path of the JSON file with the Destination artefacts representation",

        "soure_authorityUrl": "Source OAuth Token Endpoint (https://login.microsoftonline.com/00000000-0000-0000-0000-000000000011/oauth2/token)",
        "soure_resource": "Source CRM Organization URL (https://myorg.crm.dynamics.com)",
        "soure_clientId": "Source Dynamics 365 Client Id (registered in Azure App Registrations)('00000000-0000-0000-0000-000000000001')",
        "soure_clientSecret": "Source ClientSecret of given Client Id",

        "destination_authorityUrl": "Destination OAuth Token Endpoint (https://login.microsoftonline.com/00000000-0000-0000-0000-000000000011/oauth2/token)",
        "destination_resource": "Destination CRM Organization URL (https://myorg.crm.dynamics.com)",
        "destination_clientId": "Destination Dynamics 365 Client Id (registered in Azure App Registrations) ('00000000-0000-0000-0000-000000000001')",
        "destination_clientSecret": "Destination ClientSecret of given Client Id"
    })
    .argv;

if (argv._.length == 10) {
    StartUp().then(() => {
        console.log('Press any key to exit...');
        stdin = process.stdin;
        stdin.on('data', function () {
            process.exit();
        });
    });
}
else {
    showHelp();
}

async function StartUp(): Promise<void> {
    let Spinner = require('cli-spinner').Spinner;
    let spinner = new Spinner('%s Initializing...');
    try {
        spinner.setSpinnerString(3);
        spinner.start();

        let sourceAuthorityUrl: string = argv._[0];
        let sourceResourceUrl: string = argv._[1];
        let sourceClientId: string = argv._[2];
        let sourceClientSecret: string = argv._[3];
        let sourceWebAPIUrl: string = sourceResourceUrl + '/api/data/v9.0/';

        let destinationAuthorityUrl: string = argv._[4];
        let destinationResourceUrl: string = argv._[5];
        let destinationClientId: string = argv._[6]
        let destinationClientSecret: string = argv._[7];
        let destinationWebAPIUrl: string = destinationResourceUrl + '/api/data/v9.0/';

        const keyword: string = argv.k;
        const outputSourceFile: string = argv.s;
        const outputDestinationFile: string = argv.d;
        const outputReportFile: string = argv.o;

        spinner.setSpinnerTitle('%s Retrieving the Source artefacts...');
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

        spinner.setSpinnerTitle('%s Retrieving the Destination artefacts...');
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

        spinner.setSpinnerTitle('%s Generating report...');
        let htmlContent: string = fs.readFileSync(__dirname + "/template/index.html", "utf8");
        htmlContent = htmlContent.replace("{___A___}", escapeJSON(sourceRepresentation));
        htmlContent = htmlContent.replace("{___B___}", escapeJSON(destinationRepresenation));
        fs.writeFile(outputReportFile, htmlContent, (err: any) => {
            if (err) { throw err; }
        });

        console.log('\n\n\x1b[32m%s\x1b[0m', 'Report file is created: ' + outputReportFile);
        console.log('\nTrying to open Report in default browser (might not work in Windows)...');
        await open(outputReportFile);
        spinner.stop(true);

    } catch (error) {
        console.log('An error occured: ' + error);
    }
    finally {
        spinner.stop(false);
    }
}

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

function showHelp() {
    require("optimist").showHelp();
}



