"use client"

import { useEffect, useState } from "react"
import {
  Bike,
  Car,
  Truck,
  Bus,
  MapPin,
  CalendarDays,
  Package,
  CheckCircle2,
  Navigation,
} from "lucide-react"

type Tema = "dark" | "light"
type Veiculo = "moto" | "carro" | "van" | "caminhao"

const CHAVE_TEMA_EMPRESA = "temaEmpresa"

type Entrega = {
  id: number
  motorista: string
  foto: string
  veiculo: Veiculo
  mercadoria: string
  origem: string
  destino: string
  data: string
  horario: string
  status: "em_andamento" | "finalizada"
  progresso?: number
  distancia?: string
  tempoRestante?: string
  valor?: string
}

const entregasEmAndamento: Entrega[] = [
  {
    id: 1,
    motorista: "João Carlos Silva",
    foto: "https://i.pravatar.cc/150?img=12",
    veiculo: "moto",
    mercadoria: "Documentos empresariais",
    origem: "Recife - PE",
    destino: "Jaboatão - PE",
    data: "08/06/2026",
    horario: "14:30",
    status: "em_andamento",
    progresso: 68,
    distancia: "8,4 km de 12 km",
    tempoRestante: "18 min",
  },
  {
    id: 2,
    motorista: "Marcos Antônio",
    foto: "https://i.pravatar.cc/150?img=33",
    veiculo: "carro",
    mercadoria: "Caixas pequenas",
    origem: "Boa Viagem - Recife",
    destino: "Olinda - PE",
    data: "08/06/2026",
    horario: "15:10",
    status: "em_andamento",
    progresso: 42,
    distancia: "6 km de 14 km",
    tempoRestante: "27 min",
  },
]

const historicoEntregas: Entrega[] = [
  {
    id: 3,
    motorista: "Carlos Eduardo",
    foto: "https://i.pravatar.cc/150?img=18",
    veiculo: "van",
    mercadoria: "Mercadoria frágil",
    origem: "Recife - PE",
    destino: "Paulista - PE",
    data: "07/06/2026",
    horario: "10:20",
    status: "finalizada",
    valor: "R$ 180,00",
  },
  {
    id: 4,
    motorista: "Roberto Lima",
    foto: "https://i.pravatar.cc/150?img=45",
    veiculo: "caminhao",
    mercadoria: "Material de construção",
    origem: "Camaragibe - PE",
    destino: "Cabo - PE",
    data: "06/06/2026",
    horario: "09:00",
    status: "finalizada",
    valor: "R$ 420,00",
  },
]

function normalizarTema(valor: string | null): Tema {
  if (valor === "light" || valor === "claro") return "light"
  if (valor === "dark" || valor === "escuro") return "dark"
  return "dark"
}

