// Original file: proto/event.proto


export interface Position {
  'latitude': (number);
  'longitude': (number);
  'address': (string);
  'state': (string);
  'city': (string);
  'country': (string);
}

export interface Position__Output {
  'latitude': (number);
  'longitude': (number);
  'address'?: (string);
  'state'?: (string);
  'city'?: (string);
  'country'?: (string);
}
