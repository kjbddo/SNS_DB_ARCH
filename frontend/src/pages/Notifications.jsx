import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationAPI } from '../services/api'
import './Notifications.css'

function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications(currentUserId)
      // API 인터셉터가 response.data를 반환하므로, response가 이미 ApiResponse의 data 필드
      if (response && Array.isArray(response)) {
        setNotifications(response)
      } else if (response && response.data && Array.isArray(response.data)) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('알림 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error)
    }
  }

  const getNotificationText = (notification) => {
    const actor = notification.actorUsername || '누군가'
    switch (notification.type) {
      case 'LIKE':
        return `${actor}님이 게시물을 좋아합니다.`
      case 'COMMENT':
        return `${actor}님이 댓글을 남겼습니다.`
      case 'FOLLOW':
        return `${actor}님이 팔로우하기 시작했습니다.`
      case 'MENTION':
        return `${actor}님이 회원님을 멘션했습니다.`
      case 'POST_TAG':
        return `${actor}님이 회원님을 태그했습니다.`
      default:
        return '새 알림이 있습니다.'
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(unreadNotifications.map(n => notificationAPI.markAsRead(n.id)))
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="notifications">
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>알림</h2>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="notifications-mark-all-read">
              모두 읽음 처리
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <p>알림이 없습니다.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification.id)
                  }
                  if (notification.postId) {
                    navigate(`/post/${notification.postId}`)
                  } else if (notification.actorId) {
                    navigate(`/profile/${notification.actorId}`)
                  }
                }}
              >
                <img
                  src={notification.actorProfileImageUrl || '/default-avatar.png'}
                  alt={notification.actorUsername}
                  className="notification-avatar"
                />
                <div className="notification-content">
                  <p>{getNotificationText(notification)}</p>
                  <span className="notification-time">
                    {notification.createdAt 
                      ? new Date(notification.createdAt).toLocaleString('ko-KR')
                      : ''}
                  </span>
                </div>
                {notification.postImageUrl && (
                  <img
                    src={notification.postImageUrl}
                    alt="Post"
                    className="notification-post-image"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications

