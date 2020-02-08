import { IFlow } from './flow.model';
import { TriggerType } from './enumerations/trigger-type.model';
import { TimeUnit } from './enumerations/time-unit.model';

export interface IEventTrigger {
  id?: number;
  triggerName?: string;
  triggerType?: TriggerType;
  triggerPeriod?: number;
  triggerTimeUnit?: TimeUnit;
  triggerCronExpression?: string;
  triggerCronTimeZone?: string;
  flows?: IFlow[];
}

export class EventTrigger implements IEventTrigger {
  constructor(
    public id?: number,
    public triggerName?: string,
    public triggerType?: TriggerType,
    public triggerPeriod?: number,
    public triggerTimeUnit?: TimeUnit,
    public triggerCronExpression?: string,
    public triggerCronTimeZone?: string,
    public flows?: IFlow[]
  ) {}
}
