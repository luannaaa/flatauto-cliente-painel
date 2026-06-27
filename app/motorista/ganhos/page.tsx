"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, DollarSign, Filter, RefreshCw } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Periodo = "hoje" | "semana" | "mes"

type Frete = {
  id: string
  codigo?: string | null
  motorista_id?: string | null
  status?: string | null
  valor_frete?: number | null
  data_frete?: string | null
  data_entrega?: string | null
  created_at?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  tipo_contratante?: string | null
  tipo_carga?: string | null
  horario?: string | null
}

type Barra = {
  label: string
  valor: number
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function dataBaseFrete(frete: Frete) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return new Date(data)
}

function dataISO(data: Date) {
  return data.toISOString().slice(0, 10)
}

function inicioSemana(data: Date) {
  const nova = new Date(data)
  const dia = nova.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  nova.setDate(nova.getDate() + diff)
  nova.setHours(0, 0, 0, 0)
  return nova
}

function statusConcluido(status?: string | null) {
  const texto = String(status || "").toLowerCase()
  return texto.includes("conclu") || texto.includes("entregue") || texto.includes("finaliz")
}

function ganhoMotorista(frete: Frete) {
  return Number(frete.valor_frete || 0) * 0.8
}

function mesmoDia(a: Date, b: Date) {
  return dataISO(a) === dataISO(b)
}

function mesmoMes(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function dentroDaSemana(data: Date, referencia: Date) {
  const ini = inicioSemana(referencia)
  const fim = new Date(ini)
  fim.setDate(ini.getDate() + 7)
  return data >= ini && data < fim
}

function gerarBarras(periodo: Periodo, fretes: Frete[]) {
  const agora = new Date()

  if (periodo === "hoje") {
    const base = [
      { label: "08h", inicio: 8, fim: 10 },
      { label: "10h", inicio: 10, fim: 12 },
      { label: "12h", inicio: 12, fim: 15 },
      { label: "15h", inicio: 15, fim: 18 },
      { label: "18h", inicio: 18, fim: 24 },
    ]

    return base.map((item) => {
      const valor = fretes
        .filter((frete) => {
          const data = dataBaseFrete(frete)
          const hora = data.getHours()
          return mesmoDia(data, agora) && hora >= item.inicio && hora < item.fim
        })
        .reduce((total, frete) => total + ganhoMotorista(frete), 0)

      return { label: item.label, valor }
    })
  }

  if (periodo === "semana") {
    const nomes = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    const ini = inicioSemana(agora)

    return nomes.map((label, index) => {
      const dia = new Date(ini)
      dia.setDate(ini.getDate() + index)

      const valor = fretes
        .filter((frete) => mesmoDia(dataBaseFrete(frete), dia))
        .reduce((total, frete) => total + ganhoMotorista(frete), 0)

      return { label, valor }
    })
  }

  const semanas = [
    { label: "Sem 1", inicio: 1, fim: 8 },
    { label: "Sem 2", inicio: 8, fim: 15 },
    { label: "Sem 3", inicio: 15, fim: 22 },
    { label: "Sem 4", inicio: 22, fim: 32 },
  ]

  return semanas.map((semana) => {
    const valor = fretes
      .filter((frete) => {
        const data = dataBaseFrete(frete)
        return (
          mesmoMes(data, agora) &&
          data.getDate() >= semana.inicio &&
          data.getDate() < semana.fim
        )
      })
      .reduce((total, frete) => total + ganhoMotorista(frete), 0)

    return { label: semana.label, valor }
  })
}

export default function GanhosPage() {
  const [periodo, setPeriodo] = useState<Periodo>("semana")
  const [fretes, setFretes] = useState<Frete[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarGanhos()
  }, [])

  async function carregarGanhos() {
    setCarregando(true)
    setErro("")

    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      setErro("Motorista não encontrado no login.")
      setFretes([])
      setCarregando(false)
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .eq("motorista_id", motoristaId)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []
    setFretes(lista.filter((frete) => statusConcluido(frete.status)))
    setCarregando(false)
  }

  const agora = new Date()

  const ganhosHoje = useMemo(() => {
    return fretes
      .filter((frete) => mesmoDia(dataBaseFrete(frete), agora))
      .reduce((total, frete) => total + ganhoMotorista(frete), 0)
  }, [fretes])

  const ganhosSemana = useMemo(() => {
    return fretes
      .filter((frete) => dentroDaSemana(dataBaseFrete(frete), agora))
      .reduce((total, frete) => total + ganhoMotorista(frete), 0)
  }, [fretes])

  const ganhosMes = useMemo(() => {
    return fretes
      .filter((frete) => mesmoMes(dataBaseFrete(frete), agora))
      .reduce((total, frete) => total + ganhoMotorista(frete), 0)
  }, [fretes])

  const dados = useMemo(() => gerarBarras(periodo, fretes), [periodo, fretes])

  const totalFiltrado = useMemo(() => {
    if (periodo === "hoje") return ganhosHoje
    if (periodo === "semana") return ganhosSemana
    return ganhosMes
  }, [periodo, ganhosHoje, ganhosSemana, ganhosMes])

  const maiorValor = useMemo(() => {
    const maior = Math.max(...dados.map((item) => item.valor), 0)
    return maior || 1
  }, [dados])

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-10">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
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
          </div>

          <button
            onClick={carregarGanhos}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ffc400]"
          >
            <RefreshCw size={19} />
          </button>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <DollarSign size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Resumo de ganhos</h2>

          <p className="mt-2 text-sm text-white/60">
            Valores reais das entregas concluídas pelo motorista. O cálculo usa 80% do valor do frete.
          </p>
        </section>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

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
            <BotaoPeriodo ativo={periodo === "hoje"} onClick={() => setPeriodo("hoje")}>
              Hoje
            </BotaoPeriodo>

            <BotaoPeriodo ativo={periodo === "semana"} onClick={() => setPeriodo("semana")}>
              Semana
            </BotaoPeriodo>

            <BotaoPeriodo ativo={periodo === "mes"} onClick={() => setPeriodo("mes")}>
              Mês
            </BotaoPeriodo>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#10171b] p-4">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/50">Total filtrado</p>
              <h3 className="mt-1 text-3xl font-black text-[#ffc400]">
                {formatarMoeda(totalFiltrado)}
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

          {carregando ? (
            <div className="flex h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#070b0f] px-4 text-center text-sm font-bold text-white/50">
              Carregando ganhos do Supabase...
            </div>
          ) : (
            <div className="flex h-[240px] items-end gap-2 overflow-hidden rounded-2xl border border-white/10 bg-[#070b0f] px-3 pb-6 pt-4">
              {dados.map((item) => {
                const altura = Math.min(
                  Math.max((item.valor / maiorValor) * 92, item.valor > 0 ? 12 : 3),
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
                      {formatarMoeda(item.valor)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <Card titulo="Hoje" valor={formatarMoeda(ganhosHoje)} ativo={periodo === "hoje"} />
        <Card titulo="Semana" valor={formatarMoeda(ganhosSemana)} ativo={periodo === "semana"} />
        <Card titulo="Mês" valor={formatarMoeda(ganhosMes)} ativo={periodo === "mes"} />
      </div>
    </main>
  )
}

function BotaoPeriodo({ ativo, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`h-11 rounded-xl text-sm font-black ${
        ativo
          ? "bg-[#ffc400] text-black"
          : "border border-white/10 bg-[#0b1014] text-white/60"
      }`}
    >
      {children}
    </button>
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
