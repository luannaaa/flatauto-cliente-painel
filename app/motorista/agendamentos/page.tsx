"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, CheckCircle2, RefreshCw, X } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Frete = {
  id: string
  codigo?: string | null
  cliente_id?: string | null
  empresa_id?: string | null
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
  aceito_em?: string | null
  created_at?: string | null
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function texto(valor?: string | null) {
  return String(valor || "").trim().toLowerCase()
}

function dataDoFrete(frete: Frete) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return String(data).slice(0, 10)
}

function statusDisponivel(status?: string | null) {
  const s = texto(status)
  return (
    s === "" ||
    s.includes("aguardando") ||
    s.includes("disponivel") ||
    s.includes("disponível") ||
    s.includes("pendente")
  )
}

function statusAceito(status?: string | null) {
  const s = texto(status)
  return s.includes("agendado_aceito") || s.includes("aceito")
}

function dentroDos5Minutos(data?: string | null) {
  if (!data) return true
  const tempo = new Date(data).getTime()
  if (Number.isNaN(tempo)) return true
  return Date.now() - tempo < 5 * 60 * 1000
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(data: string, horario?: string | null) {
  if (!data) return horario || "Sem horário"
  const partes = data.split("-")
  const dataBR = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data
  return horario ? `${dataBR} às ${horario}` : dataBR
}

function pegarMotoristaId() {
  const chavesDiretas = ["flatauto_motorista_id", "motorista_id"]

  for (const chave of chavesDiretas) {
    const valor = localStorage.getItem(chave)
    if (valor && valor !== "true" && valor !== "false") return valor
  }

  const chavesJson = ["flatauto_motorista_dados", "motoristaLogado", "flatauto_motorista_logado_dados"]

  for (const chave of chavesJson) {
    const bruto = localStorage.getItem(chave)
    if (!bruto || bruto === "true" || bruto === "false") continue

    try {
      const obj = JSON.parse(bruto)
      if (obj?.id) return String(obj.id)
    } catch {}
  }

  return ""
}

function origemFrete(frete: Frete) {
  return frete.origem || frete.endereco_origem || "Origem não informada"
}

function destinoFrete(frete: Frete) {
  return frete.destino || frete.endereco_destino || "Destino não informado"
}

export default function AgendamentosMotoristaPage() {
  const [fretes, setFretes] = useState<Frete[]>([])
  const [selecionado, setSelecionado] = useState<Frete | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvandoId, setSalvandoId] = useState("")
  const [erro, setErro] = useState("")
  const [ok, setOk] = useState("")
  const [motoristaId, setMotoristaId] = useState("")

  useEffect(() => {
    setMotoristaId(pegarMotoristaId())
    carregarAgendamentos()
    const intervalo = setInterval(carregarAgendamentos, 15000)
    return () => clearInterval(intervalo)
  }, [])

  async function carregarAgendamentos() {
    setCarregando(true)
    setErro("")

    const { data, error } = await supabase
      .from("fretes")
      .select(
        "id,codigo,cliente_id,empresa_id,motorista_id,origem,destino,endereco_origem,endereco_destino,tipo_carga,tipo_transporte,status,data_frete,data_entrega,horario,valor_frete,observacoes,aceito_em,created_at"
      )
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      setCarregando(false)
      return
    }

    setFretes(Array.isArray(data) ? data : [])
    setCarregando(false)
  }

  const agendamentosFuturos = useMemo(() => {
    return fretes.filter((frete) => dataDoFrete(frete) > hojeISO())
  }, [fretes])

  const disponiveis = useMemo(() => {
    return agendamentosFuturos.filter((frete) => !frete.motorista_id && statusDisponivel(frete.status))
  }, [agendamentosFuturos])

  const meusAceitos = useMemo(() => {
    return agendamentosFuturos.filter(
      (frete) => frete.motorista_id === motoristaId && statusAceito(frete.status)
    )
  }, [agendamentosFuturos, motoristaId])

  const indisponiveisRecentes = useMemo(() => {
    return agendamentosFuturos.filter(
      (frete) =>
        Boolean(frete.motorista_id) &&
        frete.motorista_id !== motoristaId &&
        statusAceito(frete.status) &&
        dentroDos5Minutos(frete.aceito_em)
    )
  }, [agendamentosFuturos, motoristaId])

  async function aceitarAgendamento(frete: Frete) {
    const idMotorista = motoristaId || pegarMotoristaId()

    if (!idMotorista) {
      alert("Motorista não encontrado no login. Saia e entre de novo como motorista.")
      return
    }

    if (frete.motorista_id) {
      setErro("Esse agendamento já foi aceito.")
      return
    }

    const aceitoAgora = new Date().toISOString()
    setSalvandoId(frete.id)
    setErro("")
    setOk("")

    const { data: atualizado, error: updateError } = await supabase
      .from("fretes")
      .update({
        motorista_id: idMotorista,
        status: "agendado_aceito",
        aceito_em: aceitoAgora,
      })
      .eq("id", frete.id)
      .is("motorista_id", null)
      .select(
        "id,codigo,cliente_id,empresa_id,motorista_id,origem,destino,endereco_origem,endereco_destino,tipo_carga,tipo_transporte,status,data_frete,data_entrega,horario,valor_frete,observacoes,aceito_em,created_at"
      )

    if (updateError) {
      setSalvandoId("")
      setErro(`Erro Supabase ao salvar: ${updateError.message}`)
      return
    }

    const linha = Array.isArray(atualizado) ? atualizado[0] : null

    if (!linha || linha.motorista_id !== idMotorista || !statusAceito(linha.status)) {
      setSalvandoId("")
      setErro("Não salvou no Supabase. Atualize a lista e tente novamente.")
      await carregarAgendamentos()
      return
    }

    setFretes((lista) => lista.map((item) => (item.id === linha.id ? linha : item)))
    setSelecionado(null)
    setOk("Agendamento aceito e salvo no Supabase.")
    setSalvandoId("")

    await carregarAgendamentos()
  }

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[430px] space-y-5">
        <header className="flex items-center gap-3">
          <Link href="/motorista" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <ArrowLeft size={22} />
          </Link>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Agendamentos</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <CalendarDays size={30} />
          </div>

          <h2 className="mt-4 text-xl font-black">Agendamentos na região</h2>
          <p className="mt-2 text-sm text-white/60">
            Disponíveis para aceitar. Quando você aceitar, ele fica salvo na sua agenda.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Resumo label="Disponíveis" valor={disponiveis.length} cor="text-[#ffc400]" />
            <Resumo label="Minha agenda" valor={meusAceitos.length} cor="text-green-400" />
            <Resumo label="Indisp." valor={indisponiveisRecentes.length} cor="text-red-400" />
          </div>

          <button onClick={carregarAgendamentos} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-[#ffc400]">
            <RefreshCw size={18} />
            Atualizar
          </button>
        </section>

        {erro && <Aviso tipo="erro" texto={erro} />}
        {ok && <Aviso tipo="ok" texto={ok} />}

        {carregando ? (
          <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
            Carregando agendamentos do Supabase...
          </div>
        ) : (
          <>
            <Bloco titulo="Disponíveis" vazio="Nenhum agendamento disponível agora.">
              {disponiveis.map((frete) => (
                <Card key={frete.id} frete={frete} tipo="disponivel" onClick={() => setSelecionado(frete)} />
              ))}
            </Bloco>

            <Bloco titulo="Minha agenda aceita" vazio="Você ainda não aceitou nenhum agendamento.">
              {meusAceitos.map((frete) => (
                <Card key={frete.id} frete={frete} tipo="meu" onClick={() => setSelecionado(frete)} />
              ))}
            </Bloco>

            {indisponiveisRecentes.length > 0 && (
              <Bloco titulo="Indisponíveis recentes" vazio="">
                {indisponiveisRecentes.map((frete) => (
                  <Card key={frete.id} frete={frete} tipo="indisponivel" onClick={() => setSelecionado(frete)} />
                ))}
              </Bloco>
            )}
          </>
        )}
      </div>

      {selecionado && (
        <Modal
          frete={selecionado}
          motoristaId={motoristaId}
          salvando={salvandoId === selecionado.id}
          onFechar={() => setSelecionado(null)}
          onAceitar={() => aceitarAgendamento(selecionado)}
        />
      )}
    </main>
  )
}

