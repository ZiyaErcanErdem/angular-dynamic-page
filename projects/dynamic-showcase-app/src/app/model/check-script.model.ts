import { IScriptParam } from './script-param.model';
import { ITask } from './task.model';
import { IContent } from './content.model';
import { IEndpoint } from './endpoint.model';
import { IContentMapper } from './content-mapper.model';
import { ScriptType } from './enumerations/script-type.model';

export interface ICheckScript {
  id?: number;
  scriptName?: string;
  scriptType?: ScriptType;
  scriptSource?: string;
  actionRuleExpression?: string;
  scriptParams?: IScriptParam[];
  tasks?: ITask[];
  contents?: IContent[];
  endpoint?: IEndpoint;
  contentMapper?: IContentMapper;
}

export class CheckScript implements ICheckScript {
  constructor(
    public id?: number,
    public scriptName?: string,
    public scriptType?: ScriptType,
    public scriptSource?: string,
    public actionRuleExpression?: string,
    public scriptParams?: IScriptParam[],
    public tasks?: ITask[],
    public contents?: IContent[],
    public endpoint?: IEndpoint,
    public contentMapper?: IContentMapper
  ) {}
}
