import { BaseEntity } from "./base/baseEntity";
import { Plugin } from "./plugin";

export class PluginAssembly extends BaseEntity {
  private plugins: Plugin[];
  private version: string;

  constructor(
    id: string,
    name: string,
    version: string,
  ) {
    super(id, name);
    this.version = version;
    this.plugins = [];
  }

  public setPlugins(plugins: Plugin[]): void {
    this.plugins = plugins;
  }
}
