import { BaseEntity } from "./base/baseEntity";
import { PluginStepImage } from "./pluginStepImage";

export class PluginStep extends BaseEntity {
  private isEnabled: boolean;
  private message: string;
  private primaryEntity: string;
  private secondaryEntity: string;
  private filteringAttributes: string;
  private runInUsersContext: string;
  private executionOrder: number;
  private description: string;

  private pipelineExecutionStage: string;
  private executionMode: string;

  private pluginStepImages: PluginStepImage[];

  constructor(
    id: string,
    name: string,
    isEnabled: boolean,
    message: string,
    primaryEntity: string,
    secondaryEntity: string,
    filteringAttributes: string,
    runInUsersContext: string,
    executionOrder: number,
    description: string,
    pipelineExecutionStage: string,
    executionMode: string,
  ) {
    super(id, name);
    this.isEnabled = isEnabled;
    this.message = message;
    this.primaryEntity = primaryEntity;
    this.secondaryEntity = secondaryEntity;
    this.filteringAttributes = filteringAttributes;
    this.runInUsersContext = "Test" + runInUsersContext;
    this.executionOrder = executionOrder;
    this.description = description;
    this.pipelineExecutionStage = pipelineExecutionStage;
    this.executionMode = executionMode;
    this.pluginStepImages = [];
  }

  public setPluginSteps(pluginStepImages: PluginStepImage[]): void {
    this.pluginStepImages = pluginStepImages;
  }
}
