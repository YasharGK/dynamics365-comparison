import { Plugin } from "../entities/plugin";
import { PluginAssembly } from "../entities/pluginAssembly";
import { Authenticator } from "../util/authenticator";
import { CrmServiceBase } from "./base/CrmServiceBase";

export class PluginService extends CrmServiceBase {

  private fetchPluginsXml: string =
    "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">" +
    "<entity name=\"plugintype\">" +
    "<order attribute=\"name\" descending='true' />" +
    "<attribute name=\"plugintypeid\" />" +
    "<attribute name=\"friendlyname\" />" +
    "<attribute name=\"version\" />" +
    "<attribute name=\"typename\" />" +
    "<attribute name=\"pluginassemblyid\" />" +
    "<attribute name=\"isworkflowactivity\" />" +
    "<attribute name=\"assemblyname\" />" +
    "<attribute name=\"publickeytoken\" />" +
    "<attribute name=\"pluginassemblyid\" />" +
    "<attribute name=\"name\" />" +
    "<attribute name=\"modifiedon\" />" +
    "<attribute name=\"modifiedby\" />" +
    "<attribute name=\"description\" />" +
    "<attribute name=\"createdon\" />" +
    "<attribute name=\"createdonbehalfby\" />" +
    "<attribute name=\"createdby\" />" +
    "<order attribute=\"friendlyname\" descending=\"false\" />" +
    "<link-entity name=\"pluginassembly\" from=\"pluginassemblyid\" to=\"pluginassemblyid\" link-type=\"inner\" alias=\"ae\">" +
    "<filter type=\"and\">" +
    "<condition attribute=\"pluginassemblyid\" operator=\"eq\" value=\"{0}\" />" +
    "</filter>" +
    "</link-entity>" +
    "</entity>" +
    "</fetch>";

  constructor(authenticator: Authenticator,
              webApiUrl: string ) {
    super(authenticator, webApiUrl);
  }

  public getPlugins = async (assembly: PluginAssembly): Promise<Plugin[]> => {
    const fetchXml: string = this.fetchPluginsXml.replace("{0}", assembly.id);
    const response = await this.dynamicsWebApi.executeFetchXmlAll("plugintypes", fetchXml);
    // validate response is not null.
    // validate value is not null
    return response.value.map((x: any) => new Plugin(x.plugintypeid, x.name));

  }
}
