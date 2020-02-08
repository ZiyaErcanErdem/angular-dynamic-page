import { IContentMapper } from './content-mapper.model';
import { DataType } from './enumerations/data-type.model';

export interface IFieldMapping {
  id?: number;
  sourceIndex?: number;
  sourceName?: string;
  sourceFormat?: string;
  sourceStartIndex?: number;
  sourceEndIndex?: number;
  sourceDataType?: DataType;
  targetName?: string;
  targetColName?: string;
  targetDataType?: DataType;
  transformation?: string;
  requiredData?: boolean;
  contentMapper?: IContentMapper;
}

export class FieldMapping implements IFieldMapping {
  constructor(
    public id?: number,
    public sourceIndex?: number,
    public sourceName?: string,
    public sourceFormat?: string,
    public sourceStartIndex?: number,
    public sourceEndIndex?: number,
    public sourceDataType?: DataType,
    public targetName?: string,
    public targetColName?: string,
    public targetDataType?: DataType,
    public transformation?: string,
    public requiredData?: boolean,
    public contentMapper?: IContentMapper
  ) {
    this.requiredData = this.requiredData || false;
  }
}
