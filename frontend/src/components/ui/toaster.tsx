import React, { createContext, useCallback, useContext, useState } from 'react'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastContextValue = {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <Toaster />')
  return ctx
}

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    const next: Toast = { id, duration: 3000, variant: 'default', ...t }
    setToasts((prev) => [...prev, next])
    const duration = next.duration ?? 3000
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              background:
                t.variant === 'success'
                  ? '#16a34a'
                  : t.variant === 'error'
                  ? '#dc2626'
                  : t.variant === 'warning'
                  ? '#d97706'
                  : '#111827',
              color: 'white',
              borderRadius: 8,
              padding: '10px 12px',
              minWidth: 260,
              boxShadow:
                '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
            }}
          >
            {t.title && (
              <div
                style={{ fontWeight: 600, marginBottom: t.description ? 4 : 0 }}
              >
                {t.title}
              </div>
            )}
            {t.description && (
              <div style={{ opacity: 0.95 }}>{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
