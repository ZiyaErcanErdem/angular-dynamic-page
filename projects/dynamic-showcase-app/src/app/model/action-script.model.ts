import { ScriptType } from './enumerations/script-type.model';
import { ActionType } from 'zee-dynamic-page-lib/public-api';
import { IActionParam } from './action-param.model';
import { IAction } from './action.model';
import { IEndpoint } from './endpoint.model';

export interface IActionScript {
  id?: number;
  actionCode?: string;
  scriptName?: string;
  scriptType?: ScriptType;
  actionType?: ActionType;
  actionSource?: string;
  actionParams?: IActionParam[];
  actions?: IAction[];
  endpoint?: IEndpoint;
}

export class ActionScript implements IActionScript {
  constructor(
    public id?: number,
    public actionCode?: string,
    public scriptName?: string,
    public scriptType?: ScriptType,
    public actionType?: ActionType,
    public actionSource?: string,
    public actionParams?: IActionParam[],
    public actions?: IAction[],
    public endpoint?: IEndpoint
  ) {}
}
