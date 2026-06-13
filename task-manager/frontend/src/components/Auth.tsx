import { useState } from 'react'
import axios from 'axios'

const API = 'https://task-manager-xfg7.onrender.com'

interface AuthProps {
  onLogin: (token: string) => void
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (isLogin) {
        const res = await axios.post(`${API}/auth/login`, { email, password })
        onLogin(res.data.access_token)
      } else {
        await axios.post(`${API}/auth/register`, { email, password })
        setMessage('Account created! Please sign in.')
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white font-semibold text-lg">Taskr</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Everything you need to stay on top of your work.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Organize tasks, set priorities, track progress — all in one clean workspace.
          </p>
        </div>
        <div className="flex gap-3">
          {['Priorities', 'Due dates', 'Filters', 'Fast'].map(tag => (
            <span key={tag} className="text-xs text-gray-500 border border-gray-700 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">Taskr</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {isLogin ? 'Sign in to continue to Taskr' : 'Start organizing your work today'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign in →' : 'Create account →'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage('') }}
              className="text-blue-600 font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}