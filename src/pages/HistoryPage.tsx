import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  CreditCard,
  Building2,
  X,
  ChevronDown,
} from 'lucide-react'
import { formatNumber, cn } from '@/lib/utils'
import {
  mockTransactions,
  paymentMethodNames,
  type Transaction,
  type PaymentMethod
} from '@/data/mockData'

type TransactionStatus = Transaction['status']
type TransactionType = Transaction['type']

const statusConfig: Record<TransactionStatus, { label: string; className: string }> = {
  pending: { label: 'Ожидание', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  processing: { label: 'Обработка', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  completed: { label: 'Выполнено', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  failed: { label: 'Ошибка', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  disputed: { label: 'Спор', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  cancelled: { label: 'Отменено', className: 'bg-muted text-muted-foreground border-muted' },
}

const typeConfig: Record<TransactionType, { label: string; icon: typeof ArrowDownToLine; className: string }> = {
  payin: { label: 'Pay-in', icon: ArrowDownToLine, className: 'text-green-500 bg-green-500/10' },
  payout: { label: 'Pay-out', icon: ArrowUpFromLine, className: 'text-orange-500 bg-orange-500/10' },
}

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((tx) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesOrder = tx.orderId.toLowerCase().includes(query)
        const matchesBank = tx.bankName?.toLowerCase().includes(query)
        const matchesCard = tx.cardLast4?.includes(query)
        if (!matchesOrder && !matchesBank && !matchesCard) return false
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false

      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false

      // Method filter
      if (methodFilter !== 'all' && tx.method !== methodFilter) return false

      return true
    })
  }, [searchQuery, typeFilter, statusFilter, methodFilter])

  const stats = useMemo(() => {
    const completed = mockTransactions.filter(tx => tx.status === 'completed')
    const totalPayin = completed.filter(tx => tx.type === 'payin').reduce((sum, tx) => sum + tx.amount, 0)
    const totalPayout = completed.filter(tx => tx.type === 'payout').reduce((sum, tx) => sum + tx.amount, 0)
    const pending = mockTransactions.filter(tx => tx.status === 'pending' || tx.status === 'processing').length
    const disputed = mockTransactions.filter(tx => tx.status === 'disputed').length

    return { totalPayin, totalPayout, pending, disputed }
  }, [])

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setStatusFilter('all')
    setMethodFilter('all')
  }

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || methodFilter !== 'all'

  return (
    <div className="flex flex-col">
      <Header title="История" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <ArrowDownToLine className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pay-in (завершено)</p>
                  <p className="text-xl font-bold">{formatNumber(stats.totalPayin)} RUB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <ArrowUpFromLine className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pay-out (завершено)</p>
                  <p className="text-xl font-bold">{formatNumber(stats.totalPayout)} RUB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">В обработке</p>
                  <p className="text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <Filter className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Споры</p>
                  <p className="text-xl font-bold">{stats.disputed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по номеру, банку, карте..."
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
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-4 border-t mt-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Тип</label>
                  <div className="flex gap-1">
                    <FilterButton
                      active={typeFilter === 'all'}
                      onClick={() => setTypeFilter('all')}
                    >
                      Все
                    </FilterButton>
                    <FilterButton
                      active={typeFilter === 'payin'}
                      onClick={() => setTypeFilter('payin')}
                    >
                      Pay-in
                    </FilterButton>
                    <FilterButton
                      active={typeFilter === 'payout'}
                      onClick={() => setTypeFilter('payout')}
                    >
                      Pay-out
                    </FilterButton>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Статус</label>
                  <div className="flex flex-wrap gap-1">
                    <FilterButton
                      active={statusFilter === 'all'}
                      onClick={() => setStatusFilter('all')}
                    >
                      Все
                    </FilterButton>
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <FilterButton
                        key={key}
                        active={statusFilter === key}
                        onClick={() => setStatusFilter(key as TransactionStatus)}
                      >
                        {label}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Метод</label>
                  <div className="flex flex-wrap gap-1">
                    <FilterButton
                      active={methodFilter === 'all'}
                      onClick={() => setMethodFilter('all')}
                    >
                      Все
                    </FilterButton>
                    {Object.entries(paymentMethodNames).map(([key, label]) => (
                      <FilterButton
                        key={key}
                        active={methodFilter === key}
                        onClick={() => setMethodFilter(key as PaymentMethod)}
                      >
                        {label}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Найдено: {filteredTransactions.length} транзакций
            </div>

            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Транзакции не найдены</p>
                  <p className="text-sm">Попробуйте изменить фильтры</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80"
      )}
    >
      {children}
    </button>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { label: typeLabel, icon: TypeIcon, className: typeClassName } = typeConfig[transaction.type]
  const { label: statusLabel, className: statusClassName } = statusConfig[transaction.status]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      {/* Type Icon */}
      <div className={cn("p-2 rounded-full shrink-0", typeClassName)}>
        <TypeIcon className="h-4 w-4" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{transaction.orderId}</span>
          <Badge variant="outline" className="text-xs">
            {typeLabel}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", statusClassName)}>
            {statusLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(transaction.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {paymentMethodNames[transaction.method]}
            {transaction.cardLast4 && ` •${transaction.cardLast4}`}
          </span>
          {transaction.bankName && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {transaction.bankName}
            </span>
          )}
        </div>
        {transaction.direction && (
          <div className="text-xs text-muted-foreground mt-1">
            Направление: {transaction.direction}
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <div className={cn("font-bold", transaction.type === 'payin' ? 'text-green-500' : 'text-orange-500')}>
          {transaction.type === 'payin' ? '+' : '-'}{formatNumber(transaction.amount)} RUB
        </div>
        <div className="text-sm text-muted-foreground">
          ≈ {transaction.amountUsdt.toFixed(2)} USDT
        </div>
      </div>
    </div>
  )
}
