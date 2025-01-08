// Original file: proto/event.proto

import type { MessageMode as _ndmsRpcEvent_MessageMode, MessageMode__Output as _ndmsRpcEvent_MessageMode__Output } from '../ndmsRpcEvent/MessageMode';
import type { Position as _ndmsRpcEvent_Position, Position__Output as _ndmsRpcEvent_Position__Output } from '../ndmsRpcEvent/Position';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface Disaster {
  'type': (number);
  'postIds': (string)[];
  'disastersIds': (string)[];
  'id': (string);
  'isActive': (boolean);
  'position': (_ndmsRpcEvent_Position | null);
  'radius': (number | string);
  'startAt': (_google_protobuf_Timestamp | null);
  'endAt': (_google_protobuf_Timestamp | null);
  'severity': (number);
  'confidence': (number);
}

export interface Disaster__Output {
  'type'?: (number);
  'postIds'?: (string)[];
  'disastersIds'?: (string)[];
  'id'?: (string);
  'isActive'?: (boolean);
  'position'?: (_ndmsRpcEvent_Position__Output);
  'radius'?: (number);
  'startAt'?: (_google_protobuf_Timestamp__Output);
  'endAt'?: (_google_protobuf_Timestamp__Output);
  'severity'?: (number);
  'confidence'?: (number);
}
