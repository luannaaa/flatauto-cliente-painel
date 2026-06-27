"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText,
  Filter,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react"

type Tema = "dark" | "light"
type StatusRelatorio = "Concluída" | "Em andamento" | "Cancelada"

type EntregaRelatorio = {
  id: string
  cliente: string
  data: string
  status: StatusRelatorio
  origem: string
  destino: string
  tipo: string
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function primeiroDiaMesISO() {
  const agora = new Date()
  return new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString().slice(0, 10)
}

function normalizarStatus(status?: string | null): StatusRelatorio {
  const texto = String(status || "").toLowerCase()

  if (texto.includes("conclu") || texto.includes("entreg")) return "Concluída"
  if (texto.includes("cancel")) return "Cancelada"

  return "Em andamento"
}

function pegarDataFrete(frete: any) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at

  if (!data) return ""

  if (String(data).includes("T")) {
    return new Date(data).toISOString().slice(0, 10)
  }

  return String(data).slice(0, 10)
}

export default function RelatoriosPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [inicio, setInicio] = useState(primeiroDiaMesISO())
  const [fim, setFim] = useState(hojeISO())
  const [busca, setBusca] = useState("")
  const [entregas, setEntregas] = useState<EntregaRelatorio[]>([])
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
    carregarRelatorios()
  }, [])

  async function carregarRelatorios() {
    setCarregando(true)
    setErro("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setErro("Empresa não encontrada no login.")
      setEntregas([])
      setCarregando(false)
      return
    }

    const [fretesResp, clientesResp] = await Promise.all([
      supabase
        .from("fretes")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("created_at", { ascending: false }),

      supabase
        .from("clientes_empresa")
        .select("id,nome,responsavel")
        .eq("empresa_id", empresaId),
    ])

    if (fretesResp.error) {
      setErro(`Erro Supabase: ${fretesResp.error.message}`)
      setEntregas([])
      setCarregando(false)
      return
    }

    if (clientesResp.error) {
      console.error("Erro ao buscar clientes:", clientesResp.error.message)
    }

    const clientes = Array.isArray(clientesResp.data) ? clientesResp.data : []

    const clientesPorId = new Map(
      clientes.map((cliente: any) => [
        cliente.id,
        cliente.nome || cliente.responsavel || "Cliente",
      ])
    )

    const fretes = Array.isArray(fretesResp.data) ? fretesResp.data : []

    const formatadas: EntregaRelatorio[] = fretes.map((frete: any) => ({
      id: frete.codigo || frete.id,
      cliente: clientesPorId.get(frete.cliente_id) || "Não informado",
      data: pegarDataFrete(frete),
      status: normalizarStatus(frete.status),
      origem: frete.origem || frete.endereco_origem || "Não informado",
      destino: frete.destino || frete.endereco_destino || "Não informado",
      tipo: frete.tipo_transporte || frete.tipo_carga || "Não informado",
    }))

    setEntregas(formatadas)
    setCarregando(false)
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
    return entregas.filter((item) => {
      const dentroData = item.data >= inicio && item.data <= fim
      const texto = `${item.id} ${item.cliente} ${item.origem} ${item.destino} ${item.tipo} ${item.status}`.toLowerCase()

      return dentroData && texto.includes(busca.toLowerCase())
    })
  }, [entregas, inicio, fim, busca])

  const concluidas = filtradas.filter((e) => e.status === "Concluída").length
  const andamento = filtradas.filter((e) => e.status === "Em andamento").length
  const canceladas = filtradas.filter((e) => e.status === "Cancelada").length
  const demanda = filtradas.length

  function exportarExcel() {
    const linhas = [
      ["ID", "Cliente", "Data", "Status", "Origem", "Destino", "Tipo"],
      ...filtradas.map((e) => [e.id, e.cliente, e.data, e.status, e.origem, e.destino, e.tipo]),
    ]

    const csv = linhas.map((linha) => linha.join(";")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "relatorio-entregas.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

  function exportarPdf() {
    window.print()
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
            <h1 className="mt-1 text-2xl font-black sm:text-4xl">Relatórios</h1>
            <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
              Veja quantas entregas foram feitas, a demanda do período e o desempenho operacional.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={exportarPdf}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-black ${ui.card2}`}
            >
              <FileText size={18} />
              PDF
            </button>

            <button
              onClick={exportarExcel}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] px-4 font-black text-black"
            >
              <FileSpreadsheet size={18} />
              Excel
            </button>
          </div>
        </header>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CampoData ui={ui} label="Data inicial" value={inicio} onChange={setInicio} />
            <CampoData ui={ui} label="Data final" value={fim} onChange={setFim} />

            <div className={`flex h-12 items-center gap-3 rounded-xl border px-4 sm:mt-7 ${ui.card2}`}>
              <Search size={18} className="text-[#ffc400]" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button
              onClick={carregarRelatorios}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] px-4 font-black text-black sm:mt-7"
            >
              <Filter size={18} />
              Atualizar
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Resumo ui={ui} titulo="Demanda total" valor={demanda} icon={<BarChart3 />} />
          <Resumo ui={ui} titulo="Concluídas" valor={concluidas} icon={<CheckCircle2 />} verde />
          <Resumo ui={ui} titulo="Em andamento" valor={andamento} icon={<Clock />} azul />
          <Resumo ui={ui} titulo="Canceladas" valor={canceladas} icon={<XCircle />} vermelho />
        </section>

        <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Entregas do período</h2>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                Resultado baseado na data selecionada.
              </p>
            </div>
          </div>

          {carregando ? (
            <div className={`rounded-2xl border border-dashed p-8 text-center ${ui.card2}`}>
              <p className={`text-sm ${ui.textoFraco}`}>Carregando dados reais do Supabase...</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className={`rounded-2xl border border-dashed p-8 text-center ${ui.card2}`}>
              <p className={`text-sm ${ui.textoFraco}`}>Nenhuma entrega encontrada nesse período.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtradas.map((entrega) => (
                <article key={entrega.id} className={`rounded-[22px] border p-4 ${ui.card2}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{entrega.cliente}</h3>
                      <p className={`mt-1 text-xs font-bold ${ui.textoFraco}`}>
                        {entrega.id} • {entrega.data}
                      </p>
                    </div>

                    <Status nome={entrega.status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info ui={ui} icon={<Package size={17} />} label="Tipo" value={entrega.tipo} />
                    <Info ui={ui} icon={<CalendarDays size={17} />} label="Data" value={entrega.data} />
                    <Info ui={ui} icon={<Truck size={17} />} label="Origem" value={entrega.origem} />
                    <Info ui={ui} icon={<Truck size={17} />} label="Destino" value={entrega.destino} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function CampoData({ ui, label, value, onChange }: any) {
  return (
    <label>
      <span className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>{label}</span>
      <div className={`flex h-12 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
        <CalendarDays size={18} className="text-[#ffc400]" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
      </div>
    </label>
  )
}

function Resumo({ titulo, valor, icon, ui, verde, azul, vermelho }: any) {
  const cor = verde ? "text-green-500" : azul ? "text-sky-500" : vermelho ? "text-red-500" : "text-[#ffc400]"

  return (
    <div className={`rounded-[24px] border p-5 ${ui.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-4xl font-black">{valor}</h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${ui.card2} ${cor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function Info({ ui, icon, label, value }: any) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${ui.card}`}>
      <span className="mt-0.5 text-[#ffc400]">{icon}</span>
      <div>
        <p className={`text-xs font-black ${ui.textoFraco}`}>{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}

function Status({ nome }: { nome: string }) {
  const classe =
    nome === "Concluída"
      ? "bg-green-500/15 text-green-500"
      : nome === "Em andamento"
      ? "bg-sky-500/15 text-sky-500"
      : "bg-red-500/15 text-red-500"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${classe}`}>
      {nome}
    </span>
  )
}