"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"

type Frete = {
  id: string
  codigo?: string | null
  cliente_id?: string | null
  motorista_id?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  status?: string | null
  valor?: string | null
  valor_frete?: number | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  observacoes?: string | null
  descricao_carga?: string | null
  created_at?: string | null
}

type Motorista = {
  id?: string
  nome?: string | null
  telefone?: string | null
  tipo_caminhao?: string | null
  modelo_caminhao?: string | null
  placa?: string | null
  foto_perfil?: string | null
}

type LocalizacaoMotorista = {
  latitude?: number | null
  longitude?: number | null
  accuracy?: number | null
  tipo_veiculo?: string | null
  status?: string | null
  atualizado_em?: string | null
}

const etapas = [
  {
    id: "solicitado",
    titulo: "Frete solicitado",
    texto: "Pedido salvo no Supabase e aguardando motorista.",
  },
  {
    id: "aceito",
    titulo: "Motorista aceitou",
    texto: "Um motorista aceitou a corrida.",
  },
  {
    id: "andamento",
    titulo: "Em andamento",
    texto: "Motorista em rota para coleta ou entrega.",
  },
  {
    id: "concluido",
    titulo: "Concluído",
    texto: "Entrega finalizada.",
  },
]

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function origemFrete(frete?: Frete | null) {
  return frete?.origem || frete?.endereco_origem || "Origem não informada"
}

function destinoFrete(frete?: Frete | null) {
  return frete?.destino || frete?.endereco_destino || "Destino não informado"
}

function codigoFrete(frete?: Frete | null) {
  if (!frete) return "#----"
  return frete.codigo ? `#${frete.codigo}` : `#${String(frete.id).slice(0, 6)}`
}

function statusLabel(status?: string | null, motoristaId?: string | null) {
  const s = texto(status)

  if (s.includes("conclu") || s.includes("entregue") || s.includes("finaliz")) {
    return "Concluído"
  }

  if (s.includes("andamento") || s.includes("rota")) {
    return "Em andamento"
  }

  if (motoristaId || s.includes("aceito") || s.includes("agendado_aceito")) {
    return "Motorista aceitou"
  }

  if (s.includes("agendado")) return "Agendado"

  return "Aguardando motorista"
}

function etapaAtiva(frete: Frete | null, etapaId: string) {
  if (!frete) return false

  const label = statusLabel(frete.status, frete.motorista_id)

  if (etapaId === "solicitado") return true
  if (etapaId === "aceito") {
    return label === "Motorista aceitou" || label === "Em andamento" || label === "Concluído"
  }
  if (etapaId === "andamento") {
    return label === "Em andamento" || label === "Concluído"
  }
  if (etapaId === "concluido") return label === "Concluído"

  return false
}

function progressoFrete(frete: Frete | null) {
  if (!frete) return 0
  const label = statusLabel(frete.status, frete.motorista_id)

  if (label === "Concluído") return 100
  if (label === "Em andamento") return 65
  if (label === "Motorista aceitou") return 35
  return 15
}

