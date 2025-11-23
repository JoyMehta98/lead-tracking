import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Shield, Camera, Save } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2">
            <User className="size-6 text-white" />
          </div>
          Profile Settings
        </h2>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center space-y-4">
            <div className="group relative">
              <img
                src={user?.avatar}
                alt="Avatar"
                className="size-32 rounded-full border-4 border-white shadow-xl dark:border-gray-700"
              />
              <button className="absolute bottom-0 right-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg transition-transform hover:scale-110">
                <Camera className="size-4 text-white" />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            <div className="group">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/50 py-3 pl-11 pr-4 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                />
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/50 py-3 pl-11 pr-4 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:w-auto"
            >
              <Save className="size-5" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
        <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-2">
            <Shield className="size-5 text-white" />
          </div>
          Security
        </h3>
        <div className="space-y-4">
          <div className="group">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="group">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <button className="rounded-xl bg-gradient-to-r from-red-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Update Password
          </button>
        </div>
      </div>
    </div>
  )
}
