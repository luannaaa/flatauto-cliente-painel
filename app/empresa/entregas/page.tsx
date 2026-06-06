"use client"

import {
  Truck,
  Search,
  Plus,
  CalendarDays,
  MapPin,
  UserRound,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  MoreHorizontal,
} from "lucide-react"

const entregas = [
  {
    id: "#1287",
    cliente: "Auto Peças Brasil",
    origem: "São Paulo - SP",
    destino: "Campinas - SP",
    motorista: "Marcos Vinícius",
    carga: "Autopeças",
    veiculo: "VUC",
    valor: "R$ 1.250,00",
    data: "18/05/2026",
    horario: "14:30",
    status: "Concluída",
  },
  {
    id: "#1286",
    cliente: "Construtora Nova",
    origem: "Santos - SP",
    destino: "Ribeirão Preto - SP",
    motorista: "João Silva",
    carga: "Materiais de obra",
    veiculo: "Truck",
    valor: "R$ 2.340,00",
    data: "18/05/2026",
    horario: "16:00",
    status: "Em andamento",
  },
  {
    id: "#1285",
    cliente: "Mercado Central",
    origem: "Campinas - SP",
    destino: "São Paulo - SP",
    motorista: "Carlos Alberto",
    carga: "Alimentos",
    veiculo: "Fiorino",
    valor: "R$ 980,00",
    data: "17/05/2026",
    horario: "09:20",
    status: "Concluída",
  },
  {
    id: "#1284",
    cliente: "Indústria ABC",
    origem: "São Paulo - SP",
    destino: "Sorocaba - SP",
    motorista: "Rafael Costa",
    carga: "Peças industriais",
    veiculo: "Toco",
    valor: "R$ 1.870,00",
    data: "17/05/2026",
    horario: "11:45",
    status: "Cancelada",
  },
]

export default function EntregasEmpresaPage() {
  return (
    <main className="min-h-screen bg-[#f6f0df] px-6 py-6 text-black">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Entregas</h1>
          <p className="mt-1 text-sm text-black/55">
            Gerencie todas as entregas da empresa em tempo real.
          </p>
        </div>

        <button className="flex h-12 items-center gap-2 rounded-xl bg-[#ffc400] px-5 font-black text-black shadow">
          <Plus size={20} />
          Nova Entrega
        </button>
      </header>

      <section className="mb-6 grid grid-cols-4 gap-4">
        <CardResumo titulo="Total" valor="128" detalhe="Entregas registradas" icon={<Package />} />
        <CardResumo titulo="Concluídas" valor="96" detalhe="75% do total" icon={<CheckCircle2 />} verde />
        <CardResumo titulo="Em andamento" valor="18" detalhe="Acompanhando rota" icon={<Clock />} azul />
        <CardResumo titulo="Canceladas" valor="14" detalhe="11% do total" icon={<XCircle />} vermelho />
      </section>

      <section className="rounded-[26px] border border-[#dfd0a5] bg-white/90 p-5 shadow">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-[#dfd0a5] bg-[#f7f0dc] px-4">
            <Search size={19} />
            <input
              placeholder="Buscar por cliente, motorista, cidade ou ID..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button className="flex h-12 items-center gap-2 rounded-xl border border-[#dfd0a5] bg-[#f7f0dc] px-4 font-bold">
            <Filter size={18} />
            Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#dfd0a5] text-black/55">
                <th className="pb-4">ID</th>
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Origem</th>
                <th className="pb-4">Destino</th>
                <th className="pb-4">Motorista</th>
                <th className="pb-4">Carga</th>
                <th className="pb-4">Veículo</th>
                <th className="pb-4">Data</th>
                <th className="pb-4">Valor</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>

            <tbody>
              {entregas.map((entrega) => (
                <tr key={entrega.id} className="border-b border-[#dfd0a5]">
                  <td className="py-4 font-bold">{entrega.id}</td>

                  <td>
                    <div className="flex items-center gap-2">
                      <UserRound size={17} className="text-[#ffc400]" />
                      {entrega.cliente}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-green-600" />
                      {entrega.origem}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-red-500" />
                      {entrega.destino}
                    </div>
                  </td>

                  <td>{entrega.motorista}</td>

                  <td>
                    <div className="flex items-center gap-2">
                      <Package size={17} className="text-[#ffc400]" />
                      {entrega.carga}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <Truck size={17} className="text-black/70" />
                      {entrega.veiculo}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-black/60" />
                      {entrega.data} • {entrega.horario}
                    </div>
                  </td>

                  <td className="font-bold">{entrega.valor}</td>
                  <td><Status nome={entrega.status} /></td>

                  <td>
                    <button className="rounded-lg p-2 hover:bg-black/5">
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function CardResumo({ titulo, valor, detalhe, icon, verde, azul, vermelho }: any) {
  const cor = vermelho
    ? "text-red-500"
    : azul
    ? "text-sky-500"
    : verde
    ? "text-green-500"
    : "text-[#ffc400]"

  return (
    <div className="rounded-[24px] border border-[#dfd0a5] bg-white/90 p-5 shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-black/55">{titulo}</p>
          <h2 className="mt-3 text-4xl font-black">{valor}</h2>
          <p className={`mt-3 text-sm ${cor}`}>{detalhe}</p>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f0dc] ${cor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function Status({ nome }: { nome: string }) {
  const classe =
    nome === "Concluída"
      ? "bg-green-600"
      : nome === "Em andamento"
      ? "bg-blue-600"
      : "bg-red-600"

  return (
    <span className={`rounded-md px-3 py-1 text-xs font-bold text-white ${classe}`}>
      {nome}
    </span>
  )
}