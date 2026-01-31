import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  CreditCard,
  Building2,
  Smartphone,
  Plus,
  MoreVertical,
  Power,
  Trash2,
  Edit,
  TrendingUp,
  Clock,
  AlertCircle,
  X,
  Check,
} from 'lucide-react'
import { formatNumber, cn } from '@/lib/utils'
import { mockRequisites, paymentMethodNames, type Requisite } from '@/data/mockData'

const typeConfig = {
  card: { label: 'Карта', icon: CreditCard },
  account: { label: 'Счёт', icon: Building2 },
  sbp: { label: 'СБП', icon: Smartphone },
}

const bankOptions = [
  { value: 'Сбербанк', label: 'Сбербанк' },
  { value: 'Тинькофф', label: 'Тинькофф' },
  { value: 'Альфа-Банк', label: 'Альфа-Банк' },
  { value: 'ВТБ', label: 'ВТБ' },
  { value: 'Газпромбанк', label: 'Газпромбанк' },
  { value: 'Райффайзен', label: 'Райффайзен Банк' },
  { value: 'Россельхозбанк', label: 'Россельхозбанк' },
  { value: 'Открытие', label: 'Банк Открытие' },
  { value: 'Совкомбанк', label: 'Совкомбанк' },
  { value: 'Промсвязьбанк', label: 'Промсвязьбанк' },
  { value: 'Почта Банк', label: 'Почта Банк' },
  { value: 'Росбанк', label: 'Росбанк' },
  { value: 'МКБ', label: 'Московский Кредитный Банк' },
  { value: 'Юникредит', label: 'ЮниКредит Банк' },
  { value: 'Ситибанк', label: 'Ситибанк' },
  { value: 'Хоум Кредит', label: 'Хоум Кредит Банк' },
  { value: 'Ренессанс', label: 'Ренессанс Кредит' },
  { value: 'РНКБ', label: 'РНКБ Банк' },
  { value: 'Уралсиб', label: 'Уралсиб' },
  { value: 'Ак Барс', label: 'Ак Барс Банк' },
]

