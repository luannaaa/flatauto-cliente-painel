"use client"

import { useEffect, useState } from "react"
import {
  Menu,
  X,
  MapPin,
  Bike,
  Car,
  Truck,
  Bus,
  CalendarDays,
  Clock,
  DollarSign,
  UserRound,
  Settings,
  LogOut,
  CheckCircle2,
  Navigation,
} from "lucide-react"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

function IconeVeiculo({ tipo, size = 28 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

export default function MotoristaPage() {
  const [logado, setLogado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [menuAberto, setMenuAberto] = useState(false)
  const [tipoVeiculo, setTipoVeiculo] = useState<Veiculo>("caminhao")

  useEffect(() => {
    const motoristaSalvo = localStorage.getItem("motoristaLogado")
    const veiculoSalvo = localStorage.getItem("tipoVeiculoMotorista") as Veiculo | null

    if (motoristaSalvo === "true") {
      setLogado(true)
      if (veiculoSalvo) setTipoVeiculo(veiculoSalvo)
    } else {
      window.location.href = "/"
    }

    setCarregando(false)
  }, [])

  function sair() {
    localStorage.removeItem("motoristaLogado")
    localStorage.removeItem("tipoVeiculoMotorista")
    window.location.href = "/"
  }

  if (carregando || !logado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020507] text-white">
        <p className="text-sm text-white/60">Carregando motorista...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#10171b] px-4">
        <button
          onClick={() => setMenuAberto(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <Menu size={24} />
        </button>

        <div className="text-center">
          <p className="text-xs font-black text-[#ffc400]">FLATAUTO</p>
          <h1 className="text-sm font-black">Motorista</h1>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
          <IconeVeiculo tipo={tipoVeiculo} size={25} />
        </div>
      </header>

      {menuAberto && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuAberto(false)} />

          <aside className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] border-r border-white/10 bg-[#10171b] p-5">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-[#ffc400]">FLATAUTO</p>
                <p className="text-xs font-bold text-white/50">MOTORISTA</p>
              </div>

              <button
                onClick={() => setMenuAberto(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <MenuItem icon={<Navigation size={18} />} label="Corridas disponíveis" />
              <MenuItem icon={<CalendarDays size={18} />} label="Agendamentos" />
              <MenuItem icon={<Clock size={18} />} label="Em andamento" />
              <MenuItem icon={<CheckCircle2 size={18} />} label="Concluídas" />
              <MenuItem icon={<DollarSign size={18} />} label="Ganhos" />
              <MenuItem icon={<UserRound size={18} />} label="Perfil" />
              <MenuItem icon={<Settings size={18} />} label="Configurações" />

              <button
                onClick={sair}
                className="mt-5 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Sair
              </button>
            </nav>
          </aside>
        </div>
      )}

      <section className="relative h-[50vh] overflow-hidden bg-[#d9e4d2] pt-16">
        <div className="absolute left-[7%] top-[24%] z-20 rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white">
          Recife - PE
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
      </section>

      <section className="-mt-4 rounded-t-[34px] bg-[#020507] px-4 pb-8 pt-5">
        <div className="mx-auto max-w-[480px] space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Resumo titulo="Corridas" valor="5" />
            <Resumo titulo="Agenda" valor="3" />
            <Resumo titulo="Hoje" valor="R$ 120" />
          </div>

          <article className="rounded-[28px] border border-white/10 bg-[#10171b] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                <Navigation size={28} />
              </div>

              <div>
                <h2 className="text-lg font-black">Corrida disponível</h2>
                <p className="mt-1 text-sm text-white/60">
                  Cliente quer agendar uma entrega próxima da sua região.
                </p>

                <div className="mt-4 grid gap-2 text-sm font-bold">
                  <span>📍 Origem: Recife Antigo</span>
                  <span>🏁 Destino: Boa Viagem</span>
                  <span>⏱ Estimativa: 22 min</span>
                </div>
              </div>
            </div>

            <button className="mt-4 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black">
              Ver detalhes
            </button>
          </article>

          <section>
            <h2 className="mb-3 text-lg font-black">Agendamentos na região</h2>

            <div className="space-y-3">
              <AgendaCard cliente="Mercado Central" rota="Boa Viagem → Olinda" horario="Hoje às 16:30" tipo="Moto" />
              <AgendaCard cliente="Auto Peças Brasil" rota="Recife → Jaboatão" horario="Amanhã às 09:00" tipo="Carro" />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function MenuItem({ icon, label }: any) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-black">
      <span className="text-[#ffc400]">{icon}</span>
      {label}
    </button>
  )
}

function Resumo({ titulo, valor }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10171b] p-3 text-center">
      <p className="text-xs font-bold text-white/50">{titulo}</p>
      <h3 className="mt-1 text-lg font-black text-[#ffc400]">{valor}</h3>
    </div>
  )
}

function AgendaCard({ cliente, rota, horario, tipo }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{cliente}</h3>
          <p className="mt-1 text-sm text-white/60">{rota}</p>
          <p className="mt-2 text-sm font-bold text-[#ffc400]">{horario}</p>
        </div>

        <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
          {tipo}
        </span>
      </div>
    </article>
  )
}
