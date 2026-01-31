import { Header } from '@/components/layout/Header'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { ExchangeRates } from '@/components/dashboard/ExchangeRates'
import { ActiveDisputes } from '@/components/dashboard/ActiveDisputes'
import { TrafficDirections } from '@/components/dashboard/TrafficDirections'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import {
  mockBalance,
  mockExchangeRates,
  mockDisputes,
  mockTrafficDirections,
} from '@/data/mockData'

export function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Главная" />
      <div className="flex-1 space-y-6 p-6">
        {/* Balance Cards */}
        <BalanceCard
          available={mockBalance.available}
          securityDepositTrader={mockBalance.securityDepositTrader}
          securityDepositLk={mockBalance.securityDepositLk}
          pending={mockBalance.pending}
          totalProcessed={mockBalance.totalProcessed}
        />

        {/* Exchange Rates */}
        <ExchangeRates rates={mockExchangeRates} />

        {/* Two columns layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Disputes */}
          <ActiveDisputes disputes={mockDisputes} />

          {/* Traffic Directions */}
          <TrafficDirections directions={mockTrafficDirections} />
        </div>

        {/* Traffic Chart */}
        <TrafficChart />
      </div>
    </div>
  )
}
