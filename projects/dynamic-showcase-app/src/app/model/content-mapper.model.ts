import { ICheckScript } from './check-script.model';
import { IFieldMapping } from './field-mapping.model';
import { ItemFormat } from './enumerations/item-format.model';

export interface IContentMapper {
  id?: number;
  mapperName?: string;
  itemFormat?: ItemFormat;
  containsHeader?: boolean;
  fieldDelimiter?: string;
  checkScripts?: ICheckScript[];
  fieldMappings?: IFieldMapping[];
}

export class ContentMapper implements IContentMapper {
  constructor(
    public id?: number,
    public mapperName?: string,
    public itemFormat?: ItemFormat,
    public containsHeader?: boolean,
    public fieldDelimiter?: string,
    public checkScripts?: ICheckScript[],
    public fieldMappings?: IFieldMapping[]
  ) {
    this.containsHeader = this.containsHeader || false;
  }
}
