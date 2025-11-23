import React, { createContext, useCallback, useContext, useState } from 'react'

type ConfirmOptions = {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

type ConfirmContextValue = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState<ConfirmOptions>({})
  const [resolver, setResolver] = useState<(v: boolean) => void>(() => () => {})

  const confirm = useCallback((o: ConfirmOptions) => {
    setOpts(o)
    setOpen(true)
    return new Promise<boolean>((resolve) => setResolver(() => resolve))
  }, [])

  const onClose = (val: boolean) => {
    setOpen(false)
    resolver(val)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 20,
              width: 380,
              boxShadow: '0 10px 15px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {opts.title ?? 'Are you sure?'}
            </div>
            <div style={{ color: '#4b5563', marginBottom: 16 }}>
              {opts.message ?? 'This action cannot be undone.'}
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <button
                onClick={() => onClose(false)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#e5e7eb'
                }}
              >
                {opts.cancelText ?? 'Cancel'}
              </button>
              <button
                onClick={() => onClose(true)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#dc2626',
                  color: 'white'
                }}
              >
                {opts.confirmText ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
