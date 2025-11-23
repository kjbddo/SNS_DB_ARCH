import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Story from './pages/Story'
import CreateStory from './pages/CreateStory'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Reports from './pages/Reports'
import Followers from './pages/Followers'
import Following from './pages/Following'
import './App.css'

// 로그인 필요 컴포넌트
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('userId')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="post/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="post/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="post/:postId/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="story" element={<ProtectedRoute><Story /></ProtectedRoute>} />
          <Route path="story/create" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="collection/:collectionId" element={<ProtectedRoute><CollectionDetail /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="followers/:userId" element={<ProtectedRoute><Followers /></ProtectedRoute>} />
          <Route path="followings/:userId" element={<ProtectedRoute><Following /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App

