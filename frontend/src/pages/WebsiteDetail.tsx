import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Scan,
  Check,
  AlertCircle,
  Save,
  List,
  X
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../components/ui/toaster'
import { useWebsites } from '../hooks/useWebsites'
import {
  useScanWebsite,
  useSaveWebsiteForms,
  useWebsiteForms
} from '../hooks/useWebsiteForms'
import { useLeads } from '../hooks/useLeads'

export default function WebsiteDetail() {
  const navigate = useNavigate()
  const { id: websiteId } = useParams()
  const { toast } = useToast()
  const {
    data: websiteRes,
    isLoading: isLoadingWebsite,
    isError: isWebsiteError,
    refetch: refetchWebsite
  } = useWebsites({ websiteId })
  const website = (websiteRes as any)?.data?.data?.[0]
  const {
    data: formsRes,
    isLoading: isLoadingForms,
    refetch: refetchForms
  } = useWebsiteForms(websiteId)
  const forms = (formsRes as any)?.data ?? []
  const scanMutation = useScanWebsite(websiteId)
  const saveFormsMutation = useSaveWebsiteForms(websiteId)
  const [scanned, setScanned] = useState(false)
  const [scannedForms, setScannedForms] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<any | null>(null)
  const [drawerPage, setDrawerPage] = useState(1)
  const [drawerLimit] = useState(10)

  useEffect(() => {
    refetchWebsite()
  }, [])

  // Leads for the drawer (filtered by selectedForm)
  const { data: drawerLeadsRes, isLoading: isLoadingDrawerLeads } = useLeads(
    selectedForm && websiteId
      ? {
          websiteId: websiteId as string,
          formId: selectedForm?.id,
          page: drawerPage,
          limit: drawerLimit
        }
      : undefined
  )
  const drawerLeads = (drawerLeadsRes as any)?.data?.data ?? []
  const drawerTotal = (drawerLeadsRes as any)?.data?.total ?? 0
  const drawerTotalPages = (drawerLeadsRes as any)?.data?.totalPages ?? 1

  const finalForms = useMemo(() => {
    if (scannedForms.length > 0) {
      return scannedForms
    }
    return forms
  }, [scannedForms, forms])

  const handleSaveForms = async () => {
    if (!websiteId || finalForms.length === 0) return

    try {
      setIsSaving(true)
      await saveFormsMutation.mutateAsync({ forms: finalForms })
      toast({
        title: 'Success',
        description: 'Forms saved successfully',
        variant: 'success'
      })
      // Refresh the forms list
      await refetchForms()
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to save forms',
        variant: 'error'
      })
    } finally {
      setIsSaving(false)
      setScanned(false)
    }
  }

  const handleScan = async () => {
    if (!websiteId) return
    try {
      const data = await scanMutation.mutateAsync()
      setScannedForms(data.data)
      setScanned(true)
    } catch (err: any) {
      toast({
        title: 'Failed to scan website',
        description: err?.message,
        variant: 'error'
      })
    }
  }

  if (isLoadingWebsite || isLoadingForms) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading website...</p>
      </div>
    )
  }

  if (isWebsiteError || !website) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 size-16 text-red-400" />
        <p className="text-gray-600 dark:text-gray-400">
          Failed to load website
        </p>
        <button
          onClick={() => navigate('/websites')}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to Websites
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/websites')}
        className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="size-5" />
        Back to Websites
      </button>

      <div className="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {website?.name}
            </h2>
            <a
              href={website?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {website?.url}
            </a>
          </div>
          <button
            onClick={handleScan}
            disabled={scanMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {scanMutation.isPending ? (
              <>
                <svg className="size-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <Scan className="size-5" />
                Scan Website
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/20 dark:to-blue-800/20">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              Total Leads
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {website?.totalLeads ?? 0}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-900/20 dark:to-green-800/20">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              Status
            </p>
            <p className="text-2xl font-bold capitalize text-gray-800 dark:text-white">
              {website?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-900/20 dark:to-purple-800/20">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              Forms Found
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {scanned ? finalForms.length : website?.formsDetected ?? 0}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:from-orange-900/20 dark:to-orange-800/20">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              Last Scan
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {website?.lastScannedAt
                ? new Date(website.lastScannedAt).toDateString()
                : new Date(website?.updatedAt ?? Date.now()).toDateString()}
            </p>
          </div>
        </div>
      </div>

      {finalForms.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detected Forms
            </h3>
            {scanned && (
              <button
                onClick={handleSaveForms}
                disabled={isSaving || finalForms.length === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Forms
                  </>
                )}
              </button>
            )}
          </div>
          {finalForms.map((form: any) => (
            <div
              key={form.name}
              className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-700/50 dark:bg-gray-800/70"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h4 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                    {form.name}
                  </h4>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Action:{' '}
                      <code className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
                        {form.action}
                      </code>
                    </span>
                    <span>
                      Method:{' '}
                      <code className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
                        {form.method}
                      </code>
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2">
                  <Check className="size-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Form Fields ({form.fields?.length ?? 0})
                </h5>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(form.fields ?? []).map((field: any) => (
                    <div
                      key={field.id ?? field.name}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:border-gray-600 dark:from-gray-700/50 dark:to-gray-600/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {field.label ?? field.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Name: {field.name}
                          </p>
                        </div>
                        {field.required && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="rounded-lg bg-blue-100 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {field.type ?? 'text'}
                        </span>
                        {field.placeholder && (
                          <span className="text-xs italic text-gray-600 dark:text-gray-400">
                            "{field.placeholder}"
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leads for this form */}
              {form.id && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedForm(form)
                      setDrawerPage(1)
                      setDrawerOpen(true)
                    }}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    <List className="size-4" />
                    Leads ({(form?.leadCount ?? 0) as number})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drawer: Leads table for selected form */}
      {drawerOpen && selectedForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="relative h-full w-full max-w-xl overflow-hidden border-l border-white/10 bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Leads - {selectedForm.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Action {selectedForm.action || '-'} · Method{' '}
                  {selectedForm.method || '-'}
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="size-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="p-4">
              {/* Table */}
              <div className="h-[calc(100vh-200px)] overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/60">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                        #
                      </th>
                      {(selectedForm.fields ?? []).map((f: any) => (
                        <th
                          key={f.name}
                          className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
                        >
                          {f.label || f.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingDrawerLeads ? (
                      <tr>
                        <td
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                          colSpan={(selectedForm.fields?.length || 0) + 1}
                        >
                          Loading leads...
                        </td>
                      </tr>
                    ) : drawerLeads.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                          colSpan={(selectedForm.fields?.length || 0) + 1}
                        >
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      drawerLeads.map((lead: any, idx: number) => (
                        <tr
                          key={lead.id}
                          className="border-t border-gray-100 dark:border-gray-800"
                        >
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                            {(drawerPage - 1) * drawerLimit + idx + 1}
                          </td>
                          {(selectedForm.fields ?? []).map((f: any) => (
                            <td
                              key={f.name}
                              className="px-4 py-2 text-gray-800 dark:text-gray-200"
                            >
                              {String((lead.data || {})[f.name] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>
                  Page {drawerPage} of {drawerTotalPages} · {drawerTotal} leads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDrawerPage((p) => Math.max(1, p - 1))}
                    disabled={drawerPage <= 1}
                    className="rounded-lg bg-gray-100 px-3 py-1 disabled:opacity-50 dark:bg-gray-800"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setDrawerPage((p) => Math.min(drawerTotalPages, p + 1))
                    }
                    disabled={drawerPage >= drawerTotalPages}
                    className="rounded-lg bg-gray-100 px-3 py-1 disabled:opacity-50 dark:bg-gray-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {finalForms.length === 0 && (
        <div className="rounded-2xl border border-white/20 bg-white/70 p-12 text-center shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
          <AlertCircle className="mx-auto mb-4 size-16 text-gray-400" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No forms detected on this website
          </p>
        </div>
      )}
    </div>
  )
}
