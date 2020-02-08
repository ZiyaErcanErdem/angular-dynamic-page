import { Moment } from 'moment';
import { ICheckScript } from './check-script.model';
import { IFlow } from './flow.model';
import { ITask } from './task.model';
import { ITaskExecution } from './task-execution.model';
import { IFlowExecution } from './flow-execution.model';

export interface IContent {
  id?: number;
  sourceIndex?: number;
  txt1?: string;
  txt2?: string;
  txt3?: string;
  txt4?: string;
  txt5?: string;
  txt6?: string;
  txt7?: string;
  txt8?: string;
  txt9?: string;
  txt10?: string;
  txt11?: string;
  txt12?: string;
  txt13?: string;
  txt14?: string;
  txt15?: string;
  txt16?: string;
  txt17?: string;
  txt18?: string;
  txt19?: string;
  txt20?: string;
  num1?: number;
  num2?: number;
  num3?: number;
  num4?: number;
  num5?: number;
  num6?: number;
  num7?: number;
  num8?: number;
  num9?: number;
  num10?: number;
  num11?: number;
  num12?: number;
  num13?: number;
  num14?: number;
  num15?: number;
  num16?: number;
  num17?: number;
  num18?: number;
  num19?: number;
  num20?: number;
  date1?: Moment;
  date2?: Moment;
  date3?: Moment;
  date4?: Moment;
  date5?: Moment;
  date6?: Moment;
  date7?: Moment;
  date8?: Moment;
  date9?: Moment;
  date10?: Moment;
  bool1?: Moment;
  bool2?: Moment;
  bool3?: Moment;
  bool4?: Moment;
  bool5?: Moment;
  checkScript?: ICheckScript;
  flow?: IFlow;
  task?: ITask;
  taskExecution?: ITaskExecution;
  flowExecution?: IFlowExecution;
}

export class Content implements IContent {
  constructor(
    public id?: number,
    public sourceIndex?: number,
    public txt1?: string,
    public txt2?: string,
    public txt3?: string,
    public txt4?: string,
    public txt5?: string,
    public txt6?: string,
    public txt7?: string,
    public txt8?: string,
    public txt9?: string,
    public txt10?: string,
    public txt11?: string,
    public txt12?: string,
    public txt13?: string,
    public txt14?: string,
    public txt15?: string,
    public txt16?: string,
    public txt17?: string,
    public txt18?: string,
    public txt19?: string,
    public txt20?: string,
    public num1?: number,
    public num2?: number,
    public num3?: number,
    public num4?: number,
    public num5?: number,
    public num6?: number,
    public num7?: number,
    public num8?: number,
    public num9?: number,
    public num10?: number,
    public num11?: number,
    public num12?: number,
    public num13?: number,
    public num14?: number,
    public num15?: number,
    public num16?: number,
    public num17?: number,
    public num18?: number,
    public num19?: number,
    public num20?: number,
    public date1?: Moment,
    public date2?: Moment,
    public date3?: Moment,
    public date4?: Moment,
    public date5?: Moment,
    public date6?: Moment,
    public date7?: Moment,
    public date8?: Moment,
    public date9?: Moment,
    public date10?: Moment,
    public bool1?: Moment,
    public bool2?: Moment,
    public bool3?: Moment,
    public bool4?: Moment,
    public bool5?: Moment,
    public checkScript?: ICheckScript,
    public flow?: IFlow,
    public task?: ITask,
    public taskExecution?: ITaskExecution,
    public flowExecution?: IFlowExecution
  ) {}
}
