import { LayoutDashboard, Globe, User, LogOut } from 'lucide-react'
import { Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'detect-forms', label: 'Form Detector', icon: Search },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-white/20 bg-white/70 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
      <div className="p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <LayoutDashboard className="size-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            LeadTracker
          </h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-2 p-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition-all duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
