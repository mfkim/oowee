import {useEffect, useState, type ChangeEvent} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ArrowLeft, CreditCard, Zap} from "lucide-react"
import {toast} from "sonner"
import api from "@/lib/api"
import * as PortOne from "@portone/browser-sdk/v2"

interface PortOneResponse {
  paymentId: string
  transactionId?: string
  code?: string
  message?: string
}

const THEME = {
  bgPage: "bg-slate-50",
  bgCard: "bg-white",

  amountBtn: "h-14 w-full rounded-xl border border-slate-200 text-base font-bold transition-all relative overflow-hidden flex items-center justify-center gap-1 active:scale-95",
  amountBtnSelected: "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600 z-10",
  amountBtnNormal: "bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50",
  inputField: "h-14 w-full rounded-xl border border-slate-200 text-lg font-bold pl-4 pr-8 text-right transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 placeholder:text-slate-300 placeholder:font-medium",
  inputFieldSelected: "border-indigo-600 bg-white ring-1 ring-indigo-600",
  inputFieldNormal: "bg-slate-50/50 text-slate-800",
}

const AMOUNT_OPTIONS = [
  {label: "1,000", value: 1000},
  {label: "5,000", value: 5000},
  {label: "10,000", value: 10000},
  {label: "50,000", value: 50000},
  {label: "100,000", value: 100000},
  {label: "500,000", value: 500000},
]

export default function PaymentPage() {
  const navigate = useNavigate()

  const [selectedAmount, setSelectedAmount] = useState<number>(1000)
  const [customValue, setCustomValue] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ email: string; nickname: string } | null>(null)

  useEffect(() => {
    api.get("/api/members/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error("로그인이 필요합니다.")
        navigate("/login")
      })
  }, [navigate])

  const handleOptionClick = (value: number) => {
    setIsCustomMode(false)
    setSelectedAmount(value)
    setCustomValue("")
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCustomMode(true)
    const rawValue = e.target.value.replace(/[^0-9]/g, "")
    if (rawValue) {
      const numValue = parseInt(rawValue, 10)
      if (numValue > 100000000) return
      setSelectedAmount(numValue)
      setCustomValue(numValue.toLocaleString())
    } else {
      setSelectedAmount(0)
      setCustomValue("")
    }
  }

  const handlePayment = async () => {
    if (!user) return

    if (selectedAmount < 1000) {
      return toast.error("최소 1,000원 이상부터 충전 가능합니다!")
    }

    if (selectedAmount % 1000 !== 0) {
      return toast.warning("1,000원 단위로만 충전할 수 있어요.", {
        description: "예: 11,000원 (O), 11,500원 (X)"
      })
    }

    const storeId = import.meta.env.VITE_PORTONE_STORE_ID
    const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY

    if (!storeId || !channelKey) {
      console.error("환경 변수 누락")
      return toast.error("결제 설정 오류가 발생했습니다.")
    }

    setLoading(true)

    try {
      const paymentId = `payment-${crypto.randomUUID()}`

      const response = await PortOne.requestPayment({
        storeId: storeId,
        channelKey: channelKey,
        paymentId: paymentId,
        orderName: `${selectedAmount.toLocaleString()} 포인트 충전`,
        totalAmount: selectedAmount,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY", // 간편결제
        customer: {
          fullName: user.nickname,
          email: user.email,
        },
      }) as PortOneResponse

      if (!response) return toast.error("결제 응답이 없습니다.")

      if (response.code !== undefined && response.code !== null) {
        return toast.error("결제 실패", { description: response.message })
      }

      await api.post("/api/payments/complete", {
        paymentId: response.paymentId,
        orderId: paymentId,
        amount: selectedAmount,
      })

      toast.success("포인트 충전 완료!")
      navigate("/")

    } catch (error: any) {
      console.error(error)
      const message = error.response?.data?.message || "결제 처리에 실패했습니다."
      toast.error("오류 발생", {description: message})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen w-full flex-col items-center ${THEME.bgPage} p-4 font-sans`}>

      <div className="w-full max-w-md flex items-center mb-6 mt-2 px-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200/50 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600"/>
        </button>
        <span className="font-bold text-lg text-slate-800 ml-2">충전하기</span>
      </div>

      <Card
        className={`w-full max-w-md ${THEME.bgCard} rounded-[32px] shadow-xl shadow-slate-200/50 border-slate-100 overflow-hidden`}>
        <CardHeader className="pb-4 pt-8 px-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <Zap className="w-6 h-6 fill-indigo-600"/>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">얼마를 충전할까요?</CardTitle>
              <p className="text-sm text-slate-400 font-medium">
                최소 1,000원부터 1,000원 단위로 가능해요
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">

          {/* 포인트 선택 */}
          <div className="space-y-3">
            {/* 직접 입력창 */}
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={isCustomMode ? customValue : selectedAmount > 0 ? selectedAmount.toLocaleString() : ""}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsCustomMode(true)
                  if (!customValue) setSelectedAmount(0)
                }}
                disabled={loading}
                className={`${THEME.inputField} ${isCustomMode ? THEME.inputFieldSelected : THEME.inputFieldNormal}`}
              />
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold transition-colors ${selectedAmount > 0 ? "text-indigo-600" : "text-slate-400"}`}>
                P
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {AMOUNT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  disabled={loading}
                  className={`${THEME.amountBtn} ${
                    !isCustomMode && selectedAmount === option.value ? THEME.amountBtnSelected : THEME.amountBtnNormal
                  }`}
                >
                  {option.label}
                  <span className="text-xs font-medium opacity-70">P</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2"/>

          {/* 영수증 */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">충전 포인트</span>
              <span className="font-bold text-slate-700">{selectedAmount.toLocaleString()} P</span>
            </div>

            <div className="h-px bg-slate-200/50"/>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">최종 결제 금액</span>
              <span className="text-xl font-black text-indigo-600 tracking-tight">
                {selectedAmount.toLocaleString()} <span className="text-sm font-bold text-indigo-400">원</span>
              </span>
            </div>
          </div>

          {/* 결제하기 */}
          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={loading || selectedAmount === 0 || !user}
              className="w-full h-14 rounded-2xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              {loading ? (
                "결제 진행 중..."
              ) : selectedAmount > 0 ? (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 opacity-80"/>
                  <span>{selectedAmount.toLocaleString()}원 결제하기</span>
                </div>
              ) : (
                "금액을 입력해주세요"
              )}
            </Button>

            <p className="text-[11px] text-center text-slate-400 leading-relaxed">
              위 금액으로 결제가 진행되며, <br/>
              테스트 환경이므로 실제 비용은 청구되지 않습니다.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
