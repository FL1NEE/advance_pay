import { RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type ExchangeRate } from '@/data/mockData'

interface ExchangeRatesProps {
  rates: ExchangeRate[]
  onRefresh?: () => void
}

export function ExchangeRates({ rates, onRefresh }: ExchangeRatesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Курсы площадок</CardTitle>
        {onRefresh && (
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {rates.map((rate) => (
            <div
              key={rate.name}
              className="rounded-lg border bg-muted/50 p-3 text-center"
            >
              <p className="text-xs text-muted-foreground">{rate.name}</p>
              <p className="mt-1 text-lg font-semibold">{rate.rate.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
