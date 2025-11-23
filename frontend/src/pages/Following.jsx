import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { followAPI } from '../services/api'
import './Following.css'

function Following() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'

  useEffect(() => {
    fetchFollowings()
  }, [userId])

  const fetchFollowings = async () => {
    try {
      setLoading(true)
      const response = await followAPI.getFollowings(userId)
      if (response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('팔로잉 목록 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await followAPI.unfollow(currentUserId, targetUserId)
      } else {
        await followAPI.follow(currentUserId, targetUserId)
      }
      fetchFollowings() // 목록 새로고침
    } catch (error) {
      console.error('팔로우 처리 실패:', error)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="following">
      <div className="following-container">
        <div className="following-header">
          <button onClick={() => navigate(-1)} className="back-btn">←</button>
          <h2>팔로잉</h2>
        </div>
        <div className="following-list">
          {users.length === 0 ? (
            <div className="following-empty">
              <p>팔로잉한 사용자가 없습니다.</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user.userId} className="following-item">
                <Link to={`/app/profile/${user.userId}`} className="following-user">
                  <img
                    src={user.profileImageUrl || '/default-avatar.png'}
                    alt={user.username}
                    className="following-avatar"
                  />
                  <div className="following-info">
                    <div className="following-username">{user.username}</div>
                    {user.name && <div className="following-name">{user.name}</div>}
                  </div>
                </Link>
                {parseInt(user.userId) !== parseInt(currentUserId) && (
                  <button
                    onClick={() => handleFollow(user.userId, user.isFollowing)}
                    className={`following-follow-btn ${user.isFollowing ? 'following' : ''}`}
                  >
                    {user.isFollowing ? '팔로잉' : '팔로우'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Following

