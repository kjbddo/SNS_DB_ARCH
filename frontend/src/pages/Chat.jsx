import React, { useState, useEffect, useRef } from 'react'
import { chatAPI } from '../services/api'
import './Chat.css'

function Chat() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const currentUserId = localStorage.getItem('userId') || '1'

  const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}분 전`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}시간 전`
    }
    
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    fetchChatRooms()
  }, [])

  const fetchChatRooms = async () => {
    try {
      const response = await chatAPI.getRooms(currentUserId)
      if (response.data) {
        setRooms(response.data)
      }
    } catch (error) {
      console.error('채팅방 목록 로딩 실패:', error)
    }
  }

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages()
    }
  }, [selectedRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getRoom(selectedRoom.id)
      if (response.data) {
        setMessages(response.data.messages || [])
      }
    } catch (error) {
      console.error('메시지 로딩 실패:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCreateRoom = async (otherUserId) => {
    try {
      const response = await chatAPI.createRoom({
        user1Id: currentUserId,
        user2Id: otherUserId
      })
      if (response.data) {
        setSelectedRoom(response.data)
        fetchChatRooms()
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error)
      alert('채팅방 생성에 실패했습니다.')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom) return

    try {
      await chatAPI.sendMessage({
        chatRoomId: selectedRoom.id,
        senderId: currentUserId,
        receiverId: selectedRoom.user1Id === currentUserId 
          ? selectedRoom.user2Id 
          : selectedRoom.user1Id,
        content: newMessage
      })
      setNewMessage('')
      fetchMessages()
      fetchChatRooms() // 채팅방 목록 업데이트
    } catch (error) {
      console.error('메시지 전송 실패:', error)
    }
  }

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>메시지</h2>
            <button 
              className="chat-new-btn"
              onClick={() => {
                const userId = prompt('채팅할 사용자 ID를 입력하세요:')
                if (userId && userId.trim()) {
                  handleCreateRoom(userId.trim())
                }
              }}
              title="새 메시지"
            >
              새 메시지
            </button>
          </div>
          <div className="chat-rooms">
            {rooms.length === 0 ? (
              <div className="chat-empty">채팅방이 없습니다.</div>
            ) : (
              rooms.map(room => (
                <div
                  key={room.id}
                  className={`chat-room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img 
                    src={room.otherProfileImageUrl || '/default-avatar.png'} 
                    alt={room.otherUsername}
                    className="chat-room-avatar"
                  />
                  <div className="chat-room-info">
                    <div className="chat-room-username">{room.otherUsername}</div>
                    <div className="chat-room-preview">{room.lastMessage || '메시지가 없습니다.'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedRoom ? (
            <>
              <div className="chat-header">
                <img 
                  src={selectedRoom.otherProfileImageUrl || '/default-avatar.png'} 
                  alt={selectedRoom.otherUsername}
                  className="chat-header-avatar"
                />
                <span className="chat-header-username">{selectedRoom.otherUsername}</span>
              </div>

              <div className="chat-messages">
                {messages.map((message, index) => {
                  const isSent = parseInt(message.senderId) === parseInt(currentUserId)
                  const prevMessage = index > 0 ? messages[index - 1] : null
                  const showSender = !prevMessage || prevMessage.senderId !== message.senderId
                  
                  return (
                    <div
                      key={message.id}
                      className={`chat-message ${isSent ? 'sent' : 'received'}`}
                    >
                      {!isSent && showSender && (
                        <div className="chat-message-sender">
                          {message.senderId !== selectedRoom.user1Id && selectedRoom.user1Id !== currentUserId
                            ? selectedRoom.otherUsername
                            : selectedRoom.otherUsername}
                        </div>
                      )}
                      <div className="chat-message-content">
                        {message.content}
                      </div>
                      {message.imageUrl && (
                        <img src={message.imageUrl} alt="Message" className="chat-message-image" />
                      )}
                      {message.createdAt && (
                        <div className="chat-message-time">
                          {formatTimeAgo(message.createdAt)}
                        </div>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="메시지 입력..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">전송</button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <p>채팅방을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat

