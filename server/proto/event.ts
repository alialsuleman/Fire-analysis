import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { EventClient as _ndmsRpcEvent_EventClient, EventDefinition as _ndmsRpcEvent_EventDefinition } from './ndmsRpcEvent/Event';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  ndmsRpcEvent: {
    Disaster: MessageTypeDefinition
    Event: SubtypeConstructor<typeof grpc.Client, _ndmsRpcEvent_EventClient> & { service: _ndmsRpcEvent_EventDefinition }
    MessageMode: EnumTypeDefinition
    Position: MessageTypeDefinition
    Post: MessageTypeDefinition
    Status: MessageTypeDefinition
  }
}

