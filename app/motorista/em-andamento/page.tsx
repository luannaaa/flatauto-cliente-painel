"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Bike,
  Bus,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  X,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

type Frete = {
  id: string
  codigo?: string | null
  motorista_id?: string | null
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
  tipo_contratante?: string | null
  aceito_em?: string | null
  created_at?: string | null
}

function IconeVeiculo({ tipo, size = 28 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

function normalizarVeiculo(tipo?: string | null): Veiculo {
  const t = String(tipo || "").toLowerCase()
  if (t.includes("moto")) return "moto"
  if (t.includes("carro")) return "carro"
  if (t.includes("van")) return "van"
  return "caminhao"
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function ehEmAndamento(frete: Frete) {
  const status = texto(frete.status)
  return status.includes("andamento") || status.includes("em rota") || status.includes("rota")
}

function ehAgendadoAceito(frete: Frete) {
  const status = texto(frete.status)
  return status.includes("agendado_aceito") || status.includes("agendado aceito")
}

function dataDoFrete(frete: Frete) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return String(data).slice(0, 10)
}

function dataBR(data?: string | null) {
  if (!data) return "Data não informada"
  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")
  if (partes.length !== 3) return limpa
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function EmAndamentoPage() {
  const [tipoVeiculo, setTipoVeiculo] = useState<Veiculo>("caminhao")
  const [fretes, setFretes] = useState<Frete[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [detalhesAberto, setDetalhesAberto] = useState(false)
  const [agendamentoDetalhe, setAgendamentoDetalhe] = useState<Frete | null>(null)
  const [finalizando, setFinalizando] = useState(false)

  useEffect(() => {
    const veiculoSalvo = localStorage.getItem("tipoVeiculoMotorista")
    setTipoVeiculo(normalizarVeiculo(veiculoSalvo))
    carregarDados()
  }, [])

  async function carregarDados() {
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
      .in("status", [
        "em_andamento",
        "Em andamento",
        "em rota",
        "Em rota",
        "agendado_aceito",
        "agendado aceito",
      ])
      .order("data_frete", { ascending: true })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      setCarregando(false)
      return
    }

    setFretes(Array.isArray(data) ? data : [])
    setCarregando(false)
  }

  const corridaAtual = useMemo(() => {
    return fretes.find(ehEmAndamento) || null
  }, [fretes])

  const proximosAgendamentos = useMemo(() => {
    return fretes.filter((frete) => ehAgendadoAceito(frete))
  }, [fretes])

  async function iniciarAgendamento(frete: Frete) {
    const { error } = await supabase
      .from("fretes")
      .update({
        status: "em_andamento",
      })
      .eq("id", frete.id)

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    setAgendamentoDetalhe(null)
    await carregarDados()
  }

  async function finalizarCorrida() {
    if (!corridaAtual || finalizando) return

    const confirmar = window.confirm("Finalizar esta entrega?")
    if (!confirmar) return

    setFinalizando(true)

    const { error } = await supabase
      .from("fretes")
      .update({
        status: "concluido",
      })
      .eq("id", corridaAtual.id)

    setFinalizando(false)

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    setDetalhesAberto(false)
    await carregarDados()
  }

  const origemAtual = corridaAtual?.origem || corridaAtual?.endereco_origem || "Origem não informada"
  const destinoAtual = corridaAtual?.destino || corridaAtual?.endereco_destino || "Destino não informado"

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#10171b] px-4">
        <div className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-xl font-black">Em andamento</h1>
          </div>
        </div>

        <button
          onClick={carregarDados}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ffc400]"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <section className="relative h-[52vh] overflow-hidden bg-[#d9e4d2] pt-16">
        <MapaVisual tipoVeiculo={tipoVeiculo} ativo={Boolean(corridaAtual)} />
      </section>

      <section className="-mt-5 rounded-t-[34px] bg-[#020507] px-4 pb-8 pt-5">
        <div className="mx-auto max-w-[480px] space-y-4">
          {erro && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
              {erro}
            </div>
          )}

          {carregando ? (
            <CardVazio texto="Carregando corridas do Supabase..." />
          ) : corridaAtual ? (
            <button
              onClick={() => setDetalhesAberto(true)}
              className="w-full rounded-[28px] border border-[#ffc400]/25 bg-[#10171b] p-5 text-left transition hover:border-[#ffc400]/60"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                  <IconeVeiculo tipo={tipoVeiculo} size={30} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#ffc400]">CORRIDA ATUAL</p>
                  <h2 className="mt-1 text-xl font-black">Entrega em andamento</h2>
                  <p className="mt-1 text-sm text-white/60">
                    {origemAtual} → {destinoAtual}
                  </p>
                  <p className="mt-2 text-sm font-black text-green-400">
                    Toque para ver detalhes e finalizar
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <CardVazio texto="Nenhuma corrida em andamento agora." />
          )}

          {corridaAtual && (
            <div className="grid gap-3">
              <InfoCard icon={<MapPin size={21} />} titulo="Destino" valor={destinoAtual} />
              <InfoCard icon={<Clock size={21} />} titulo="Horário" valor={corridaAtual.horario || "Não informado"} />
              <InfoCard icon={<Package size={21} />} titulo="Tipo de pacote" valor={corridaAtual.tipo_carga || corridaAtual.tipo_transporte || "Não informado"} />
            </div>
          )}

          <section className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#ffc400]">PRÓXIMOS</p>
                <h2 className="text-lg font-black">Corridas agendadas</h2>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
                {proximosAgendamentos.length}
              </span>
            </div>

            {proximosAgendamentos.length === 0 ? (
              <CardVazio texto="Nenhum agendamento aceito ainda." menor />
            ) : (
              <div className="space-y-3">
                {proximosAgendamentos.map((frete) => (
                  <AgendamentoCard
                    key={frete.id}
                    frete={frete}
                    onAbrir={() => setAgendamentoDetalhe(frete)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      {detalhesAberto && corridaAtual && (
        <DetalhesModal
          frete={corridaAtual}
          tipoVeiculo={tipoVeiculo}
          onFechar={() => setDetalhesAberto(false)}
          onFinalizar={finalizarCorrida}
          finalizando={finalizando}
        />
      )}

      {agendamentoDetalhe && (
        <AgendamentoDetalhesModal
          frete={agendamentoDetalhe}
          onFechar={() => setAgendamentoDetalhe(null)}
          onIniciar={() => iniciarAgendamento(agendamentoDetalhe)}
        />
      )}
    </main>
  )
}

function MapaVisual({ tipoVeiculo, ativo }: { tipoVeiculo: Veiculo; ativo: boolean }) {
  return (
    <>
      <div className={`absolute left-[7%] top-[24%] z-20 rounded-xl px-4 py-2 text-sm font-black text-white ${ativo ? "bg-green-600" : "bg-black/40"}`}>
        {ativo ? "Origem" : "Sem rota"}
      </div>

      <div className={`absolute right-[8%] top-[33%] z-20 rounded-xl px-4 py-2 text-sm font-black text-white ${ativo ? "bg-red-600" : "bg-black/40"}`}>
        {ativo ? "Destino" : "Aguardando"}
      </div>

      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-5%] top-[33%] h-[4px] w-[115%] rotate-[12deg] bg-white/90" />
        <div className="absolute left-[-5%] top-[62%] h-[4px] w-[115%] -rotate-[7deg] bg-white/90" />
        <div className="absolute left-[23%] top-[10%] h-[100%] w-[4px] rotate-[8deg] bg-white/90" />
        <div className="absolute left-[70%] top-[0%] h-[100%] w-[4px] -rotate-[9deg] bg-white/90" />
      </div>

      <div className="absolute left-[18%] top-[38%] h-28 w-40 rounded-[35px] bg-green-500/20" />
      <div className="absolute right-[10%] top-[22%] h-32 w-48 rounded-[35px] bg-green-500/20" />
      <div className="absolute bottom-[8%] left-[35%] h-32 w-52 rounded-[35px] bg-green-500/20" />

      {ativo && (
        <>
          <div className="absolute left-[24%] top-[52%] h-[5px] w-[52%] -rotate-[8deg] rounded-full bg-[#ffc400]" />

          <div className="absolute left-[20%] top-[49%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
            <MapPin size={27} />
          </div>

          <div className="absolute left-[72%] top-[38%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <MapPin size={27} />
          </div>

          <div className="absolute left-[43%] top-[43%] z-30 flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-[#ffc400] text-black shadow-[0_10px_35px_rgba(255,196,0,0.45)]">
            <IconeVeiculo tipo={tipoVeiculo} size={42} />
          </div>
        </>
      )}
    </>
  )
}

function DetalhesModal({
  frete,
  tipoVeiculo,
  onFechar,
  onFinalizar,
  finalizando,
}: {
  frete: Frete
  tipoVeiculo: Veiculo
  onFechar: () => void
  onFinalizar: () => void
  finalizando: boolean
}) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 px-4 pb-5 sm:items-center sm:pb-0">
      <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
              <IconeVeiculo tipo={tipoVeiculo} size={26} />
            </div>

            <div>
              <p className="text-xs font-black text-[#ffc400]">DETALHES DA CORRIDA</p>
              <h2 className="text-lg font-black">Entrega atual</h2>
            </div>
          </div>

          <button
            onClick={onFechar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <InfoCard icon={<FileText size={19} />} titulo="Cliente" valor={frete.tipo_contratante || "Cliente não informado"} />
          <InfoCard icon={<MapPin size={19} />} titulo="Onde pegar" valor={origem} />
          <InfoCard icon={<MapPin size={19} />} titulo="Onde entregar" valor={destino} />
          <InfoCard icon={<Package size={19} />} titulo="Tipo do pacote" valor={frete.tipo_carga || frete.tipo_transporte || "Não informado"} />
          <InfoCard icon={<Clock size={19} />} titulo="Horário" valor={frete.horario || "Não informado"} />
          <InfoCard icon={<FileText size={19} />} titulo="Observação" valor={frete.observacoes || "Sem observação."} maior />
          <InfoCard icon={<Package size={19} />} titulo="Valor" valor={formatarMoeda(frete.valor_frete)} />
        </div>

        <button
          onClick={onFinalizar}
          disabled={finalizando}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] py-4 font-black text-black disabled:opacity-60"
        >
          <CheckCircle2 size={22} />
          {finalizando ? "Finalizando..." : "Finalizar corrida"}
        </button>
      </div>
    </div>
  )
}

function AgendamentoDetalhesModal({
  frete,
  onFechar,
  onIniciar,
}: {
  frete: Frete
  onFechar: () => void
  onIniciar: () => void
}) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 px-4 pb-5 sm:items-center sm:pb-0">
      <div className="w-full max-w-[420px] rounded-[26px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#ffc400]">DETALHES DO AGENDAMENTO</p>
            <h2 className="mt-1 text-lg font-black">Corrida agendada</h2>
            <p className="mt-1 text-sm text-white/55">
              {dataBR(dataDoFrete(frete))} {frete.horario ? `• ${frete.horario}` : ""}
            </p>
          </div>

          <button
            onClick={onFechar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <InfoCard icon={<FileText size={19} />} titulo="Cliente / Empresa" valor={frete.tipo_contratante || "Não informado"} />
          <InfoCard icon={<MapPin size={19} />} titulo="Onde pegar" valor={origem} />
          <InfoCard icon={<MapPin size={19} />} titulo="Onde entregar" valor={destino} />
          <InfoCard icon={<Package size={19} />} titulo="Tipo do pacote" valor={frete.tipo_carga || frete.tipo_transporte || "Não informado"} />
          <InfoCard icon={<Clock size={19} />} titulo="Data e horário" valor={`${dataBR(dataDoFrete(frete))}${frete.horario ? ` às ${frete.horario}` : ""}`} />
          <InfoCard icon={<FileText size={19} />} titulo="Observação" valor={frete.observacoes || "Sem observação."} maior />
          <InfoCard icon={<Package size={19} />} titulo="Valor" valor={formatarMoeda(frete.valor_frete)} />
        </div>

        <button
          onClick={onIniciar}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] py-4 font-black text-black"
        >
          <CheckCircle2 size={22} />
          Iniciar corrida
        </button>

        <button
          onClick={onFechar}
          className="mt-3 h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] font-black text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

function AgendamentoCard({ frete, onAbrir }: { frete: Frete; onAbrir: () => void }) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <button
      onClick={onAbrir}
      className="w-full rounded-2xl border border-white/10 bg-[#10171b] p-4 text-left transition hover:border-[#ffc400]/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffc400]/15 text-[#ffc400]">
          <CalendarDays size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase text-white/45">
            {dataBR(dataDoFrete(frete))} {frete.horario ? `• ${frete.horario}` : ""}
          </p>
          <h3 className="mt-1 font-black text-white">{frete.tipo_contratante || "Agendamento aceito"}</h3>
          <p className="mt-1 text-sm text-white/60">
            {origem} → {destino}
          </p>
          <p className="mt-2 text-xs font-black text-[#ffc400]">Toque para ver detalhes</p>
        </div>
      </div>
    </button>
  )
}

function InfoCard({ icon, titulo, valor, maior }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffc400]/15 text-[#ffc400]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black uppercase text-white/45">{titulo}</p>
          <p className={`mt-1 font-black text-white ${maior ? "text-sm leading-relaxed" : "text-base"}`}>
            {valor}
          </p>
        </div>
      </div>
    </article>
  )
}

function CardVazio({ texto, menor = false }: { texto: string; menor?: boolean }) {
  return (
    <div className={`rounded-2xl border border-dashed border-white/10 bg-[#10171b] ${menor ? "p-4" : "p-6"} text-center`}>
      <Package className="mx-auto text-[#ffc400]" size={menor ? 26 : 34} />
      <p className="mt-3 text-sm font-bold text-white/60">{texto}</p>
    </div>
  )
}
