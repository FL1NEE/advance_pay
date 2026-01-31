// Типы
export interface ExchangeRate {
  name: string
  rate: number
  source: 'rapira' | 'static'
}

export interface TrafficDirection {
  id: string
  name: string
  exchange: string
  percentage: number
  category: 'gambling' | 'exchange' | 'mobile'
}

export interface Dispute {
  id: string
  orderId: string
  amount: number
  amountUsdt: number
  status: 'open' | 'pending' | 'resolved' | 'won' | 'lost'
  createdAt: string
  deadlineAt?: string
  resolvedAt?: string
  description?: string
  reason: string
  clientMessage?: string
  traderResponse?: string
  method: PaymentMethod
  bankName?: string
  cardLast4?: string
  direction?: string
}

export interface TrafficRange {
  min: number
  max: number
  status: 'green' | 'yellow' | 'orange' | 'red-orange' | 'red' | 'none'
  count: number
}

export type PaymentMethod = 'sbp' | 'card' | 'account' | 'qr'

export interface WalletTransaction {
  id: string
  type: 'deposit' | 'withdraw'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  completedAt?: string
  txHash?: string
  address?: string
}

export interface Transaction {
  id: string
  orderId: string
  type: 'payin' | 'payout'
  amount: number
  amountUsdt: number
  method: PaymentMethod
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'disputed' | 'cancelled'
  createdAt: string
  completedAt?: string
  cardLast4?: string
  bankName?: string
  clientId?: string
  direction?: string
}

export interface Requisite {
  id: string
  type: 'card' | 'account' | 'sbp'
  bankName: string
  cardNumber?: string
  accountNumber?: string
  phone?: string
  holderName: string
  isActive: boolean
  dailyLimit: number
  dailyUsed: number
  monthlyLimit: number
  monthlyUsed: number
  totalProcessed: number
  transactionsCount: number
  createdAt: string
  lastUsedAt?: string
  methods: PaymentMethod[]
}

// Моки курсов
export const mockExchangeRates: ExchangeRate[] = [
  { name: 'Google', rate: 92.45, source: 'rapira' },
  { name: 'Rapira', rate: 92.45, source: 'rapira' },
  { name: 'ByBit', rate: 92.45, source: 'rapira' },
  { name: 'HTX', rate: 92.45, source: 'rapira' },
  { name: 'BT1', rate: 87.50, source: 'static' },
  { name: 'BT2', rate: 84.50, source: 'static' },
]

// Моки направлений трафика
export const mockTrafficDirections: TrafficDirection[] = [
  { id: '1', name: 'Gambling 1', exchange: 'Rapira', percentage: 8, category: 'gambling' },
  { id: '2', name: 'Gambling 2', exchange: 'ByBit', percentage: 7.5, category: 'gambling' },
  { id: '3', name: 'Gambling 3', exchange: 'HTX', percentage: 7, category: 'gambling' },
  { id: '4', name: 'Exchange 1', exchange: 'Rapira', percentage: 9, category: 'exchange' },
  { id: '5', name: 'Exchange 2', exchange: 'ByBit', percentage: 8.5, category: 'exchange' },
  { id: '6', name: 'Exchange 3', exchange: 'HTX', percentage: 8, category: 'exchange' },
  { id: '7', name: 'Mobile 1', exchange: 'Rapira', percentage: 15, category: 'mobile' },
  { id: '8', name: 'Mobile 2', exchange: 'ByBit', percentage: 13, category: 'mobile' },
  { id: '9', name: 'Mobile 3', exchange: 'HTX', percentage: 12.5, category: 'mobile' },
]

