import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/api"

export default function SignupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = async () => {
    // 1. 정규표현식
    // 닉네임: 한글, 영문, 숫자만 가능 (특수문자 X), 1~6글자
    const nameRegex = /^[가-힣a-zA-Z0-9]{1,6}$/
    // 비밀번호: 영문, 숫자, 특수문자 포함 8~16자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/

    // 2. 유효성 검사
    if (!nameRegex.test(name)) {
      alert("닉네임은 특수문자 없이 한글, 영문, 숫자로만 6자 이내로 입력해주세요.")
      return
    }

    if (!email) {
      alert("이메일을 입력해주세요.")
      return
    }

    if (!passwordRegex.test(password)) {
      alert("비밀번호는 8~16자의 영문, 숫자, 특수문자를 모두 포함해야 합니다.")
      return
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 서로 다릅니다.")
      return
    }

    try {
      // 3. API 요청 전송 (/api/members/signup)
      await api.post("/api/members/signup", {
        nickname: name,
        email: email,
        password: password,
      })

      navigate("/login")

    } catch (error: any) {
      const detail = error.response?.data?.message || error.message
      if (detail) {
        console.error("Signup error detail:", detail)
      }

      alert("회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.")
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">회원가입</CardTitle>
          <CardDescription>
            새로운 계정을 만들고 서비스를 이용해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">

          {/* 닉네임 */}
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              placeholder="한글, 영문, 숫자 (최대 6자)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              * 특수문자 없이 한글, 영문, 숫자로만 6자 이내로 입력해주세요.
            </p>
          </div>

          {/* 이메일 */}
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 비밀번호 */}
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="8~16자 (영문, 숫자, 특수문자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              * 8~16자의 영문, 숫자, 특수문자를 반드시 포함해야 합니다.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup}>
            가입하기
          </Button>
          <div className="text-center text-sm text-slate-500">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
