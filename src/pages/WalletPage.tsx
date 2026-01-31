import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Wallet,
  Shield,
  Clock,
  TrendingUp,
  Copy,
  Check,
  ArrowDownToLine,
  ArrowUpFromLine,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { formatCurrency, formatAmount, cn } from '@/lib/utils'
import {
  mockBalance,
  mockDepositAddress,
  mockWalletTransactions,
  type WalletTransaction
} from '@/data/mockData'

export function WalletPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [copied, setCopied] = useState(false)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(mockDepositAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsWithdrawing(true)
    // Имитация запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsWithdrawing(false)
    setWithdrawAddress('')
    setWithdrawAmount('')
    // В реальности тут был бы API запрос
  }

  const maxWithdraw = mockBalance.available

  return (
    <div className="flex flex-col">
      <Header title="Кошелёк" />
      <div className="flex-1 space-y-6 p-6">
        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доступный баланс</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(mockBalance.available)}</div>
              <p className="text-xs text-muted-foreground">Доступно для вывода</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Страховой депозит</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {formatAmount(mockBalance.securityDepositTrader)}/{formatAmount(mockBalance.securityDepositLk)} USDT
              </div>
              <p className="text-xs text-muted-foreground">
                {mockBalance.securityDepositTrader >= mockBalance.securityDepositLk
                  ? 'Депозит закрыт'
                  : 'Требуется пополнение'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В обработке</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockBalance.pending)}</div>
              <p className="text-xs text-muted-foreground">Ожидает подтверждения</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего обработано</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(mockBalance.totalProcessed)}</div>
              <p className="text-xs text-muted-foreground">За всё время</p>
            </CardContent>
          </Card>
        </div>

        {/* Deposit / Withdraw Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'deposit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('deposit')}
                  className="gap-2"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Пополнить
                </Button>
                <Button
                  variant={activeTab === 'withdraw' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('withdraw')}
                  className="gap-2"
                >
                  <ArrowUpFromLine className="h-4 w-4" />
                  Вывести
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'deposit' ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Отправляйте только USDT (TRC20)
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Минимальная сумма пополнения: 10 USDT
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Адрес для пополнения (USDT TRC20)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={mockDepositAddress}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyAddress}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <div className="w-40 h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      QR Code
                    </div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Средства зачисляются автоматически после 20 подтверждений сети
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Доступно для вывода:</span>
                      <span className="font-medium">{formatCurrency(maxWithdraw)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Адрес получателя (USDT TRC20)
                    </label>
                    <Input
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder="T..."
                      className="font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Сумма вывода
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        min="10"
                        max={maxWithdraw}
                        step="0.01"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setWithdrawAmount(maxWithdraw.toString())}
                        className="shrink-0"
                      >
                        MAX
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Минимум: 10 USDT · Комиссия сети: 1 USDT
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isWithdrawing || !withdrawAddress || !withdrawAmount}
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      'Вывести средства'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>История операций</CardTitle>
              <CardDescription>Последние транзакции кошелька</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockWalletTransactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: WalletTransaction }) {
  const isDeposit = transaction.type === 'deposit'

  const statusColors: Record<WalletTransaction['status'], string> = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-muted text-muted-foreground border-muted',
  }

  const statusLabels: Record<WalletTransaction['status'], string> = {
    pending: 'Ожидание',
    completed: 'Выполнено',
    failed: 'Ошибка',
    cancelled: 'Отменено',
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full",
          isDeposit ? "bg-green-500/10" : "bg-orange-500/10"
        )}>
          {isDeposit ? (
            <ArrowDownToLine className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4 text-orange-500" />
          )}
        </div>
        <div>
          <div className="font-medium text-sm">
            {isDeposit ? 'Пополнение' : 'Вывод'}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(transaction.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={cn(
            "font-medium",
            isDeposit ? "text-green-500" : "text-orange-500"
          )}>
            {isDeposit ? '+' : '-'}{formatAmount(transaction.amount)} USDT
          </div>
          <Badge variant="outline" className={cn("text-xs", statusColors[transaction.status])}>
            {statusLabels[transaction.status]}
          </Badge>
        </div>
        {transaction.txHash && (
          <a
            href={`https://tronscan.org/#/transaction/${transaction.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        )}
      </div>
    </div>
  )
}
