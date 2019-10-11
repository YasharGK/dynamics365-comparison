import fs = require("fs");
import open = require("open");
import { CrmOrganisationService } from "./services/CrmOrganisationService";
import { Authenticator } from "./util/authenticator";

// var argv = require('optimist')
//     .default('x', 10)
//     .default('y', 10)
//     .argv
// ;
// console.log(argv.x + argv.y);


var argv = require("optimist")
    .usage("\n\nUsage: $0 [-k keyword] [-o outputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret soure_webAPIUrl destination_authorityUrl destination_resource destination_clientId destination_clientSecret destination_webAPIUrl")
    .default('k', "Microsoft")
    .default('o', "Output.html")
    .describe({
        "k": "Only plug-ins containing this keyword will be included in the comparison",
        "o": "Filename of the HTML report that is generated",
    })
    .argv;

if (argv._.length == 10) {
    StartUp();
}
else {
    showHelp();
}

async function StartUp() {
    try {
        let Spinner = require('cli-spinner').Spinner;
        let spinner = new Spinner('%s Initializing...');
        spinner.setSpinnerString(3);
        spinner.start();

        let sourceAuthorityUrl: string = argv._[0];
        let sourceResourceUrl: string = argv._[1];
        let sourceClientId: string = argv._[2];
        let sourceClientSecret: string = argv._[3];
        let sourceWebAPIUrl: string = argv._[4];

        let destinationAuthorityUrl: string = argv._[5];
        let destinationResourceUrl: string = argv._[6];
        let destinationClientId: string = argv._[7];
        let destinationClientSecret: string = argv._[8];
        let destinationWebAPIUrl: string = argv._[9];

        const keyword: string = argv.k;
        const outputFile: string = argv.o;

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

        spinner.setSpinnerTitle('%s Generating report...');
        let htmlContent: string = fs.readFileSync("lib/template/index.html", "utf8");
        htmlContent = htmlContent.replace("{___A___}", escapeJSON(sourceRepresentation));
        htmlContent = htmlContent.replace("{___B___}", escapeJSON(destinationRepresenation));
        fs.writeFile("lib/out/" + outputFile, htmlContent, (err: any) => {
            if (err) { throw err; }
        });

        spinner.setSpinnerTitle('%s Generating report...');
        await open("lib/out/" + outputFile);
        spinner.stop(true);

    } catch (error) {
        console.log('An error occured: ' + error);
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