function formatarMoeda(frete?: Frete | null) {
  if (!frete) return "R$ 0,00"

  if (typeof frete.valor_frete === "number") {
    return frete.valor_frete.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return frete.valor || "A calcular"
}

function formatarData(data?: string | null) {
  if (!data) return "Não informada"

  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")

  if (partes.length !== 3) return limpa

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function escolherIconeVeiculo(tipo?: string | null) {
  const normalizado = texto(tipo)

  if (normalizado.includes("moto")) return "🏍️"
  if (normalizado.includes("carro")) return "🚗"
  if (normalizado.includes("van")) return "🚐"

  return "🚚"
}

function formatarAtualizacao(data?: string | null) {
  if (!data) return "Sem GPS"

  try {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Agora"
  }
}

export default function Page() {
  const [fretes, setFretes] = useState<Frete[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<Frete | null>(null)
  const [motorista, setMotorista] = useState<Motorista | null>(null)
  const [localizacao, setLocalizacao] = useState<LocalizacaoMotorista | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarMeusFretes()
  }, [])

  useEffect(() => {
    if (!freteSelecionado) return

    carregarMotoristaEFreteTempoReal(freteSelecionado)

    const intervalo = setInterval(() => {
      carregarMotoristaEFreteTempoReal(freteSelecionado)
    }, 6000)

    return () => clearInterval(intervalo)
  }, [freteSelecionado?.id, freteSelecionado?.motorista_id])

  async function carregarMeusFretes() {
    setCarregando(true)
    setErro("")

    const clienteId = localStorage.getItem("flatauto_cliente_id")

    if (!clienteId) {
      setErro("Cliente não encontrado no login. Saia e entre novamente.")
      setFretes([])
      setCarregando(false)
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []

    setFretes(lista)
    setFreteSelecionado((atual) => {
      if (atual) {
        return lista.find((frete) => frete.id === atual.id) || lista[0] || null
      }

      return lista[0] || null
    })

    setCarregando(false)
  }

  async function carregarMotoristaEFreteTempoReal(frete: Frete) {
    setMotorista(null)
    setLocalizacao(null)

    if (frete.motorista_id) {
      const { data: motoristaData } = await supabase
        .from("motoristas")
        .select("*")
        .eq("id", frete.motorista_id)
        .maybeSingle()

      if (motoristaData) setMotorista(motoristaData)
    }

    let localizacaoData: LocalizacaoMotorista | null = null

    const { data: locPorFrete } = await supabase
      .from("corridas_tempo_real")
      .select("*")
      .eq("frete_id", frete.id)
      .order("atualizado_em", { ascending: false })
      .limit(1)

    if (Array.isArray(locPorFrete) && locPorFrete.length > 0) {
      localizacaoData = locPorFrete[0]
    }

    if (!localizacaoData && frete.motorista_id) {
      const { data: locPorMotorista } = await supabase
        .from("corridas_tempo_real")
        .select("*")
        .eq("motorista_id", frete.motorista_id)
        .order("atualizado_em", { ascending: false })
        .limit(1)

      if (Array.isArray(locPorMotorista) && locPorMotorista.length > 0) {
        localizacaoData = locPorMotorista[0]
      }
    }

    setLocalizacao(localizacaoData)
  }

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  const progresso = progressoFrete(freteSelecionado)
  const tipoVeiculo = motorista?.tipo_caminhao || motorista?.modelo_caminhao || freteSelecionado?.tipo_transporte
  const iconeVeiculo = escolherIconeVeiculo(tipoVeiculo)
  const temMotorista = Boolean(freteSelecionado?.motorista_id)
  const temLocalizacao = Boolean(localizacao?.latitude && localizacao?.longitude)

  const mapaUrl = temLocalizacao
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(localizacao?.longitude) - 0.01}%2C${Number(localizacao?.latitude) - 0.01}%2C${Number(localizacao?.longitude) + 0.01}%2C${Number(localizacao?.latitude) + 0.01}&layer=mapnik&marker=${localizacao?.latitude}%2C${localizacao?.longitude}`
    : ""

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px] pb-10">
        <button onClick={voltarPainel} className="font-bold text-[#ffc400]">
          ← Voltar
        </button>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <p className="text-sm font-bold text-[#ffc400]">Painel do cliente</p>
          <h1 className="mt-2 text-[32px] font-black text-white">Meus fretes</h1>
          <p className="mt-3 text-white/60">
            Acompanhe seus pedidos reais, status, motorista e localização quando disponível.
          </p>

          <button
            type="button"
            onClick={carregarMeusFretes}
            className="mt-5 h-12 w-full rounded-2xl border border-[#ffc400]/35 bg-[#ffc400]/10 font-black text-[#ffc400]"
          >
            Atualizar
          </button>
        </section>

        {erro && (
          <section className="mt-6 rounded-[22px] border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </section>
        )}

        {carregando ? (
          <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-6 text-center">
            <p className="font-bold text-[#ffc400]">Carregando fretes do Supabase...</p>
          </section>
        ) : fretes.length === 0 ? (
          <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffc400] text-3xl text-black">
              📦
            </div>
            <h2 className="mt-4 text-xl font-black">Nenhum frete ainda</h2>
            <p className="mt-2 text-sm text-white/55">
              Quando você solicitar uma entrega, ela aparecerá aqui.
            </p>
          </section>
        ) : (
          <>
            <section className="mt-6 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/50">Frete selecionado</p>
                  <h2 className="mt-1 text-[22px] font-black">
                    Frete {codigoFrete(freteSelecionado)}
                  </h2>
                  <p className="mt-1 text-xs font-bold text-white/45">
                    {freteSelecionado?.tipo_carga || freteSelecionado?.tipo_transporte || "Tipo não informado"}
                  </p>
                </div>

                <div className="rounded-full bg-[#ffc400] px-4 py-2 text-center text-xs font-black text-black">
                  {statusLabel(freteSelecionado?.status, freteSelecionado?.motorista_id)}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-[#10171b]">
                <div className="relative h-[260px] bg-[#10171b]">
                  {temLocalizacao ? (
                    <>
                      <iframe
                        title="Mapa do motorista para o cliente"
                        src={mapaUrl}
                        className="h-full w-full border-0"
                      />

                      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-3xl text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                          {iconeVeiculo}
                        </div>

                        <div className="mt-2 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-[#ffc400]">
                          Motorista aqui
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                      <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffc400] text-3xl text-black">
                          {temMotorista ? iconeVeiculo : "📦"}
                        </div>
                        <h3 className="mt-4 text-xl font-black">
                          {temMotorista ? "Motorista aceitou" : "Aguardando motorista"}
                        </h3>
                        <p className="mt-2 text-sm text-white/60">
                          {temMotorista
                            ? "Quando o motorista ativar o GPS, a localização aparece aqui."
                            : "Seu pedido está salvo e disponível para motoristas."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
                  <CardMini titulo="Rastreamento" valor={temLocalizacao ? "Tempo real" : "Aguardando"} pequeno />
                  <CardMini titulo="Atualização" valor={formatarAtualizacao(localizacao?.atualizado_em)} pequeno />
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-black p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-3xl">
                    {iconeVeiculo}
                  </div>
                  <div>
                    <p className="text-sm text-white/45">Motorista responsável</p>
                    <p className="text-lg font-black">
                      {motorista?.nome || (temMotorista ? "Motorista vinculado" : "Aguardando aceite")}
                    </p>
                    <p className="text-sm text-[#ffc400]">
                      {motorista?.modelo_caminhao || motorista?.tipo_caminhao || freteSelecionado?.tipo_transporte || "Veículo não informado"}
                      {motorista?.placa ? ` • Placa ${motorista.placa}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <CardMini titulo="Valor" valor={formatarMoeda(freteSelecionado)} />
                <CardMini titulo="Data" valor={formatarData(freteSelecionado?.data_frete)} />
                <CardMini titulo="Horário" valor={freteSelecionado?.horario || "--"} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <CardMini titulo="Coleta" valor={formatarData(freteSelecionado?.data_frete)} pequeno />
                <CardMini titulo="Entrega" valor={formatarData(freteSelecionado?.data_entrega)} pequeno />
              </div>

              <div className="mt-5 rounded-[20px] border border-white/10 bg-black p-4">
                <p className="text-xs font-black uppercase text-white/40">Rota</p>
                <p className="mt-2 text-sm font-bold text-white">{origemFrete(freteSelecionado)}</p>
                <p className="my-2 text-[#ffc400]">↓</p>
                <p className="text-sm font-bold text-white">{destinoFrete(freteSelecionado)}</p>
              </div>

              <div className="mt-5 rounded-[20px] border border-white/10 bg-black p-4">
                <p className="text-xs font-black uppercase text-white/40">Informações do pedido</p>
                <p className="mt-2 text-sm font-bold text-white">
                  {freteSelecionado?.descricao_carga || freteSelecionado?.observacoes || "Sem observação."}
                </p>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-bold text-white/80">Progresso da entrega</p>
                  <p className="text-sm font-bold text-[#ffc400]">{progresso}%</p>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${progresso}%` }} />
                </div>

                <div className="relative mt-3 h-10">
                  <div className="absolute top-0 text-3xl" style={{ left: `calc(${progresso}% - 18px)` }}>
                    {iconeVeiculo}
                  </div>
                  <div className="absolute left-0 top-4 h-[2px] w-full bg-white/10" />
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-5">
              <h2 className="text-[22px] font-black">Status do frete</h2>
              <div className="mt-5 space-y-4">
                {etapas.map((etapa) => (
                  <Etapa
                    key={etapa.id}
                    ativo={etapaAtiva(freteSelecionado, etapa.id)}
                    icone={etapaAtiva(freteSelecionado, etapa.id) ? "✅" : "○"}
                    titulo={etapa.titulo}
                    texto={etapa.texto}
                  />
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-5">
              <h2 className="text-[22px] font-black">Todos os meus fretes</h2>
              <div className="mt-4 space-y-3">
                {fretes.map((frete) => (
                  <button
                    key={frete.id}
                    type="button"
                    onClick={() => setFreteSelecionado(frete)}
                    className={`w-full rounded-[18px] border p-4 text-left ${
                      freteSelecionado?.id === frete.id
                        ? "border-[#ffc400]/50 bg-[#ffc400]/10"
                        : "border-white/10 bg-black"
                    }`}
                  >
                    <FreteItem
                      icone={escolherIconeVeiculo(frete.tipo_transporte)}
                      codigo={codigoFrete(frete)}
                      status={statusLabel(frete.status, frete.motorista_id)}
                      rota={`${origemFrete(frete)} → ${destinoFrete(frete)}`}
                    />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function CardMini({
  titulo,
  valor,
  pequeno,
}: {
  titulo: string
  valor: string
  pequeno?: boolean
}) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black p-3 text-center">
      <p className="text-xs text-white/45">{titulo}</p>
      <p className={`mt-1 font-black text-[#ffc400] ${pequeno ? "text-[13px]" : "text-[16px]"}`}>
        {valor}
      </p>
    </div>
  )
}

function Etapa({
  icone,
  titulo,
  texto,
  ativo = false,
}: {
  icone: string
  titulo: string
  texto: string
  ativo?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          ativo ? "bg-[#ffc400] text-black" : "bg-white/10 text-white/50"
        }`}
      >
        {icone}
      </div>
      <div>
        <p className={`font-black ${ativo ? "text-white" : "text-white/45"}`}>
          {titulo}
        </p>
        <p className="mt-1 text-sm text-white/45">{texto}</p>
      </div>
    </div>
  )
}

function FreteItem({
  icone,
  codigo,
  status,
  rota,
}: {
  icone: string
  codigo: string
  status: string
  rota: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl">{icone}</div>
      <div className="min-w-0 flex-1">
        <p className="font-black">{codigo}</p>
        <p className="truncate text-sm text-white/45">{rota}</p>
      </div>
      <p className="text-right text-sm font-bold text-[#ffc400]">{status}</p>
    </div>
  )
}
