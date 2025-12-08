import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      themeStyle: 'gradient', // 'gradient' or 'flat'
      setTheme: (theme) => set({ theme }),
      setThemeStyle: (style) => set({ themeStyle: style }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      }))
    }),
    {
      name: 'magnetic-theme'
    }
  )
)

// Auth store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: !!user 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      }))
    }),
    {
      name: 'magnetic-auth'
    }
  )
)

// Cart store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      addItem: (item) => set((state) => {
        const existing = state.items.find(
          i => i.id === item.id && i.billingCycle === item.billingCycle
        )
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id && i.billingCycle === item.billingCycle
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (id, billingCycle) => set((state) => ({
        items: state.items.filter(
          i => !(i.id === id && i.billingCycle === billingCycle)
        )
      })),
      updateQuantity: (id, billingCycle, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.id === id && i.billingCycle === billingCycle
            ? { ...i, quantity }
            : i
        )
      })),
      clearCart: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      getTotal: () => {
        const state = get()
        const subtotal = state.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        )
        const discount = state.coupon
          ? state.coupon.type === 'percentage'
            ? subtotal * (state.coupon.value / 100)
            : state.coupon.value
          : 0
        return {
          subtotal,
          discount,
          total: subtotal - discount
        }
      }
    }),
    {
      name: 'magnetic-cart'
    }
  )
)

// Currency store
export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'USD',
      rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        BDT: 110,
        INR: 83,
        SGD: 1.35,
        AUD: 1.53
      },
      setCurrency: (currency) => set({ currency }),
      setRates: (rates) => set({ rates }),
      convert: (amount, from = 'USD') => {
        const state = get()
        const fromRate = state.rates[from] || 1
        const toRate = state.rates[state.currency] || 1
        return (amount / fromRate) * toRate
      },
      format: (amount, from = 'USD') => {
        const state = get()
        const converted = state.convert(amount, from)
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: state.currency,
          minimumFractionDigits: 2
        }).format(converted)
      }
    }),
    {
      name: 'magnetic-currency'
    }
  )
)

// Settings store
export const useSettingsStore = create(
  persist(
    (set) => ({
      settings: {},
      setSettings: (settings) => set({ settings }),
      updateSetting: (key, value) => set((state) => ({
        settings: { ...state.settings, [key]: value }
      }))
    }),
    {
      name: 'magnetic-settings'
    }
  )
)

// Site Settings store (logo, favicon, site name)
export const useSiteSettingsStore = create(
  persist(
    (set) => ({
      siteName: 'Magnetic Clouds',
      siteTagline: 'Premium Cloud Hosting',
      logo: null,
      favicon: null,
      contactEmail: 'support@magneticclouds.com',
      contactPhone: '',
      loaded: false,
      setSiteSettings: (data) => set({ ...data, loaded: true }),
      updateSiteSetting: (key, value) => set({ [key]: value })
    }),
    {
      name: 'magnetic-site-settings'
    }
  )
)
