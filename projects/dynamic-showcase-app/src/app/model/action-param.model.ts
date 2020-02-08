import { DataType } from './enumerations/data-type.model';
import { IActionScript } from './action-script.model';

export interface IActionParam {
  id?: number;
  paramName?: string;
  paramDataType?: DataType;
  paramValue?: string;
  paramExpression?: string;
  actionScript?: IActionScript;
}

export class ActionParam implements IActionParam {
  constructor(
    public id?: number,
    public paramName?: string,
    public paramDataType?: DataType,
    public paramValue?: string,
    public paramExpression?: string,
    public actionScript?: IActionScript
  ) {}
}
