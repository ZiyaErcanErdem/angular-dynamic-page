import { ICheckScript } from './check-script.model';
import { DataType } from './enumerations/data-type.model';

export interface IScriptParam {
  id?: number;
  paramName?: string;
  paramDataType?: DataType;
  paramValue?: string;
  paramExpression?: string;
  checkScript?: ICheckScript;
}

export class ScriptParam implements IScriptParam {
  constructor(
    public id?: number,
    public paramName?: string,
    public paramDataType?: DataType,
    public paramValue?: string,
    public paramExpression?: string,
    public checkScript?: ICheckScript
  ) {}
}
