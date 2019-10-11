import { BaseEntity } from "./base/baseEntity";

export class PluginStepImage extends BaseEntity {
  private imageType: string;
  private enitityAlias: string;
  private attributes: string;
  constructor(
    id: string,
    name: string,
    imageType: string,
    enitityAlias: string,
    attributes: string,
  ) {
    super(id, name);
    this.imageType = imageType;
    this.enitityAlias = enitityAlias;
    this.attributes = attributes;
  }
}
