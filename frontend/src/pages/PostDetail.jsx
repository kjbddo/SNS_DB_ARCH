import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { postAPI, commentAPI, likeAPI, scrapAPI, reportAPI, collectionAPI } from '../services/api'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaEllipsisH, FaTrash, FaEdit, FaFlag } from 'react-icons/fa'
import './PostDetail.css'

function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isScrapped, setIsScrapped] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [collections, setCollections] = useState([])
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'
  const isPostOwner = post && parseInt(post.userId) === parseInt(currentUserId)

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
    fetchPost()
    fetchComments()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(postId)
      if (response.data) {
        setPost(response.data)
        setIsLiked(response.data.isLiked || false)
        setIsScrapped(response.data.isScrapped || false)
        setLikeCount(response.data.likeCount || 0)
      }
    } catch (error) {
      console.error('게시물 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(postId)
      if (response.data) {
        setComments(response.data)
      }
    } catch (error) {
      console.error('댓글 로딩 실패:', error)
    }
  }

  const handleLike = async () => {
    try {
      if (isLiked) {
        await likeAPI.unlike({ userId: currentUserId, postId })
        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        await likeAPI.like({ userId: currentUserId, postId })
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
      fetchPost()
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
    }
  }

  const handleScrap = async () => {
    try {
      if (isScrapped) {
        await scrapAPI.unscrap({ userId: currentUserId, postId })
        setIsScrapped(false)
      } else {
        await scrapAPI.scrap({ userId: currentUserId, postId })
        setIsScrapped(true)
      }
    } catch (error) {
      console.error('스크랩 처리 실패:', error)
    }
  }

  const handleSaveToCollection = async () => {
    try {
      const response = await collectionAPI.getCollections(currentUserId)
      if (response.data) {
        setCollections(response.data)
        setShowSaveModal(true)
      }
    } catch (error) {
      console.error('컬렉션 로딩 실패:', error)
    }
  }

  const handleSavePost = async (collectionId) => {
    try {
      await collectionAPI.savePost({
        userId: currentUserId,
        postId,
        collectionId: collectionId || null
      })
      setShowSaveModal(false)
      alert('게시물이 저장되었습니다.')
    } catch (error) {
      console.error('게시물 저장 실패:', error)
      alert('게시물 저장에 실패했습니다.')
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return
    
    try {
      await postAPI.delete(postId, currentUserId)
      navigate('/app')
    } catch (error) {
      console.error('게시물 삭제 실패:', error)
      alert('게시물 삭제에 실패했습니다.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    
    try {
      await commentAPI.delete(commentId, currentUserId)
      fetchComments()
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
    }
  }

  const handleEditComment = async (commentId, content) => {
    try {
      await commentAPI.update(commentId, currentUserId, { content })
      setEditingCommentId(null)
      setEditCommentText('')
      fetchComments()
    } catch (error) {
      console.error('댓글 수정 실패:', error)
    }
  }

  const handleReport = async () => {
    const reason = prompt('신고 사유를 입력하세요:')
    if (!reason) return

    try {
      await reportAPI.create({
        reporterId: currentUserId,
        reportedPostId: postId,
        reportType: 'INAPPROPRIATE_CONTENT',
        reason: reason
      })
      alert('신고가 접수되었습니다.')
    } catch (error) {
      console.error('신고 실패:', error)
      alert('신고에 실패했습니다.')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await commentAPI.create({
        postId,
        userId: currentUserId,
        content: newComment
      })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (!post) {
    return <div className="error">게시물을 찾을 수 없습니다.</div>
  }

  return (
    <div className="post-detail">
      <div className="post-detail-container">
        <div className="post-detail-image">
          {post.imageUrls && post.imageUrls[0] && (
            <img src={post.imageUrls[0]} alt="Post" />
          )}
        </div>
        <div className="post-detail-content">
          <header className="post-detail-header">
            <Link to={`/app/profile/${post.userId}`} className="post-detail-user">
              <img 
                src={post.profileImageUrl || '/default-avatar.png'} 
                alt={post.username}
                className="post-detail-avatar"
              />
              <span className="post-detail-username">{post.username}</span>
            </Link>
            <div className="post-detail-header-actions">
              {isPostOwner && (
                <>
                  <Link to={`/app/post/${postId}/edit`} className="post-detail-action-btn">
                    <FaEdit />
                  </Link>
                  <button onClick={handleDeletePost} className="post-detail-action-btn delete">
                    <FaTrash />
                  </button>
                </>
              )}
              {!isPostOwner && (
                <button onClick={handleReport} className="post-detail-action-btn">
                  <FaFlag />
                </button>
              )}
            </div>
          </header>

          <div className="post-detail-comments-section">
            <div className="post-detail-caption">
              <Link to={`/app/profile/${post.userId}`} className="post-detail-username-link">
                {post.username}
              </Link>
              <span>{post.caption}</span>
              {post.createdAt && (
                <div className="post-detail-time">
                  {formatTimeAgo(post.createdAt)}
                </div>
              )}
            </div>
            {comments.map(comment => {
              const isCommentOwner = parseInt(comment.userId) === parseInt(currentUserId)
              const isEditing = editingCommentId === comment.id
              
              return (
                <div key={comment.id} className="post-detail-comment">
                  <Link to={`/app/profile/${comment.userId}`} className="post-detail-username-link">
                    {comment.username}
                  </Link>
                  {isEditing ? (
                    <div className="comment-edit-form">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditComment(comment.id, editCommentText)
                          }
                        }}
                        autoFocus
                      />
                      <button onClick={() => handleEditComment(comment.id, editCommentText)}>저장</button>
                      <button onClick={() => {
                        setEditingCommentId(null)
                        setEditCommentText('')
                      }}>취소</button>
                    </div>
                  ) : (
                    <>
                      <span>{comment.content}</span>
                      {isCommentOwner && (
                        <div className="comment-actions">
                          <button 
                            onClick={() => {
                              setEditingCommentId(comment.id)
                              setEditCommentText(comment.content)
                            }}
                            className="comment-action-btn"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="comment-action-btn delete"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="post-detail-actions">
            <div className="post-detail-actions-left">
              <button onClick={handleLike} className="action-btn">
                {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
              </button>
              <button onClick={handleScrap} className="action-btn" title="스크랩">
                {isScrapped ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button onClick={handleSaveToCollection} className="action-btn" title="저장">
                저장
              </button>
            </div>
          </div>

          <div className="post-detail-stats">
            <div className="post-detail-likes">
              좋아요 <strong>{likeCount}</strong>개
            </div>
            {comments.length > 0 && (
              <div className="post-detail-comments-count">
                댓글 <strong>{comments.length}</strong>개
              </div>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="post-detail-comment-form">
            <input
              type="text"
              placeholder="댓글 달기..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim()}>
              게시
            </button>
          </form>
        </div>
      </div>

      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>컬렉션에 저장</h3>
            <div className="save-collections-list">
              <button 
                className="save-collection-item"
                onClick={() => handleSavePost(null)}
              >
                저장됨 (기본)
              </button>
              {collections.map(collection => (
                <button
                  key={collection.id}
                  className="save-collection-item"
                  onClick={() => handleSavePost(collection.id)}
                >
                  {collection.name}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowSaveModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail

