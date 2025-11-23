import { useState } from 'react'
import { useDetectForms } from '../hooks/useDetectForms'
import { Check } from 'lucide-react'

export default function DetectForms() {
  const [url, setUrl] = useState('')
  const [html, setHtml] = useState('')
  const detect = useDetectForms()

  const onDetect = async () => {
    if (!url && !html.trim()) return

    await detect.mutateAsync({ url: url || undefined, html: html || undefined })
  }

  const results = detect.data?.data || []

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Detect Forms
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Enter a URL or paste raw HTML to detect forms and input fields.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL
          </label>
          <input
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="space-y-3 md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Raw HTML
          </label>
          <textarea
            className="w-full min-h-48 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="&lt;form&gt;...&lt;/form&gt;"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            setUrl('')
            setHtml('')
          }}
          className="rounded-xl bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Clear
        </button>
        <button
          onClick={onDetect}
          disabled={detect.isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          {detect.isPending ? 'Detecting...' : 'Detect Forms'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white ">
            Detected ({results.length})
          </h2>
          <div className="space-y-4">
            {results.map((form) => (
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
