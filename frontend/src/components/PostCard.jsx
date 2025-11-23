import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaComment, FaBookmark, FaRegBookmark, FaEllipsisH } from 'react-icons/fa'
import { likeAPI, scrapAPI } from '../services/api'
import './PostCard.css'

function PostCard({ post, currentUserId, onUpdate }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isScrapped, setIsScrapped] = useState(post.isScrapped || false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await likeAPI.unlike({ userId: currentUserId, postId: post.id })
        setIsLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        await likeAPI.like({ userId: currentUserId, postId: post.id })
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
    }
  }

  const handleScrap = async () => {
    try {
      if (isScrapped) {
        await scrapAPI.unscrap({ userId: currentUserId, postId: post.id })
        setIsScrapped(false)
      } else {
        await scrapAPI.scrap({ userId: currentUserId, postId: post.id })
        setIsScrapped(true)
      }
    } catch (error) {
      console.error('스크랩 처리 실패:', error)
    }
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/app/profile/${post.userId}`} className="post-user">
          <img 
            src={post.profileImageUrl || '/default-avatar.png'} 
            alt={post.username}
            className="post-avatar"
          />
          <span className="post-username">{post.username}</span>
        </Link>
        <div className="post-menu-container" ref={menuRef}>
          <button 
            className="post-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaEllipsisH />
          </button>
          {showMenu && (
            <div className="post-menu">
              <Link to={`/app/post/${post.id}`} className="post-menu-item" onClick={() => setShowMenu(false)}>
                게시물로 이동
              </Link>
              {post.userId === currentUserId && (
                <Link to={`/app/post/${post.id}/edit`} className="post-menu-item" onClick={() => setShowMenu(false)}>
                  수정
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {(post.imageUrls || post.images) && (post.imageUrls || post.images).length > 0 && (
        <div className="post-images">
          {(post.imageUrls || post.images).map((image, index) => (
            <img key={index} src={image} alt={`Post ${index + 1}`} />
          ))}
        </div>
      )}

      <div className="post-actions">
        <div className="post-actions-left">
          <button onClick={handleLike} className="action-btn">
            {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
          </button>
          <Link to={`/app/post/${post.id}`} className="action-btn">
            <FaComment />
          </Link>
        </div>
        <button onClick={handleScrap} className="action-btn">
          {isScrapped ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      <div className="post-content">
        <div className="post-likes">
          좋아요 <strong>{likeCount}</strong>개
        </div>
        <div className="post-caption">
          <Link to={`/app/profile/${post.userId}`} className="post-username-link">
            {post.username || '사용자'}
          </Link>
          <span>{post.caption}</span>
        </div>
        {post.commentCount > 0 && (
          <Link to={`/app/post/${post.id}`} className="post-comments-link">
            댓글 {post.commentCount}개 모두 보기
          </Link>
        )}
        {post.createdAt && (
          <div className="post-time">
            {formatTimeAgo(post.createdAt)}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard

