import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  AlertTriangle,
  History,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Кошелёк', href: '/wallet', icon: Wallet },
  { name: 'Реквизиты', href: '/requisites', icon: CreditCard },
  { name: 'Споры', href: '/disputes', icon: AlertTriangle },
  { name: 'История', href: '/history', icon: History },
  { name: 'Настройки', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Zap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">AdvancePay</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="mb-4 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{user?.username || 'Трейдер'}</p>
          <p className="text-xs text-muted-foreground">{user?.teamName || 'Solo'}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  )
}
