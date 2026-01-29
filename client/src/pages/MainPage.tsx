import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import api from "@/lib/api"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {ArrowRightLeft, LogOut, ChevronRight, Wallet} from "lucide-react"
import {toast} from "sonner";

const THEME = {
  bgPage: "bg-slate-50",
  bgCard: "bg-white",
  textMain: "text-slate-900",
  textSub: "text-slate-500",
}

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
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchMyInfo()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  // 로딩 스켈레톤 (스타일 맞춤)
  if (loading) {
    return (
      <div className={`flex min-h-screen w-full flex-col items-center ${THEME.bgPage} p-4 pt-10 font-sans`}>
        <div
          className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100`}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/2"/>
              <Skeleton className="h-4 w-1/3"/>
            </div>
            <Skeleton className="h-48 w-full rounded-3xl"/>
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl"/>
              <Skeleton className="h-20 w-full rounded-2xl"/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen w-full flex-col items-center ${THEME.bgPage} p-4 pt-10 font-sans`}>

      {/* 메인 컨테이너 */}
      <div
        className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col relative overflow-hidden`}>

        {/* 상단 인사말 */}
        <div className="mb-6 space-y-1 animate-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            반가워요, <span className="text-indigo-600">{user?.nickname}</span>님! 👋
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            오늘도 좋은 하루 되세요.
          </p>
        </div>

        {/* 포인트 카드 */}
        <div
          className="relative w-full h-48 rounded-[28px] bg-linear-to-br from-indigo-500 to-violet-600 text-white p-7 shadow-lg shadow-indigo-200 mb-8 overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"/>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900/10 rounded-full blur-xl"/>

          <div className="relative flex flex-col justify-between h-full z-10">
            <div className="flex items-center gap-2 opacity-90">
              <Wallet className="w-5 h-5"/>
              <span className="text-sm font-semibold tracking-wide">내 지갑</span>
            </div>

            <div className="space-y-1">
              <span className="text-indigo-100 text-sm font-medium">보유 포인트</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight">
                  {(user?.point ?? 0).toLocaleString()}
                </span>
                <span className="text-xl font-bold opacity-80">P</span>
              </div>
            </div>

            <div className="text-xs text-indigo-200 font-medium tracking-wide opacity-80">
              {user?.email}
            </div>
          </div>
        </div>

        {/* 바로가기 */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">바로가기</p>

          {/* 🎲 주사위 게임 */}
          <button
            onClick={() => navigate("/game/dice")}
            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-[24px] border border-slate-100 transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎲
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-slate-800">주사위 게임</p>
                <p className="text-xs text-slate-400 font-medium">50% 확률에 도전하세요</p>
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-colors">
              <ChevronRight className="w-5 h-5"/>
            </div>
          </button>

          {/* 환전하기 */}
          <button
            onClick={() => toast.info("아직 준비 중인 기능이에요! 🚧")}
            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-[24px] border border-slate-100 transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-6 h-6"/>
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-slate-800">환전하기</p>
                <p className="text-xs text-slate-400 font-medium">포인트를 현금으로</p>
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-teal-500 transition-colors">
              <ChevronRight className="w-5 h-5"/>
            </div>
          </button>
        </div>

        {/* 로그아웃 */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors gap-2 self-center text-sm"
        >
          <LogOut className="w-4 h-4"/> 로그아웃
        </Button>
      </div>
    </div>
  )
}
