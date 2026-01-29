import {useState, useEffect} from "react"
import api from "@/lib/api"
import {useNavigate} from "react-router-dom"
import {Loader2, ChevronLeft, RefreshCw, Minus, Plus, Coins, Check, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {useWindowSize} from "react-use";
import Confetti from "react-confetti"
import {toast} from "sonner";

interface GameResult {
  win: boolean;
  diceNumber: number;
  currentBalance: number;
  playedBetAmount: number;
}

const THEME = {
  bgPage: "bg-slate-50",
  bgCard: "bg-white",
  textMain: "text-slate-900",
  textSub: "text-slate-500",

  primaryBtn: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 ring-offset-2 focus:ring-2 focus:ring-indigo-500",
  disabledBtn: "bg-slate-200 text-slate-400",

  // 홀수, 짝수 버튼
  oddBtn: "bg-purple-50 text-purple-700 border-2 border-purple-200 hover:bg-purple-100",
  oddBtnSelected: "bg-purple-600 text-white border-2 border-purple-600 shadow-md shadow-purple-200 scale-[1.02]",
  evenBtn: "bg-teal-50 text-teal-700 border-2 border-teal-200 hover:bg-teal-100",
  evenBtnSelected: "bg-teal-600 text-white border-2 border-teal-600 shadow-md shadow-teal-200 scale-[1.02]",

  // 칩
  bgChip: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600",

  // 결과 뱃지
  winBadge: "bg-gradient-to-r from-teal-400 to-emerald-600 text-white shadow-lg shadow-teal-200/50 border-0 px-4 py-1",
  loseBadge: "bg-gradient-to-r from-rose-400 to-red-600 text-white shadow-lg shadow-rose-200/50 border-0 px-4 py-1",
}

const DiceFace = ({value, isRolling}: { value: number; isRolling: boolean }) => {
  const dotPositions: Record<number, { cx: number; cy: number }[]> = {
    1: [{cx: 50, cy: 50}],
    2: [{cx: 25, cy: 25}, {cx: 75, cy: 75}],
    3: [{cx: 25, cy: 25}, {cx: 50, cy: 50}, {cx: 75, cy: 75}],
    4: [{cx: 25, cy: 25}, {cx: 75, cy: 25}, {cx: 25, cy: 75}, {cx: 75, cy: 75}],
    5: [{cx: 25, cy: 25}, {cx: 75, cy: 25}, {cx: 50, cy: 50}, {cx: 25, cy: 75}, {cx: 75, cy: 75}],
    6: [{cx: 25, cy: 25}, {cx: 75, cy: 25}, {cx: 25, cy: 50}, {cx: 75, cy: 50}, {cx: 25, cy: 75}, {cx: 75, cy: 75}],
  }

  const rollingStyle = isRolling ? "animate-spin blur-[1px] scale-90" : "scale-100"

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${isRolling ? "opacity-80" : "opacity-100"}`}>
      {!isRolling && <div className="absolute -bottom-4 w-20 h-4 bg-indigo-900/10 blur-md rounded-[100%]"/>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={`w-36 h-36 ${rollingStyle} bg-white rounded-[24px] shadow-[0_10px_40px_rgba(79,70,229,0.15)] border border-slate-100 p-2 text-slate-800`}
      >
        {dotPositions[value]?.map((pos, index) => (
          <circle key={index} cx={pos.cx} cy={pos.cy} r="8" fill="currentColor"/>
        ))}
      </svg>
    </div>
  )
}

export default function DiceGamePage() {
  const navigate = useNavigate()
  const {width, height} = useWindowSize()

  const [betAmount, setBetAmount] = useState<number>(1000)
  const [bettingType, setBettingType] = useState<"ODD" | "EVEN" | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [rollingValue, setRollingValue] = useState(1)
  const [demoValue, setDemoValue] = useState(1)

  useEffect(() => {
    let interval: number | undefined

    if (loading) {
      interval = window.setInterval(() => {
        setRollingValue(Math.floor(Math.random() * 6) + 1)
      }, 80)
    } else if (!result) {
      interval = window.setInterval(() => {
        setDemoValue(Math.floor(Math.random() * 6) + 1)
      }, 800)
    }

    return () => clearInterval(interval)
  }, [loading, result])

  const handlePlayGame = async () => {
    if (!bettingType) {
      toast.warning("배팅할 위치를 선택해주세요!", {
        description: "홀수 또는 짝수 중 하나를 골라주세요."
      })
      return
    }

    if (betAmount < 100) {
      toast.error("최소 100P 이상 배팅해주세요!")
      return
    }

    setLoading(true)
    setResult(null)

    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1200))
    const apiCall = api.post("/api/games/dice", {betAmount, bettingType})

    try {
      const [response] = await Promise.all([apiCall, minLoadingTime])

      setResult({
        ...response.data,
        playedBetAmount: betAmount
      })

    } catch (error: any) {
      toast.error("게임 진행 중 문제가 생겼어요.", {
        description: error.response?.data?.message || "잠시 후 다시 시도해주세요."
      })
    } finally {
      setLoading(false)
    }
  }

  const addAmount = (amount: number) => setBetAmount(prev => prev + amount)

  return (
    <div className={`flex min-h-screen flex-col items-center ${THEME.bgPage} p-4 font-sans ${THEME.textMain}`}>

      {/* 폭죽 효과 */}
      {result?.win && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            recycle={false}
            gravity={0.2}
          />
        </div>
      )}

      {/* 상단 네비게이션 */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 px-2">
        <button onClick={() => navigate("/")} aria-label="뒤로가기"
                className="p-2 -ml-2 rounded-full hover:bg-slate-200/50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600"/>
        </button>
        <span className="font-bold text-lg text-slate-700">주사위 게임</span>
        <div className="w-8"/>
      </div>

      {/* 메인 */}
      <div
        className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center relative overflow-hidden border border-slate-100`}>

        {/* 결과 배경 효과 */}
        {result?.win && <div
          className="absolute inset-0 bg-linear-to-b from-indigo-50/80 to-transparent animate-in fade-in duration-500 pointer-events-none"/>}

        {/* 주사위 */}
        <div className="min-h-80 w-full flex flex-col items-center justify-center z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <DiceFace value={rollingValue} isRolling={true}/>
              <p className="text-xl font-bold text-indigo-600 animate-pulse tracking-tight">
                과연 결과는...? 🎲
              </p>
            </div>
          ) : result ? (
            <div
              className="flex flex-col items-center justify-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <DiceFace value={result.diceNumber} isRolling={false}/>
              <div className="flex flex-col items-center mt-4">
                <Badge
                  className={`mb-4 h-9 rounded-full px-5 text-sm shadow-sm flex items-center gap-2 ${result.win ? THEME.winBadge : THEME.loseBadge}`}>
                  {result.win ? (
                    <>
                      <Check className="w-4 h-4 stroke-3"/>
                      <span className="font-bold pb-px">축하해요!!!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 stroke-3"/>
                      <span className="font-bold pb-px">아쉬워요...</span>
                    </>
                  )}
                </Badge>

                {/* 금액 표시 */}
                <p className={`text-3xl font-black tracking-tight text-transparent bg-clip-text ${
                  result.win
                    ? "bg-linear-to-r from-teal-500 to-emerald-600"
                    : "bg-linear-to-r from-rose-500 to-red-600"
                }`}>
                  {result.win ? "+" : "-"}{result.playedBetAmount.toLocaleString()} P
                </p>

                <div
                  className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-600 font-semibold border border-slate-200">
                  <Coins className="w-4 h-4 text-slate-500"/>
                  <span>내 포인트: {result.currentBalance.toLocaleString()} P</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-8 py-4">
              <div className="relative group cursor-pointer"
                   onClick={() => setDemoValue(Math.floor(Math.random() * 6) + 1)}>
                <div
                  className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500"/>

                <div
                  className="relative transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3">
                  <DiceFace value={demoValue} isRolling={false}/>
                </div>
              </div>

              <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  홀? 짝? <span className="text-indigo-600">선택</span>의 시간!
                </p>
                <p className="text-sm text-slate-400 font-medium">
                  망설이지 말고 느낌대로 배팅하세요.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-8"/>

        {/* 컨트롤 */}
        <div className="w-full space-y-6 z-10">

          {/* 배팅 포인트 */}
          <div className="text-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
            <label className="text-xs font-bold text-slate-400 mb-3 block uppercase tracking-wider">배팅 포인트</label>

            <div className="flex items-center justify-center gap-4 mb-4">
              {/* 마이너스 */}
              <button
                onClick={() => setBetAmount(Math.max(100, betAmount - 1000))}
                disabled={loading}
                className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 transition-all 
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 active:scale-95"}`}
              >
                <Minus className="w-5 h-5"/>
              </button>

              {/* 포인트 표시 */}
              <div
                className={`text-3xl font-black text-slate-800 tracking-tight font-mono w-40 transition-opacity ${loading ? "opacity-50" : ""}`}>
                {betAmount.toLocaleString()}
              </div>

              {/* 플러스 */}
              <button
                onClick={() => addAmount(1000)}
                disabled={loading}
                className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 transition-all 
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 active:scale-95"}`}
              >
                <Plus className="w-5 h-5"/>
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {/* 칩 */}
              {[1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addAmount(amt)}
                  disabled={loading}
                  className={`px-3 py-1.5 ${THEME.bgChip} text-xs font-bold rounded-lg transition-all shadow-sm
                    ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
                >
                  +{amt / 1000}K
                </button>
              ))}
              {/* 초기화 */}
              <button
                onClick={() => setBetAmount(0)}
                aria-label="배팅 금액 초기화"
                disabled={loading}
                className={`px-3 py-1.5 ${THEME.bgChip} text-slate-400 rounded-lg transition-transform shadow-sm
                  ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
              >
                <RefreshCw className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

          {/* 홀짝 선택 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBettingType("ODD")}
              disabled={loading} // 👈 로딩 중 클릭 방지
              className={`h-20 rounded-2xl text-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                    ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"} 
                    ${bettingType === "ODD" ? THEME.oddBtnSelected : THEME.oddBtn}`}
            >
              <span>홀수</span>
            </button>

            <button
              onClick={() => setBettingType("EVEN")}
              disabled={loading} // 👈 로딩 중 클릭 방지
              className={`h-20 rounded-2xl text-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                    ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"} 
                    ${bettingType === "EVEN" ? THEME.evenBtnSelected : THEME.evenBtn}`}
            >
              <span>짝수</span>
            </button>
          </div>

          {/* 굴리기 버튼 */}
          <Button
            onClick={handlePlayGame}
            disabled={loading}
            className={`w-full h-14 rounded-2xl text-lg font-bold transition-all active:scale-95
                    ${loading ? THEME.disabledBtn : THEME.primaryBtn}
                `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5"/>굴러가는 중...
              </div>
            ) : (
              "주사위 굴리기 🎲"
            )}
          </Button>

        </div>
      </div>
    </div>
  )
}
