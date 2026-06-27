"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, Truck, UserRound, MapPin, RefreshCw, X } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Motorista = {
  id: string
  nome?: string | null
  telefone?: string | null
  tipo_caminhao?: string | null
  modelo_caminhao?: string | null
  placa?: string | null
  regiao?: string | null
  regioes_atuacao?: string[] | null
  foto_perfil?: string | null
}

type Avaliacao = {
  motorista_id?: string | null
  nota?: number | null
}

type Frete = {
  id: string
  motorista_id?: string | null
  status?: string | null
}

type Localizacao = {
  motorista_id?: string | null
  status?: string | null
  atualizado_em?: string | null
  latitude?: number | null
  longitude?: number | null
}

type MotoristaBusca = {
  motorista: Motorista
  media: number
  totalAvaliacoes: number
  entregas: number
  localizacao?: Localizacao | null
}

function texto(valor?: string | null) {
  return String(valor || "").trim()
}

function normalizar(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function formatarRegiao(regiao: string) {
  if (regiao.startsWith("ESTADO:")) return regiao.replace("ESTADO:", "")
  if (regiao.startsWith("CIDADE:")) {
    const partes = regiao.split(":")
    return `${partes[2]} - ${partes[1]}`
  }
  return regiao
}

function regioesTexto(motorista: Motorista) {
  if (Array.isArray(motorista.regioes_atuacao) && motorista.regioes_atuacao.length > 0) {
    return motorista.regioes_atuacao.slice(0, 3).map(formatarRegiao).join(", ")
  }

  return motorista.regiao || "Região não informada"
}

function statusOnline(localizacao?: Localizacao | null) {
  if (!localizacao?.atualizado_em) return "Offline"

  const atualizado = new Date(localizacao.atualizado_em).getTime()
  if (Number.isNaN(atualizado)) return "Offline"

  const minutos = (Date.now() - atualizado) / 1000 / 60

  if (minutos <= 10) {
    if (normalizar(localizacao.status).includes("andamento")) return "Em entrega"
    return "Online"
  }

  return "Offline"
}

function corStatus(status: string) {
  if (status === "Online") return "text-green-400 bg-green-500/10 border-green-500/30"
  if (status === "Em entrega") return "text-[#ffc400] bg-[#ffc400]/10 border-[#ffc400]/30"
  return "text-white/45 bg-white/[0.04] border-white/10"
}

export default function Page() {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [motoristas, setMotoristas] = useState<MotoristaBusca[]>([])
  const [selecionado, setSelecionado] = useState<MotoristaBusca | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarMotoristas()
  }, [])

  async function carregarMotoristas() {
    setCarregando(true)
    setErro("")

    const { data: motoristasData, error: erroMotoristas } = await supabase
      .from("motoristas")
      .select("*")
      .order("nome", { ascending: true })

    if (erroMotoristas) {
      setErro(`Erro Supabase: ${erroMotoristas.message}`)
      setMotoristas([])
      setCarregando(false)
      return
    }

    const motoristasLista = Array.isArray(motoristasData) ? motoristasData : []
    const ids = motoristasLista.map((m: Motorista) => m.id).filter(Boolean)

    if (ids.length === 0) {
      setMotoristas([])
      setCarregando(false)
      return
    }

    const { data: avaliacoesData } = await supabase
      .from("avaliacoes")
      .select("motorista_id,nota")
      .in("motorista_id", ids)

    const { data: fretesData } = await supabase
      .from("fretes")
      .select("id,motorista_id,status")
      .in("motorista_id", ids)

    const { data: localizacaoData } = await supabase
      .from("corridas_tempo_real")
      .select("*")
      .in("motorista_id", ids)
      .order("atualizado_em", { ascending: false })

    const avaliacoes = Array.isArray(avaliacoesData) ? avaliacoesData : []
    const fretes = Array.isArray(fretesData) ? fretesData : []
    const localizacoes = Array.isArray(localizacaoData) ? localizacaoData : []

    const listaMontada = motoristasLista.map((motorista: Motorista) => {
      const avaliacoesMotorista = avaliacoes.filter(
        (avaliacao: Avaliacao) => avaliacao.motorista_id === motorista.id
      )

      const soma = avaliacoesMotorista.reduce(
        (total: number, avaliacao: Avaliacao) => total + Number(avaliacao.nota || 0),
        0
      )

      const media =
        avaliacoesMotorista.length > 0 ? soma / avaliacoesMotorista.length : 0

      const entregas = fretes.filter((frete: Frete) => {
        const status = normalizar(frete.status)
        return (
          frete.motorista_id === motorista.id &&
          (status.includes("conclu") ||
            status.includes("entregue") ||
            status.includes("finaliz"))
        )
      }).length

      const localizacao =
        localizacoes.find((item: Localizacao) => item.motorista_id === motorista.id) || null

      return {
        motorista,
        media,
        totalAvaliacoes: avaliacoesMotorista.length,
        entregas,
        localizacao,
      }
    })

    setMotoristas(listaMontada)
    setCarregando(false)
  }

  const filtrados = useMemo(() => {
    const termo = normalizar(busca)

    if (!termo) return motoristas

    return motoristas.filter((item) => {
      const motorista = item.motorista
      const regioes = regioesTexto(motorista)

      return [
        motorista.nome,
        motorista.tipo_caminhao,
        motorista.modelo_caminhao,
        motorista.placa,
        motorista.regiao,
        regioes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    })
  }, [busca, motoristas])

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px] pb-10">
        <header className="flex items-center justify-between gap-3">
          <button onClick={() => router.push("/cliente")} className="font-bold text-[#ffc400]">
            ← Voltar
          </button>

          <button
            onClick={carregarMotoristas}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#080808] text-[#ffc400]"
          >
            <RefreshCw size={18} />
          </button>
        </header>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffc400] text-black">
            <Search size={34} />
          </div>

          <h1 className="mt-5 text-[32px] font-black text-[#ffc400]">Buscar</h1>

          <p className="mt-3 text-white/60">
            Pesquise motoristas reais pelo nome, veículo ou região.
          </p>

          <div className="mt-5 flex h-13 items-center gap-3 rounded-2xl border border-white/10 bg-black px-4">
            <Search size={18} className="text-[#ffc400]" />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar nome, cidade ou veículo..."
              className="h-13 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35"
            />
          </div>
        </section>

        {erro && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        {carregando ? (
          <section className="mt-6 rounded-[24px] border border-white/10 bg-[#080808] p-6 text-center">
            <p className="font-bold text-[#ffc400]">Carregando motoristas do Supabase...</p>
          </section>
        ) : filtrados.length === 0 ? (
          <section className="mt-6 rounded-[24px] border border-white/10 bg-[#080808] p-6 text-center">
            <Truck className="mx-auto text-[#ffc400]" size={42} />
            <h2 className="mt-4 text-xl font-black">Nenhum motorista encontrado</h2>
            <p className="mt-2 text-sm text-white/55">
              Tente buscar por outro nome, cidade ou tipo de veículo.
            </p>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {filtrados.map((item) => {
              const motorista = item.motorista
              const status = statusOnline(item.localizacao)

              return (
                <button
                  key={motorista.id}
                  type="button"
                  onClick={() => setSelecionado(item)}
                  className="w-full rounded-[24px] border border-white/10 bg-[#080808] p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#ffc400] text-black">
                      {motorista.foto_perfil && motorista.foto_perfil !== "sem-foto" ? (
                        <img
                          src={motorista.foto_perfil}
                          alt="Foto do motorista"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={34} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-black">
                            {motorista.nome || "Motorista"}
                          </h2>

                          <p className="mt-1 text-sm font-bold text-[#ffc400]">
                            {motorista.modelo_caminhao || motorista.tipo_caminhao || "Veículo não informado"}
                          </p>
                        </div>

                        <span className={`rounded-full border px-3 py-1 text-[10px] font-black ${corStatus(status)}`}>
                          {status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#ffc400]/10 px-3 py-1 text-xs font-black text-[#ffc400]">
                          ⭐ {item.media ? item.media.toFixed(1) : "0.0"}
                        </span>

                        <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/55">
                          {item.totalAvaliacoes} avaliações
                        </span>

                        <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/55">
                          {item.entregas} entregas
                        </span>
                      </div>

                      <p className="mt-3 flex items-start gap-2 text-sm text-white/55">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-[#ffc400]" />
                        {regioesTexto(motorista)}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </section>
        )}
      </div>

      {selecionado && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 px-4 pb-5 sm:items-center sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#080808] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#ffc400] text-black">
                  {selecionado.motorista.foto_perfil &&
                  selecionado.motorista.foto_perfil !== "sem-foto" ? (
                    <img
                      src={selecionado.motorista.foto_perfil}
                      alt="Foto do motorista"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={34} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-[#ffc400]">
                    Perfil do motorista
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    {selecionado.motorista.nome || "Motorista"}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    {selecionado.motorista.modelo_caminhao ||
                      selecionado.motorista.tipo_caminhao ||
                      "Veículo não informado"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelecionado(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <PerfilMini titulo="Nota" valor={selecionado.media ? selecionado.media.toFixed(1) : "0.0"} />
              <PerfilMini titulo="Avaliações" valor={String(selecionado.totalAvaliacoes)} />
              <PerfilMini titulo="Entregas" valor={String(selecionado.entregas)} />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-white/40">
                <MapPin size={16} />
                Região de atuação
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                {regioesTexto(selecionado.motorista)}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-white/40">
                <Truck size={16} />
                Veículo
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                {selecionado.motorista.modelo_caminhao ||
                  selecionado.motorista.tipo_caminhao ||
                  "Não informado"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-white/40">
                <Star size={16} />
                Avaliação
              </p>
              <p className="mt-2 text-sm font-bold text-[#ffc400]">
                {selecionado.totalAvaliacoes > 0
                  ? `Média ${selecionado.media.toFixed(1)} de 5 estrelas`
                  : "Ainda sem avaliações"}
              </p>
            </div>

            <button
              onClick={() => setSelecionado(null)}
              className="mt-5 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black"
            >
              Fechar perfil
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function PerfilMini({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-3 text-center">
      <p className="text-xs font-bold text-white/45">{titulo}</p>
      <p className="mt-1 text-xl font-black text-[#ffc400]">{valor}</p>
    </div>
  )
}
