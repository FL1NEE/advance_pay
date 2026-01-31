import { Wallet, Shield, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatAmount } from '@/lib/utils'

interface BalanceCardProps {
  available: number
  securityDepositTrader: number
  securityDepositLk: number
  pending: number
  totalProcessed: number
}

export function BalanceCard({ available, securityDepositTrader, securityDepositLk, pending, totalProcessed }: BalanceCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Доступный баланс</CardTitle>
          <Wallet className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(available)}</div>
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
            {formatAmount(securityDepositTrader)}/{formatAmount(securityDepositLk)} USDT
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">В обработке</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pending)}</div>
          <p className="text-xs text-muted-foreground">Ожидает подтверждения</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего обработано</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalProcessed)}</div>
          <p className="text-xs text-muted-foreground">За всё время</p>
        </CardContent>
      </Card>
    </div>
  )
}
