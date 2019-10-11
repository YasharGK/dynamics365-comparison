import { Plugin } from "../entities/plugin";
import { PluginStep } from "../entities/pluginStep";
import { Authenticator } from "../util/authenticator";
import { CrmServiceBase } from "./base/CrmServiceBase";

export class PluginStepService extends CrmServiceBase {

  private fetchPluginStepsXml: string =
    "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">" +
    "<entity name=\"sdkmessageprocessingstep\">" +
    "<order attribute=\"name\" descending='true' />" +
    "<attribute name=\"name\" />" +
    "<attribute name=\"description\" />" +
    "<attribute name=\"eventhandler\" />" +
    "<attribute name=\"impersonatinguseridname\" />" +
    "<attribute name=\"supporteddeployment\" />" +
    "<attribute name=\"statuscode\" />" +
    "<attribute name=\"statecode\" />" +
    "<attribute name=\"sdkmessagefilterid\" />" +
    "<attribute name=\"sdkmessageid\" />" +
    "<attribute name=\"filteringattributes\" />" +
    "<attribute name=\"configuration\" />" +
    "<attribute name=\"asyncautodelete\" />" +
    "<attribute name=\"ismanaged\" />" +
    "<attribute name=\"stage\" />" +
    "<attribute name=\"mode\" />" +
    "<attribute name=\"rank\" />" +
    "<attribute name=\"plugintypeid\" />" +
    "<attribute name=\"modifiedon\" />" +
    "<attribute name=\"modifiedonbehalfby\" />" +
    "<attribute name=\"modifiedby\" />" +
    "<attribute name=\"canusereadonlyconnection\" />" +
    "<attribute name=\"eventexpander\" />" +
    "<attribute name=\"createdon\" />" +
    "<attribute name=\"createdonbehalfby\" />" +
    "<attribute name=\"createdby\" />" +
    "<link-entity name=\"sdkmessagefilter\" from=\"sdkmessagefilterid\" to=\"sdkmessagefilterid\" visible=\"false\" link-type=\"outer\" alias=\"a1\">" +
    "<attribute name=\"secondaryobjecttypecode\" />" +
    "<attribute name=\"primaryobjecttypecode\" />" +
    "</link-entity>" +
    "<link-entity name=\"plugintype\" from=\"plugintypeid\" to=\"plugintypeid\" link-type=\"inner\" alias=\"ak\">" +
    "<filter type=\"and\">" +
    "<condition attribute=\"plugintypeid\" operator=\"eq\" value=\"{0}\" />" +
    "</filter>" +
    "</link-entity>" +
    "</entity>" +
    "</fetch>";

  constructor(authenticator: Authenticator, webApiUrl: string) {
    super(authenticator, webApiUrl);
  }

  public getPluginSteps = async (plugin: Plugin): Promise<PluginStep[]> => {
    const fetchXml = this.fetchPluginStepsXml.replace("{0}", plugin.id);
    const response = await this.dynamicsWebApi.executeFetchXmlAll("sdkmessageprocessingsteps", fetchXml);
    // validate response is not null.
    // validate value is not null
    return response.value.map((x: any) =>
      new PluginStep(x.sdkmessageprocessingstepid, x.name, x.statuscode, x.configuration, x.primaryobjecttypecode,
        x.secondaryobjecttypecode, x.filteringattributes, x.impersonatinguseridname,
        x.rank, x.description, x.stage, x.mode));
  }
}
