import { PluginAssembly } from "../entities/pluginAssembly";
import { Authenticator } from "../util/authenticator";
import { CrmServiceBase } from "./base/CrmServiceBase";

export class PluginAssemblyService extends CrmServiceBase {

  private fetchpluginAssembliesXml: string =
    "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">" +
      "<entity name=\"pluginassembly\">" +
      "<order attribute=\"name\" descending='true' />" +
      "<attribute name=\"name\" />" +
      "<attribute name=\"sourcetype\" />" +
      "<attribute name=\"version\" />" +
      "<attribute name=\"createdby\" />" +
      "<attribute name=\"createdon\" />" +
      "<attribute name=\"modifiedby\" />" +
      "<attribute name=\"modifiedon\" />" +
      "<attribute name=\"path\" />" +
      "<attribute name=\"pluginassemblyid\" />" +
      "<attribute name=\"url\" />" +
      "<attribute name=\"username\" />" +
      "<attribute name=\"ismanaged\" />" +
      "<attribute name=\"authtype\" />" +
      "<attribute name=\"modifiedonbehalfby\" />" +
      "<attribute name=\"description\" />" +
      "<attribute name=\"createdonbehalfby\" />" +
        "<filter type=\"and\">" +
          "<condition attribute=\"name\" operator=\"like\" value=\"%{0}%\" />" +
        "</filter>" +
      "</entity>" +
    "</fetch>";

  constructor(authenticator: Authenticator,
              webApiUrl: string ) {
    super(authenticator, webApiUrl);
  }

  public  getPluginAssemblies = async (keyword: string): Promise<PluginAssembly[]> => {

    let fetchXml: string = this.fetchpluginAssembliesXml;
    if (keyword) {
      fetchXml = this.fetchpluginAssembliesXml.replace("{0}", keyword);
    }

    const response = await this.dynamicsWebApi.executeFetchXmlAll("pluginassemblies", fetchXml);
    // validate response is not null.
    // validate value is not null
    return response.value.map((x: any) => new PluginAssembly(x.pluginassemblyid, x.name, x.version));
  }

}
