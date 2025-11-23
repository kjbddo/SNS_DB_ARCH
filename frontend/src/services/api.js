import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    // 403 에러 상세 로깅
    if (error.response?.status === 403) {
      console.error('403 Forbidden:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
        response: error.response?.data
      })
    }
    return Promise.reject(error)
  }
)

// User API
export const userAPI = {
  register: (data) => api.post('/users', data),
  login: (data) => api.post('/users/login', data),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  getProfile: (userId) => api.get(`/users/${userId}`),
  searchUsers: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
}

// Post API
export const postAPI = {
  create: (data) => api.post('/posts', data),
  update: (postId, userId, data) => api.put(`/posts/${postId}?userId=${userId}`, data),
  delete: (postId, userId) => api.delete(`/posts/${postId}?userId=${userId}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getFeedPosts: (userId) => api.get(`/posts/feed/${userId}`),
}

// Comment API
export const commentAPI = {
  create: (data) => api.post('/comments', data),
  update: (commentId, userId, data) => api.put(`/comments/${commentId}?userId=${userId}`, data),
  delete: (commentId, userId) => api.delete(`/comments/${commentId}?userId=${userId}`),
  getComments: (postId) => api.get(`/comments/post/${postId}`),
}

// Like API
export const likeAPI = {
  like: (data) => api.post('/likes', data),
  unlike: (data) => api.delete('/likes', { data }),
}

// Follow API
export const followAPI = {
  follow: (followerId, followingId) => api.post(`/follows?followerId=${followerId}&followingId=${followingId}`),
  unfollow: (followerId, followingId) => api.delete(`/follows?followerId=${followerId}&followingId=${followingId}`),
  getFollowers: (userId) => api.get(`/follows/followers/${userId}`),
  getFollowings: (userId) => api.get(`/follows/followings/${userId}`),
}

// Block API
export const blockAPI = {
  block: (blockerId, blockedId) => api.post(`/blocks?blockerId=${blockerId}&blockedId=${blockedId}`),
  unblock: (blockerId, blockedId) => api.delete(`/blocks?blockerId=${blockerId}&blockedId=${blockedId}`),
}

// Story API
export const storyAPI = {
  create: (data) => api.post('/stories', data),
  getStories: (userId) => api.get(`/stories/user/${userId}`),
  viewStory: (storyId, viewerId) => api.post(`/stories/${storyId}/view?viewerId=${viewerId}`),
}

// Hashtag API
export const hashtagAPI = {
  search: (tag) => api.get(`/hashtags/search?tag=${tag}`),
}

// Chat API
export const chatAPI = {
  createRoom: (data) => api.post('/chats/rooms', data),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
  getRooms: (userId) => api.get(`/chats/rooms/user/${userId}`),
  sendMessage: (data) => api.post('/chats/messages', data),
}

// Notification API
export const notificationAPI = {
  create: (data) => api.post('/notifications', data),
  getNotifications: (userId) => api.get(`/notifications/user/${userId}`),
  markAsRead: (notificationId) => api.post(`/notifications/${notificationId}/read`),
}

// Report API
export const reportAPI = {
  create: (data) => api.post('/reports', data),
  updateStatus: (reportId, data) => api.put(`/reports/${reportId}/status`, data),
  getReports: (reporterId) => api.get(`/reports/reporter/${reporterId}`),
}

// Scrap API
export const scrapAPI = {
  scrap: (data) => api.post('/scraps', data),
  unscrap: (data) => api.delete('/scraps', { data }),
  getScraps: (userId) => api.get(`/scraps/user/${userId}`),
}

// Collection API
export const collectionAPI = {
  create: (data) => api.post('/collections', data),
  update: (collectionId, userId, data) => api.put(`/collections/${collectionId}?userId=${userId}`, data),
  delete: (collectionId, userId) => api.delete(`/collections/${collectionId}?userId=${userId}`),
  getCollections: (userId) => api.get(`/collections/user/${userId}`),
  savePost: (data) => api.post('/collections/saved', data),
  removeSavedPost: (savedPostId, userId) => api.delete(`/collections/saved/${savedPostId}?userId=${userId}`),
  getSavedPosts: (userId, collectionId) => {
    const url = collectionId 
      ? `/collections/saved?userId=${userId}&collectionId=${collectionId}`
      : `/collections/saved?userId=${userId}`
    return api.get(url)
  },
}

export default api

