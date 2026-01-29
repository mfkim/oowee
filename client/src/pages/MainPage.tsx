import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton.tsx";

interface UserInfo {
  email: string
  nickname: string
  point: number
  role: string
}

export default function MainPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await api.get("/api/members/me")
        setUser(response.data)
      } catch (error) {
        console.error("정보 조회 실패:", error)
        localStorage.removeItem("accessToken")
        alert("인증이 만료되었습니다. 다시 로그인해주세요.")
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchMyInfo().then(() => {
      console.log("정보 조회 완료!")
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    alert("로그아웃 되었습니다.")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-slate-50 p-4 pt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            {/* 제목 */}
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 포인트 카드 */}
            <div className="rounded-xl bg-slate-900 p-6 h-40 flex flex-col justify-between">
              <Skeleton className="h-4 w-20 bg-slate-700" />
              <Skeleton className="h-10 w-32 bg-slate-700" />
              <Skeleton className="h-3 w-40 bg-slate-700" />
            </div>

            {/* 메뉴 */}
            <div className="grid gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50 p-4 pt-20">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            반가워요, <span className="text-blue-600">{user?.nickname}</span>님!
          </CardTitle>
          <CardDescription>
            오늘도 행운을 빕니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="rounded-xl bg-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm font-medium">내 포인트</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">
                {(user?.point ?? 0).toLocaleString()}
              </span>
              <span className="text-lg font-medium text-slate-400">P</span>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {user?.email}
            </p>
          </div>

          {/* 메뉴 버튼 */}
          <div className="grid gap-3">
            <Button className="w-full" variant="outline" onClick={() => alert("서비스 준비 중입니다.")}>
              🎲 주사위 던지기
            </Button>
            <Button className="w-full" variant="outline" onClick={() => alert("서비스 준비 중입니다.")}>
              📋 게시판
            </Button>
          </div>

          <Button
            className="w-full"
            variant="ghost"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
