import { Moment } from 'moment';
import { ExecutionStatus } from './enumerations/execution-status.model';
import { IAction } from './action.model';

export interface IActionExecution {
  id?: number;
  executionStartTime?: Moment;
  executionEndTime?: Moment;
  executionStatus?: ExecutionStatus;
  actionLog?: string;
  action?: IAction;
}

export class ActionExecution implements IActionExecution {
  constructor(
    public id?: number,
    public executionStartTime?: Moment,
    public executionEndTime?: Moment,
    public executionStatus?: ExecutionStatus,
    public actionLog?: string,
    public action?: IAction
  ) {}
}
