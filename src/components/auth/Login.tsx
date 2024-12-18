import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/data/requests"
import { useAuthStore } from "../../stores/authStore"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state: any) => state.setAuth)
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
        if (data.payload.is_admin) {
            setAuth(data.payload.user_id, true)
            navigate('/')
        } else {
            alert("Only admin users are allowed to access this portal")
        }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(credentials)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/assets/logo.svg"
            alt="Your Company"
          />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
          Sign in to your account
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sidebar focus:border-sidebar focus:z-10 sm:text-sm"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sidebar focus:border-sidebar focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant={'default'}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sidebar hover:bg-sidebar-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}