import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { followAPI } from '../services/api'
import './Followers.css'

function Followers() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'

  useEffect(() => {
    fetchFollowers()
  }, [userId])

  const fetchFollowers = async () => {
    try {
      setLoading(true)
      const response = await followAPI.getFollowers(userId)
      if (response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('팔로워 목록 로딩 실패:', error)
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
      fetchFollowers() // 목록 새로고침
    } catch (error) {
      console.error('팔로우 처리 실패:', error)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="followers">
      <div className="followers-container">
        <div className="followers-header">
          <button onClick={() => navigate(-1)} className="back-btn">←</button>
          <h2>팔로워</h2>
        </div>
        <div className="followers-list">
          {users.length === 0 ? (
            <div className="followers-empty">
              <p>팔로워가 없습니다.</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user.userId} className="follower-item">
                <Link to={`/app/profile/${user.userId}`} className="follower-user">
                  <img
                    src={user.profileImageUrl || '/default-avatar.png'}
                    alt={user.username}
                    className="follower-avatar"
                  />
                  <div className="follower-info">
                    <div className="follower-username">{user.username}</div>
                    {user.name && <div className="follower-name">{user.name}</div>}
                  </div>
                </Link>
                {parseInt(user.userId) !== parseInt(currentUserId) && (
                  <button
                    onClick={() => handleFollow(user.userId, user.isFollowing)}
                    className={`follower-follow-btn ${user.isFollowing ? 'following' : ''}`}
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

export default Followers

