# Dynamics 365 Comparison

dynamics365-comparison is a node.js app that makes comparison of Dynamics 365 CRM / CR / CDS plug-in artefacts easier.  
Just run the app with the Source and Destination parameters and a HTML report will appear! 

Differences in artefacts or properties are shown in colors:
* Red will indicates where artfacts or properties are different or missing in Destination
* Green will indicates where artfacts or properties are different or missing in Source

### Installation
```
npm install -g dynamics365-comparison
```
#### OR (npx)
If you are running `npm 5.2.0` or higher, you can try out workinHard without polluting global namespace. 
Try this with:
```
npx dynamics365-comparison [-k keyword] [-o outputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret soure_webAPIUrl destination_authorityUrl destination_resource destination_clientId destination_clientSecret destination_webAPIUrl```

### Usage
To run:
```
dynamics365-comparison [-k keyword] [-o outputFile] soure_authorityUrl soure_resource soure_clientId soure_clientSecret soure_webAPIUrl destination_authorityUrl destination_resource destination_clientId destination_clientSecret destination_webAPIUrl
```