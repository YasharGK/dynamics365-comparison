import { BaseEntity } from "./base/baseEntity";
import { PluginStep } from "./pluginStep";

export class Plugin extends BaseEntity {
  private pluginSteps: PluginStep[];
  constructor(
    id: string,
    name: string,
  ) {
    super(id, name);
    this.pluginSteps = [];
  }

  public setPluginSteps(pluginSteps: PluginStep[]): void {
    this.pluginSteps = pluginSteps;
  }
}
