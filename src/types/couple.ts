export interface CoupleProfile {
  id: string
  display_name: string
  avatar_url: string
  email?: string
}

export interface Couple {
  id: string
  user_1: string
  user_2: string
  anniversary_date: string
  nickname_1?: string | null
  nickname_2?: string | null
  status: "active" | "separated"
  created_at: string
  updated_at: string
  partner?: CoupleProfile
}

export type CoupleRequestStatus = "pending" | "accepted" | "rejected" | "canceled"

export interface CoupleRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: CoupleRequestStatus
  created_at: string
  updated_at: string
  sender_profile?: CoupleProfile
  receiver_profile?: CoupleProfile
}

export interface CoupleMessage {
  id: string
  couple_id: string
  sender_id: string
  text: string
  type: "text" | "heart" | "image"
  status?: "sent" | "delivered" | "read"
  created_at: number | string
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
