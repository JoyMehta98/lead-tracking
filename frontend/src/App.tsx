import { useMemo } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DetectForms from './pages/DetectForms'
import ManageWebsites from './pages/ManageWebsites'
import WebsiteDetail from './pages/WebsiteDetail'
import Profile from './pages/Profile'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function PublicRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

function ProtectedLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const currentPage = useMemo(() => {
    if (pathname.startsWith('/websites/')) return 'website-detail'
    if (pathname.startsWith('/websites')) return 'websites'
    if (pathname.startsWith('/detect-forms')) return 'detect-forms'
    if (pathname.startsWith('/profile')) return 'profile'
    return 'dashboard'
  }, [pathname])

  const onNavigate = (page: string, websiteId?: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/')
        break
      case 'websites':
        navigate('/websites')
        break
      case 'detect-forms':
        navigate('/detect-forms')
        break
      case 'website-detail':
        navigate(`/websites/${websiteId}`)
        break
      case 'profile':
        navigate('/profile')
        break
      case 'login':
        navigate('/login')
        break
      case 'register':
        navigate('/register')
        break
      default:
        navigate('/')
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={onNavigate}>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes with app layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/websites" element={<ManageWebsites />} />
                <Route path="/websites/:id" element={<WebsiteDetail />} />
                <Route path="/detect-forms" element={<DetectForms />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
