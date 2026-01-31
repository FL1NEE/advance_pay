const API_BASE_URL = 'http://localhost:8000/api/v1'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }))
      throw new Error(error.detail || 'Request failed')
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Auth
  async login(username: string, password: string) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }))
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    this.token = data.access_token
    return data
  }

  async register(username: string, password: string, email?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { username, password, email, role: 'trader' },
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  // Users
  async getMyBalance() {
    return this.request('/users/me/balance')
  }

  // Requisites
  async getRequisites() {
    return this.request('/requisites')
  }

  async createRequisite(data: {
    type: string
    bank_name: string
    card_number?: string
    account_number?: string
    phone?: string
    holder_name: string
    methods: string[]
    daily_limit?: number
    monthly_limit?: number
  }) {
    return this.request('/requisites', { method: 'POST', body: data })
  }

  async updateRequisite(id: string, data: { is_active?: boolean; daily_limit?: number; monthly_limit?: number }) {
    return this.request(`/requisites/${id}`, { method: 'PATCH', body: data })
  }

  async deleteRequisite(id: string) {
    return this.request(`/requisites/${id}`, { method: 'DELETE' })
  }

  // Transactions
  async getTransactions(params?: { page?: number; page_size?: number; type?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString())
    if (params?.type) searchParams.append('type', params.type)
    if (params?.status) searchParams.append('status', params.status)
    const query = searchParams.toString()
    return this.request(`/transactions${query ? `?${query}` : ''}`)
  }

  async createTransaction(data: {
    type: string
    amount: number
    amount_usdt: number
    method: string
    requisite_id?: string
    client_id?: string
    direction?: string
  }) {
    return this.request('/transactions', { method: 'POST', body: data })
  }

  async updateTransaction(id: string, data: { status: string }) {
    return this.request(`/transactions/${id}`, { method: 'PATCH', body: data })
  }

  // Disputes
  async getDisputes(status?: string) {
    const query = status ? `?status=${status}` : ''
    return this.request(`/disputes${query}`)
  }

  async createDispute(data: { transaction_id: string; reason: string; description?: string; client_message?: string }) {
    return this.request('/disputes', { method: 'POST', body: data })
  }

  async updateDispute(id: string, data: { status?: string; trader_response?: string }) {
    return this.request(`/disputes/${id}`, { method: 'PATCH', body: data })
  }

  // Wallet
  async getDepositAddress() {
    return this.request('/wallet/deposit-address')
  }

  async getWalletTransactions() {
    return this.request('/wallet/transactions')
  }

  async requestWithdraw(amount: number, address: string) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: { type: 'withdraw', amount, address },
    })
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications')
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, { method: 'POST' })
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', { method: 'POST' })
  }
}

export const apiClient = new ApiClient()