export function RequisitesPage() {
  const [requisites, setRequisites] = useState(mockRequisites)
  const [showAddModal, setShowAddModal] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [editingRequisite, setEditingRequisite] = useState<Requisite | null>(null)

  const toggleActive = (id: string) => {
    setRequisites(prev =>
      prev.map(req =>
        req.id === id ? { ...req, isActive: !req.isActive } : req
      )
    )
  }

  const handleEditRequisite = (requisite: Requisite) => {
    setEditingRequisite(requisite)
    setMenuOpenId(null)
  }

  const handleSaveRequisite = (updatedRequisite: Requisite) => {
    setRequisites(prev =>
      prev.map(req =>
        req.id === updatedRequisite.id ? updatedRequisite : req
      )
    )
    setEditingRequisite(null)
  }

  const handleDeleteRequisite = (id: string) => {
    setRequisites(prev => prev.filter(req => req.id !== id))
    setMenuOpenId(null)
  }

  const activeCount = requisites.filter(r => r.isActive).length
  const totalLimit = requisites.filter(r => r.isActive).reduce((sum, r) => sum + r.dailyLimit, 0)
  const totalUsed = requisites.filter(r => r.isActive).reduce((sum, r) => sum + r.dailyUsed, 0)

  return (
    <div className="flex flex-col">
      <Header title="Реквизиты" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего реквизитов</p>
                  <p className="text-xl font-bold">{requisites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Power className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Активных</p>
                  <p className="text-xl font-bold text-green-500">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дневной лимит</p>
                  <p className="text-xl font-bold">{formatNumber(totalLimit)} ₽</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Использовано сегодня</p>
                  <p className="text-xl font-bold">{formatNumber(totalUsed)} ₽</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Мои реквизиты</h2>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить реквизит
          </Button>
        </div>

        {/* Requisites Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {requisites.map((requisite) => (
            <RequisiteCard
              key={requisite.id}
              requisite={requisite}
              onToggleActive={() => toggleActive(requisite.id)}
              menuOpen={menuOpenId === requisite.id}
              onMenuToggle={() => setMenuOpenId(menuOpenId === requisite.id ? null : requisite.id)}
              onMenuClose={() => setMenuOpenId(null)}
              onEdit={() => handleEditRequisite(requisite)}
              onDelete={() => handleDeleteRequisite(requisite.id)}
            />
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <AddRequisiteModal onClose={() => setShowAddModal(false)} />
        )}

        {/* Edit Modal */}
        {editingRequisite && (
          <EditRequisiteModal
            requisite={editingRequisite}
            onClose={() => setEditingRequisite(null)}
            onSave={handleSaveRequisite}
          />
        )}
      </div>
    </div>
  )
}

function RequisiteCard({
  requisite,
  onToggleActive,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onDelete,
}: {
  requisite: Requisite
  onToggleActive: () => void
  menuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { icon: TypeIcon } = typeConfig[requisite.type]
  const dailyPercent = (requisite.dailyUsed / requisite.dailyLimit) * 100
  const monthlyPercent = (requisite.monthlyUsed / requisite.monthlyLimit) * 100

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className={cn(!requisite.isActive && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              requisite.isActive ? "bg-primary/10" : "bg-muted"
            )}>
              <TypeIcon className={cn("h-5 w-5", requisite.isActive ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {requisite.bankName}
                <Badge variant={requisite.isActive ? "success" : "destructive"} className="text-xs">
                  {requisite.isActive ? 'Активен' : 'Неактивен'}
                </Badge>
              </CardTitle>
              <CardDescription className="font-mono">
                {requisite.cardNumber || requisite.accountNumber || requisite.phone}
              </CardDescription>
            </div>
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMenuToggle}>
              <MoreVertical className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={onMenuClose} />
                <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-md z-20">
                  <button
                    onClick={() => { onToggleActive(); onMenuClose(); }}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <Power className="h-4 w-4" />
                    {requisite.isActive ? 'Деактивировать' : 'Активировать'}
                  </button>
                  <button
                    onClick={onEdit}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Methods */}
        <div className="flex flex-wrap gap-1">
          {requisite.methods.map((method) => (
            <Badge key={method} variant="outline" className="text-xs">
              {paymentMethodNames[method]}
            </Badge>
          ))}
        </div>

        {/* Limits */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Дневной лимит</span>
              <span>{formatNumber(requisite.dailyUsed)} / {formatNumber(requisite.dailyLimit)} ₽</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  dailyPercent > 90 ? "bg-red-500" : dailyPercent > 70 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(dailyPercent, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Месячный лимит</span>
              <span>{formatNumber(requisite.monthlyUsed)} / {formatNumber(requisite.monthlyLimit)} ₽</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  monthlyPercent > 90 ? "bg-red-500" : monthlyPercent > 70 ? "bg-yellow-500" : "bg-primary"
                )}
                style={{ width: `${Math.min(monthlyPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm pt-2 border-t">
          <div>
            <span className="text-muted-foreground">Всего: </span>
            <span className="font-medium">{formatNumber(requisite.totalProcessed)} ₽</span>
          </div>
          <div>
            <span className="text-muted-foreground">Транзакций: </span>
            <span className="font-medium">{requisite.transactionsCount}</span>
          </div>
        </div>

        {requisite.lastUsedAt && (
          <div className="text-xs text-muted-foreground">
            Последнее использование: {formatDate(requisite.lastUsedAt)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddRequisiteModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [type, setType] = useState<Requisite['type'] | null>(null)
  const [formData, setFormData] = useState({
    bankName: '',
    cardNumber: '',
    accountNumber: '',
    phone: '',
    holderName: '',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-md mx-4 z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Добавить реквизит</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {step === 1 ? 'Выберите тип реквизита' : 'Заполните данные'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="grid gap-3">
              {Object.entries(typeConfig).map(([key, { label, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => { setType(key as Requisite['type']); setStep(2); }}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors text-left"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'card' && 'Банковская карта для приёма платежей'}
                      {key === 'account' && 'Расчётный счёт для переводов'}
                      {key === 'sbp' && 'Приём через Систему Быстрых Платежей'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Реквизиты должны быть оформлены на ваше имя
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Банк</label>
                <Select
                  options={bankOptions}
                  value={formData.bankName}
                  onChange={(value) => setFormData({ ...formData, bankName: value })}
                  placeholder="Выберите банк"
                />
              </div>

              {type === 'card' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Номер карты</label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  />
                </div>
              )}

              {type === 'account' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Номер счёта</label>
                  <Input
                    placeholder="40702..."
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>
              )}

              {type === 'sbp' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Номер телефона</label>
                  <Input
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Имя держателя</label>
                <Input
                  placeholder="IVAN IVANOV"
                  value={formData.holderName}
                  onChange={(e) => setFormData({ ...formData, holderName: e.target.value.toUpperCase() })}
                  className="uppercase"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Назад
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  <Check className="h-4 w-4" />
                  Добавить
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EditRequisiteModal({
  requisite,
  onClose,
  onSave,
}: {
  requisite: Requisite
  onClose: () => void
  onSave: (requisite: Requisite) => void
}) {
  const [formData, setFormData] = useState({
    bankName: requisite.bankName,
    cardNumber: requisite.cardNumber || '',
    accountNumber: requisite.accountNumber || '',
    phone: requisite.phone || '',
    holderName: requisite.holderName,
    dailyLimit: requisite.dailyLimit,
    monthlyLimit: requisite.monthlyLimit,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    onSave({
      ...requisite,
      bankName: formData.bankName,
      cardNumber: requisite.type === 'card' ? formData.cardNumber : requisite.cardNumber,
      accountNumber: requisite.type === 'account' ? formData.accountNumber : requisite.accountNumber,
      phone: requisite.type === 'sbp' ? formData.phone : requisite.phone,
      holderName: formData.holderName,
      dailyLimit: formData.dailyLimit,
      monthlyLimit: formData.monthlyLimit,
    })
    setIsSaving(false)
  }

  const { icon: TypeIcon, label: typeLabel } = typeConfig[requisite.type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-md mx-4 z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Редактировать реквизит</CardTitle>
                <CardDescription>{typeLabel} · {requisite.bankName}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Банк</label>
              <Select
                options={bankOptions}
                value={formData.bankName}
                onChange={(value) => setFormData({ ...formData, bankName: value })}
                placeholder="Выберите банк"
              />
            </div>

            {requisite.type === 'card' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер карты</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                />
              </div>
            )}

            {requisite.type === 'account' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер счёта</label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>
            )}

            {requisite.type === 'sbp' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер телефона</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Имя держателя</label>
              <Input
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value.toUpperCase() })}
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Дневной лимит (₽)</label>
                <Input
                  type="number"
                  value={formData.dailyLimit}
                  onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Месячный лимит (₽)</label>
                <Input
                  type="number"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Сохранение...
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Сохранить
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
