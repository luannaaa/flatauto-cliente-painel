"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, CheckCircle2, Clock, DollarSign, Menu, Navigation, Package, UserRound, X } from "lucide-react"
import { supabase } from "../../lib/supabase"

type Frete = {
  id: string
  motorista_id?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  status?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor_frete?: number | null
  aceito_em?: string | null
  created_at?: string | null
}

type Localizacao = { latitude: number; longitude: number }

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function dataDoFrete(frete: Frete) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return String(data).slice(0, 10)
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function pegarMotoristaId() {
  const direto = localStorage.getItem("flatauto_motorista_id") || localStorage.getItem("motorista_id")
  if (direto) return direto

  const possiveis = ["flatauto_motorista_dados", "motoristaLogado", "flatauto_motorista_logado_dados"]
  for (const chave of possiveis) {
    const bruto = localStorage.getItem(chave)
    if (!bruto) continue
    try {
      const obj = JSON.parse(bruto)
      if (obj?.id) return String(obj.id)
    } catch {}
  }

  return ""
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function MotoristaPage() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [fretes, setFretes] = useState<Frete[]>([])
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [mensagemGps, setMensagemGps] = useState("Aguardando localização")
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarPainel()

    const intervalo = setInterval(carregarPainel, 12000)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
          setLocalizacao(loc)
          setMensagemGps("Localização em tempo real ativa.")
          localStorage.setItem("flatauto_motorista_localizacao", JSON.stringify({ ...loc, atualizadoEm: new Date().toISOString() }))
        },
        () => setMensagemGps("Permita a localização para ativar o mapa real."),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      )
    }

    return () => clearInterval(intervalo)
  }, [])

  async function carregarPainel() {
    setErro("")

    const { data, error } = await supabase
      .from("fretes")
      .select("id,motorista_id,origem,destino,endereco_origem,endereco_destino,status,data_frete,data_entrega,horario,valor_frete,aceito_em,created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      return
    }

    setFretes(Array.isArray(data) ? data : [])
  }

  const motoristaId = typeof window !== "undefined" ? pegarMotoristaId() : ""

  const agendaAceita = useMemo(() => {
    return fretes.filter((frete) => {
      const st = texto(frete.status)
      return frete.motorista_id === motoristaId && (st.includes("agendado_aceito") || st.includes("aceito"))
    })
  }, [fretes, motoristaId])

  const corridasDisponiveisHoje = useMemo(() => {
    return fretes.filter((frete) => {
      const st = texto(frete.status)
      const disponivel = st.includes("aguardando") || st.includes("disponivel") || st.includes("disponível") || st.includes("pendente")
      return !frete.motorista_id && dataDoFrete(frete) === hojeISO() && disponivel
    })
  }, [fretes])

  const hoje = agendaAceita.filter((frete) => dataDoFrete(frete) === hojeISO()).length
  const entregaAtiva = fretes.find((frete) => frete.motorista_id === motoristaId && texto(frete.status).includes("andamento"))
  const agendamentosRegiao = fretes.filter((frete) => {
    const st = texto(frete.status)
    const disponivel = st.includes("aguardando") || st.includes("disponivel") || st.includes("disponível") || st.includes("pendente")
    return !frete.motorista_id && dataDoFrete(frete) > hojeISO() && disponivel
  }).slice(0, 2)

  const mapaUrl = localizacao
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${localizacao.longitude - 0.01}%2C${localizacao.latitude - 0.01}%2C${localizacao.longitude + 0.01}%2C${localizacao.latitude + 0.01}&layer=mapnik&marker=${localizacao.latitude}%2C${localizacao.longitude}`
    : "https://www.openstreetmap.org/export/embed.html?bbox=-35.05%2C-8.16%2C-34.85%2C-8.02&layer=mapnik"

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#020507]">
        <header className="sticky top-0 z-40 flex items-center justify-between bg-[#10171b] px-4 py-4">
          <button onClick={() => setMenuAberto(true)} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Menu size={25} />
          </button>

          <div className="text-center">
            <p className="font-black leading-none text-[#ffc400]">FLATAUTO</p>
            <p className="text-sm font-black">Motorista</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Navigation size={24} />
          </div>
        </header>

        <section className="relative h-[300px] overflow-hidden bg-[#10171b]">
          <iframe title="Mapa do motorista" src={mapaUrl} className="h-full w-full border-0 opacity-90" />
          <div className="absolute left-4 right-4 top-5 rounded-[28px] bg-black/70 p-5 backdrop-blur-md">
            <p className="text-xs font-black text-[#ffc400]">MAPA REAL DO MOTORISTA</p>
            <h1 className="mt-2 text-xl font-black">{entregaAtiva ? "Entrega ativa" : "Sem entrega ativa"}</h1>
            <p className="mt-2 text-sm text-white/70">{mensagemGps}</p>
            {localizacao && <p className="mt-2 text-xs font-black text-[#ffc400]">Lat: {localizacao.latitude.toFixed(5)} • Long: {localizacao.longitude.toFixed(5)}</p>}
          </div>
        </section>

        <section className="-mt-8 space-y-4 px-4 pb-8">
          <div className="relative rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-xl">
            {entregaAtiva ? (
              <>
                <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">Em andamento</span>
                <h2 className="mt-4 text-2xl font-black">Entrega ativa</h2>
                <p className="mt-2 text-sm text-white/60">{entregaAtiva.origem || entregaAtiva.endereco_origem} → {entregaAtiva.destino || entregaAtiva.endereco_destino}</p>
                <p className="mt-3 text-lg font-black text-[#ffc400]">{formatarMoeda(entregaAtiva.valor_frete)}</p>
              </>
            ) : (
              <>
                <p className="text-xs font-black text-white/45">ENTREGA ATIVA</p>
                <h2 className="mt-2 text-2xl font-black">Sem entrega ativa</h2>
                <p className="mt-2 text-sm text-white/60">Quando você aceitar uma corrida do dia, ela aparece aqui.</p>
                <p className="mt-3 text-sm font-bold text-[#ffc400]">Aguardando corrida</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <ResumoCard titulo="Corridas" valor={corridasDisponiveisHoje.length} />
            <ResumoCard titulo="Agenda" valor={agendaAceita.length} />
            <ResumoCard titulo="Hoje" valor={hoje} />
          </div>

          {erro && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">{erro}</div>}

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Corridas disponíveis</h2>
              <Link href="/motorista/corridas" className="text-xs font-black text-[#ffc400]">Ver todas</Link>
            </div>
            {corridasDisponiveisHoje.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">Nenhuma corrida disponível agora.</div>
            ) : (
              <div className="space-y-3">
                {corridasDisponiveisHoje.slice(0, 2).map((frete) => <MiniCard key={frete.id} frete={frete} />)}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Agendamentos na região</h2>
              <Link href="/motorista/agendamentos" className="text-xs font-black text-[#ffc400]">Ver todos</Link>
            </div>
            {agendamentosRegiao.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">Nenhum agendamento disponível.</div>
            ) : (
              <div className="space-y-3">
                {agendamentosRegiao.map((frete) => <MiniCard key={frete.id} frete={frete} />)}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Minha agenda aceita</h2>
              <span className="text-xs font-black text-[#ffc400]">{agendaAceita.length}</span>
            </div>
            {agendaAceita.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">Nenhum agendamento aceito ainda.</div>
            ) : (
              <div className="space-y-3">
                {agendaAceita.slice(0, 3).map((frete) => <MiniCard key={frete.id} frete={frete} />)}
              </div>
            )}
          </section>
        </section>
      </div>

      {menuAberto && <MenuMotorista fechar={() => setMenuAberto(false)} />}
    </main>
  )
}

function ResumoCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10171b] p-4 text-center">
      <p className="text-xs font-black text-white/55">{titulo}</p>
      <p className="mt-2 text-xl font-black text-[#ffc400]">{valor}</p>
    </div>
  )
}

function MiniCard({ frete }: { frete: Frete }) {
  const aceito = Boolean(frete.motorista_id) && texto(frete.status).includes("aceito")

  return (
    <article className={`rounded-2xl border p-4 ${aceito ? "border-green-500/40 bg-green-500/10" : "border-white/10 bg-[#10171b]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">Solicitação de frete</h3>
          <p className="mt-1 text-sm text-white/60">{frete.origem || frete.endereco_origem || "Origem"} → {frete.destino || frete.endereco_destino || "Destino"}</p>
          <p className="mt-2 text-sm font-black text-[#ffc400]">{dataDoFrete(frete)} {frete.horario || ""}</p>
        </div>
        {aceito && <span className="rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-black text-green-300">Aceito</span>}
      </div>
    </article>
  )
}

function MenuMotorista({ fechar }: { fechar: () => void }) {
  const links = [
    ["Corridas disponíveis", "/motorista/corridas"],
    ["Agendamentos", "/motorista/agendamentos"],
    ["Em andamento", "/motorista/em-andamento"],
    ["Concluídas", "/motorista/concluidas"],
    ["Ganhos", "/motorista/ganhos"],
    ["Perfil", "/motorista/perfil"],
    ["Configurações", "/motorista/configuracoes"],
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/70">
      <aside className="h-full w-[82%] max-w-[340px] bg-[#10171b] p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-[#ffc400]">FLATAUTO</p>
            <p className="font-bold">MOTORISTA</p>
          </div>
          <button onClick={fechar} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-3">
          {links.map(([texto, href]) => (
            <Link key={href} href={href} className="block rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 font-black text-white">
              {texto}
            </Link>
          ))}
          <Link href="/" className="block rounded-2xl px-4 py-4 font-black text-red-400">Sair</Link>
        </nav>
      </aside>
    </div>
  )
}
