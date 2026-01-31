import { ThemeToggle } from '@/components/ThemeToggle'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { AndroidDropdown } from '@/components/AndroidDropdown'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <AndroidDropdown />
        <NotificationDropdown />
        <ThemeToggle />
      </div>
    </header>
  )
}
