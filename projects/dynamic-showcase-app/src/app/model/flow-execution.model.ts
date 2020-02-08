import { Moment } from 'moment';
import { ITaskExecution } from './task-execution.model';
import { IContent } from './content.model';
import { IFlow } from './flow.model';
import { ExecutionStatus } from './enumerations/execution-status.model';

export interface IFlowExecution {
  id?: number;
  executionStartTime?: Moment;
  executionEndTime?: Moment;
  totalTaskCount?: number;
  runningTaskCount?: number;
  errorTaskCount?: number;
  executionStatus?: ExecutionStatus;
  taskExecutions?: ITaskExecution[];
  contents?: IContent[];
  flow?: IFlow;
}

export class FlowExecution implements IFlowExecution {
  constructor(
    public id?: number,
    public executionStartTime?: Moment,
    public executionEndTime?: Moment,
    public totalTaskCount?: number,
    public runningTaskCount?: number,
    public errorTaskCount?: number,
    public executionStatus?: ExecutionStatus,
    public taskExecutions?: ITaskExecution[],
    public contents?: IContent[],
    public flow?: IFlow
  ) {}
}
