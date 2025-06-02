import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Home from './pages/Home'
import { userAuthStore } from './store/userAuthStore.js'
import { Loader } from 'lucide-react'
import { useThemeStore } from './store/useThemStore.js'

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = userAuthStore()
  console.log('online', onlineUsers)

  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log('authuser', authUser)

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    )
  }
  return (
    <div data-theme={theme} className="pb-20">
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<Settings />} />

        {/* home */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  )
}

export default App
