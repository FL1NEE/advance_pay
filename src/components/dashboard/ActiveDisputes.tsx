import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { type Dispute } from '@/data/mockData'

interface ActiveDisputesProps {
  disputes: Dispute[]
}

const statusConfig = {
  open: { label: 'Открыт', variant: 'destructive' as const },
  pending: { label: 'На рассмотрении', variant: 'outline' as const },
  resolved: { label: 'Решён', variant: 'secondary' as const },
  won: { label: 'Выигран', variant: 'default' as const },
  lost: { label: 'Проигран', variant: 'secondary' as const },
}

export function ActiveDisputes({ disputes }: ActiveDisputesProps) {
  if (disputes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Активные споры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <AlertTriangle className="h-6 w-6 text-green-500" />
            </div>
            <p className="mt-3 text-sm font-medium">Нет активных споров</p>
            <p className="text-xs text-muted-foreground">Все сделки проходят успешно</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Активные споры
          <Badge variant="destructive" className="ml-auto">
            {disputes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dispute.orderId}</span>
                  <Badge variant={statusConfig[dispute.status].variant}>
                    {statusConfig[dispute.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(dispute.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-destructive">
                  {formatCurrency(dispute.amount)}
                </p>
                <Button variant="ghost" size="sm" className="mt-1">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Детали
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
