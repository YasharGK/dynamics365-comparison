import { BaseEntity } from "./base/baseEntity";
import { PluginAssembly } from "./pluginAssembly";

export class CrmOrganisation {
  public assemblies: PluginAssembly[];
  public webAPIUrl: string;
  constructor(
    webAPIUrl: string,
    assemblies: PluginAssembly[],
  ) {
    this.webAPIUrl = webAPIUrl;
    this.assemblies = assemblies;
  }
}
