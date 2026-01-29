import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Link, useNavigate} from "react-router-dom"
import {Loader2, Mail, Lock, LogIn} from "lucide-react"
import api from "@/lib/api"
import {toast} from "sonner";

const THEME = {
  bgPage: "bg-slate-50",
  bgCard: "bg-white",
  inputWrapper: "relative",
  inputIcon: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400",
  inputField: "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all",
  primaryBtn: "bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95",
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("이메일과 비밀번호를 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post("/api/members/login", {
        email: email,
        password: password,
      })

      const {token} = response.data
      localStorage.setItem("accessToken", token)
      toast.success("로그인되었습니다!", { duration: 2000 })
      navigate("/")

    } catch (error: any) {
      toast.error("로그인에 실패했습니다.", {
        description: "이메일이나 비밀번호를 다시 확인해주세요."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className={`flex min-h-screen w-full items-center justify-center ${THEME.bgPage} p-4 font-sans`}>
      <div
        className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100`}>

        {/* 헤더 */}
        <div className="text-center space-y-2 mb-8 mt-2">
          <div
            className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
            <LogIn className="w-7 h-7"/>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            만나서 반가워요!
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            서비스 이용을 위해 로그인이 필요해요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-5">
          {/* 이메일 */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-500 ml-1">이메일</label>
            <div className={THEME.inputWrapper}>
              <Mail className={THEME.inputIcon}/>
              <Input
                id="email"
                type="email"
                placeholder="name@email.com"
                className={THEME.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 ml-1">비밀번호</label>
            <div className={THEME.inputWrapper}>
              <Lock className={THEME.inputIcon}/>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={THEME.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-8 space-y-4">
          <Button
            className={`w-full ${THEME.primaryBtn}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : "로그인하기"}
          </Button>

          <div className="text-center text-sm text-slate-400 font-medium">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline ml-1">
              회원가입
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
