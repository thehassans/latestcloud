import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CreditCard, Key, Eye, EyeOff, Save, TestTube, CheckCircle, AlertCircle } from 'lucide-react'
import { settingsAPI } from '../../lib/api'
import toast from 'react-hot-toast'

export default function AdminPaymentGateway() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [settings, setSettings] = useState({
    stripe_enabled: false,
    stripe_mode: 'test',
    stripe_publishable_key_test: '',
    stripe_secret_key_test: '',
    stripe_publishable_key_live: '',
    stripe_secret_key_live: '',
    stripe_webhook_secret: '',
    paypal_enabled: false,
    paypal_mode: 'sandbox',
    paypal_client_id_sandbox: '',
    paypal_secret_sandbox: '',
    paypal_client_id_live: '',
    paypal_secret_live: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await settingsAPI.getPaymentGateway()
      if (res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }))
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.updatePaymentGateway(settings)
      toast.success('Payment gateway settings saved!')
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async (gateway) => {
    setTesting(true)
    try {
      const res = await settingsAPI.testPaymentGateway(gateway)
      if (res.data.success) {
        toast.success(`${gateway} connection successful!`)
      } else {
        toast.error(res.data.error || 'Connection failed')
      }
    } catch (err) {
      toast.error('Connection test failed')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <Helmet><title>Payment Gateway - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Payment Gateway Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Stripe Settings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#635BFF] rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Stripe</h2>
                <p className="text-sm text-dark-500">Accept credit/debit card payments</p>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.stripe_enabled}
                onChange={(e) => setSettings(prev => ({ ...prev, stripe_enabled: e.target.checked }))}
                className="w-5 h-5 rounded text-primary-500"
              />
              <span className="font-medium">Enabled</span>
            </label>
          </div>

          {settings.stripe_enabled && (
            <div className="space-y-6">
              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Mode</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${settings.stripe_mode === 'test' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                    <input
                      type="radio"
                      name="stripe_mode"
                      value="test"
                      checked={settings.stripe_mode === 'test'}
                      onChange={(e) => setSettings(prev => ({ ...prev, stripe_mode: e.target.value }))}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <TestTube className="w-5 h-5 text-amber-500" />
                      <span className="font-medium">Test Mode</span>
                    </div>
                    <p className="text-xs text-dark-500 mt-1">Use for development & testing</p>
                  </label>
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${settings.stripe_mode === 'live' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                    <input
                      type="radio"
                      name="stripe_mode"
                      value="live"
                      checked={settings.stripe_mode === 'live'}
                      onChange={(e) => setSettings(prev => ({ ...prev, stripe_mode: e.target.value }))}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Live Mode</span>
                    </div>
                    <p className="text-xs text-dark-500 mt-1">Accept real payments</p>
                  </label>
                </div>
              </div>

              {/* Test Keys */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <TestTube className="w-4 h-4" /> Test API Keys
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Publishable Key (Test)</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input
                        type="text"
                        value={settings.stripe_publishable_key_test}
                        onChange={(e) => setSettings(prev => ({ ...prev, stripe_publishable_key_test: e.target.value }))}
                        placeholder="pk_test_..."
                        className="input pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Key (Test)</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input
                        type={showSecretKey ? 'text' : 'password'}
                        value={settings.stripe_secret_key_test}
                        onChange={(e) => setSettings(prev => ({ ...prev, stripe_secret_key_test: e.target.value }))}
                        placeholder="sk_test_..."
                        className="input pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showSecretKey ? <EyeOff className="w-4 h-4 text-dark-400" /> : <Eye className="w-4 h-4 text-dark-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Keys */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Live API Keys
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Publishable Key (Live)</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input
                        type="text"
                        value={settings.stripe_publishable_key_live}
                        onChange={(e) => setSettings(prev => ({ ...prev, stripe_publishable_key_live: e.target.value }))}
                        placeholder="pk_live_..."
                        className="input pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Key (Live)</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input
                        type={showSecretKey ? 'text' : 'password'}
                        value={settings.stripe_secret_key_live}
                        onChange={(e) => setSettings(prev => ({ ...prev, stripe_secret_key_live: e.target.value }))}
                        placeholder="sk_live_..."
                        className="input pl-10 pr-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook Secret */}
              <div>
                <label className="block text-sm font-medium mb-2">Webhook Secret (Optional)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={settings.stripe_webhook_secret}
                    onChange={(e) => setSettings(prev => ({ ...prev, stripe_webhook_secret: e.target.value }))}
                    placeholder="whsec_..."
                    className="input pl-10"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-1">Required for automatic payment confirmations</p>
              </div>

              <button
                onClick={() => handleTestConnection('stripe')}
                disabled={testing}
                className="btn-secondary"
              >
                <TestTube className="w-4 h-4 mr-2" />
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          )}
        </div>

        {/* PayPal Settings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">PayPal</h2>
                <p className="text-sm text-dark-500">Accept PayPal payments</p>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.paypal_enabled}
                onChange={(e) => setSettings(prev => ({ ...prev, paypal_enabled: e.target.checked }))}
                className="w-5 h-5 rounded text-primary-500"
              />
              <span className="font-medium">Enabled</span>
            </label>
          </div>

          {settings.paypal_enabled && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Mode</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${settings.paypal_mode === 'sandbox' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                    <input type="radio" name="paypal_mode" value="sandbox" checked={settings.paypal_mode === 'sandbox'}
                      onChange={(e) => setSettings(prev => ({ ...prev, paypal_mode: e.target.value }))} className="hidden" />
                    <div className="flex items-center gap-2">
                      <TestTube className="w-5 h-5 text-amber-500" />
                      <span className="font-medium">Sandbox</span>
                    </div>
                  </label>
                  <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-colors ${settings.paypal_mode === 'live' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                    <input type="radio" name="paypal_mode" value="live" checked={settings.paypal_mode === 'live'}
                      onChange={(e) => setSettings(prev => ({ ...prev, paypal_mode: e.target.value }))} className="hidden" />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Live</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client ID ({settings.paypal_mode})</label>
                  <input
                    type="text"
                    value={settings.paypal_mode === 'sandbox' ? settings.paypal_client_id_sandbox : settings.paypal_client_id_live}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      [settings.paypal_mode === 'sandbox' ? 'paypal_client_id_sandbox' : 'paypal_client_id_live']: e.target.value 
                    }))}
                    placeholder="Client ID"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secret ({settings.paypal_mode})</label>
                  <input
                    type="password"
                    value={settings.paypal_mode === 'sandbox' ? settings.paypal_secret_sandbox : settings.paypal_secret_live}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      [settings.paypal_mode === 'sandbox' ? 'paypal_secret_sandbox' : 'paypal_secret_live']: e.target.value 
                    }))}
                    placeholder="Secret"
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Setup Instructions
          </h3>
          <div className="space-y-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <h4 className="font-medium">Stripe Setup:</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <a href="https://dashboard.stripe.com" target="_blank" rel="noopener" className="underline">Stripe Dashboard</a></li>
                <li>Navigate to Developers → API Keys</li>
                <li>Copy your Publishable and Secret keys</li>
                <li>For webhooks, go to Developers → Webhooks and add endpoint</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium">PayPal Setup:</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <a href="https://developer.paypal.com" target="_blank" rel="noopener" className="underline">PayPal Developer</a></li>
                <li>Create an app in My Apps & Credentials</li>
                <li>Copy your Client ID and Secret</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
