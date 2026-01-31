import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  CircleDollarSign,
  Info,
  X,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { mockNotifications, type Notification } from '@/data/mockData'

const notificationIcons: Record<Notification['type'], typeof Bell> = {
  payin: ArrowDownCircle,
  payout: ArrowUpCircle,
  dispute: AlertTriangle,
  balance: CircleDollarSign,
  system: Info,
}

const notificationColors: Record<Notification['type'], string> = {
  payin: 'text-green-500',
  payout: 'text-blue-500',
  dispute: 'text-orange-500',
  balance: 'text-emerald-500',
  system: 'text-yellow-500',
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'вчера'
  return `${diffDays} дн. назад`
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Уведомления</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={markAllAsRead}
              >
                <Check className="mr-1 h-3 w-3" />
                Прочитать все
              </Button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const colorClass = notificationColors[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'group relative flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-b-0',
                      notification.isRead
                        ? 'bg-card'
                        : 'bg-primary/5 hover:bg-primary/10'
                    )}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        notification.isRead ? 'bg-muted' : 'bg-primary/10'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', colorClass)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm',
                            notification.isRead ? 'text-muted-foreground' : 'font-medium'
                          )}
                        >
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {notification.orderId && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{notification.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                Показать все уведомления
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
