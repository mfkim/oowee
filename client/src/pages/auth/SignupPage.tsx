import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Link, useNavigate} from "react-router-dom"
import {Loader2, User, Mail, Lock, CheckCircle2, UserPlus} from "lucide-react"
import api from "@/lib/api"

const THEME = {
  bgPage: "bg-slate-50",
  bgCard: "bg-white",
  inputWrapper: "relative",
  inputIcon: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400",
  inputField: "pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all",
  primaryBtn: "bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95",
  helperText: "text-xs text-slate-400 mt-1 ml-1 font-medium",
}

export default function SignupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    const nameRegex = /^[가-힣a-zA-Z0-9]{1,6}$/
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/

    if (!nameRegex.test(name)) return alert("닉네임 형식을 확인해주세요.")
    if (!email) return alert("이메일을 입력해주세요.")
    if (!passwordRegex.test(password)) return alert("비밀번호 형식을 확인해주세요.")
    if (password !== confirmPassword) return alert("비밀번호가 서로 다릅니다.")

    setIsLoading(true)

    try {
      await api.post("/api/members/signup", {
        nickname: name,
        email: email,
        password: password,
      })
      alert("가입이 완료되었습니다! 로그인해주세요.")
      navigate("/login")
    } catch (error: any) {
      const detail = error.response?.data?.message || error.message
      console.error("Signup error:", detail)
      alert("회원가입 실패: 이미 존재하는 정보거나 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen w-full items-center justify-center ${THEME.bgPage} p-4 font-sans`}>
      <div
        className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100`}>

        {/* 헤더 */}
        <div className="text-center space-y-2 mb-8 mt-2">
          <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
            <UserPlus className="w-7 h-7 pl-1" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            새로운 계정 만들기
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            1분이면 충분해요! 정보를 입력해주세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-5">

          {/* 닉네임 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">닉네임</label>
            <div className={THEME.inputWrapper}>
              <User className={THEME.inputIcon}/>
              <Input
                id="nickname"
                placeholder="별명"
                className={THEME.inputField}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <p className={THEME.helperText}>* 한글, 영문, 숫자 (1~6자)</p>
          </div>

          {/* 이메일 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">이메일</label>
            <div className={THEME.inputWrapper}>
              <Mail className={THEME.inputIcon}/>
              <Input
                id="email"
                type="email"
                placeholder="name@email.com"
                className={THEME.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">비밀번호</label>
            <div className={THEME.inputWrapper}>
              <Lock className={THEME.inputIcon}/>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호 입력"
                className={THEME.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className={THEME.helperText}>* 8~16자 (영문, 숫자, 특수문자 포함)</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">비밀번호 확인</label>
            <div className={THEME.inputWrapper}>
              <CheckCircle2 className={THEME.inputIcon}/>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 한 번 더 입력"
                className={THEME.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* 비밀번호 일치 여부 피드백 */}
            {confirmPassword && (
              <p
                className={`text-xs mt-1 ml-1 font-bold ${password === confirmPassword ? "text-teal-600" : "text-rose-500"}`}>
                {password === confirmPassword ? "✓ 비밀번호가 일치합니다" : "! 비밀번호가 다릅니다"}
              </p>
            )}
          </div>

        </div>

        {/* 버튼 영역 */}
        <div className="mt-8 space-y-4">
          <Button
            className={`w-full ${THEME.primaryBtn}`}
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : "가입하기"}
          </Button>

          <div className="text-center text-sm text-slate-400 font-medium">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">
              로그인
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
