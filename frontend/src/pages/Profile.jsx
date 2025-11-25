import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { userAPI, postAPI, followAPI, blockAPI, reportAPI, scrapAPI, collectionAPI, chatAPI } from '../services/api'
import { FaEllipsisH, FaUserSlash, FaFlag, FaPaperPlane } from 'react-icons/fa'
import PostCard from '../components/PostCard'
import './Profile.css'

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [scrappedPosts, setScrappedPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts') // 'posts', 'saved', 'scrapped'
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'
  const isOwnProfile = parseInt(userId) === parseInt(currentUserId)

  useEffect(() => {
    const userIdNum = parseInt(userId)
    const currentUserIdNum = parseInt(currentUserId)
    const isOwn = userIdNum === currentUserIdNum
    
    fetchProfile()
    fetchPosts()
    if (isOwn) {
      fetchSavedPosts()
      fetchScrappedPosts()
    }
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId)
      // API 인터셉터가 response.data를 반환하므로, response가 이미 ApiResponse의 data 필드
      const userData = response && response.data ? response.data : response
      if (userData) {
        setUser(userData)
      }
    } catch (error) {
      console.error('프로필 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getUserPosts(userId)
      if (response.data) {
        setPosts(response.data)
      }
    } catch (error) {
      console.error('게시물 로딩 실패:', error)
    }
  }

  const fetchSavedPosts = async () => {
    try {
      const response = await collectionAPI.getSavedPosts(userId, null)
      if (response.data) {
        setSavedPosts(response.data)
      }
    } catch (error) {
      console.error('저장된 게시물 로딩 실패:', error)
    }
  }

  const fetchScrappedPosts = async () => {
    try {
      const response = await scrapAPI.getScraps(userId)
      if (response.data) {
        setScrappedPosts(response.data)
      }
    } catch (error) {
      console.error('스크랩한 게시물 로딩 실패:', error)
    }
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await followAPI.unfollow(currentUserId, userId)
        setIsFollowing(false)
      } else {
        await followAPI.follow(currentUserId, userId)
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('팔로우 처리 실패:', error)
    }
  }

  const handleBlock = async () => {
    if (!window.confirm('이 사용자를 차단하시겠습니까?')) return
    
    try {
      if (isBlocked) {
        await blockAPI.unblock(currentUserId, userId)
        setIsBlocked(false)
        alert('차단이 해제되었습니다.')
      } else {
        await blockAPI.block(currentUserId, userId)
        setIsBlocked(true)
        alert('사용자가 차단되었습니다.')
      }
    } catch (error) {
      console.error('차단 처리 실패:', error)
      alert('차단 처리에 실패했습니다.')
    }
  }

  const handleReport = async () => {
    const reason = prompt('신고 사유를 입력하세요:')
    if (!reason) return

    try {
      await reportAPI.create({
        reporterId: currentUserId,
        reportedUserId: userId,
        reportType: 'INAPPROPRIATE_CONTENT',
        reason: reason
      })
      alert('신고가 접수되었습니다.')
      setShowMenu(false)
    } catch (error) {
      console.error('신고 실패:', error)
      alert('신고에 실패했습니다.')
    }
  }

  const handleMessage = async () => {
    try {
      // 채팅방 생성 또는 기존 채팅방 찾기
      const response = await chatAPI.createRoom({
        user1Id: currentUserId,
        user2Id: userId
      })
      if (response.data) {
        navigate('/app/chat')
        // TODO: 생성된 채팅방으로 자동 이동
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error)
      navigate('/chat')
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (!user) {
    return <div className="error">사용자를 찾을 수 없습니다.</div>
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.profileImageUrl || '/default-avatar.png'} 
            alt={user.username}
          />
        </div>
        <div className="profile-info">
          <div className="profile-header-top">
            <h1 className="profile-username">{user.username}</h1>
            <div className="profile-actions">
              {isOwnProfile ? (
                <Link to="/app/settings" className="profile-edit-btn">
                  프로필 편집
                </Link>
              ) : (
                <>
                  <button 
                    onClick={handleFollow}
                    className={`profile-follow-btn ${isFollowing ? 'following' : ''}`}
                  >
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </button>
                  <button 
                    onClick={handleMessage}
                    className="profile-message-btn"
                  >
                    <FaPaperPlane /> 메시지
                  </button>
                  <div className="profile-menu-container">
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      className="profile-menu-btn"
                    >
                      <FaEllipsisH />
                    </button>
                    {showMenu && (
                      <div className="profile-menu">
                        <button onClick={handleBlock} className="profile-menu-item">
                          <FaUserSlash /> {isBlocked ? '차단 해제' : '차단'}
                        </button>
                        <button onClick={handleReport} className="profile-menu-item">
                          <FaFlag /> 신고
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <strong>{posts.length}</strong> 게시물
            </div>
            <div className="stat clickable" onClick={() => {
              navigate(`/app/followers/${userId}`)
            }}>
              <strong>{user.followerCount || 0}</strong> 팔로워
            </div>
            <div className="stat clickable" onClick={() => {
              navigate(`/app/followings/${userId}`)
            }}>
              <strong>{user.followingCount || 0}</strong> 팔로잉
            </div>
          </div>
          <div className="profile-bio">
            <div className="profile-name">{user.name}</div>
            {user.bio && <div className="profile-bio-text">{user.bio}</div>}
          </div>
        </div>
      </div>

      <div className="profile-posts">
        {isOwnProfile && (
          <div className="profile-posts-header">
            <span 
              className={activeTab === 'posts' ? 'active' : ''}
              onClick={() => setActiveTab('posts')}
            >
              게시물
            </span>
            <span 
              className={activeTab === 'saved' ? 'active' : ''}
              onClick={() => setActiveTab('saved')}
            >
              저장됨
            </span>
            <span 
              className={activeTab === 'scrapped' ? 'active' : ''}
              onClick={() => setActiveTab('scrapped')}
            >
              스크랩
            </span>
          </div>
        )}
        {!isOwnProfile && (
          <div className="profile-posts-header">
            <span className="active">게시물</span>
          </div>
        )}
        <div className="profile-posts-grid">
          {activeTab === 'posts' && posts.map(post => (
            <Link key={post.id} to={`/app/post/${post.id}`} className="profile-post-item">
              {(post.imageUrls || post.images) && (post.imageUrls || post.images)[0] && (
                <img src={(post.imageUrls || post.images)[0]} alt="Post" />
              )}
            </Link>
          ))}
          {activeTab === 'saved' && savedPosts.map(saved => (
            <Link key={saved.id} to={`/app/post/${saved.postId}`} className="profile-post-item">
              {saved.postImageUrl && (
                <img src={saved.postImageUrl} alt="Post" />
              )}
            </Link>
          ))}
          {activeTab === 'saved' && savedPosts.length === 0 && (
            <div className="profile-empty">저장된 게시물이 없습니다.</div>
          )}
          {activeTab === 'scrapped' && scrappedPosts.map(scrap => (
            <Link key={scrap.postId} to={`/app/post/${scrap.postId}`} className="profile-post-item">
              {scrap.postImageUrl && (
                <img src={scrap.postImageUrl} alt="Post" />
              )}
            </Link>
          ))}
          {activeTab === 'scrapped' && scrappedPosts.length === 0 && (
            <div className="profile-empty">스크랩한 게시물이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

