import { useEffect, useState } from 'react'
import {
  Plus,
  Globe,
  TrendingUp,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  Copy
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useWebsites,
  useCreateWebsite,
  useDeleteWebsite,
  useUpdateWebsite
} from '../hooks/useWebsites'
import { useConfirm } from '../components/ui/confirm'
import { useToast } from '../components/ui/toaster'

export default function ManageWebsites() {
  const navigate = useNavigate()
  const { data, isLoading, error, isRefetching, refetch } = useWebsites()
  const createWebsite = useCreateWebsite()
  const deleteWebsite = useDeleteWebsite()
  const editWebsite = useUpdateWebsite()
  const { confirm } = useConfirm()
  const { toast } = useToast()
  const [websites, setWebsites] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' })
  const [formError, setFormError] = useState({ name: '', url: '' })
  const [currentWebsiteId, setCurrentWebsiteId] = useState('')

  useEffect(() => {
    refetch()
  }, [])

  function mapApiToWebsite(item: any) {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      isActive: item.isActive,
      secretKey: item.secretKey,
      leads: item.totalLeads ?? 0,
      lastScannedAt: item.lastScannedAt,
      formsDetected: item.formsDetected ?? 0
    }
  }
  useEffect(() => {
    const list = (data?.data?.data ?? []).map(mapApiToWebsite)
    setWebsites(list)
  }, [data])

  const handleAddWebsite = async () => {
    const errorObj = { name: '', url: '' }
    if (!newWebsite.name.trim()) {
      errorObj.name = 'Name is required'
    }

    if (!newWebsite.url.trim()) {
      errorObj.url = 'URL is required'
    }

    if (
      newWebsite.url.trim() &&
      !newWebsite.url.startsWith('http://') &&
      !newWebsite.url.startsWith('https://')
    ) {
      errorObj.url = 'URL must start with http:// or https://'
    }

    if (errorObj.name || errorObj.url) {
      setFormError(errorObj)
      return
    }

    try {
      const payload = {
        name: newWebsite.name.trim(),
        url: newWebsite.url.trim()
      }

      if (currentWebsiteId) {
        await editWebsite.mutateAsync({ ...payload, id: currentWebsiteId })
      } else {
        await createWebsite.mutateAsync(payload)
      }
      setNewWebsite({ name: '', url: '' })
      setShowAddModal(false)
      setCurrentWebsiteId('')
    } catch (e: any) {
      toast({
        title: 'Failed to create website',
        description: e?.message,
        variant: 'error'
      })
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete website?',
      message: 'This action cannot be undone.'
    })
    if (!ok) return

    deleteWebsite.mutate({ ids: [id] })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {String((error as any)?.message || 'Failed to load websites')}
        </div>
      )}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Websites
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your tracked websites
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Plus className="size-5" />
          Add Website
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading || isRefetching) && (
          <div className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">
            Loading websites...
          </div>
        )}
        {websites.map((website) => (
          <div
            key={website.id}
            className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700/50 dark:bg-gray-800/70"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
                <Globe className="size-6 text-white" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewWebsite(website)
                    setCurrentWebsiteId(website.id)
                  }}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="size-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleDelete(website.id)}
                  className="rounded-lg p-2 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="size-4 text-red-500" />
                </button>
              </div>
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
              {website.name}
            </h3>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {website.url}
              <ExternalLink className="size-3" />
            </a>

            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    website.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {website.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="size-4" />
                  Secret Key
                </span>
                <div className="flex items-center gap-2">
                  <span className="max-w-[180px] truncate font-bold text-gray-800 dark:text-white">
                    {website.secretKey}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(website.secretKey)
                      toast({ title: 'Secret key copied', variant: 'success' })
                    }}
                    className="rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Copy secret key"
                    title="Copy secret key"
                  >
                    <Copy className="size-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="size-4" />
                  Total Leads
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {website.leads.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="size-4" />
                  Last Scanned
                </span>
                <span className="text-sm text-gray-800 dark:text-white">
                  {new Date(website.lastScannedAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Forms Detected
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {website.formsDetected}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/websites/${website.id}`)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {(showAddModal || currentWebsiteId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-gray-800">
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              {currentWebsiteId ? 'Edit Website' : 'Add New Website'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website Name
                </label>
                <input
                  type="text"
                  value={newWebsite.name}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="My Website"
                />
                {formError.name && (
                  <p className="mt-1 text-sm text-red-500">{formError.name}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, url: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
                {formError.url && (
                  <p className="mt-1 text-sm text-red-500">{formError.url}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewWebsite({ name: '', url: '' })
                  setCurrentWebsiteId('')
                }}
                className="flex-1 rounded-xl bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebsite}
                disabled={createWebsite.isPending || editWebsite.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {createWebsite.isPending || editWebsite.isPending
                  ? 'Saving...'
                  : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
