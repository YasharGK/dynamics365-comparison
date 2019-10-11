import { PluginStep } from "../entities/pluginStep";
import { PluginStepImage } from "../entities/pluginStepImage";
import { Authenticator } from "../util/authenticator";
import { CrmServiceBase } from "./base/CrmServiceBase";

export class PluginStepImageService extends CrmServiceBase {

  private fetchPluginStepsImagesXml: string =
    "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">" +
    "<entity name=\"sdkmessageprocessingstepimage\">" +
    "<order attribute=\"name\" descending='true' />" +
    "<attribute name=\"sdkmessageprocessingstepimageid\" />" +
    "<attribute name=\"relatedattributename\" />" +
    "<attribute name=\"messagepropertyname\" />" +
    "<attribute name=\"imagetype\" />" +
    "<attribute name=\"name\" />" +
    "<attribute name=\"modifiedonbehalfby\" />" +
    "<attribute name=\"modifiedon\" />" +
    "<attribute name=\"modifiedby\" />" +
    "<attribute name=\"entityalias\" />" +
    "<attribute name=\"description\" />" +
    "<attribute name=\"createdon\" />" +
    "<attribute name=\"createdonbehalfby\" />" +
    "<attribute name=\"createdby\" />" +
    "<attribute name=\"attributes\" />" +
    "<link-entity name=\"sdkmessageprocessingstep\" from=\"sdkmessageprocessingstepid\" to=\"sdkmessageprocessingstepid\" link-type=\"inner\" alias=\"a_177\">" +
    "<attribute name=\"sdkmessageid\" />" +
    "<attribute name=\"description\" />" +
    "<filter type=\"and\">" +
    "<condition attribute=\"sdkmessageprocessingstepid\" operator=\"eq\" value=\"{0}\" />" +
    "</filter>" +
    "</link-entity>" +
    "</entity>" +
    "</fetch>";

  constructor(authenticator: Authenticator, webApiUrl: string) {
    super(authenticator, webApiUrl);
  }

  public getPluginStepImages = async (pluginStep: PluginStep): Promise<PluginStepImage[]> => {
    const fetchXml = this.fetchPluginStepsImagesXml.replace("{0}", pluginStep.id);
    // validate response is not null.
    // validate value is not null
    const response = await this.dynamicsWebApi.executeFetchXmlAll("sdkmessageprocessingstepimages", fetchXml);
    return response.value.map((x: any) =>
      new PluginStepImage(x.sdkmessageprocessingstepimageid, x.name, x.imagetype, x.entityalias, x.attributes));
  }

}
