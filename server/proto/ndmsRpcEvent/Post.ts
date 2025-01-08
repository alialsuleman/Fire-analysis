// Original file: proto/event.proto

import type { MessageMode as _ndmsRpcEvent_MessageMode, MessageMode__Output as _ndmsRpcEvent_MessageMode__Output } from '../ndmsRpcEvent/MessageMode';
import type { Position as _ndmsRpcEvent_Position, Position__Output as _ndmsRpcEvent_Position__Output } from '../ndmsRpcEvent/Position';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface Post {
  'type': (number);
  'id': (string);
  'position': (_ndmsRpcEvent_Position);
  'radius': (number);
  'createdAt': (_google_protobuf_Timestamp);
  'severity': (number);
  'confidence': (number);
  'numLikes': (number);
  'numDisLikes': (number);
  'numComments': (number);
}

export interface Post__Output {
  'type'?: (number);
  'id'?: (string);
  'position'?: (_ndmsRpcEvent_Position__Output);
  'radius'?: (number);
  'createdAt'?: (_google_protobuf_Timestamp__Output);
  'severity'?: (number);
  'confidence'?: (number);
  'numLikes': (number);
  'numDisLikes': (number);
  'numComments': (number);
}
