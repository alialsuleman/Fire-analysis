// Original file: proto/event.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Disaster as _ndmsRpcEvent_Disaster, Disaster__Output as _ndmsRpcEvent_Disaster__Output } from '../ndmsRpcEvent/Disaster';
import type { Post as _ndmsRpcEvent_Post, Post__Output as _ndmsRpcEvent_Post__Output } from '../ndmsRpcEvent/Post';

export interface EventClient extends grpc.Client {
  sendEvent(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_ndmsRpcEvent_Post, _ndmsRpcEvent_Disaster__Output>;
  sendEvent(options?: grpc.CallOptions): grpc.ClientDuplexStream<_ndmsRpcEvent_Post, _ndmsRpcEvent_Disaster__Output>;
  sendEvent(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_ndmsRpcEvent_Post, _ndmsRpcEvent_Disaster__Output>;
  sendEvent(options?: grpc.CallOptions): grpc.ClientDuplexStream<_ndmsRpcEvent_Post, _ndmsRpcEvent_Disaster__Output>;
  
}

export interface EventHandlers extends grpc.UntypedServiceImplementation {
  sendEvent: grpc.handleBidiStreamingCall<_ndmsRpcEvent_Post__Output, _ndmsRpcEvent_Disaster>;
  
}

export interface EventDefinition extends grpc.ServiceDefinition {
  sendEvent: MethodDefinition<_ndmsRpcEvent_Post, _ndmsRpcEvent_Disaster, _ndmsRpcEvent_Post__Output, _ndmsRpcEvent_Disaster__Output>
}
