import { ITask } from './task.model';
import { IAction } from './action.model';
import { AgentType } from './enumerations/agent-type.model';
import { AgentStatus } from './enumerations/agent-status.model';

export interface IAgent {
  id?: number;
  agentName?: string;
  agentInstanceId?: string;
  listenURI?: string;
  agentType?: AgentType;
  agentStatus?: AgentStatus;
  agentDescription?: string;
  tasks?: ITask[];
  actions?: IAction[];
}

export class Agent implements IAgent {
  constructor(
    public id?: number,
    public agentName?: string,
    public agentInstanceId?: string,
    public listenURI?: string,
    public agentType?: AgentType,
    public agentStatus?: AgentStatus,
    public agentDescription?: string,
    public tasks?: ITask[],
    public actions?: IAction[]
  ) {}
}
