"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bike,
  Building2,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Package,
  RefreshCw,
  Truck,
  UserRound,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Tema = "dark" | "light"

type CorridaTempoReal = {
  id: string
  corrida_id?: string | null
  frete_id?: string | null
  empresa_id?: string | null
  cliente_id?: string | null
  motorista_id?: string | null
  origem?: string | null
  destino?: string | null
  cep_origem?: string | null
  cep_destino?: string | null
  tipo_carga?: string | null
  valor_frete?: number | null
  latitude_origem?: number | null
  longitude_origem?: number | null
  latitude_destino?: number | null
  longitude_destino?: number | null
  latitude_motorista?: number | null
  longitude_motorista?: number | null
  latitude?: number | null
  longitude?: number | null
  distancia_restante?: string | null
  tempo_restante?: string | null
  status?: string | null
  veiculo_tipo?: string | null
  tipo_veiculo?: string | null
  veiculo_modelo?: string | null
  veiculo_placa?: string | null
  atualizado_em?: string | null
}

type Frete = {
  id: string
  codigo?: string | null
  empresa_id?: string | null
  cliente_id?: string | null
  motorista_id?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  status?: string | null
  valor_frete?: number | null
  horario?: string | null
  observacoes?: string | null
  created_at?: string | null
}

type Motorista = {
  id: string
  nome?: string | null
  telefone?: string | null
  foto_perfil?: string | null
  tipo_caminhao?: string | null
  modelo_caminhao?: string | null
  placa?: string | null
}

type Cliente = {
  id: string
  nome?: string | null
  email?: string | null
  telefone?: string | null
}

function texto(valor?: string | null) {
  return String(valor || "").trim().toLowerCase()
}

