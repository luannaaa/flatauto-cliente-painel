"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Wallet,
  DollarSign,
  Truck,
  TrendingUp,
  RefreshCw,
  Building2,
  Smartphone,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Tema = "dark" | "light"

type Financeiro = {
  id: string
  empresa_id: string | null
  frete_id: string | null
  motorista_id: string | null
  cliente_empresa_id: string | null
  tipo_contratante: string | null
  valor_frete: number | null
  percentual_moto: number | null
  percentual_empr: number | null
  percentual_app: number | null
  valor_motorista: number | null
  valor_empresa: number | null
  valor_app: number | null
  despesas: number | null
  lucro_liquido: number | null
  status_pagamento: string | null
  data_pagamento: string | null
  created_at: string | null
  updated_at: string | null
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function FinanceiroPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)

    carregarFinanceiro()
  }, [])

  async function carregarFinanceiro() {
    setCarregando(true)
    setErro("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setErro("Empresa não encontrada no login.")
      setCarregando(false)
      return
    }

    const { data, error } = await supabase
      .from("financeiro")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFinanceiro([])
      setCarregando(false)
      return
    }

    setFinanceiro(Array.isArray(data) ? data : [])
    setCarregando(false)
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#dfd0a5] bg-[#f7f0dc]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#dfd0a5]" : "border-white/10",
  }

  const faturamentoBruto = useMemo(() => {
    return financeiro.reduce((total, item) => total + Number(item.valor_frete || 0), 0)
  }, [financeiro])

  const repasseMotorista = useMemo(() => {
    return financeiro.reduce((total, item) => total + Number(item.valor_motorista || 0), 0)
  }, [financeiro])

  const receitaEmpresa = useMemo(() => {
    return financeiro.reduce((total, item) => total + Number(item.valor_empresa || 0), 0)
  }, [financeiro])

  const lucroApp = useMemo(() => {
    return financeiro.reduce((total, item) => total + Number(item.valor_app || 0), 0)
  }, [financeiro])

  const lucroLiquido = useMemo(() => {
    return financeiro.reduce((total, item) => total + Number(item.lucro_liquido || 0), 0)
  }, [financeiro])

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <section className={`rounded-[30px] border p-5 sm:p-8 ${ui.card}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
          <Wallet size={34} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">Financeiro</h1>
            <p className={`mt-2 max-w-[700px] text-sm ${ui.textoFraco}`}>
              Resumo financeiro puxando os dados reais da tabela financeiro.
            </p>
          </div>

          <button
            onClick={carregarFinanceiro}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>

        {erro && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card ui={ui} titulo="Faturamento bruto" valor={formatarMoeda(faturamentoBruto)} detalhe="Valor total dos fretes" icon={<DollarSign />} />
          <Card ui={ui} titulo="Motorista" valor={formatarMoeda(repasseMotorista)} detalhe="Repasse do motorista" icon={<Truck />} />
          <Card ui={ui} titulo="Empresa" valor={formatarMoeda(receitaEmpresa)} detalhe="Receita da empresa" icon={<Building2 />} />
          <Card ui={ui} titulo="App FlatAuto" valor={formatarMoeda(lucroApp)} detalhe="Lucro do app" icon={<Smartphone />} />
          <Card ui={ui} titulo="Lucro líquido" valor={formatarMoeda(lucroLiquido)} detalhe="Lucro final" icon={<TrendingUp />} />
        </section>

        <section className={`mt-8 rounded-2xl border p-5 ${ui.card2}`}>
          <p className="font-bold">Movimentações financeiras</p>

          {carregando ? (
            <p className={`mt-3 text-sm ${ui.textoFraco}`}>Carregando financeiro...</p>
          ) : financeiro.length === 0 ? (
            <p className={`mt-3 text-sm ${ui.textoFraco}`}>
              Nenhum financeiro salvo ainda.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className={`border-b ${ui.linha} ${ui.textoFraco}`}>
                    <th className="pb-3">Frete</th>
                    <th className="pb-3">Contratante</th>
                    <th className="pb-3">Pagamento</th>
                    <th className="pb-3">Valor total</th>
                    <th className="pb-3">Motorista</th>
                    <th className="pb-3">Empresa</th>
                    <th className="pb-3">App</th>
                    <th className="pb-3">Lucro líquido</th>
                  </tr>
                </thead>

                <tbody>
                  {financeiro.map((item) => (
                    <tr key={item.id} className={`border-b ${ui.linha}`}>
                      <td className="py-4 font-bold">{item.frete_id || item.id}</td>
                      <td className="py-4">{item.tipo_contratante || "Não informado"}</td>
                      <td className="py-4">{item.status_pagamento || "Pendente"}</td>
                      <td className="py-4">{formatarMoeda(Number(item.valor_frete || 0))}</td>
                      <td className="py-4">{formatarMoeda(Number(item.valor_motorista || 0))}</td>
                      <td className="py-4">{formatarMoeda(Number(item.valor_empresa || 0))}</td>
                      <td className="py-4">{formatarMoeda(Number(item.valor_app || 0))}</td>
                      <td className="py-4">{formatarMoeda(Number(item.lucro_liquido || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

function Card({ titulo, valor, detalhe, icon, ui }: any) {
  return (
    <div className={`rounded-[24px] border p-5 ${ui.card2}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-xl font-black sm:text-2xl">{valor}</h2>
          <p className={`mt-2 text-sm ${ui.textoFraco}`}>{detalhe}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
          {icon}
        </div>
      </div>
    </div>
  )
}