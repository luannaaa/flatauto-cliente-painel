"use client"

import { ArrowLeft, Bike, CalendarDays, CheckCircle2, Clock, DollarSign, Settings, UserRound, Navigation } from "lucide-react"

export default function MotoristaSubPage() {
  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <header className="flex items-center gap-3">
          <a href="/motorista" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <ArrowLeft size={22} />
          </a>
          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Corridas</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Bike size={34} />
          </div>
          <h2 className="mt-5 text-xl font-black">Área preparada</h2>
          <p className="mt-2 text-sm text-white/60">
            Esta tela está pronta visualmente para receber os dados reais do backend depois.
          </p>
        </section>

        <section className="space-y-3">
          <Card titulo="Entrega exemplo" detalhe="Recife Antigo → Boa Viagem" extra="Hoje às 16:30" />
          <Card titulo="Agendamento exemplo" detalhe="Mercado Central → Olinda" extra="Amanhã às 09:00" />
        </section>
      </div>
    </main>
  )
}

function Card({ titulo, detalhe, extra }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <h3 className="font-black">{titulo}</h3>
      <p className="mt-1 text-sm text-white/60">{detalhe}</p>
      <p className="mt-2 text-sm font-bold text-[#ffc400]">{extra}</p>
    </article>
  )
}