function useTemaEmpresa() {
  const [tema, setTema] = useState<Tema>("dark")

  useEffect(() => {
    function carregarTema() {
      setTema(normalizarTema(localStorage.getItem(CHAVE_TEMA_EMPRESA)))
    }

    carregarTema()

    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  return tema
}

function IconeVeiculo({ tipo, size = 22 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

function nomeVeiculo(tipo: Veiculo) {
  if (tipo === "moto") return "Motoboy"
  if (tipo === "carro") return "Carro"
  if (tipo === "van") return "Van / Fiorino"
  return "Caminhão"
}

export default function MotoristasPage() {
  const tema = useTemaEmpresa()
  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#ffffff] text-[#111111]" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#e8dcc2] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#10171b] shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
    card2: claro
      ? "bg-[#fbfaf7] border-[#e8dcc2]"
      : "bg-white/[0.045] border-white/10",
    textoFraco: claro ? "text-black/60" : "text-white/60",
    textoMaisFraco: claro ? "text-black/45" : "text-white/45",
    linha: claro ? "border-[#e8dcc2]" : "border-white/10",
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-bold text-[#d4af37]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">Motoristas e entregas</h1>
          <p className={`mt-2 max-w-2xl text-sm sm:text-base ${ui.textoFraco}`}>
            Acompanhe os motoristas em rota e veja o histórico das entregas já finalizadas.
          </p>
        </header>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Em andamento</h2>
            <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#d4af37]">
              {entregasEmAndamento.length} ativas
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {entregasEmAndamento.map((entrega) => (
              <CardEmAndamento key={entrega.id} entrega={entrega} ui={ui} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Histórico</h2>
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-500">
              Finalizadas
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {historicoEntregas.map((entrega) => (
              <CardHistorico key={entrega.id} entrega={entrega} ui={ui} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function CardEmAndamento({ entrega, ui }: { entrega: Entrega; ui: any }) {
  return (
    <article className={`rounded-[28px] border p-4 sm:p-5 ${ui.card}`}>
      <div className="flex gap-4">
        <img src={entrega.foto} alt={entrega.motorista} className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black leading-tight">{entrega.motorista}</h3>
              <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#d4af37]">
                <IconeVeiculo tipo={entrega.veiculo} size={16} />
                {nomeVeiculo(entrega.veiculo)}
              </div>
            </div>
            <span className="w-fit rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-xs font-black text-[#d4af37]">
              Em andamento
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info ui={ui} icon={<Package size={17} />} label="Mercadoria" value={entrega.mercadoria} />
        <Info ui={ui} icon={<CalendarDays size={17} />} label="Data/Hora" value={`${entrega.data} às ${entrega.horario}`} />
        <Info ui={ui} icon={<MapPin size={17} />} label="Origem" value={entrega.origem} />
        <Info ui={ui} icon={<Navigation size={17} />} label="Destino" value={entrega.destino} />
      </div>

      <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
        <div className="mb-2 flex items-center justify-between text-xs font-black">
          <span>Progresso da rota</span>
          <span>{entrega.progresso}%</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${entrega.progresso}%` }} />
        </div>
        <div className={`mt-3 flex flex-col gap-2 text-xs font-bold sm:flex-row sm:items-center sm:justify-between ${ui.textoFraco}`}>
          <span>Distância: {entrega.distancia}</span>
          <span>Falta: {entrega.tempoRestante}</span>
        </div>
      </div>
    </article>
  )
}

function CardHistorico({ entrega, ui }: { entrega: Entrega; ui: any }) {
  return (
    <article className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
      <div className="flex gap-4">
        <img src={entrega.foto} alt={entrega.motorista} className="h-14 w-14 rounded-2xl object-cover sm:h-16 sm:w-16" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-black">{entrega.motorista}</h3>
              <div className={`mt-2 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${ui.card2}`}>
                <IconeVeiculo tipo={entrega.veiculo} size={15} />
                {nomeVeiculo(entrega.veiculo)}
              </div>
            </div>
            <span className="flex w-fit items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-500">
              <CheckCircle2 size={14} />
              Finalizada
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info ui={ui} icon={<Package size={17} />} label="Mercadoria" value={entrega.mercadoria} />
        <Info ui={ui} icon={<CalendarDays size={17} />} label="Data/Hora" value={`${entrega.data} às ${entrega.horario}`} />
        <Info ui={ui} icon={<MapPin size={17} />} label="Origem" value={entrega.origem} />
        <Info ui={ui} icon={<Navigation size={17} />} label="Destino" value={entrega.destino} />
      </div>

      <div className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 ${ui.card2}`}>
        <span className={`text-sm font-bold ${ui.textoFraco}`}>Valor da entrega</span>
        <strong className="text-lg font-black">{entrega.valor}</strong>
      </div>
    </article>
  )
}

function Info({ ui, icon, label, value }: { ui: any; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${ui.card2}`}>
      <span className="mt-0.5 text-[#d4af37]">{icon}</span>
      <div>
        <p className={`text-xs font-black ${ui.textoMaisFraco}`}>{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}