// Моки споров
export const mockDisputes: Dispute[] = [
  {
    id: 'd1',
    orderId: 'ORD-45618',
    amount: 3500,
    amountUsdt: 37.84,
    status: 'open',
    createdAt: '2025-01-13T11:30:00',
    deadlineAt: '2025-01-13T12:00:00',
    reason: 'payment_not_received',
    description: 'Клиент утверждает, что перевод не поступил на счёт',
    clientMessage: 'Я отправил деньги через СБП 30 минут назад, но статус заказа не изменился. Прикладываю чек.',
    method: 'sbp',
    bankName: 'ВТБ',
    direction: 'Gambling 2',
  },
  {
    id: 'd2',
    orderId: 'ORD-45590',
    amount: 15000,
    amountUsdt: 162.16,
    status: 'pending',
    createdAt: '2025-01-12T15:45:00',
    deadlineAt: '2025-01-12T16:15:00',
    reason: 'amount_mismatch',
    description: 'Расхождение суммы перевода',
    clientMessage: 'Отправил 15000, но система показывает 14500. Требую зачисление полной суммы.',
    traderResponse: 'Проверил чек клиента, поступило действительно 15000. Произошла ошибка в системе.',
    method: 'card',
    bankName: 'Сбербанк',
    cardLast4: '4532',
    direction: 'Exchange 1',
  },
  {
    id: 'd3',
    orderId: 'ORD-45501',
    amount: 8000,
    amountUsdt: 86.49,
    status: 'won',
    createdAt: '2025-01-10T09:20:00',
    resolvedAt: '2025-01-10T10:00:00',
    reason: 'duplicate_payment',
    description: 'Клиент заявляет о двойном списании',
    clientMessage: 'С моей карты списали деньги дважды за один заказ!',
    traderResponse: 'Предоставил выписку по счёту, второго списания не было. Клиент перепутал транзакции.',
    method: 'card',
    bankName: 'Тинькофф',
    cardLast4: '7891',
    direction: 'Gambling 1',
  },
  {
    id: 'd4',
    orderId: 'ORD-45445',
    amount: 25000,
    amountUsdt: 270.27,
    status: 'lost',
    createdAt: '2025-01-08T14:00:00',
    resolvedAt: '2025-01-08T15:30:00',
    reason: 'payment_not_received',
    description: 'Платёж не поступил',
    clientMessage: 'Перевод по СБП был отклонён банком, но деньги списались.',
    traderResponse: 'Не смог предоставить доказательства поступления средств.',
    method: 'sbp',
    bankName: 'Альфа-Банк',
    direction: 'Mobile 1',
  },
  {
    id: 'd5',
    orderId: 'ORD-45400',
    amount: 5500,
    amountUsdt: 59.46,
    status: 'resolved',
    createdAt: '2025-01-07T11:00:00',
    resolvedAt: '2025-01-07T11:45:00',
    reason: 'wrong_details',
    description: 'Клиент отправил на неверные реквизиты',
    clientMessage: 'Случайно отправил на старый номер карты.',
    traderResponse: 'Подтвердил поступление на старую карту, вернул средства клиенту.',
    method: 'card',
    bankName: 'Сбербанк',
    cardLast4: '1234',
    direction: 'Gambling 3',
  },
]

export const disputeReasons: Record<string, string> = {
  payment_not_received: 'Платёж не получен',
  amount_mismatch: 'Несоответствие суммы',
  duplicate_payment: 'Двойное списание',
  wrong_details: 'Неверные реквизиты',
  timeout: 'Истекло время',
  other: 'Другое',
}

