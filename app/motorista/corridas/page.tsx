"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  Clock,
  MapPin,
  Package,
  RefreshCw,
  X,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Frete = {
  id: string
  codigo?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  cep_origem?: string | null
  cep_destino?: string | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  descricao_carga?: string | null
  status?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor?: string | null
  valor_frete?: number | null
  observacoes?: string | null
  motorista_id?: string | null
  created_at?: string | null
}

type MotoristaConfig = {
  id: string
  regioes_atuacao?: string[] | null
}

type TipoAba = "hoje" | "agendadas"

const estadosBrasil = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
]

function hojeISO() {
  const data = new Date()
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function formatarMoeda(frete: Frete) {
  if (typeof frete.valor_frete === "number" && frete.valor_frete > 0) {
    return frete.valor_frete.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return frete.valor || "A calcular"
}

function formatarDataBR(data?: string | null) {
  if (!data) return "Sem data"
  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")
  if (partes.length !== 3) return limpa
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function dataDoFrete(frete: Frete) {
  const data = String(frete.data_frete || frete.data_entrega || frete.created_at || "").trim()

  if (!data) return ""

  if (data.includes("/")) {
    const partes = data.split("/")
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`
    }
  }

  return data.slice(0, 10)
}

function statusDisponivel(frete: Frete) {
  const status = texto(frete.status)

  const bloqueado =
    status.includes("aceito") ||
    status.includes("andamento") ||
    status.includes("rota") ||
    status.includes("conclu") ||
    status.includes("entregue") ||
    status.includes("finaliz") ||
    status.includes("cancel")

  return !bloqueado
}

function freteCombinaComRegiaoMotorista(frete: Frete, regioes: string[]) {
  if (!regioes.length) return true

  const textoFrete = [
    frete.origem,
    frete.destino,
    frete.endereco_origem,
    frete.endereco_destino,
    frete.cep_origem,
    frete.cep_destino,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (!textoFrete.trim()) return true

  return regioes.some((regiao) => {
    if (regiao.startsWith("ESTADO:")) {
      const uf = regiao.replace("ESTADO:", "")
      const estado = estadosBrasil.find((item) => item.uf === uf)

      if (!estado) return false

      return (
        textoFrete.includes(estado.nome.toLowerCase()) ||
        textoFrete.includes(` ${uf.toLowerCase()} `) ||
        textoFrete.includes(`-${uf.toLowerCase()}`) ||
        textoFrete.includes(`${uf.toLowerCase()},`) ||
        textoFrete.includes(`/${uf.toLowerCase()}`)
      )
    }

    if (regiao.startsWith("CIDADE:")) {
      const partes = regiao.split(":")
      const uf = partes[1] || ""
      const cidade = partes[2] || ""

      return textoFrete.includes(cidade.toLowerCase()) || textoFrete.includes(uf.toLowerCase())
    }

    return textoFrete.includes(regiao.toLowerCase())
  })
}

function ehDisponivelHoje(frete: Frete, regioes: string[]) {
  return (
    !frete.motorista_id &&
    dataDoFrete(frete) === hojeISO() &&
    statusDisponivel(frete) &&
    freteCombinaComRegiaoMotorista(frete, regioes)
  )
}

function ehDisponivelAgendado(frete: Frete, regioes: string[]) {
  const dataFrete = dataDoFrete(frete)

  return (
    !frete.motorista_id &&
    dataFrete > hojeISO() &&
    statusDisponivel(frete) &&
    freteCombinaComRegiaoMotorista(frete, regioes)
  )
}

function minutosAteHorarioHoje(horario?: string | null) {
  if (!horario || horario === "Agora") return 0

  const match = horario.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return 0

  const agora = new Date()
  const alvo = new Date()
  alvo.setHours(Number(match[1]), Number(match[2]), 0, 0)

  return alvo.getTime() - agora.getTime()
}

function pedirPermissaoNotificacao() {
  if (typeof window === "undefined") return

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}

function avisarHorario(frete: Frete) {
  if (typeof window === "undefined") return

  const ms = minutosAteHorarioHoje(frete.horario)
  if (ms <= 0) return

  window.setTimeout(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("FlatAuto Motorista", {
        body: `Está na hora da coleta do frete ${frete.codigo || String(frete.id).slice(0, 6)}.`,
      })
      return
    }

    alert(`Está na hora da coleta do frete ${frete.codigo || String(frete.id).slice(0, 6)}.`)
  }, ms)
}

export default function MotoristaSubPage() {
  const [aba, setAba] = useState<TipoAba>("hoje")
  const [corridasHoje, setCorridasHoje] = useState<Frete[]>([])
  const [corridasAgendadas, setCorridasAgendadas] = useState<Frete[]>([])
  const [regioesMotorista, setRegioesMotorista] = useState<string[]>([])
  const [freteAberto, setFreteAberto] = useState<Frete | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [aceitandoId, setAceitandoId] = useState("")

  useEffect(() => {
    pedirPermissaoNotificacao()
    carregarCorridasDisponiveis()
  }, [])

  async function carregarRegioesMotorista(motoristaId: string) {
    const { data } = await supabase
      .from("motoristas")
      .select("id,regioes_atuacao")
      .eq("id", motoristaId)
      .maybeSingle()

    const motorista = data as MotoristaConfig | null
    const regioes = Array.isArray(motorista?.regioes_atuacao) ? motorista.regioes_atuacao : []

    setRegioesMotorista(regioes)
    return regioes
  }

  async function carregarCorridasDisponiveis() {
    setCarregando(true)
    setErro("")

    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      setErro("Motorista não encontrado no login.")
      setCorridasHoje([])
      setCorridasAgendadas([])
      setCarregando(false)
      return
    }

    const regioes = await carregarRegioesMotorista(motoristaId)

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .is("motorista_id", null)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCorridasHoje([])
      setCorridasAgendadas([])
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []

    setCorridasHoje(lista.filter((frete) => ehDisponivelHoje(frete, regioes)))
    setCorridasAgendadas(lista.filter((frete) => ehDisponivelAgendado(frete, regioes)))
    setCarregando(false)
  }

  async function aceitarCorrida(frete: Frete) {
    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      alert("Motorista não encontrado no login.")
      return
    }

    setAceitandoId(frete.id)

    const statusNovo = dataDoFrete(frete) === hojeISO() ? "em_andamento" : "agendado_aceito"

    const { data, error } = await supabase
      .from("fretes")
      .update({
        motorista_id: motoristaId,
        status: statusNovo,
      })
      .eq("id", frete.id)
      .is("motorista_id", null)
      .select("*")

    if (error) {
      setAceitandoId("")
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    if (!data || data.length === 0) {
      setAceitandoId("")
      alert("Esse frete já foi aceito por outro motorista. Atualize a lista.")
      await carregarCorridasDisponiveis()
      return
    }

    const freteAtualizado = data[0] as Frete

    setFreteAberto(null)
    setCorridasHoje((lista) => lista.filter((item) => item.id !== frete.id))
    setCorridasAgendadas((lista) => lista.filter((item) => item.id !== frete.id))

    if (statusNovo === "em_andamento") {
      avisarHorario(freteAtualizado)
    }

    setTimeout(async () => {
      setAceitandoId("")
      await carregarCorridasDisponiveis()
      window.location.href = "/motorista/em-andamento"
    }, 5000)
  }

  const corridasVisiveis = aba === "hoje" ? corridasHoje : corridasAgendadas

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Corridas disponíveis</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Bike size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Fretes disponíveis</h2>
          <p className="mt-2 text-sm text-white/60">
            Fretes de hoje ficam em Hoje. Fretes de outro dia ficam em Agendadas.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setAba("hoje")}
              className={`h-12 rounded-xl text-sm font-black ${
                aba === "hoje"
                  ? "bg-[#ffc400] text-black"
                  : "border border-white/10 bg-white/[0.04] text-white/60"
              }`}
            >
              Hoje ({corridasHoje.length})
            </button>

            <button
              onClick={() => setAba("agendadas")}
              className={`h-12 rounded-xl text-sm font-black ${
                aba === "agendadas"
                  ? "bg-[#ffc400] text-black"
                  : "border border-white/10 bg-white/[0.04] text-white/60"
              }`}
            >
              Agendadas ({corridasAgendadas.length})
            </button>
          </div>

          <button
            onClick={carregarCorridasDisponiveis}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-[#ffc400]"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>

          <p className="mt-3 text-xs font-bold text-white/35">
            Região: {regioesMotorista.length ? `${regioesMotorista.length} região(ões) selecionada(s)` : "Brasil todo"}
          </p>
        </section>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
            Carregando corridas do Supabase...
          </div>
        ) : corridasVisiveis.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-6 text-center">
            <Package className="mx-auto text-[#ffc400]" size={34} />
            <h3 className="mt-3 font-black">
              Nenhuma corrida {aba === "hoje" ? "de hoje" : "agendada"} disponível
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Quando cliente ou empresa chamar um frete compatível com sua região, ele aparece aqui.
            </p>
          </div>
        ) : (
          <section className="space-y-3">
            {corridasVisiveis.map((frete) => (
              <Card
                key={frete.id}
                frete={frete}
                aceitando={aceitandoId === frete.id}
                tipo={aba}
                onVerMais={() => setFreteAberto(frete)}
                onAceitar={() => aceitarCorrida(frete)}
              />
            ))}
          </section>
        )}
      </div>

      {freteAberto && (
        <ModalDetalhes
          frete={freteAberto}
          aceitando={aceitandoId === freteAberto.id}
          onFechar={() => setFreteAberto(null)}
          onAceitar={() => aceitarCorrida(freteAberto)}
        />
      )}
    </main>
  )
}

function Card({
  frete,
  onAceitar,
  onVerMais,
  aceitando,
  tipo,
}: {
  frete: Frete
  onAceitar: () => void
  onVerMais: () => void
  aceitando: boolean
  tipo: TipoAba
}) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <article className={`rounded-2xl border p-4 ${aceitando ? "border-green-500/40 bg-green-500/10" : "border-white/10 bg-[#10171b]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{frete.codigo ? `#${frete.codigo}` : "Frete disponível"}</h3>

          <p className="mt-2 flex gap-2 text-sm text-white/70">
            <MapPin size={16} className="text-[#ffc400]" />
            {origem} → {destino}
          </p>
        </div>

        <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-1 text-[10px] font-black text-[#ffc400]">
          {tipo === "hoje" ? "Hoje" : "Agendado"}
        </span>
      </div>

      <p className="mt-3 flex gap-2 text-sm text-white/60">
        <Package size={16} className="text-[#ffc400]" />
        {frete.tipo_carga || frete.tipo_transporte || "Tipo não informado"}
      </p>

      <p className="mt-2 flex gap-2 text-sm text-white/60">
        <Clock size={16} className="text-[#ffc400]" />
        {frete.horario || "Horário não informado"}
      </p>

      <p className="mt-3 text-lg font-black text-[#ffc400]">
        {formatarMoeda(frete)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onVerMais}
          disabled={aceitando}
          className="h-12 rounded-xl border border-white/10 bg-white/[0.04] font-black text-white"
        >
          Ver mais
        </button>

        <button
          onClick={onAceitar}
          disabled={aceitando}
          className={`h-12 rounded-xl font-black ${
            aceitando ? "bg-green-500 text-white" : "bg-[#ffc400] text-black"
          }`}
        >
          {aceitando ? "Aceita..." : "Aceitar"}
        </button>
      </div>
    </article>
  )
}

function ModalDetalhes({
  frete,
  onFechar,
  onAceitar,
  aceitando,
}: {
  frete: Frete
  onFechar: () => void
  onAceitar: () => void
  aceitando: boolean
}) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 px-4 pb-5 sm:items-center sm:pb-0">
      <div className="max-h-[88vh] w-full max-w-[460px] overflow-y-auto rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[#ffc400]">Detalhes do frete</p>
            <h2 className="mt-1 text-2xl font-black">
              {frete.codigo ? `#${frete.codigo}` : "Frete disponível"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <Info titulo="Origem" valor={origem} />
          <Info titulo="Destino" valor={destino} />
          <Info titulo="Data" valor={formatarDataBR(dataDoFrete(frete))} />
          <Info titulo="Horário" valor={frete.horario || "Horário não informado"} />
          <Info titulo="Tipo de pacote" valor={frete.tipo_carga || frete.tipo_transporte || "Tipo não informado"} />
          <Info titulo="Transporte" valor={frete.tipo_transporte || "Não informado"} />
          <Info titulo="Valor" valor={formatarMoeda(frete)} destaque />
          <Info titulo="Observação" valor={frete.observacoes || frete.descricao_carga || "Sem observação."} />
        </div>

        <button
          type="button"
          onClick={onAceitar}
          disabled={aceitando}
          className={`mt-5 h-14 w-full rounded-2xl font-black ${
            aceitando ? "bg-green-500 text-white" : "bg-[#ffc400] text-black"
          }`}
        >
          {aceitando ? "Aceita. Indo para andamento..." : "Aceitar frete"}
        </button>
      </div>
    </div>
  )
}

function Info({
  titulo,
  valor,
  destaque,
}: {
  titulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4">
      <p className="text-xs font-black uppercase text-white/40">{titulo}</p>
      <p className={`mt-1 font-black ${destaque ? "text-xl text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </div>
  )
}
