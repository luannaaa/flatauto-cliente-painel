"use client"

import {
  ArrowLeft,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Package,
  FileText,
  DollarSign,
  CalendarDays,
  UserRound,
  Route,
  Hash,
  RefreshCw,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"

type EntregaConcluida = {
  id: string
  numeroNota: string
  cliente: string
  origem: string
  destino: string
  tipoPacote: string
  dataEntrega: string
  horarioEntrega: string
  tempoTotal: string
  distancia: string
  valorRecebido: string
  observacaoCliente: string
  status: "Entregue"
}

type FreteSupabase = {
  id: string
  codigo?: string | null
  motorista_id?: string | null
  tipo_contratante?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  status?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor_frete?: number | null
  observacoes?: string | null
  created_at?: string | null
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function dataDoFrete(frete: FreteSupabase) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return String(data).slice(0, 10)
}

function formatarDataBR(data?: string | null) {
  if (!data) return "Não informada"

  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")

  if (partes.length !== 3) return limpa

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function statusConcluido(status?: string | null) {
  const texto = String(status || "").toLowerCase()
  return (
    texto.includes("conclu") ||
    texto.includes("entregue") ||
    texto.includes("finaliz") ||
    texto === "concluido"
  )
}

function transformarFrete(frete: FreteSupabase): EntregaConcluida {
  return {
    id: frete.codigo || frete.id,
    numeroNota: frete.codigo ? `Frete ${frete.codigo}` : "Sem nota informada",
    cliente: frete.tipo_contratante || "Cliente não informado",
    origem: frete.origem || frete.endereco_origem || "Origem não informada",
    destino: frete.destino || frete.endereco_destino || "Destino não informado",
    tipoPacote: frete.tipo_carga || frete.tipo_transporte || "Tipo não informado",
    dataEntrega: formatarDataBR(dataDoFrete(frete)),
    horarioEntrega: frete.horario || "Não informado",
    tempoTotal: "Não calculado",
    distancia: "Não calculada",
    valorRecebido: formatarMoeda(frete.valor_frete),
    observacaoCliente: frete.observacoes || "Sem observação.",
    status: "Entregue",
  }
}

export default function ConcluidasMotoristaPage() {
  const [selecionada, setSelecionada] = useState<EntregaConcluida | null>(null)
  const [entregasConcluidas, setEntregasConcluidas] = useState<EntregaConcluida[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarConcluidas()
  }, [])

  async function carregarConcluidas() {
    setCarregando(true)
    setErro("")

    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      setErro("Motorista não encontrado no login.")
      setEntregasConcluidas([])
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
      setEntregasConcluidas([])
      setCarregando(false)
      return
    }

    const fretes = Array.isArray(data) ? data : []
    const concluidas = fretes
      .filter((frete: FreteSupabase) => statusConcluido(frete.status))
      .map(transformarFrete)

    setEntregasConcluidas(concluidas)
    setCarregando(false)
  }

  const totalRecebido = useMemo(() => {
    const total = entregasConcluidas.reduce((soma, entrega) => {
      const valor = Number(
        entrega.valorRecebido
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      )

      return soma + (Number.isNaN(valor) ? 0 : valor)
    }, 0)

    return formatarMoeda(total)
  }, [entregasConcluidas])

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/motorista"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <ArrowLeft size={22} />
            </a>

            <div>
              <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
              <h1 className="text-2xl font-black">Concluídas</h1>
            </div>
          </div>

          <button
            onClick={carregarConcluidas}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ffc400]"
          >
            <RefreshCw size={19} />
          </button>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Histórico de entregas</h2>
          <p className="mt-2 text-sm text-white/60">
            Veja as corridas finalizadas, valores recebidos, cliente, nota e detalhes da entrega.
          </p>
        </section>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="grid grid-cols-2 gap-3">
          <Resumo titulo="Entregas" valor={`${entregasConcluidas.length}`} />
          <Resumo titulo="Recebido" valor={totalRecebido} destaque />
        </section>

        {carregando ? (
          <Vazio texto="Carregando concluídas do Supabase..." />
        ) : entregasConcluidas.length === 0 ? (
          <Vazio texto="Nenhuma entrega concluída ainda." />
        ) : (
          <section className="space-y-3">
            {entregasConcluidas.map((entrega) => (
              <article
                key={entrega.id}
                onClick={() => setSelecionada(entrega)}
                className="cursor-pointer rounded-2xl border border-white/10 bg-[#10171b] p-4 transition hover:border-[#ffc400]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-2 py-1 text-[10px] font-black text-[#ffc400]">
                        {entrega.id}
                      </span>

                      <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-black text-green-400">
                        Entregue
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-black">{entrega.cliente}</h3>

                    <p className="mt-1 text-sm text-white/60">
                      {entrega.origem} → {entrega.destino}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MiniInfo titulo="Data" valor={entrega.dataEntrega} />
                      <MiniInfo titulo="Hora" valor={entrega.horarioEntrega} />
                      <MiniInfo titulo="Valor" valor={entrega.valorRecebido} amarelo />
                      <MiniInfo titulo="Nota" valor={entrega.numeroNota} />
                    </div>

                    <p className="mt-3 text-xs font-bold text-white/45">
                      {entrega.tipoPacote}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-5 sm:items-center sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#ffc400]">DETALHES DA ENTREGA</p>
                <h2 className="mt-1 text-xl font-black">{selecionada.cliente}</h2>
              </div>

              <button
                onClick={() => setSelecionada(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <DetalheLinha titulo="Corrida" valor={selecionada.id} icone={<Hash size={18} />} />
              <DetalheLinha titulo="Cliente" valor={selecionada.cliente} icone={<UserRound size={18} />} />
              <DetalheLinha titulo="Nota fiscal" valor={selecionada.numeroNota} icone={<FileText size={18} />} />
              <DetalheLinha titulo="Origem" valor={selecionada.origem} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Destino" valor={selecionada.destino} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Tipo de pacote" valor={selecionada.tipoPacote} icone={<Package size={18} />} />
              <DetalheLinha titulo="Data" valor={selecionada.dataEntrega} icone={<CalendarDays size={18} />} />
              <DetalheLinha titulo="Horário" valor={selecionada.horarioEntrega} icone={<Clock size={18} />} />
              <DetalheLinha titulo="Tempo total" valor={selecionada.tempoTotal} icone={<Clock size={18} />} />
              <DetalheLinha titulo="Distância" valor={selecionada.distancia} icone={<Route size={18} />} />
              <DetalheLinha titulo="Valor recebido" valor={selecionada.valorRecebido} icone={<DollarSign size={18} />} destaque />

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-white/45">
                  <FileText size={18} />
                  Observação do cliente
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-white">
                  {selecionada.observacaoCliente}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelecionada(null)}
              className="mt-5 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black"
            >
              Fechar detalhes
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function Resumo({ titulo, valor, destaque }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <p className="text-xs font-black uppercase text-white/45">{titulo}</p>
      <p className={`mt-1 text-xl font-black ${destaque ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </article>
  )
}

function MiniInfo({ titulo, valor, amarelo }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] font-black uppercase text-white/35">{titulo}</p>
      <p className={`mt-1 text-xs font-black ${amarelo ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </div>
  )
}

function DetalheLinha({ titulo, valor, icone, destaque }: any) {
  return (
    <div className={`rounded-2xl border p-4 ${destaque ? "border-[#ffc400]/30 bg-[#ffc400]/10" : "border-white/10 bg-white/[0.04]"}`}>
      <p className={`flex items-center gap-2 text-xs font-black uppercase ${destaque ? "text-[#ffc400]" : "text-white/45"}`}>
        {icone}
        {titulo}
      </p>
      <p className={`mt-1 text-sm font-black ${destaque ? "text-[#ffc400]" : "text-white"}`}>{valor}</p>
    </div>
  )
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-6 text-center">
      <CheckCircle2 className="mx-auto text-[#ffc400]" size={34} />
      <p className="mt-3 text-sm font-bold text-white/60">{texto}</p>
    </div>
  )
}