// Функция генерации диапазонов трафика
export function generateTrafficRanges(mode: 'standard' | 'extended'): TrafficRange[] {
  const ranges: TrafficRange[] = []

  if (mode === 'standard') {
    const standardRanges = [
      { min: 100, max: 999 },
      { min: 1000, max: 2000 },
      { min: 2000, max: 3000 },
      { min: 3000, max: 4000 },
      { min: 4000, max: 5000 },
      { min: 5000, max: 6000 },
      { min: 6000, max: 7000 },
      { min: 7000, max: 8000 },
      { min: 8000, max: 9000 },
      { min: 9000, max: 10000 },
      { min: 10000, max: 15000 },
      { min: 15000, max: 20000 },
      { min: 20000, max: 30000 },
      { min: 30000, max: 50000 },
    ]

    standardRanges.forEach(({ min, max }) => {
      const count = Math.floor(Math.random() * 20)
      ranges.push({
        min,
        max,
        count,
        status: getTrafficStatus(count),
      })
    })
  } else {
    // Расширенный диапазон с шагом 500
    ranges.push({
      min: 100,
      max: 999,
      count: Math.floor(Math.random() * 25),
      status: getTrafficStatus(Math.floor(Math.random() * 25)),
    })

    for (let i = 1000; i <= 50000; i += 500) {
      const count = Math.floor(Math.random() * 15)
      ranges.push({
        min: i,
        max: i + 500,
        count,
        status: getTrafficStatus(count),
      })
    }
  }

  return ranges
}

function getTrafficStatus(count: number): TrafficRange['status'] {
  if (count === 0) return 'none'
  if (count >= 15) return 'green'
  if (count >= 10) return 'yellow'
  if (count >= 5) return 'orange'
  if (count >= 2) return 'red-orange'
  return 'red'
}

// Названия методов оплаты
export const paymentMethodNames: Record<PaymentMethod, string> = {
  sbp: 'СБП',
  card: 'Номер карты (C2C)',
  account: 'По номеру счёта',
  qr: 'QR (НСПК)',
}

// Функция расчёта балансов по правильной логике
// Приоритет: сначала закрывается страховой депозит, потом остаток → рабочий баланс
export function calculateBalances(totalDeposit: number, requiredSecurity: number) {
  const securityDeposit = Math.min(totalDeposit, requiredSecurity)
  const workingBalance = Math.max(0, totalDeposit - requiredSecurity)
  const isSecurityClosed = securityDeposit >= requiredSecurity

  return { securityDeposit, workingBalance, isSecurityClosed }
}

// Мок баланса (USDT TRC20)
// Пример: трейдер внёс 1700 USDT, требуемый страховой = 500
// → страховой закрыт (500/500), рабочий баланс = 1200
export const mockBalance = {
  available: 1200.00,           // Рабочий депозит (после закрытия страхового)
  securityDepositTrader: 500.00, // Сколько ушло в страховой (факт)
  securityDepositLk: 500.00,     // Сколько требуется (установлено тимлидом)
  pending: 150.00,
  totalProcessed: 24500.00,
}

// Мок адреса для пополнения
export const mockDepositAddress = 'TJYxNdv3T1QQHrWYPTQJYNqPJqGJLQxnVZ'

// Мок реквизитов
export const mockRequisites: Requisite[] = [
  {
    id: 'req1',
    type: 'card',
    bankName: 'Сбербанк',
    cardNumber: '4276 **** **** 4532',
    holderName: 'IVAN PETROV',
    isActive: true,
    dailyLimit: 300000,
    dailyUsed: 145000,
    monthlyLimit: 5000000,
    monthlyUsed: 1250000,
    totalProcessed: 4500000,
    transactionsCount: 342,
    createdAt: '2024-11-15T10:00:00',
    lastUsedAt: '2025-01-13T14:30:00',
    methods: ['card', 'sbp'],
  },
  {
    id: 'req2',
    type: 'card',
    bankName: 'Тинькофф',
    cardNumber: '5536 **** **** 7891',
    holderName: 'IVAN PETROV',
    isActive: true,
    dailyLimit: 500000,
    dailyUsed: 78000,
    monthlyLimit: 10000000,
    monthlyUsed: 890000,
    totalProcessed: 2800000,
    transactionsCount: 198,
    createdAt: '2024-12-01T14:00:00',
    lastUsedAt: '2025-01-13T13:15:00',
    methods: ['card', 'sbp', 'qr'],
  },
  {
    id: 'req3',
    type: 'sbp',
    bankName: 'Альфа-Банк',
    phone: '+7 (999) ***-**-45',
    holderName: 'IVAN PETROV',
    isActive: true,
    dailyLimit: 200000,
    dailyUsed: 0,
    monthlyLimit: 3000000,
    monthlyUsed: 450000,
    totalProcessed: 1200000,
    transactionsCount: 89,
    createdAt: '2024-12-20T09:00:00',
    lastUsedAt: '2025-01-12T18:20:00',
    methods: ['sbp'],
  },
  {
    id: 'req4',
    type: 'account',
    bankName: 'ВТБ',
    accountNumber: '4070 **** **** 8901',
    holderName: 'IVAN PETROV',
    isActive: false,
    dailyLimit: 1000000,
    dailyUsed: 0,
    monthlyLimit: 15000000,
    monthlyUsed: 0,
    totalProcessed: 650000,
    transactionsCount: 23,
    createdAt: '2024-10-05T11:00:00',
    lastUsedAt: '2025-01-05T12:00:00',
    methods: ['account'],
  },
]

