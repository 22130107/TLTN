export interface CoupleMessage {
  id: string
  couple_id: string
  sender_id: string
  text: string
  type: "text" | "heart" | "image"
  status?: "sent" | "delivered" | "read"
  created_at: number // epoch ms
}

export type WsClientAction =
  | { type: "join"; coupleId: string; userId: string }
  | { type: "message"; coupleId: string; senderId: string; text: string; msgType?: "text" | "heart" }
  | { type: "typing"; coupleId: string; userId: string; isTyping: boolean }
  | { type: "heart_ping"; coupleId: string; senderId: string }

export type WsServerEvent =
  | { type: "history"; messages: CoupleMessage[] }
  | { type: "new_message"; message: CoupleMessage }
  | { type: "typing"; userId: string; isTyping: boolean }
  | { type: "partner_status"; isOnline: boolean }
  | { type: "heart_received"; senderId: string }
  | { type: "error"; message: string }

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run(): Promise<{ success: boolean; meta: unknown }>
  all<T = unknown>(): Promise<{ results?: T[]; success: boolean }>
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  dump(): Promise<ArrayBuffer>
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<unknown[]>
  exec(query: string): Promise<unknown>
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

export interface Env {
  CHAT_DB?: D1Database
  ENVIRONMENT?: string
  MAX_HISTORY_MESSAGES?: string
}
