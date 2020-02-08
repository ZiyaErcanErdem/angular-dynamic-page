import { IEndpointProperty } from './endpoint-property.model';
import { ICheckScript } from './check-script.model';
import { IActionScript } from './action-script.model';
import { EndpointType } from './enumerations/endpoint-type.model';
import { EndpointSpec } from './enumerations/endpoint-spec.model';

export interface IEndpoint {
  id?: number;
  endpointName?: string;
  endpointInstanceId?: string;
  endpointType?: EndpointType;
  endpointSpec?: EndpointSpec;
  endpointDescription?: string;
  endpointProperties?: IEndpointProperty[];
  checkScripts?: ICheckScript[];
  actionScripts?: IActionScript[];
}

export class Endpoint implements IEndpoint {
  constructor(
    public id?: number,
    public endpointName?: string,
    public endpointInstanceId?: string,
    public endpointType?: EndpointType,
    public endpointSpec?: EndpointSpec,
    public endpointDescription?: string,
    public endpointProperties?: IEndpointProperty[],
    public checkScripts?: ICheckScript[],
    public actionScripts?: IActionScript[]
  ) {}
}