// Мок истории транзакций (pay-in / pay-out)
export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    orderId: 'ORD-45621',
    type: 'payin',
    amount: 15000,
    amountUsdt: 162.16,
    method: 'sbp',
    status: 'completed',
    createdAt: '2025-01-13T14:30:00',
    completedAt: '2025-01-13T14:31:00',
    bankName: 'Сбербанк',
    clientId: 'client_001',
    direction: 'Gambling 1',
  },
  {
    id: 't2',
    orderId: 'ORD-45620',
    type: 'payin',
    amount: 5000,
    amountUsdt: 54.05,
    method: 'card',
    status: 'completed',
    createdAt: '2025-01-13T13:15:00',
    completedAt: '2025-01-13T13:17:00',
    cardLast4: '4532',
    bankName: 'Тинькофф',
    clientId: 'client_002',
    direction: 'Exchange 1',
  },
  {
    id: 't3',
    orderId: 'ORD-45619',
    type: 'payout',
    amount: 25000,
    amountUsdt: 270.27,
    method: 'card',
    status: 'processing',
    createdAt: '2025-01-13T12:45:00',
    cardLast4: '7891',
    bankName: 'Альфа-Банк',
    clientId: 'client_003',
  },
  {
    id: 't4',
    orderId: 'ORD-45618',
    type: 'payin',
    amount: 3500,
    amountUsdt: 37.84,
    method: 'sbp',
    status: 'disputed',
    createdAt: '2025-01-13T11:30:00',
    bankName: 'ВТБ',
    clientId: 'client_004',
    direction: 'Gambling 2',
  },
  {
    id: 't5',
    orderId: 'ORD-45617',
    type: 'payin',
    amount: 10000,
    amountUsdt: 108.11,
    method: 'qr',
    status: 'completed',
    createdAt: '2025-01-13T10:00:00',
    completedAt: '2025-01-13T10:02:00',
    bankName: 'Сбербанк',
    clientId: 'client_005',
    direction: 'Mobile 1',
  },
  {
    id: 't6',
    orderId: 'ORD-45616',
    type: 'payout',
    amount: 8000,
    amountUsdt: 86.49,
    method: 'account',
    status: 'completed',
    createdAt: '2025-01-12T18:20:00',
    completedAt: '2025-01-12T18:45:00',
    bankName: 'Газпромбанк',
    clientId: 'client_006',
  },
  {
    id: 't7',
    orderId: 'ORD-45615',
    type: 'payin',
    amount: 50000,
    amountUsdt: 540.54,
    method: 'sbp',
    status: 'failed',
    createdAt: '2025-01-12T16:00:00',
    bankName: 'Райффайзен',
    clientId: 'client_007',
    direction: 'Exchange 2',
  },
  {
    id: 't8',
    orderId: 'ORD-45614',
    type: 'payin',
    amount: 7500,
    amountUsdt: 81.08,
    method: 'card',
    status: 'pending',
    createdAt: '2025-01-13T15:00:00',
    cardLast4: '2345',
    bankName: 'Тинькофф',
    clientId: 'client_008',
    direction: 'Gambling 1',
  },
  {
    id: 't9',
    orderId: 'ORD-45613',
    type: 'payout',
    amount: 12000,
    amountUsdt: 129.73,
    method: 'sbp',
    status: 'cancelled',
    createdAt: '2025-01-12T14:30:00',
    bankName: 'Сбербанк',
    clientId: 'client_009',
  },
  {
    id: 't10',
    orderId: 'ORD-45612',
    type: 'payin',
    amount: 2000,
    amountUsdt: 21.62,
    method: 'sbp',
    status: 'completed',
    createdAt: '2025-01-12T12:00:00',
    completedAt: '2025-01-12T12:01:00',
    bankName: 'Сбербанк',
    clientId: 'client_010',
    direction: 'Mobile 2',
  },
]

