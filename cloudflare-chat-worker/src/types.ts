export interface Couple {
  id: string
  user_1: string
  user_2: string
  anniversary_date: string // YYYY-MM-DD
  nickname_1?: string | null
  nickname_2?: string | null
  status: "active" | "separated"
  created_at: number // epoch ms
  updated_at: number // epoch ms
}

export interface CoupleRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: "pending" | "accepted" | "rejected" | "canceled"
  created_at: number // epoch ms
  updated_at: number // epoch ms
}

export interface CoupleMessage {
  id: string
  couple_id: string
  sender_id: string
  text: string
  type: "text" | "heart" | "image"
  status?: "sent" | "delivered" | "read"
  created_at: number // epoch ms
}

export interface CoupleStatusResult {
  couple: Couple | null
  incomingRequests: CoupleRequest[]
  outgoingRequests: CoupleRequest[]
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

export interface D1Result<T = unknown> {
  results?: T[]
  success: boolean
  meta?: unknown
  error?: string
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run(): Promise<{ success: boolean; meta: unknown }>
  all<T = unknown>(): Promise<D1Result<T>>
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
