import { useState, useMemo } from 'react'
import { BarChart3, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber } from '@/lib/utils'
import {
  generateTrafficRanges,
  paymentMethodNames,
  type TrafficRange,
  type PaymentMethod,
} from '@/data/mockData'

type FilterMode = 'standard' | 'extended'

const statusColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  'red-orange': 'bg-orange-600',
  red: 'bg-red-500',
  none: 'bg-muted',
}

const statusLabels = {
  green: 'Высокий',
  yellow: 'Средний',
  orange: 'Низкий',
  'red-orange': 'Очень низкий',
  red: 'Критический',
  none: 'Нет трафика',
}

export function TrafficChart() {
  const [filterMode, setFilterMode] = useState<FilterMode>('standard')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'all'>('all')

  const trafficRanges = useMemo(() => {
    return generateTrafficRanges(filterMode)
  }, [filterMode])

  const methods: (PaymentMethod | 'all')[] = ['all', 'sbp', 'card', 'account', 'qr']

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            График трафиков
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('standard')}
            >
              <Filter className="mr-1 h-3 w-3" />
              Стандартный
            </Button>
            <Button
              variant={filterMode === 'extended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('extended')}
            >
              <Filter className="mr-1 h-3 w-3" />
              Расширенный
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Payment Methods */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-muted-foreground">Метод оплаты:</p>
          <div className="flex flex-wrap gap-2">
            {methods.map((method) => (
              <Button
                key={method}
                variant={selectedMethod === method ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMethod(method)}
              >
                {method === 'all' ? 'Все методы' : paymentMethodNames[method]}
              </Button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-3 w-3 rounded',
                  statusColors[status as keyof typeof statusColors]
                )}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Traffic Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {trafficRanges.map((range, index) => (
            <TrafficRangeCard key={index} range={range} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TrafficRangeCard({ range }: { range: TrafficRange }) {
  return (
    <div
      className={cn(
        'relative rounded-lg border p-3 transition-all hover:scale-105',
        range.status === 'none' ? 'opacity-50' : ''
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-lg opacity-20',
          statusColors[range.status]
        )}
      />
      <div className="relative">
        <p className="text-xs font-medium">
          {formatNumber(range.min)} - {formatNumber(range.max)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(
              'text-xs',
              range.status !== 'none' && statusColors[range.status],
              range.status !== 'none' && 'text-white'
            )}
          >
            {range.count}
          </Badge>
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              statusColors[range.status]
            )}
          />
        </div>
      </div>
    </div>
  )
}
