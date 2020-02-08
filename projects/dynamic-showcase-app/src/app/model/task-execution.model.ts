import { Moment } from 'moment';
import { IContent } from './content.model';
import { IContentValidationError } from './content-validation-error.model';
import { ITask } from './task.model';
import { IFlowExecution } from './flow-execution.model';
import { ExecutionStatus } from './enumerations/execution-status.model';

export interface ITaskExecution {
  id?: number;
  executionStartTime?: Moment;
  executionEndTime?: Moment;
  executionStatus?: ExecutionStatus;
  contents?: IContent[];
  contentValidationErrors?: IContentValidationError[];
  task?: ITask;
  flowExecution?: IFlowExecution;
}

export class TaskExecution implements ITaskExecution {
  constructor(
    public id?: number,
    public executionStartTime?: Moment,
    public executionEndTime?: Moment,
    public executionStatus?: ExecutionStatus,
    public contents?: IContent[],
    public contentValidationErrors?: IContentValidationError[],
    public task?: ITask,
    public flowExecution?: IFlowExecution
  ) {}
}
