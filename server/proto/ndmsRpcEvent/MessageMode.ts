// Original file: proto/event.proto

export const MessageMode = {
  CREATE: 0,
  UPDATE: 1,
} as const;

export type MessageMode =
  | 'CREATE'
  | 0
  | 'UPDATE'
  | 1

export type MessageMode__Output = typeof MessageMode[keyof typeof MessageMode]
