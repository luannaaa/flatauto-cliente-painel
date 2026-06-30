"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Navigation,
  Package,
  Play,
  Truck,
  UserRound,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

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
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor?: string | null
  valor_frete?: number | null
  observacoes?: string | null
  descricao_carga?: string | null
  created_at?: string | null
}

type Cliente = {
  id: string
  nome?: string | null
  telefone?: string | null
  email?: string | null
}

type Localizacao = {
  latitude: number
  longitude: number
  accuracy?: number
}

const etapas = [
  { id: "aceito", titulo: "Aceito", texto: "Solicitação aceita" },
  { id: "coleta", titulo: "Buscar pacote", texto: "Indo para coleta" },
  { id: "em_rota", titulo: "Pacote pego", texto: "Indo entregar" },
  { id: "entregue", titulo: "Entregue", texto: "Finalizado" },
]

function MotoNova({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="17" cy="45" r="9" stroke="currentColor" strokeWidth="5" />
      <circle cx="48" cy="45" r="9" stroke="currentColor" strokeWidth="5" />
      <path
        d="M18 45h10l8-16h8l6 16M28 45l-9-16h11l8 16M37 29l8-8h8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 21h10"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconeVeiculo({
  tipo,
  size = 28,
}: {
  tipo: Veiculo | string
  size?: number
}) {
  const limpo = String(tipo || "").toLowerCase()

  const estilo = {
    fontSize: `${size}px`,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const

  if (limpo.includes("moto")) return <span style={estilo}>🏍️</span>
  if (limpo.includes("carro")) return <span style={estilo}>🚗</span>
  if (limpo.includes("suv")) return <span style={estilo}>🚙</span>
  if (limpo.includes("van")) return <span style={estilo}>🚐</span>
  if (limpo.includes("vuc")) return <span style={estilo}>🚚</span>
  if (limpo.includes("bike")) return <span style={estilo}>🚲</span>

  return <span style={estilo}>🚛</span>
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function etapaAtual(status?: string | null) {
  const s = texto(status)

  if (s.includes("entregue") || s.includes("conclu") || s.includes("finaliz")) return "entregue"
  if (s.includes("rota") || s.includes("caminho")) return "em_rota"
  if (s.includes("coleta") || s.includes("buscar") || s.includes("pegando")) return "coleta"
  if (s.includes("aceito") || s.includes("aceita") || s.includes("andamento")) return "aceito"

  return "aceito"
}

function progresso(status?: string | null) {
  const etapa = etapaAtual(status)

  if (etapa === "entregue") return 100
  if (etapa === "em_rota") return 70
  if (etapa === "coleta") return 42
  return 18
}

function etapaAtiva(status: string | null | undefined, etapa: string) {
  const ordem = ["aceito", "coleta", "em_rota", "entregue"]
  return ordem.indexOf(etapa) <= ordem.indexOf(etapaAtual(status))
}

function statusTexto(status?: string | null) {
  const etapa = etapaAtual(status)

  if (etapa === "entregue") return "Entrega concluída"
  if (etapa === "em_rota") return "Pacote pego • Em caminho"
  if (etapa === "coleta") return "Buscando pacote"
  return "Solicitação aceita"
}

function origemFrete(frete?: Frete | null) {
  return frete?.origem || frete?.endereco_origem || "Origem não informada"
}

function destinoFrete(frete?: Frete | null) {
  return frete?.destino || frete?.endereco_destino || "Destino não informado"
}

function formatarMoeda(frete?: Frete | null) {
  if (!frete) return "R$ 0,00"

  if (typeof frete.valor_frete === "number" && frete.valor_frete > 0) {
    return frete.valor_frete.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return frete.valor || "A calcular"
}

function dataBR(data?: string | null) {
  if (!data) return "--"
  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")
  if (partes.length !== 3) return limpa
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

export default function EmAndamentoPage() {
  const [tipoVeiculo, setTipoVeiculo] = useState<Veiculo>("caminhao")
  const [frete, setFrete] = useState<Frete | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [gpsAtivo, setGpsAtivo] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  const watcherRef = useRef<number | null>(null)
  const freteRef = useRef<Frete | null>(null)

  useEffect(() => {
    const veiculoSalvo = localStorage.getItem("tipoVeiculoMotorista") as Veiculo | null

    if (
      veiculoSalvo === "moto" ||
      veiculoSalvo === "carro" ||
      veiculoSalvo === "van" ||
      veiculoSalvo === "caminhao"
    ) {
      setTipoVeiculo(veiculoSalvo)
    }

    carregarCorridaAtual()

    return () => {
      if (watcherRef.current) {
        navigator.geolocation.clearWatch(watcherRef.current)
      }
    }
  }, [])

  useEffect(() => {
    freteRef.current = frete
  }, [frete])

  async function carregarCorridaAtual() {
    setCarregando(true)
    setErro("")

    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      setErro("Motorista não encontrado no login.")
      setCarregando(false)
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .eq("motorista_id", motoristaId)
      .not("status", "in", "(concluido,concluído,entregue,cancelado)")
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []
    const corridaAtual = lista[0] || null

    setFrete(corridaAtual)
    freteRef.current = corridaAtual

    if (corridaAtual?.cliente_id) {
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id,nome,telefone,email")
        .eq("id", corridaAtual.cliente_id)
        .maybeSingle()

      if (clienteData) setCliente(clienteData)
    }

    setCarregando(false)
  }

  async function criarNotificacao(titulo: string, mensagem: string, statusNovo: string) {
    const corrida = freteRef.current
    if (!corrida) return

    const payload = {
      frete_id: corrida.id,
      cliente_id: corrida.cliente_id || null,
      empresa_id: corrida.empresa_id || null,
      motorista_id: corrida.motorista_id || localStorage.getItem("flatauto_motorista_id"),
      titulo,
      mensagem,
      status: statusNovo,
      lida: false,
      criado_em: new Date().toISOString(),
    }

    const { error } = await supabase.from("notificacoes").insert(payload as any)

    if (error) {
      console.warn("Notificação não salva:", error.message)
    }
  }

  async function salvarLocalizacaoTempoReal(novaLocalizacao: Localizacao, statusAtual: string) {
    const corrida = freteRef.current
    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!corrida || !motoristaId) return

    const payload = {
      frete_id: corrida.id,
      corrida_id: corrida.id,
      empresa_id: corrida.empresa_id || null,
      cliente_id: corrida.cliente_id || null,
      motorista_id: motoristaId,
      origem: origemFrete(corrida),
      destino: destinoFrete(corrida),
      tipo_carga: corrida.tipo_carga || corrida.tipo_transporte || null,
      valor_frete: corrida.valor_frete || null,
      latitude: novaLocalizacao.latitude,
      longitude: novaLocalizacao.longitude,
      latitude_motorista: novaLocalizacao.latitude,
      longitude_motorista: novaLocalizacao.longitude,
      accuracy: novaLocalizacao.accuracy || null,
      tipo_veiculo: tipoVeiculo,
      veiculo_tipo: tipoVeiculo,
      veiculo_modelo: localStorage.getItem("modeloVeiculoMotorista") || null,
      veiculo_placa: localStorage.getItem("placaVeiculoMotorista") || null,
      status: statusAtual,
      atualizado_em: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("corridas_tempo_real")
      .upsert(payload as any, { onConflict: "motorista_id" })

    if (error) {
      setErro(`Erro ao salvar tempo real: ${error.message}`)
    }
  }

  function iniciarGps(statusAtual: string) {
    if (watcherRef.current) return

    if (!navigator.geolocation) {
      setErro("Este celular não suporta GPS.")
      return
    }

    setGpsAtivo(true)

    watcherRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const novaLocalizacao = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        setLocalizacao(novaLocalizacao)
        await salvarLocalizacaoTempoReal(novaLocalizacao, statusAtual)
      },
      () => {
        setGpsAtivo(false)
        setErro("GPS negado. Ative a localização do celular para acompanhar em tempo real.")
      },
      {
        enableHighAccuracy: true,
        maximumAge: 4000,
        timeout: 15000,
      }
    )
  }

  async function atualizarEtapa(statusNovo: string, titulo: string, mensagem: string) {
    if (!frete || salvando) return

    setSalvando(true)
    setErro("")

    const { data, error } = await supabase
      .from("fretes")
      .update({
        status: statusNovo,
      })
      .eq("id", frete.id)
      .select("*")
      .maybeSingle()

    if (error) {
      setSalvando(false)
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    const freteAtualizado = (data as Frete) || { ...frete, status: statusNovo }

    setFrete(freteAtualizado)
    freteRef.current = freteAtualizado

    await criarNotificacao(titulo, mensagem, statusNovo)

    if (statusNovo === "coleta" || statusNovo === "em_rota") {
      iniciarGps(statusNovo)
    }

    if (localizacao) {
      await salvarLocalizacaoTempoReal(localizacao, statusNovo)
    }

    setSalvando(false)
  }

  async function iniciarCorrida() {
    await atualizarEtapa(
      "coleta",
      "Motorista iniciou a coleta",
      "O motorista iniciou a corrida e está indo buscar o pacote."
    )
  }

  async function pacoteColetado() {
    await atualizarEtapa(
      "em_rota",
      "Pacote pego com sucesso",
      "O pacote foi coletado e o motorista está indo para a entrega."
    )
  }

  async function finalizarCorrida() {
    await atualizarEtapa(
      "entregue",
      "Entrega concluída",
      "A entrega foi marcada como concluída pelo motorista."
    )

    setTimeout(() => {
      window.location.replace("/motorista/concluidas")
    }, 800)
  }

  const statusAtual = etapaAtual(frete?.status)
  const porcentagem = progresso(frete?.status)
  const origem = origemFrete(frete)
  const destino = destinoFrete(frete)
  const pacote = frete?.tipo_carga || frete?.tipo_transporte || "Pacote não informado"

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-white/10 bg-[#10171b] px-4">
        <a
          href="/motorista"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
        >
          <ArrowLeft size={20} />
        </a>

        <div>
          <p className="text-[10px] font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
          <h1 className="text-lg font-black">Em andamento</h1>
        </div>
      </header>

      <section className="relative h-[42vh] min-h-[300px] overflow-hidden bg-[#05070b] pt-14">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-10%] top-[28%] h-[2px] w-[120%] rotate-[11deg] bg-white/10" />
          <div className="absolute left-[-10%] top-[62%] h-[2px] w-[120%] -rotate-[8deg] bg-white/10" />
          <div className="absolute left-[23%] top-0 h-full w-[2px] rotate-[7deg] bg-white/10" />
          <div className="absolute left-[72%] top-0 h-full w-[2px] -rotate-[9deg] bg-white/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_34%,rgba(255,196,0,0.13),transparent_20%),radial-gradient(circle_at_75%_60%,rgba(255,196,0,0.08),transparent_18%)]" />
        </div>

        <div className="absolute left-[13%] top-[66%] z-20 flex -translate-y-1/2 flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_25px_rgba(34,197,94,0.6)]">
            <MapPin size={23} />
          </div>
          <span className="mt-2 rounded-lg bg-black/80 px-3 py-1 text-[10px] font-black text-white">
            Coleta
          </span>
        </div>

        <div className="absolute right-[13%] top-[34%] z-20 flex -translate-y-1/2 flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]">
            <MapPin size={23} />
          </div>
          <span className="mt-2 rounded-lg bg-black/80 px-3 py-1 text-[10px] font-black text-white">
            Entrega
          </span>
        </div>

        <div className="absolute left-[16%] top-[60%] h-[5px] w-[66%] -rotate-[18deg] rounded-full bg-white/15" />
        <div
          className="absolute left-[16%] top-[60%] h-[5px] -rotate-[18deg] rounded-full bg-[#ffc400] shadow-[0_0_18px_rgba(255,196,0,0.75)] transition-all duration-700"
          style={{ width: `${Math.max(8, porcentagem * 0.66)}%` }}
        />

        <div
          className="absolute top-[49%] z-30 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_35px_rgba(255,196,0,0.75)] transition-all duration-700"
          style={{ left: `${Math.min(78, Math.max(16, 16 + porcentagem * 0.62))}%` }}
        >
          <IconeVeiculo tipo={tipoVeiculo} size={34} />
        </div>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/75 p-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase text-white/40">
                Status da corrida
              </p>
              <h2 className="mt-1 text-lg font-black text-[#ffc400]">
                {statusTexto(frete?.status)}
              </h2>
            </div>

            <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
              {porcentagem}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#ffc400] transition-all duration-700"
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>
      </section>

      <section className="-mt-4 rounded-t-[26px] bg-[#020507] px-4 pb-6 pt-4">
        <div className="mx-auto max-w-[480px] space-y-3">
          {erro && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-400">
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
              Carregando corrida do Supabase...
            </div>
          ) : !frete ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center">
              <Package className="mx-auto text-[#ffc400]" size={34} />
              <h2 className="mt-3 text-lg font-black">Sem corrida em andamento</h2>
              <p className="mt-2 text-sm text-white/60">
                Quando você aceitar uma corrida de hoje, ela aparece aqui.
              </p>
            </div>
          ) : (
            <>
              <article className="rounded-[22px] border border-[#ffc400]/25 bg-[#10171b] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                    <IconeVeiculo tipo={tipoVeiculo} size={28} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase text-[#ffc400]">
                      Corrida atual
                    </p>
                    <h2 className="mt-1 text-lg font-black leading-tight">
                      {frete.codigo ? `Frete #${frete.codigo}` : "Entrega em andamento"}
                    </h2>
                    <p className="mt-1 text-xs font-bold text-white/50">
                      {gpsAtivo ? "GPS enviando localização em tempo real" : "GPS inicia quando apertar iniciar corrida"}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-[10px] font-black text-[#ffc400]">
                    {statusTexto(frete.status)}
                  </span>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/10 bg-[#10171b] p-4">
                <div className="space-y-3">
                  <LinhaCompleta
                    icon={<MapPin size={18} />}
                    titulo="Onde pegar"
                    valor={origem}
                    cor="text-green-400"
                  />

                  <LinhaCompleta
                    icon={<MapPin size={18} />}
                    titulo="Onde entregar"
                    valor={destino}
                    cor="text-red-400"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <MiniInfo
                      icon={<Package size={17} />}
                      titulo="Pacote"
                      valor={pacote}
                    />

                    <MiniInfo
                      icon={<Clock size={17} />}
                      titulo="Horário"
                      valor={frete.horario || "--"}
                    />

                    <MiniInfo
                      icon={<UserRound size={17} />}
                      titulo="Cliente"
                      valor={cliente?.nome || "Cliente não informado"}
                    />

                    <MiniInfo
                      icon={<Navigation size={17} />}
                      titulo="Valor"
                      valor={formatarMoeda(frete)}
                      destaque
                    />

                    <MiniInfo
                      icon={<span className="text-sm">📅</span>}
                      titulo="Coleta"
                      valor={dataBR(frete.data_frete)}
                    />

                    <MiniInfo
                      icon={<span className="text-sm">📍</span>}
                      titulo="GPS"
                      valor={localizacao ? "Ativo" : "Aguardando"}
                    />
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 text-[#ffc400]">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase text-white/40">
                          Observação
                        </p>
                        <p className="mt-1 break-words text-sm font-black leading-snug text-white">
                          {frete.observacoes || frete.descricao_carga || "Sem observação."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/10 bg-[#10171b] p-4">
                <p className="mb-3 text-xs font-black uppercase text-white/40">
                  Etapas da entrega
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {etapas.map((etapa) => (
                    <EtapaCard
                      key={etapa.id}
                      ativa={etapaAtiva(frete.status, etapa.id)}
                      titulo={etapa.titulo}
                      texto={etapa.texto}
                    />
                  ))}
                </div>
              </article>

              {statusAtual === "aceito" && (
                <BotaoPrincipal
                  icon={<Play size={21} />}
                  texto={salvando ? "Iniciando..." : "Iniciar corrida"}
                  onClick={iniciarCorrida}
                  disabled={salvando}
                />
              )}

              {statusAtual === "coleta" && (
                <BotaoPrincipal
                  icon={<Package size={21} />}
                  texto={salvando ? "Salvando..." : "Pacote pego com sucesso"}
                  onClick={pacoteColetado}
                  disabled={salvando}
                />
              )}

              {statusAtual === "em_rota" && (
                <BotaoPrincipal
                  icon={<CheckCircle2 size={21} />}
                  texto={salvando ? "Finalizando..." : "Finalizar entrega"}
                  onClick={finalizarCorrida}
                  disabled={salvando}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function BotaoPrincipal({
  icon,
  texto,
  onClick,
  disabled,
}: {
  icon: ReactNode
  texto: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="sticky bottom-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] text-base font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.25)] disabled:opacity-60"
    >
      {icon}
      {texto}
    </button>
  )
}

function LinhaCompleta({
  icon,
  titulo,
  valor,
  cor,
}: {
  icon: ReactNode
  titulo: string
  valor: string
  cor: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-3">
      <div className="flex items-start gap-2">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 ${cor}`}>
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase text-white/40">{titulo}</p>
          <p className="mt-1 break-words text-sm font-black leading-snug text-white">
            {valor}
          </p>
        </div>
      </div>
    </div>
  )
}

function MiniInfo({
  icon,
  titulo,
  valor,
  destaque,
}: {
  icon: ReactNode
  titulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-3">
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 text-[#ffc400]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase text-white/40">{titulo}</p>
          <p className={`mt-1 break-words text-xs font-black leading-snug ${destaque ? "text-[#ffc400]" : "text-white"}`}>
            {valor}
          </p>
        </div>
      </div>
    </div>
  )
}

function EtapaCard({
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
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${
          ativa
            ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_18px_rgba(255,196,0,0.35)]"
            : "border-white/15 bg-white/[0.04] text-white/30"
        }`}
      >
        <CheckCircle2 size={18} />
      </div>

      <p className={`mt-2 text-[10px] font-black leading-tight ${ativa ? "text-[#ffc400]" : "text-white/35"}`}>
        {titulo}
      </p>
      <p className="mt-1 text-[9px] leading-tight text-white/30">{texto}</p>
    </div>
  )
}