function IconeVeiculo({ tipo, size = 20 }: { tipo: string; size?: number }) {
  const t = texto(tipo)

  if (t.includes("moto")) return <Bike size={size} />
  if (t.includes("carro")) return <Car size={size} />
  if (t.includes("van")) return <Bus size={size} />

  return <Truck size={size} />
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function statusNormalizado(status?: string | null) {
  const s = texto(status)

  if (s.includes("entregue") || s.includes("conclu") || s.includes("finaliz")) {
    return "entregue"
  }

  if (s.includes("rota") || s.includes("caminho") || s.includes("andamento")) {
    return "em_rota"
  }

  if (s.includes("coleta") || s.includes("pegou")) {
    return "coleta"
  }

  if (s.includes("aceito") || s.includes("aceita")) {
    return "aceito"
  }

  return "solicitado"
}

function progressoPorStatus(status?: string | null) {
  const atual = statusNormalizado(status)

  if (atual === "entregue") return 100
  if (atual === "em_rota") return 65
  if (atual === "coleta") return 42
  if (atual === "aceito") return 25

  return 12
}

function etapaAtiva(status: string | null | undefined, etapa: string) {
  const ordem = ["solicitado", "aceito", "coleta", "em_rota", "entregue"]
  return ordem.indexOf(etapa) <= ordem.indexOf(statusNormalizado(status))
}

function statusLegivel(status?: string | null) {
  const atual = statusNormalizado(status)

  if (atual === "entregue") return "Entregue"
  if (atual === "em_rota") return "Em caminho"
  if (atual === "coleta") return "Pegou o pacote"
  if (atual === "aceito") return "Motorista aceitou"

  return "Frete solicitado"
}

function origemFrete(corrida: CorridaTempoReal | null, frete: Frete | null) {
  return (
    corrida?.origem ||
    frete?.origem ||
    frete?.endereco_origem ||
    "Origem não informada"
  )
}

function destinoFrete(corrida: CorridaTempoReal | null, frete: Frete | null) {
  return (
    corrida?.destino ||
    frete?.destino ||
    frete?.endereco_destino ||
    "Destino não informado"
  )
}

function tipoPacote(corrida: CorridaTempoReal | null, frete: Frete | null) {
  return (
    corrida?.tipo_carga ||
    frete?.tipo_carga ||
    frete?.tipo_transporte ||
    "Pacote não informado"
  )
}

export default function MapaEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [corrida, setCorrida] = useState<CorridaTempoReal | null>(null)
  const [frete, setFrete] = useState<Frete | null>(null)
  const [motorista, setMotorista] = useState<Motorista | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [localizacaoEmpresa, setLocalizacaoEmpresa] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [mensagem, setMensagem] = useState("Buscando entregas em tempo real...")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)

    carregarMapa()

    const intervalo = setInterval(() => {
      carregarMapa()
    }, 4000)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoEmpresa({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          setMensagem("Sem entrega ativa. Permita a localização para mostrar a empresa.")
        }
      )
    }

    return () => clearInterval(intervalo)
  }, [])

  async function buscarFretePorCorrida(corridaAtual: CorridaTempoReal) {
    const freteId = corridaAtual.frete_id || corridaAtual.corrida_id

    if (!freteId) return null

    const { data } = await supabase
      .from("fretes")
      .select("*")
      .eq("id", freteId)
      .maybeSingle()

    return (data as Frete | null) || null
  }

  async function buscarFreteAtivoDaEmpresa(empresaId: string) {
    const { data } = await supabase
      .from("fretes")
      .select("*")
      .eq("empresa_id", empresaId)
      .not("motorista_id", "is", null)
      .not("status", "in", "(concluido,concluído,entregue,cancelado)")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return (data as Frete | null) || null
  }

  async function carregarMapa() {
    setCarregando(true)

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setCarregando(false)
      setErro("Empresa não encontrada no login.")
      return
    }

    const { data, error } = await supabase
      .from("corridas_tempo_real")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      setCarregando(false)
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    const corridaAtual = (data as CorridaTempoReal | null) || null
    let freteAtual: Frete | null = null

    if (corridaAtual) {
      freteAtual = await buscarFretePorCorrida(corridaAtual)
    }

    if (!freteAtual) {
      freteAtual = await buscarFreteAtivoDaEmpresa(empresaId)
    }

    setCorrida(corridaAtual)
    setFrete(freteAtual)
    setErro("")
    setMensagem(
      corridaAtual || freteAtual
        ? "Acompanhamento ilustrativo puxando dados em tempo real."
        : "Sem entrega ativa: mostrando a localização da empresa."
    )

    const motoristaId = corridaAtual?.motorista_id || freteAtual?.motorista_id
    const clienteId = corridaAtual?.cliente_id || freteAtual?.cliente_id

    if (motoristaId) {
      const { data: motoristaData } = await supabase
        .from("motoristas")
        .select("id,nome,telefone,foto_perfil,tipo_caminhao,modelo_caminhao,placa")
        .eq("id", motoristaId)
        .maybeSingle()

      setMotorista((motoristaData as Motorista | null) || null)
    } else {
      setMotorista(null)
    }

    if (clienteId) {
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id,nome,email,telefone")
        .eq("id", clienteId)
        .maybeSingle()

      setCliente((clienteData as Cliente | null) || null)
    } else {
      setCliente(null)
    }

    setCarregando(false)
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90" : "border-white/10 bg-[#10171b]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.04]",
    mapa: claro ? "bg-[#dce8d2]" : "bg-[#10171b]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  const latitudeMotorista = Number(
    corrida?.latitude_motorista || corrida?.latitude || 0
  )
  const longitudeMotorista = Number(
    corrida?.longitude_motorista || corrida?.longitude || 0
  )

  const temEntrega =
    Boolean(corrida) ||
    Boolean(frete)

  const temMotoristaNoMapa =
    latitudeMotorista !== 0 && longitudeMotorista !== 0

  const latitudeAtual = temMotoristaNoMapa
    ? latitudeMotorista
    : localizacaoEmpresa?.latitude || 0

  const longitudeAtual = temMotoristaNoMapa
    ? longitudeMotorista
    : localizacaoEmpresa?.longitude || 0

  const tipoVeiculo =
    corrida?.veiculo_tipo ||
    corrida?.tipo_veiculo ||
    motorista?.tipo_caminhao ||
    frete?.tipo_transporte ||
    "caminhao"

  const nomeMotorista = motorista?.nome || (temEntrega ? "Motorista não informado" : "Empresa")
  const nomeCliente = cliente?.nome || "Cliente não informado"
  const origem = origemFrete(corrida, frete)
  const destino = destinoFrete(corrida, frete)
  const pacote = tipoPacote(corrida, frete)
  const status = corrida?.status || frete?.status || "Sem entrega ativa"
  const progresso = progressoPorStatus(status)
  const valor = corrida?.valor_frete || frete?.valor_frete || 0
  const tempo = corrida?.tempo_restante || "Calculando"
  const distancia = corrida?.distancia_restante || "Atualizando"

  const mapaUrl =
    latitudeAtual && longitudeAtual
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitudeAtual - 0.02}%2C${latitudeAtual - 0.02}%2C${longitudeAtual + 0.02}%2C${latitudeAtual + 0.02}&layer=mapnik&marker=${latitudeAtual}%2C${longitudeAtual}`
      : ""

  const entregasAtivas = useMemo(() => {
    if (!temEntrega) return 0
    return 1
  }, [temEntrega])

  return (
    <main className={`min-h-screen px-4 py-6 sm:px-8 ${ui.pagina}`}>
      <div className="mx-auto max-w-[1240px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
            <h1 className="text-3xl font-black sm:text-4xl">Mapa de Entregas</h1>
            <p className={`mt-2 max-w-[720px] text-sm ${ui.textoFraco}`}>
              Mapa ilustrativo com dados reais do Supabase e localização em tempo real.
            </p>
          </div>

          <button
            type="button"
            onClick={carregarMapa}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 font-black text-[#ffc400]"
          >
            <RefreshCw size={18} className={carregando ? "animate-spin" : ""} />
            Atualizar
          </button>
        </header>

        {erro && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="mt-8 grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className={`rounded-[28px] border p-5 ${ui.card}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {temEntrega ? "Entrega em andamento" : "Localização da empresa"}
              </h2>

              <span className="rounded-full bg-[#ffc400] px-3 py-1 text-xs font-black text-black">
                {entregasAtivas}
              </span>
            </div>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                  {temEntrega ? <IconeVeiculo tipo={tipoVeiculo} /> : <Building2 size={22} />}
                </div>

                <div className="min-w-0">
                  <h3 className="font-black">
                    {temEntrega ? nomeMotorista : "Empresa"}
                  </h3>

                  <p className={`text-xs ${ui.textoFraco}`}>
                    {temEntrega
                      ? `${motorista?.modelo_caminhao || corrida?.veiculo_modelo || tipoVeiculo} • ${motorista?.placa || corrida?.veiculo_placa || "Sem placa"}`
                      : "Sede / ponto da empresa"}
                  </p>

                  <p className="mt-2 text-xs font-bold text-green-400">
                    📍 {temEntrega ? origem : "Local atual da empresa"}
                  </p>

                  {temEntrega && (
                    <p className="text-xs font-bold text-red-400">
                      📍 {destino}
                    </p>
                  )}

                  <p className="mt-1 text-xs font-bold text-[#ffc400]">
                    {mensagem}
                  </p>
                </div>
              </div>
            </div>

            {temEntrega && (
              <div className={`mt-4 rounded-2xl border p-4 ${ui.card2}`}>
                <p className="text-xs font-black uppercase text-white/40">
                  Resumo
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <LinhaResumo label="Motorista" valor={nomeMotorista} />
                  <LinhaResumo label="Cliente" valor={nomeCliente} />
                  <LinhaResumo label="Pacote" valor={pacote} />
                  <LinhaResumo label="Status" valor={statusLegivel(status)} amarelo />
                </div>
              </div>
            )}
          </aside>

          <section className={`overflow-hidden rounded-[28px] border ${ui.card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <h2 className="text-xl font-black">
                  {temEntrega ? "Mapa da entrega" : "Mapa da empresa"}
                </h2>

                <p className={`text-sm ${ui.textoFraco}`}>
                  {temEntrega ? `${origem} → ${destino}` : "Localização atual pelo GPS"}
                </p>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">
                {temEntrega ? statusLegivel(status) : "Empresa"}
              </span>
            </div>

            <div className={`relative h-[470px] overflow-hidden ${ui.mapa}`}>
              {mapaUrl ? (
                <>
                  <iframe
                    title="Mapa em tempo real"
                    src={mapaUrl}
                    className="h-full w-full border-0"
                  />

                  {temEntrega && (
                    <>
                      <div className="pointer-events-none absolute left-[22%] top-[62%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_25px_rgba(34,197,94,0.7)]">
                          <MapPin size={24} />
                        </div>
                        <div className="mt-2 rounded-xl bg-black/85 px-3 py-2 text-xs font-black text-white">
                          Origem
                        </div>
                      </div>

                      <div className="pointer-events-none absolute right-[22%] top-[40%] flex translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)]">
                          <MapPin size={24} />
                        </div>
                        <div className="mt-2 rounded-xl bg-black/85 px-3 py-2 text-xs font-black text-white">
                          Destino
                        </div>
                      </div>

                      <div className="pointer-events-none absolute left-[22%] top-[56%] h-[5px] w-[56%] -rotate-[14deg] rounded-full bg-white/65" />
                      <div
                        className="pointer-events-none absolute left-[22%] top-[56%] h-[5px] -rotate-[14deg] rounded-full bg-[#ffc400] shadow-[0_0_18px_rgba(255,196,0,0.7)]"
                        style={{ width: `${Math.max(8, progresso * 0.56)}%` }}
                      />
                    </>
                  )}

                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                      {temEntrega ? (
                        <IconeVeiculo tipo={tipoVeiculo} size={30} />
                      ) : (
                        <Building2 size={32} />
                      )}
                    </div>

                    <div className="mt-2 rounded-full bg-black/85 px-3 py-1 text-xs font-black text-[#ffc400]">
                      {temEntrega ? nomeMotorista : "Empresa aqui"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <div>
                    <MapPin className="mx-auto text-[#ffc400]" size={44} />
                    <h3 className="mt-4 text-xl font-black">Aguardando localização</h3>
                    <p className="mt-2 text-sm text-white/60">
                      Permita o GPS ou aguarde a localização do motorista no Supabase.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl bg-black/75 p-3 backdrop-blur-md sm:grid-cols-4">
                <InfoMapa icon={<Package size={16} />} label="Pacote" valor={temEntrega ? pacote : "Empresa"} />
                <InfoMapa icon={temEntrega ? <IconeVeiculo tipo={tipoVeiculo} size={16} /> : <Building2 size={16} />} label="Motorista" valor={temEntrega ? nomeMotorista : "Empresa"} />
                <InfoMapa icon={<Clock size={16} />} label="Tempo" valor={temEntrega ? tempo : "Local atual"} />
                <InfoMapa icon={<Navigation size={16} />} label="GPS" valor={temEntrega ? distancia : "Aguardando"} />
              </div>
            </div>
          </section>
        </section>

        <section className={`mt-5 rounded-[28px] border p-5 ${ui.card}`}>
          <div className="grid gap-5 lg:grid-cols-[220px_1fr_220px]">
            <div>
              <p className="text-xs font-black uppercase text-white/40">Entrega</p>
              <h3 className="mt-1 text-xl font-black">
                {frete?.codigo ? `#${frete.codigo}` : temEntrega ? "Entrega ativa" : "Sem entrega ativa"}
              </h3>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>{nomeMotorista}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black">Progresso da entrega</p>
                <p className="text-xl font-black text-[#ffc400]">{temEntrega ? `${progresso}%` : "0%"}</p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#ffc400] shadow-[0_0_18px_rgba(255,196,0,0.4)]"
                  style={{ width: temEntrega ? `${progresso}%` : "0%" }}
                />
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                <Etapa
                  ativa={temEntrega && etapaAtiva(status, "solicitado")}
                  titulo="Frete solicitado"
                  texto="Pedido criado"
                />
                <Etapa
                  ativa={temEntrega && etapaAtiva(status, "coleta")}
                  titulo="Pegou o pacote"
                  texto="Coleta feita"
                />
                <Etapa
                  ativa={temEntrega && etapaAtiva(status, "em_rota")}
                  titulo="Em caminho"
                  texto="Indo ao destino"
                />
                <Etapa
                  ativa={temEntrega && etapaAtiva(status, "entregue")}
                  titulo="Entregue"
                  texto="Finalizado"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase text-white/40">
                Previsão
              </p>
              <h3 className="mt-1 text-3xl font-black text-[#ffc400]">
                {temEntrega ? tempo : "--"}
              </h3>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                {temEntrega ? distancia : "Sem rota ativa"}
              </p>

              <p className="mt-4 text-xs font-black uppercase text-white/40">
                Valor
              </p>
              <p className="mt-1 text-lg font-black">
                {temEntrega ? formatarMoeda(valor) : "R$ 0,00"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function LinhaResumo({
  label,
  valor,
  amarelo,
}: {
  label: string
  valor: string
  amarelo?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
      <span className="text-white/45">{label}</span>
      <span className={`text-right font-black ${amarelo ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </span>
    </div>
  )
}

function InfoMapa({ icon, label, valor }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
      <p className="flex items-center gap-1 text-xs font-bold text-[#ffc400]">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-white">{valor}</p>
    </div>
  )
}

function Etapa({
  ativa,
  titulo,
  texto,
}: {
  ativa: boolean
  titulo: string
  texto: string
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border ${
          ativa
            ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_20px_rgba(255,196,0,0.35)]"
            : "border-white/20 bg-white/[0.04] text-white/35"
        }`}
      >
        <CheckCircle2 size={20} />
      </div>

      <p className={`mt-2 text-[11px] font-black ${ativa ? "text-[#ffc400]" : "text-white/45"}`}>
        {titulo}
      </p>
      <p className="mt-1 text-[10px] text-white/35">{texto}</p>
    </div>
  )
}
