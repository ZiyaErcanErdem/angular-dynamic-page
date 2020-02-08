import { Moment } from 'moment';
import { ITaskExecution } from './task-execution.model';
import { IContent } from './content.model';
import { IContentValidationError } from './content-validation-error.model';
import { IAgent } from './agent.model';
import { ICheckScript } from './check-script.model';
import { IFlow } from './flow.model';
import { TaskState } from './enumerations/task-state.model';

export interface ITask {
  id?: number;
  taskName?: string;
  taskDescription?: string;
  nextExecutionStartTime?: Moment;
  taskState?: TaskState;
  taskExecutions?: ITaskExecution[];
  contents?: IContent[];
  contentValidationErrors?: IContentValidationError[];
  agent?: IAgent;
  checkScript?: ICheckScript;
  flow?: IFlow;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public taskName?: string,
    public taskDescription?: string,
    public nextExecutionStartTime?: Moment,
    public taskState?: TaskState,
    public taskExecutions?: ITaskExecution[],
    public contents?: IContent[],
    public contentValidationErrors?: IContentValidationError[],
    public agent?: IAgent,
    public checkScript?: ICheckScript,
    public flow?: IFlow
  ) {}
}
