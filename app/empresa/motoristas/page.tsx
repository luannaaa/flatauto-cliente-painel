"use client"

import {
  Bike,
  Car,
  Truck,
  Bus,
  MapPin,
  Clock,
  CalendarDays,
  Package,
  CheckCircle2,
  Navigation,
} from "lucide-react"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

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
  return (
    <main className="min-h-screen bg-[#f8f6ef] px-4 py-5 text-[#111] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-bold text-[#b99025]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">
            Motoristas e entregas
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60 sm:text-base">
            Acompanhe os motoristas em rota e veja o histórico das entregas já finalizadas.
          </p>
        </header>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Em andamento</h2>
            <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#9b7817]">
              {entregasEmAndamento.length} ativas
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {entregasEmAndamento.map((entrega) => (
              <CardEmAndamento key={entrega.id} entrega={entrega} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Histórico</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
              Finalizadas
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {historicoEntregas.map((entrega) => (
              <CardHistorico key={entrega.id} entrega={entrega} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function CardEmAndamento({ entrega }: { entrega: Entrega }) {
  return (
    <article className="rounded-[28px] border border-[#e8dcc2] bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="flex gap-4">
        <img
          src={entrega.foto}
          alt={entrega.motorista}
          className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black leading-tight">
                {entrega.motorista}
              </h3>

              <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#9b7817]">
                <IconeVeiculo tipo={entrega.veiculo} size={16} />
                {nomeVeiculo(entrega.veiculo)}
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-xs font-black text-[#9b7817]">
              Em andamento
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info icon={<Package size={17} />} label="Mercadoria" value={entrega.mercadoria} />
        <Info icon={<CalendarDays size={17} />} label="Data/Hora" value={`${entrega.data} às ${entrega.horario}`} />
        <Info icon={<MapPin size={17} />} label="Origem" value={entrega.origem} />
        <Info icon={<Navigation size={17} />} label="Destino" value={entrega.destino} />
      </div>

      <div className="mt-5 rounded-2xl bg-[#fbfaf7] p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-black">
          <span>Progresso da rota</span>
          <span>{entrega.progresso}%</span>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-[#d4af37]"
            style={{ width: `${entrega.progresso}%` }}
          />
        </div>

        <div className="mt-3 flex flex-col gap-2 text-xs font-bold text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <span>Distância: {entrega.distancia}</span>
          <span>Falta: {entrega.tempoRestante}</span>
        </div>
      </div>
    </article>
  )
}

function CardHistorico({ entrega }: { entrega: Entrega }) {
  return (
    <article className="rounded-[26px] border border-[#e8dcc2] bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex gap-4">
        <img
          src={entrega.foto}
          alt={entrega.motorista}
          className="h-14 w-14 rounded-2xl object-cover sm:h-16 sm:w-16"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-black">{entrega.motorista}</h3>

              <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-black">
                <IconeVeiculo tipo={entrega.veiculo} size={15} />
                {nomeVeiculo(entrega.veiculo)}
              </div>
            </div>

            <span className="flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
              <CheckCircle2 size={14} />
              Finalizada
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info icon={<Package size={17} />} label="Mercadoria" value={entrega.mercadoria} />
        <Info icon={<CalendarDays size={17} />} label="Data/Hora" value={`${entrega.data} às ${entrega.horario}`} />
        <Info icon={<MapPin size={17} />} label="Origem" value={entrega.origem} />
        <Info icon={<Navigation size={17} />} label="Destino" value={entrega.destino} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#fbfaf7] px-4 py-3">
        <span className="text-sm font-bold text-black/60">Valor da entrega</span>
        <strong className="text-lg font-black">{entrega.valor}</strong>
      </div>
    </article>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#fbfaf7] p-3">
      <span className="mt-0.5 text-[#d4af37]">{icon}</span>
      <div>
        <p className="text-xs font-black text-black/45">{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}