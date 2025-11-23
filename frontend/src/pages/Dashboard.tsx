import {
  TrendingUp,
  Globe,
  Target,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { mockAnalytics } from '../data/mockData'

export default function Dashboard() {
  const analytics = mockAnalytics

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Static Analytics Dashboard
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Track your lead generation performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <TrendingUp className="size-6" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-sm">
              <ArrowUpRight className="size-4" />
              12.5%
            </span>
          </div>
          <p className="mb-1 text-sm text-white/80">Total Leads</p>
          <p className="text-3xl font-bold">
            {analytics.totalLeads.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Globe className="size-6" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-sm">
              <ArrowUpRight className="size-4" />
              8.2%
            </span>
          </div>
          <p className="mb-1 text-sm text-white/80">Active Websites</p>
          <p className="text-3xl font-bold">{analytics.activeWebsites}</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Target className="size-6" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-sm">
              <ArrowUpRight className="size-4" />
              5.1%
            </span>
          </div>
          <p className="mb-1 text-sm text-white/80">Conversion Rate</p>
          <p className="text-3xl font-bold">{analytics.conversionRate}%</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Clock className="size-6" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-green-500/50 px-2 py-1 text-sm">
              <ArrowDownRight className="size-4" />
              15%
            </span>
          </div>
          <p className="mb-1 text-sm text-white/80">Avg Response Time</p>
          <p className="text-3xl font-bold">{analytics.avgResponseTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <BarChart3 className="size-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Leads Over Time
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.leadsOverTime.map((item, index) => {
              const maxLeads = Math.max(
                ...analytics.leadsOverTime.map((d) => d.leads)
              )
              const width = (item.leads / maxLeads) * 100
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.date}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {item.leads}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2">
              <Globe className="size-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Top Websites
            </h3>
          </div>
          <div className="space-y-4">
            {analytics.topWebsites.map((website, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800 dark:text-white">
                    {website.name}
                  </p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                      style={{
                        width: `${
                          (website.leads / analytics.topWebsites[0].leads) * 100
                        }%`
                      }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {website.leads.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    leads
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-2">
            <Target className="size-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Form Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Form Name
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Submissions
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Conversion Rate
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.formPerformance.map((form, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-700/50"
                >
                  <td className="p-4">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {form.name}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {form.submissions.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {form.conversionRate}%
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                      <ArrowUpRight className="size-4" />
                      {(Math.random() * 10 + 5).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
