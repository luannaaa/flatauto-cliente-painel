"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, DollarSign, Filter } from "lucide-react"

type Periodo = "hoje" | "semana" | "mes"

const dados = {
  hoje: [
    { label: "08h", valor: 25 },
    { label: "10h", valor: 40 },
    { label: "12h", valor: 20 },
    { label: "15h", valor: 35 },
  ],
  semana: [
    { label: "Seg", valor: 80 },
    { label: "Ter", valor: 60 },
    { label: "Qua", valor: 120 },
    { label: "Qui", valor: 90 },
    { label: "Sex", valor: 130 },
  ],
  mes: [
    { label: "Sem 1", valor: 420 },
    { label: "Sem 2", valor: 510 },
    { label: "Sem 3", valor: 390 },
    { label: "Sem 4", valor: 530 },
  ],
}

const totais = {
  hoje: "R$ 120,00",
  semana: "R$ 480,00",
  mes: "R$ 1.850,00",
}

export default function GanhosPage() {
  const [periodo, setPeriodo] = useState<Periodo>("semana")

  const maiorValor = useMemo(() => {
    return Math.max(...dados[periodo].map((item) => item.valor))
  }, [periodo])

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-10">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">
              FLATAUTO MOTORISTA
            </p>
            <h1 className="text-2xl font-black">Ganhos</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <DollarSign size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Resumo de ganhos</h2>

          <p className="mt-2 text-sm text-white/60">
            Valores simulados até conectar com o backend.
          </p>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#10171b] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-white/45">
                Filtro
              </p>
              <h3 className="text-lg font-black text-white">
                Período dos ganhos
              </h3>
            </div>

            <Filter size={22} className="text-[#ffc400]" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPeriodo("hoje")}
              className={`h-11 rounded-xl text-sm font-black ${
                periodo === "hoje"
                  ? "bg-[#ffc400] text-black"
                  : "border border-white/10 bg-[#0b1014] text-white/60"
              }`}
            >
              Hoje
            </button>

            <button
              onClick={() => setPeriodo("semana")}
              className={`h-11 rounded-xl text-sm font-black ${
                periodo === "semana"
                  ? "bg-[#ffc400] text-black"
                  : "border border-white/10 bg-[#0b1014] text-white/60"
              }`}
            >
              Semana
            </button>

            <button
              onClick={() => setPeriodo("mes")}
              className={`h-11 rounded-xl text-sm font-black ${
                periodo === "mes"
                  ? "bg-[#ffc400] text-black"
                  : "border border-white/10 bg-[#0b1014] text-white/60"
              }`}
            >
              Mês
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#10171b] p-4">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/50">Total filtrado</p>
              <h3 className="mt-1 text-3xl font-black text-[#ffc400]">
                {totais[periodo]}
              </h3>
            </div>

            <p className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-xs font-black text-[#ffc400]">
              {periodo === "hoje"
                ? "Hoje"
                : periodo === "semana"
                  ? "Semana"
                  : "Mês"}
            </p>
          </div>

          <div className="flex h-[240px] items-end gap-2 overflow-hidden rounded-2xl border border-white/10 bg-[#070b0f] px-3 pb-6 pt-4">
            {dados[periodo].map((item) => {
              const altura = Math.min(
                Math.max((item.valor / maiorValor) * 92, 12),
                92
              )

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-[135px] w-full items-end overflow-hidden">
                    <div
                      className="w-full rounded-t-xl bg-[#ffc400] shadow-[0_0_18px_rgba(255,196,0,0.35)]"
                      style={{ height: `${altura}%` }}
                    />
                  </div>

                  <p className="text-xs font-black text-white/60">
                    {item.label}
                  </p>

                  <p className="whitespace-nowrap text-[10px] font-black text-[#ffc400]">
                    R$ {item.valor},00
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <Card titulo="Hoje" valor="R$ 120,00" ativo={periodo === "hoje"} />
        <Card titulo="Semana" valor="R$ 480,00" ativo={periodo === "semana"} />
        <Card titulo="Mês" valor="R$ 1.850,00" ativo={periodo === "mes"} />
      </div>
    </main>
  )
}

function Card({
  titulo,
  valor,
  ativo,
}: {
  titulo: string
  valor: string
  ativo?: boolean
}) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        ativo
          ? "border-[#ffc400]/50 bg-[#ffc400]/10"
          : "border-white/10 bg-[#10171b]"
      }`}
    >
      <p className="text-sm text-white/50">{titulo}</p>
      <h3 className="mt-1 text-2xl font-black text-[#ffc400]">{valor}</h3>
    </article>
  )
}