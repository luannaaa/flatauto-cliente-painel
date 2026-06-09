"use client"

import { ArrowLeft, DollarSign } from "lucide-react"

export default function GanhosPage() {
  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <Header titulo="Ganhos" />

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <DollarSign size={34} />
          </div>
          <h2 className="mt-5 text-xl font-black">Resumo de ganhos</h2>
          <p className="mt-2 text-sm text-white/60">Valores simulados até conectar com o backend.</p>
        </section>

        <Card titulo="Hoje" valor="R$ 120,00" />
        <Card titulo="Semana" valor="R$ 480,00" />
        <Card titulo="Mês" valor="R$ 1.850,00" />
      </div>
    </main>
  )
}

function Header({ titulo }: any) {
  return (
    <header className="flex items-center gap-3">
      <a href="/motorista" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <ArrowLeft size={22} />
      </a>
      <div>
        <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
        <h1 className="text-2xl font-black">{titulo}</h1>
      </div>
    </header>
  )
}

function Card({ titulo, valor }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <p className="text-sm text-white/50">{titulo}</p>
      <h3 className="mt-1 text-2xl font-black text-[#ffc400]">{valor}</h3>
    </article>
  )
}
