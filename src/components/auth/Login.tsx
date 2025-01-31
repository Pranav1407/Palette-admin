import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/data/requests"
import { useAuthStore } from "../../stores/authStore"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state: any) => state.setAuth)
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
        if (data.payload.role === 'user' || 'admin') {
            setAuth(data.payload.user_id, true)
            navigate('/')
        } else {
            toast.error('You are not authorized to access this page.')
        }
    },
    onError: (error) => {
      console.error('Login failed:', error)
      //@ts-expect-error error.response is not null
      setError(error.response.data.detail)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(credentials)
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/2 m-2 bg-sidebar-30 flex items-center justify-center rounded-[5px]">
        <img src="/assets/Logo.png" alt="Logo" />
      </div>
      <div className="w-1/2 flex flex-col gap-5 items-center justify-center">
        <p className="font-thin text-5xl">Login</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className={`w-[592px] m-2 p-3 pl-6 border border-[#d9d9d9] rounded-[20px] outline-none font-normal text-xl text-[#818181] ${error ? 'border-red-500' : ''}`}
            value={credentials.username}
            required
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-[592px] m-2 p-3 pl-6 border border-[#d9d9d9] rounded-[20px] outline-none font-normal text-xl text-[#818181] ${error ? 'border-red-500' : ''}`}
              value={credentials.password}
              required
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <span className="text-lg m-2 ml-4 text-sidebar">Forgot password ?</span>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            variant='default'
            type="submit"
            className={`w-[592px] m-2 mt-4 p-8 bg-sidebar text-white rounded-[20px] font-semibold text-xl cursor-pointer ${loginMutation.isPending && 'cursor-progress opacity-40'}`}
          >
            {loginMutation.isPending ? 'Loging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}