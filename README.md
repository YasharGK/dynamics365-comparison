# Dynamics 365 Comparison

dynamics365-comparison is a node.js app that makes comparison of Dynamics 365 CRM / CE / CDS plug-in artefacts easier, developed by Yashar Ghouchibeik (y.ghouchibeik@orkestratie.nl). Just run the app with the Source and Destination parameters and a HTML report will appear! 

Differences in artefacts or properties are shown in colors:
* Red indicates where artfacts or properties are different/missing in Destination
* Green indicates where artfacts or properties are different/missing in Source

### Installation
```
npm install -g dynamics365-comparison
```
### OR (npx)

Try this with:
```
npx dynamics365-comparison [-k keyword] [-o outputReportFile] [-s sourceOutputFile] [-d destinationOutputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret destination_authorityUrl destination_resource destination_clientId destination_clientSecret
```
### Usage
To run:
```
dynamics365-comparison [-k keyword] [-o outputReportFile] [-s sourceOutputFile] [-d destinationOutputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret destination_authorityUrl destination_resource destination_clientId destination_clientSecret
```

## Known issues
* The output report might not open automatically in Windows (depending on default browser)
