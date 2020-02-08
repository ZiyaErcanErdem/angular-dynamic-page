import { Moment } from 'moment';
import { ActionState } from './enumerations/action-state.model';
import { IActionExecution } from './action-execution.model';
import { IAgent } from './agent.model';
import { IActionScript } from './action-script.model';

export interface IAction {
  id?: number;
  actionName?: string;
  actionDescription?: string;
  nextExecutionStartTime?: Moment;
  actionState?: ActionState;
  resolutionRuleExpression?: string;
  actionExecutions?: IActionExecution[];
  agent?: IAgent;
  actionScript?: IActionScript;
}

export class Action implements IAction {
  constructor(
    public id?: number,
    public actionName?: string,
    public actionDescription?: string,
    public nextExecutionStartTime?: Moment,
    public actionState?: ActionState,
    public resolutionRuleExpression?: string,
    public actionExecutions?: IActionExecution[],
    public agent?: IAgent,
    public actionScript?: IActionScript
  ) {}
}