function Resumo({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="text-[10px] font-black text-white/50">{label}</p>
      <p className={`mt-2 text-xl font-black ${cor}`}>{valor}</p>
    </div>
  )
}

function Bloco({ titulo, vazio, children }: { titulo: string; vazio: string; children: any }) {
  const lista = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : []

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-black">{titulo}</h2>
      {lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
          {vazio}
        </div>
      ) : (
        lista
      )}
    </section>
  )
}

function Card({ frete, tipo, onClick }: { frete: Frete; tipo: "disponivel" | "meu" | "indisponivel"; onClick: () => void }) {
  const origem = origemFrete(frete)
  const destino = destinoFrete(frete)
  const data = dataDoFrete(frete)

  const estilo =
    tipo === "meu"
      ? "border-green-500/40 bg-green-500/10"
      : tipo === "indisponivel"
        ? "border-red-500/40 bg-red-500/10"
        : "border-white/10 bg-[#10171b] hover:border-[#ffc400]/40"

  const badge =
    tipo === "meu"
      ? "Aceito por você"
      : tipo === "indisponivel"
        ? "Indisponível"
        : "Disponível"

  const badgeClasse =
    tipo === "meu"
      ? "bg-green-500/20 text-green-300"
      : tipo === "indisponivel"
        ? "bg-red-500/20 text-red-300"
        : "bg-[#ffc400]/15 text-[#ffc400]"

  return (
    <article onClick={onClick} className={`cursor-pointer rounded-2xl border p-4 transition ${estilo}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-black">{frete.empresa_id ? "Solicitação da empresa" : "Solicitação de frete"}</h3>
          <p className="mt-1 text-sm text-white/70">{origem} → {destino}</p>
          <p className="mt-2 text-sm font-bold text-[#ffc400]">{formatarData(data, frete.horario)}</p>
          <p className="mt-2 text-xs font-bold text-white/45">{frete.tipo_carga || frete.tipo_transporte || "Tipo não informado"}</p>
        </div>

        <span className={`rounded-full px-3 py-1 text-[10px] font-black ${badgeClasse}`}>{badge}</span>
      </div>
    </article>
  )
}

function Modal({
  frete,
  motoristaId,
  salvando,
  onFechar,
  onAceitar,
}: {
  frete: Frete
  motoristaId: string
  salvando: boolean
  onFechar: () => void
  onAceitar: () => void
}) {
  const meu = frete.motorista_id === motoristaId && statusAceito(frete.status)
  const aceitoPorOutro = Boolean(frete.motorista_id) && !meu
  const disponivel = !frete.motorista_id && statusDisponivel(frete.status)
  const origem = origemFrete(frete)
  const destino = destinoFrete(frete)
  const data = dataDoFrete(frete)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="max-h-[82vh] w-full max-w-[360px] overflow-y-auto rounded-[24px] border border-white/10 bg-[#10171b] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#ffc400]">DETALHES</p>
            <h2 className="mt-1 text-lg font-black">Agendamento</h2>
          </div>

          <button onClick={onFechar} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <Detalhe titulo="Origem" valor={origem} />
          <Detalhe titulo="Destino" valor={destino} />
          <Detalhe titulo="Tipo" valor={frete.tipo_carga || frete.tipo_transporte || "Tipo não informado"} />
          <Detalhe titulo="Horário" valor={formatarData(data, frete.horario)} />
          <Detalhe titulo="Valor" valor={formatarMoeda(frete.valor_frete)} />
          <Detalhe titulo="Observação" valor={frete.observacoes || "Sem observação."} />
          {meu && <Detalhe titulo="Status" valor="Aceito por você e salvo no Supabase" />}
          {aceitoPorOutro && <Detalhe titulo="Status" valor="Indisponível: aceito por outro motorista" />}
        </div>

        <button
          onClick={onAceitar}
          disabled={!disponivel || salvando}
          className={`mt-4 h-12 w-full rounded-2xl font-black ${
            disponivel && !salvando ? "bg-[#ffc400] text-black" : "cursor-not-allowed bg-white/10 text-white/40"
          }`}
        >
          {meu ? "Aceito por você" : aceitoPorOutro ? "Indisponível" : salvando ? "Salvando..." : "Aceitar agendamento"}
        </button>
      </div>
    </div>
  )
}

function Detalhe({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[11px] font-black uppercase text-white/45">{titulo}</p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}

function Aviso({ tipo, texto }: { tipo: "erro" | "ok"; texto: string }) {
  return (
    <div className={`rounded-2xl border p-4 text-sm font-bold ${tipo === "erro" ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-green-500/30 bg-green-500/10 text-green-400"}`}>
      {texto}
    </div>
  )
}
