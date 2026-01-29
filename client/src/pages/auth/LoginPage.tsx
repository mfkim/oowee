import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Link, useNavigate} from "react-router-dom"
import api from "@/lib/api"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    // 1. 입력값 기본 체크
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.")
      return
    }

    try {
      // 2. 서버 로그인 요청 (POST /api/members/login)
      const response = await api.post("/api/members/login", {
        email: email,
        password: password,
      })

      // 3. 토큰 꺼내기
      const {token} = response.data

      // 4. LocalStorage에 토큰 저장
      localStorage.setItem("accessToken", token)

      navigate("/")

    } catch (error: any) {
      const detail = error.response?.data?.message || error.message
      console.error("Login error detail:", detail)

      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    }
  }

  // 엔터키 로그인
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">로그인</CardTitle>
          <CardDescription>
            서비스 이용을 위해 이메일과 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>
            로그인하기
          </Button>
          <div className="text-center text-sm text-slate-500">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