// Типы уведомлений
export interface Notification {
  id: string
  type: 'payin' | 'payout' | 'dispute' | 'system' | 'balance'
  title: string
  message: string
  amount?: number
  amountUsdt?: number
  orderId?: string
  isRead: boolean
  createdAt: string
}

// Мок уведомлений
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'payin',
    title: 'Новая заявка Pay-In',
    message: 'Поступила заявка на 15 000 ₽',
    amount: 15000,
    amountUsdt: 162.16,
    orderId: 'ORD-45625',
    isRead: false,
    createdAt: '2025-01-13T15:30:00',
  },
  {
    id: 'n2',
    type: 'dispute',
    title: 'Открыт спор',
    message: 'Клиент оспаривает транзакцию',
    amount: 3500,
    orderId: 'ORD-45618',
    isRead: false,
    createdAt: '2025-01-13T15:15:00',
  },
  {
    id: 'n3',
    type: 'payout',
    title: 'Pay-Out выполнен',
    message: 'Успешно отправлено 25 000 ₽',
    amount: 25000,
    amountUsdt: 270.27,
    orderId: 'ORD-45619',
    isRead: false,
    createdAt: '2025-01-13T14:45:00',
  },
  {
    id: 'n4',
    type: 'balance',
    title: 'Пополнение баланса',
    message: 'Зачислено 500 USDT',
    amountUsdt: 500,
    isRead: true,
    createdAt: '2025-01-13T14:00:00',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Лимит достигнут',
    message: 'Дневной лимит по карте Сбербанк израсходован на 85%',
    isRead: true,
    createdAt: '2025-01-13T12:00:00',
  },
]

// Мок транзакций кошелька
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 500.00,
    status: 'completed',
    createdAt: '2025-01-10T14:30:00',
    completedAt: '2025-01-10T14:35:00',
    txHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    address: 'TJYxNdv3T1QQHrWYPTQJYNqPJqGJLQxnVZ',
  },
  {
    id: 'tx2',
    type: 'deposit',
    amount: 1200.00,
    status: 'completed',
    createdAt: '2025-01-11T09:15:00',
    completedAt: '2025-01-11T09:20:00',
    txHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
    address: 'TJYxNdv3T1QQHrWYPTQJYNqPJqGJLQxnVZ',
  },
  {
    id: 'tx3',
    type: 'withdraw',
    amount: 300.00,
    status: 'completed',
    createdAt: '2025-01-12T16:45:00',
    completedAt: '2025-01-12T17:00:00',
    txHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    address: 'TAbcd1234567890XYZabcdefghijklmnop',
  },
  {
    id: 'tx4',
    type: 'deposit',
    amount: 150.00,
    status: 'pending',
    createdAt: '2025-01-13T11:00:00',
    address: 'TJYxNdv3T1QQHrWYPTQJYNqPJqGJLQxnVZ',
  },
]
