"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
import {
  BarChart3,
  CheckCircle2,
  CircleAlert,
  MousePointerClick,
  PlugZap,
  RefreshCw,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"

type Tema = "dark" | "light"

type StatusIntegracao = "Conectado" | "Desconectado"

type Integracao = {
  id: string
  nome: string
  descricao: string
  status: StatusIntegracao
  conectado: boolean
}

const opcoesIntegracoes = [
  {
    nome: "Google Analytics",
    descricao: "Acompanhar visitas, acessos e comportamento no site.",
  },
  {
    nome: "Google Ads",
    descricao: "Ver campanhas, cliques e conversões dos anúncios.",
  },
  {
    nome: "Meta Ads",
    descricao: "Acompanhar anúncios do Facebook e Instagram.",
  },
  {
    nome: "Google Tag Manager",
    descricao: "Gerenciar tags, eventos e pixels de rastreamento.",
  },
]

export default function AnalyticsPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [integracoes, setIntegracoes] = useState<Integracao[]>([])
  const [busca, setBusca] = useState("")
  const [visitas, setVisitas] = useState(0)
  const [cliques, setCliques] = useState(0)
  const [pedidosFrete, setPedidosFrete] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    function carregarTema() {
      const temaSalvo = localStorage.getItem("temaEmpresa")
      setTema(temaSalvo === "light" || temaSalvo === "claro" ? "light" : "dark")
    }

    carregarTema()
    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  useEffect(() => {
    carregarAnalytics()
  }, [])

  async function carregarAnalytics() {
    setCarregando(true)
    setErro("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setErro("Empresa não encontrada no login.")
      setIntegracoes(montarIntegracoes([]))
      setCarregando(false)
      return
    }

    const [integracoesResp, fretesResp] = await Promise.all([
      supabase
        .from("crm_integracoes")
        .select("*")
        .eq("empresa_id", empresaId),

      supabase
        .from("fretes")
        .select("id")
        .eq("empresa_id", empresaId),
    ])

    if (integracoesResp.error) {
      setErro(`Erro Supabase: ${integracoesResp.error.message}`)
    }

    const dadosIntegracoes = Array.isArray(integracoesResp.data)
      ? integracoesResp.data
      : []

    const fretes = Array.isArray(fretesResp.data) ? fretesResp.data : []

    setIntegracoes(montarIntegracoes(dadosIntegracoes))
    setPedidosFrete(fretes.length)

    setVisitas(0)
    setCliques(0)

    setCarregando(false)
  }

  function montarIntegracoes(dadosSupabase: any[]): Integracao[] {
    return opcoesIntegracoes.map((opcao) => {
      const encontrada = dadosSupabase.find(
        (item) =>
          String(item.crm || "").toLowerCase() === opcao.nome.toLowerCase()
      )

      const conectado = Boolean(encontrada?.conectado)

      return {
        id: encontrada?.id || opcao.nome,
        nome: opcao.nome,
        descricao: opcao.descricao,
        conectado,
        status: conectado ? "Conectado" : "Desconectado",
      }
    })
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow-[0_18px_45px_rgba(80,60,20,0.10)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#dfd0a5] bg-[#f7f0dc]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  const filtradas = useMemo(() => {
    return integracoes.filter((item) =>
      `${item.nome} ${item.descricao}`.toLowerCase().includes(busca.toLowerCase())
    )
  }, [integracoes, busca])

  const conectadas = integracoes.filter((item) => item.conectado).length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">Analytics</h1>
          <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
            Estrutura limpa preparada para puxar dados reais de visitas,
            campanhas, cliques e conversões quando as integrações forem ativadas.
          </p>
        </header>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Resumo ui={ui} titulo="Visitas do site" valor={visitas} icon={<Users />} />
          <Resumo ui={ui} titulo="Cliques" valor={cliques} icon={<MousePointerClick />} />
          <Resumo ui={ui} titulo="Pedidos de frete" valor={pedidosFrete} icon={<Target />} />
          <Resumo ui={ui} titulo="Conectadas" valor={conectadas} icon={<PlugZap />} />
        </section>

        <section className={`rounded-[30px] border p-4 sm:p-6 ${ui.card}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black sm:text-2xl">
                Conexões de Analytics
              </h2>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                Sem dados fake. As integrações aparecem como estrutura e só ficam
                conectadas quando existir registro no Supabase.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={carregarAnalytics}
                className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-black ${ui.card2}`}
              >
                <RefreshCw size={18} />
                Atualizar
              </button>

              <div className={`flex h-12 w-full items-center gap-3 rounded-xl border px-4 lg:w-[360px] ${ui.card2}`}>
                <Search size={18} className="text-[#ffc400]" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar integração..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {carregando ? (
            <div className={`mt-6 rounded-2xl border border-dashed p-8 text-center ${ui.card2}`}>
              <p className={`text-sm ${ui.textoFraco}`}>
                Carregando integrações do Supabase...
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {filtradas.map((item) => (
                <article key={item.id} className={`rounded-[26px] border p-4 sm:p-5 ${ui.card2}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                      <IconeIntegracao nome={item.nome} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-black">{item.nome}</h3>
                          <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                            {item.descricao}
                          </p>
                        </div>

                        <Status status={item.status} />
                      </div>

                      <div className={`mt-4 rounded-2xl border p-4 ${ui.card}`}>
                        <div className="flex items-center gap-2 font-black">
                          <Settings size={18} className="text-[#ffc400]" />
                          Preparado para backend/API
                        </div>

                        <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                          A conexão real será feita por token, OAuth ou API da
                          plataforma escolhida.
                        </p>
                      </div>

                      <button
                        disabled
                        className={`mt-4 flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl font-black ${
                          item.conectado
                            ? "bg-green-500/15 text-green-500"
                            : "bg-[#ffc400]/30 text-black/70"
                        }`}
                      >
                        <PlugZap size={18} />
                        {item.conectado ? "Conectado" : "Aguardando conexão"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
              <RefreshCw size={28} />
            </div>

            <div>
              <h2 className="text-xl font-black">Como vai funcionar</h2>
              <p className={`mt-2 max-w-3xl text-sm ${ui.textoFraco}`}>
                Hoje a tela já busca integrações no Supabase pela empresa logada.
                Quando as APIs forem conectadas, os campos de visitas, cliques e
                conversões serão preenchidos automaticamente.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function IconeIntegracao({ nome }: { nome: string }) {
  if (nome.includes("Ads")) return <TrendingUp size={28} />
  if (nome.includes("Tag")) return <Settings size={28} />
  return <BarChart3 size={28} />
}

function Resumo({ titulo, valor, icon, ui }: any) {
  return (
    <div className={`rounded-[24px] border p-5 ${ui.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-3xl font-black">{valor}</h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-[#ffc400] ${ui.card2}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function Status({ status }: { status: StatusIntegracao }) {
  const conectado = status === "Conectado"

  return (
    <span
      className={`flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
        conectado
          ? "bg-green-500/15 text-green-500"
          : "bg-red-500/15 text-red-500"
      }`}
    >
      {conectado ? <CheckCircle2 size={14} /> : <CircleAlert size={14} />}
      {status}
    </span>
  )
}