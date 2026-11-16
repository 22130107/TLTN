"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useCouple } from "@/hooks/useCouple"
import { useCoupleChat } from "@/hooks/useCoupleChat"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import UnpairedView from "@/components/couple/UnpairedView"
import PairedDashboard from "@/components/couple/PairedDashboard"
import CoupleChatArea from "@/components/couple/CoupleChatArea"
import HeartAnimationOverlay from "@/components/couple/HeartAnimationOverlay"

export default function CouplePage() {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth()
  const {
    couple,
    isLoading: isCoupleLoading,
    incomingRequests,
    outgoingRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    unpair,
    updateAnniversary,
  } = useCouple()

  // Chat hook initialized with couple ID & current user ID
  const {
    messages,
    isConnected,
    partnerOnline,
    partnerTyping,
    heartReceivedTimestamp,
    sendMessage,
    sendTyping,
    sendHeart,
  } = useCoupleChat(couple?.id, user?.id)

  // 1. Loading State
  if (isAuthLoading || (user && isCoupleLoading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#121212] px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff4b72] border-t-transparent shadow-lg shadow-[#ff4b72]/20" />
          <p className="font-medium text-gray-300">Đang chuẩn bị không gian cặp đôi...</p>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#121212] text-white">
        <MainHeader activeTab="couple" />
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#1c1c1c] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-500/10 text-4xl text-[#ff4b72]">
              🔒
            </div>
            <h2 className="text-2xl font-bold">Đăng nhập để vào Không gian Cặp đôi</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Bạn cần đăng nhập tài khoản HYUN để có thể chia sẻ User ID, gửi lời mời ghép đôi và trò
              chuyện cùng người thương.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ff4b72] to-[#ff3366] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4b72]/30 transition-transform hover:opacity-95 active:scale-98"
            >
              Đăng nhập ngay ❤️
            </button>
          </div>
        </main>
        <MainFooter />
      </div>
    )
  }

  // 3. Authenticated State
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <MainHeader activeTab="couple" />

      {/* Flying Hearts Animation Overlay */}
      <HeartAnimationOverlay triggerTimestamp={heartReceivedTimestamp} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!couple ? (
          /* Unpaired State: Show ID, send invite form, pending requests */
          <UnpairedView
            user={user}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onSendRequest={async (targetUserId) => {
              await sendRequest(targetUserId)
            }}
            onAcceptRequest={async (requestId) => {
              await acceptRequest(requestId)
            }}
            onRejectRequest={rejectRequest}
            onCancelRequest={cancelRequest}
          />
        ) : (
          /* Paired State: Couple Dashboard + Realtime Chat */
          <div className="space-y-6">
            <PairedDashboard
              couple={couple}
              currentUserId={user.id}
              partnerOnline={partnerOnline}
              onUnpair={unpair}
              onUpdateAnniversary={updateAnniversary}
            />

            <CoupleChatArea
              messages={messages}
              currentUserId={user.id}
              partnerName={couple.partner?.display_name || "Người thương"}
              partnerAvatar={couple.partner?.avatar_url}
              partnerOnline={partnerOnline}
              partnerTyping={partnerTyping}
              isConnected={isConnected}
              onSendMessage={sendMessage}
              onSendTyping={sendTyping}
              onSendHeart={sendHeart}
            />
          </div>
        )}
      </main>

      <MainFooter />
    </div>
  )
}
