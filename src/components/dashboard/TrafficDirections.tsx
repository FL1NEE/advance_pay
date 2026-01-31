import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatPercent } from '@/lib/utils'
import { type TrafficDirection } from '@/data/mockData'

interface TrafficDirectionsProps {
  directions: TrafficDirection[]
}

const categoryConfig = {
  gambling: { label: 'Gambling', color: 'bg-violet-500' },
  exchange: { label: 'Exchange', color: 'bg-blue-500' },
  mobile: { label: 'Mobile', color: 'bg-green-500' },
}

export function TrafficDirections({ directions }: TrafficDirectionsProps) {
  const groupedDirections = directions.reduce((acc, dir) => {
    if (!acc[dir.category]) {
      acc[dir.category] = []
    }
    acc[dir.category].push(dir)
    return acc
  }, {} as Record<string, TrafficDirection[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Направления трафика
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedDirections).map(([category, dirs]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', categoryConfig[category as keyof typeof categoryConfig].color)} />
                <span className="text-sm font-medium">
                  {categoryConfig[category as keyof typeof categoryConfig].label}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {dirs.map((dir) => (
                  <div
                    key={dir.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{dir.name}</p>
                      <p className="text-xs text-muted-foreground">{dir.exchange}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {formatPercent(dir.percentage)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
