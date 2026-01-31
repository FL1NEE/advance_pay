import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronDown,
  X,
  Send,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  Timer,
} from 'lucide-react'
import { formatNumber, cn } from '@/lib/utils'
import {
  mockDisputes,
  disputeReasons,
  paymentMethodNames,
  type Dispute,
} from '@/data/mockData'

type DisputeStatus = Dispute['status']

const statusConfig: Record<DisputeStatus, { label: string; icon: typeof Clock; className: string }> = {
  open: { label: 'Открыт', icon: AlertTriangle, className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  pending: { label: 'На рассмотрении', icon: Clock, className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  resolved: { label: 'Решён', icon: CheckCircle2, className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  won: { label: 'Выигран', icon: CheckCircle2, className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  lost: { label: 'Проигран', icon: XCircle, className: 'bg-muted text-muted-foreground border-muted' },
}

export function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)

  const filteredDisputes = useMemo(() => {
    return mockDisputes.filter((d) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!d.orderId.toLowerCase().includes(query)) return false
      }
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      return true
    })
  }, [searchQuery, statusFilter])

  const stats = useMemo(() => {
    const open = mockDisputes.filter(d => d.status === 'open').length
    const pending = mockDisputes.filter(d => d.status === 'pending').length
    const won = mockDisputes.filter(d => d.status === 'won').length
    const lost = mockDisputes.filter(d => d.status === 'lost').length
    const total = mockDisputes.length
    const winRate = total > 0 ? Math.round((won / (won + lost)) * 100) || 0 : 0

    return { open, pending, won, lost, total, winRate }
  }, [])

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all'

  return (
    <div className="flex flex-col">
      <Header title="Споры" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Открытых</p>
                  <p className="text-xl font-bold text-red-500">{stats.open}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">На рассмотрении</p>
                  <p className="text-xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Выиграно</p>
                  <p className="text-xl font-bold text-green-500">{stats.won}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Проиграно</p>
                  <p className="text-xl font-bold">{stats.lost}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold">{stats.winRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Disputes List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по номеру заказа..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Фильтры
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Сбросить
                    </Button>
                  )}
                </div>

                {showFilters && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    <FilterButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                      Все
                    </FilterButton>
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <FilterButton
                        key={key}
                        active={statusFilter === key}
                        onClick={() => setStatusFilter(key as DisputeStatus)}
                      >
                        {label}
                      </FilterButton>
                    ))}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {filteredDisputes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Споры не найдены</p>
                  </div>
                ) : (
                  filteredDisputes.map((dispute) => (
                    <DisputeRow
                      key={dispute.id}
                      dispute={dispute}
                      isSelected={selectedDispute?.id === dispute.id}
                      onClick={() => setSelectedDispute(dispute)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dispute Details */}
          <Card className="lg:col-span-1">
            {selectedDispute ? (
              <DisputeDetails dispute={selectedDispute} />
            ) : (
              <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Выберите спор для просмотра деталей</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs rounded-md transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
      )}
    >
      {children}
    </button>
  )
}

function DisputeRow({
  dispute,
  isSelected,
  onClick,
}: {
  dispute: Dispute
  isSelected: boolean
  onClick: () => void
}) {
  const { label, icon: StatusIcon, className } = statusConfig[dispute.status]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-colors",
        isSelected ? "bg-primary/5 border-primary" : "bg-card hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-medium">{dispute.orderId}</span>
          <Badge variant="outline" className={cn("ml-2 text-xs", className)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {label}
          </Badge>
        </div>
        <span className="font-bold">{formatNumber(dispute.amount)} ₽</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
        {disputeReasons[dispute.reason]}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {formatDate(dispute.createdAt)}
      </div>
    </button>
  )
}

function DisputeDetails({ dispute }: { dispute: Dispute }) {
  const [response, setResponse] = useState(dispute.traderResponse || '')
  const { label, icon: StatusIcon, className } = statusConfig[dispute.status]
  const canRespond = dispute.status === 'open' || dispute.status === 'pending'

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {dispute.orderId}
              <Badge variant="outline" className={cn("text-xs", className)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {label}
              </Badge>
            </CardTitle>
            <CardDescription>{disputeReasons[dispute.reason]}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatNumber(dispute.amount)} ₽</div>
            <div className="text-sm text-muted-foreground">≈ {dispute.amountUsdt.toFixed(2)} USDT</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer for open disputes */}
        {dispute.status === 'open' && dispute.deadlineAt && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 text-red-500">
              <Timer className="h-5 w-5" />
              <span className="font-medium">Требуется ответ</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ответьте на спор до {formatDate(dispute.deadlineAt)}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Детали транзакции</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Метод:</span>
              <span>{paymentMethodNames[dispute.method]}</span>
            </div>
            {dispute.bankName && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Банк:</span>
                <span>{dispute.bankName}</span>
              </div>
            )}
            {dispute.cardLast4 && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Карта:</span>
                <span>•••• {dispute.cardLast4}</span>
              </div>
            )}
            {dispute.direction && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Направление:</span>
                <span>{dispute.direction}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Создан:</span>
              <span>{formatDate(dispute.createdAt)}</span>
            </div>
            {dispute.resolvedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Решён:</span>
                <span>{formatDate(dispute.resolvedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Сообщения</h4>

          {/* Client message */}
          {dispute.clientMessage && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium">К</span>
                </div>
                <span className="text-sm font-medium">Клиент</span>
              </div>
              <p className="text-sm">{dispute.clientMessage}</p>
            </div>
          )}

          {/* Trader response */}
          {dispute.traderResponse && (
            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">Т</span>
                </div>
                <span className="text-sm font-medium">Вы</span>
              </div>
              <p className="text-sm">{dispute.traderResponse}</p>
            </div>
          )}
        </div>

        {/* Response form */}
        {canRespond && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Ваш ответ</h4>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Опишите ситуацию, приложите доказательства..."
              className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Отправить ответ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </>
  )
}
