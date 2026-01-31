import { useState, useRef, useEffect } from 'react'
import { Smartphone, Download, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AppItem {
  id: string
  name: string
  description: string
  icon: string
  version: string
  uploadDate: string
  downloadUrl: string
}

const apps: AppItem[] = [
  {
    id: '1',
    name: 'Automatic',
    description: 'Automatic приложение',
    icon: '📱',
    version: '1.0',
    uploadDate: '2026-01-30',
    downloadUrl: '#',
  },
]

export function AndroidDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        title="Приложения для трейдеров"
      >
        <Smartphone className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Список приложений для работы</span>
          </div>

          {/* Apps list */}
          <div className="max-h-[400px] overflow-y-auto">
            {apps.map((app) => (
              <div
                key={app.id}
                className="group flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{app.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
                          v{app.version}
                        </span>
                        <span>•</span>
                        <span>{new Date(app.uploadDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                    <a
                      href={app.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 px-2"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs">Скачать</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-xs text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="h-3 w-3" />
              Все приложения
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
