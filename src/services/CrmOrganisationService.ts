import DynamicsWebApi = require("dynamics-web-api");
import { CrmOrganisation } from "../entities/crmOrganisation";
import { Authenticator } from "../util/authenticator";
import { PluginAssemblyService } from "./pluginAssemblyService";
import { PluginService } from "./pluginService";
import { PluginStepImageService } from "./pluginStepImageService";
import { PluginStepService } from "./pluginStepService";

export class CrmOrganisationService {

  private name: string;
  private webApiUrl: string;

  private authenticator: Authenticator;
  private dynamicsWebApi: DynamicsWebApi;

  private assemblyService: PluginAssemblyService;
  private pluginService: PluginService;
  private pluginStepService: PluginStepService;
  private pluginStepImageService: PluginStepImageService;

  constructor(
    authenticator: Authenticator,
    name: string,
    webApiUrl: string,
  ) {
    this.name = name;
    this.authenticator = authenticator;
    this.webApiUrl = webApiUrl;

    this.assemblyService = new PluginAssemblyService(authenticator, webApiUrl);
    this.pluginService = new PluginService(authenticator, webApiUrl);
    this.pluginStepService = new PluginStepService(authenticator, webApiUrl);
    this.pluginStepImageService = new PluginStepImageService(authenticator, webApiUrl);

    this.dynamicsWebApi = new DynamicsWebApi({
      onTokenRefresh: authenticator.acquireToken,
      webApiUrl: this.webApiUrl,
    });
  }

  public async retrieveArtefacts(keyword: string): Promise<CrmOrganisation> {
    const assemblies = await this.assemblyService.getPluginAssemblies(keyword);
    for (const assembly of assemblies) {
      const plugins = await this.pluginService.getPlugins(assembly);
      assembly.setPlugins(plugins);
      for (const plugin of plugins) {
        const steps = await this.pluginStepService.getPluginSteps(plugin);
        plugin.setPluginSteps(steps);
        for (const step of steps) {
          const stepImages = await this.pluginStepImageService.getPluginStepImages(step);
          step.setPluginSteps(stepImages);
        }
      }
    }

    return(new CrmOrganisation(this.webApiUrl, assemblies));
  }
}
