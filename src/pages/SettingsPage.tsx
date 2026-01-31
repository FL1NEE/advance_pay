import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Shield,
  Bell,
  Palette,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Check,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  Send,
  Link2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

type SettingsTab = 'profile' | 'security' | 'notifications'

const tabs = [
  { id: 'profile' as const, label: 'Профиль', icon: User },
  { id: 'security' as const, label: 'Безопасность', icon: Shield },
  { id: 'notifications' as const, label: 'Уведомления', icon: Bell },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <div className="flex flex-col">
      <Header title="Настройки" />
      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <Card className="h-fit">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      activeTab === id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSettings() {
  const user = useAuthStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || 'trader_001',
    email: 'trader@example.com',
    telegram: '@trader_001',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль</CardTitle>
        <CardDescription>Управление личными данными</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{formData.username}</h3>
            <p className="text-sm text-muted-foreground">Трейдер</p>
            <Badge variant="outline" className="mt-1 text-xs bg-green-500/10 text-green-500 border-green-500/20">
              Верифицирован
            </Badge>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Логин</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Telegram</label>
            <Input
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Сохранить
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [telegramLinked, setTelegramLinked] = useState(false)
  const [telegramCode, setTelegramCode] = useState('')
  const [isLinkingTelegram, setIsLinkingTelegram] = useState(false)

  const handleLinkTelegram = async () => {
    if (!telegramCode) return
    setIsLinkingTelegram(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTelegramLinked(true)
    setIsLinkingTelegram(false)
    setTelegramCode('')
  }

  const handleUnlinkTelegram = async () => {
    setTelegramLinked(false)
  }

  return (
    <>
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Смена пароля
          </CardTitle>
          <CardDescription>Регулярно обновляйте пароль для безопасности</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Текущий пароль</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Введите текущий пароль"
              />
              <button
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Новый пароль</label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Введите новый пароль"
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Подтвердите пароль</label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Повторите новый пароль"
            />
          </div>

          <Button disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm}>
            Изменить пароль
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Auth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Двухфакторная аутентификация
          </CardTitle>
          <CardDescription>Дополнительный уровень защиты аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                twoFactorEnabled ? "bg-green-500/10" : "bg-muted"
              )}>
                <Shield className={cn(
                  "h-5 w-5",
                  twoFactorEnabled ? "text-green-500" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className="font-medium">Google Authenticator</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? 'Включено' : 'Отключено'}
                </p>
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? "outline" : "default"}
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            >
              {twoFactorEnabled ? 'Отключить' : 'Включить'}
            </Button>
          </div>

          {!twoFactorEnabled && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
              <div>
                <p className="font-medium text-yellow-500">Рекомендуем включить 2FA</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Двухфакторная аутентификация значительно повышает безопасность вашего аккаунта
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Telegram Bot Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Telegram бот
          </CardTitle>
          <CardDescription>
            Подключите Telegram для мгновенных уведомлений и быстрого доступа
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {telegramLinked ? (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Telegram подключён</p>
                    <p className="text-sm text-muted-foreground">@trader_001</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleUnlinkTelegram}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Отключить
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Вы будете получать уведомления о транзакциях, спорах и важных событиях в Telegram.
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                    Откройте бота в Telegram
                  </div>
                  <a
                    href="https://t.me/AdvancePayBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    @AdvancePayBot
                    <Link2 className="h-3 w-3 ml-1" />
                  </a>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                    Отправьте команду /start и получите код
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Бот выдаст вам уникальный код для привязки аккаунта
                  </p>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                    Введите код подтверждения
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Введите код из бота"
                      value={telegramCode}
                      onChange={(e) => setTelegramCode(e.target.value)}
                      className="font-mono"
                    />
                    <Button
                      onClick={handleLinkTelegram}
                      disabled={!telegramCode || isLinkingTelegram}
                    >
                      {isLinkingTelegram ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Привязать
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Активные сессии</CardTitle>
          <CardDescription>Устройства, с которых выполнен вход</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Windows · Chrome</p>
                <p className="text-xs text-muted-foreground">Москва, Россия · Текущая сессия</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
              Сейчас
            </Badge>
          </div>

          <Button variant="outline" className="w-full">
            Завершить все другие сессии
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailTransactions: true,
    emailDisputes: true,
    emailNews: false,
    telegramTransactions: true,
    telegramDisputes: true,
    telegramBalance: true,
    pushEnabled: false,
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email уведомления
          </CardTitle>
          <CardDescription>Настройте уведомления на почту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Транзакции"
            description="Уведомления о новых платежах и выводах"
            enabled={notifications.emailTransactions}
            onToggle={() => toggleNotification('emailTransactions')}
          />
          <NotificationToggle
            label="Споры"
            description="Уведомления об открытии и изменении споров"
            enabled={notifications.emailDisputes}
            onToggle={() => toggleNotification('emailDisputes')}
          />
          <NotificationToggle
            label="Новости и обновления"
            description="Информация о новых функциях платформы"
            enabled={notifications.emailNews}
            onToggle={() => toggleNotification('emailNews')}
          />
        </CardContent>
      </Card>

      {/* Telegram Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Telegram уведомления
          </CardTitle>
          <CardDescription>Мгновенные уведомления в Telegram</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Транзакции"
            description="Уведомления о новых платежах"
            enabled={notifications.telegramTransactions}
            onToggle={() => toggleNotification('telegramTransactions')}
          />
          <NotificationToggle
            label="Споры"
            description="Срочные уведомления о спорах"
            enabled={notifications.telegramDisputes}
            onToggle={() => toggleNotification('telegramDisputes')}
          />
          <NotificationToggle
            label="Баланс"
            description="Уведомления о пополнении и выводе"
            enabled={notifications.telegramBalance}
            onToggle={() => toggleNotification('telegramBalance')}
          />
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push-уведомления
          </CardTitle>
          <CardDescription>Уведомления в браузере</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationToggle
            label="Включить push-уведомления"
            description="Получайте уведомления даже когда сайт закрыт"
            enabled={notifications.pushEnabled}
            onToggle={() => toggleNotification('pushEnabled')}
          />
        </CardContent>
      </Card>
    </>
  )
}

function NotificationToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
            enabled && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}
