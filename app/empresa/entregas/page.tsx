"use client"

import { useEffect, useState } from "react"
import NovaEntregaModal from "../components/NovaEntregaModal"
import { Truck, Search, Plus, CalendarDays, MapPin, UserRound, Package, CheckCircle2, Clock, XCircle, Filter, MoreHorizontal } from "lucide-react"

type Tema = "dark" | "light"

const entregas = [
  { id: "#1287", cliente: "Auto Peças Brasil", origem: "São Paulo - SP", destino: "Campinas - SP", motorista: "Marcos Vinícius", carga: "Autopeças", veiculo: "VUC", valor: "R$ 1.250,00", data: "18/05/2026", horario: "14:30", status: "Concluída" },
  { id: "#1286", cliente: "Construtora Nova", origem: "Santos - SP", destino: "Ribeirão Preto - SP", motorista: "João Silva", carga: "Materiais de obra", veiculo: "Truck", valor: "R$ 2.340,00", data: "18/05/2026", horario: "16:00", status: "Em andamento" },
  { id: "#1285", cliente: "Mercado Central", origem: "Campinas - SP", destino: "São Paulo - SP", motorista: "Carlos Alberto", carga: "Alimentos", veiculo: "Fiorino", valor: "R$ 980,00", data: "17/05/2026", horario: "09:20", status: "Concluída" },
  { id: "#1284", cliente: "Indústria ABC", origem: "São Paulo - SP", destino: "Sorocaba - SP", motorista: "Rafael Costa", carga: "Peças industriais", veiculo: "Toco", valor: "R$ 1.870,00", data: "17/05/2026", horario: "11:45", status: "Cancelada" },
]

export default function EntregasEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)
  }, [])

  const claro = tema === "light"
  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90 shadow" : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#dfd0a5]" : "border-white/10",
    iconeEscuro: claro ? "text-black/70" : "text-white/70",
  }

  return (
    <main className={`min-h-screen px-4 py-5 md:px-6 md:py-6 ${ui.pagina}`}>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black">Entregas</h1>
          <p className={`mt-1 text-sm ${ui.textoFraco}`}>Gerencie todas as entregas da empresa em tempo real.</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] px-5 font-black text-black shadow md:w-auto"><Plus size={20} />Nova Entrega</button>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <CardResumo ui={ui} titulo="Total" valor="128" detalhe="Entregas registradas" icon={<Package />} />
        <CardResumo ui={ui} titulo="Concluídas" valor="96" detalhe="75% do total" icon={<CheckCircle2 />} verde />
        <CardResumo ui={ui} titulo="Em andamento" valor="18" detalhe="Acompanhando rota" icon={<Clock />} azul />
        <CardResumo ui={ui} titulo="Canceladas" valor="14" detalhe="11% do total" icon={<XCircle />} vermelho />
      </section>

      <section className={`rounded-[26px] border p-4 md:p-5 ${ui.card}`}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
            <Search size={19} />
            <input placeholder="Buscar por cliente, motorista, cidade ou ID..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <button className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}><Filter size={18} />Filtrar</button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead><tr className={`border-b ${ui.linha} ${ui.textoFraco}`}><th className="pb-4">ID</th><th className="pb-4">Cliente</th><th className="pb-4">Origem</th><th className="pb-4">Destino</th><th className="pb-4">Motorista</th><th className="pb-4">Carga</th><th className="pb-4">Veículo</th><th className="pb-4">Data</th><th className="pb-4">Valor</th><th className="pb-4">Status</th><th className="pb-4"></th></tr></thead>
            <tbody>{entregas.map((entrega) => <tr key={entrega.id} className={`border-b ${ui.linha}`}><td className="py-4 font-bold">{entrega.id}</td><td><IconText icon={<UserRound size={17} className="text-[#ffc400]" />} text={entrega.cliente} /></td><td><IconText icon={<MapPin size={17} className="text-green-500" />} text={entrega.origem} /></td><td><IconText icon={<MapPin size={17} className="text-red-500" />} text={entrega.destino} /></td><td>{entrega.motorista}</td><td><IconText icon={<Package size={17} className="text-[#ffc400]" />} text={entrega.carga} /></td><td><IconText icon={<Truck size={17} className={ui.iconeEscuro} />} text={entrega.veiculo} /></td><td><IconText icon={<CalendarDays size={17} className={ui.iconeEscuro} />} text={`${entrega.data} • ${entrega.horario}`} /></td><td className="font-bold">{entrega.valor}</td><td><Status nome={entrega.status} /></td><td><button className="rounded-lg p-2 hover:bg-white/10"><MoreHorizontal size={19} /></button></td></tr>)}</tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {entregas.map((entrega) => (
            <article key={entrega.id} className={`rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex items-start justify-between gap-3"><div><p className={`text-xs font-bold ${ui.textoFraco}`}>{entrega.id} • {entrega.data} às {entrega.horario}</p><h3 className="mt-1 text-base font-black">{entrega.cliente}</h3></div><Status nome={entrega.status} /></div>
              <div className="mt-4 space-y-2 text-sm"><IconText icon={<MapPin size={17} className="text-green-500" />} text={entrega.origem} /><IconText icon={<MapPin size={17} className="text-red-500" />} text={entrega.destino} /><IconText icon={<UserRound size={17} className="text-[#ffc400]" />} text={entrega.motorista} /><IconText icon={<Package size={17} className="text-[#ffc400]" />} text={entrega.carga} /><IconText icon={<Truck size={17} className={ui.iconeEscuro} />} text={entrega.veiculo} /></div>
              <div className={`mt-4 flex items-center justify-between border-t pt-3 ${ui.linha}`}><span className={`text-xs ${ui.textoFraco}`}>Valor da entrega</span><strong>{entrega.valor}</strong></div>
            </article>
          ))}
        </div>
      </section>

      {modalAberto && <NovaEntregaModal ui={ui} fechar={() => setModalAberto(false)} />}
    </main>
  )
}

function IconText({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="flex items-center gap-2">{icon}<span>{text}</span></div> }

function CardResumo({ titulo, valor, detalhe, icon, verde, azul, vermelho, ui }: any) {
  const cor = vermelho ? "text-red-500" : azul ? "text-sky-500" : verde ? "text-green-500" : "text-[#ffc400]"
  return <div className={`rounded-[24px] border p-4 md:p-5 ${ui.card}`}><div className="flex items-start justify-between gap-3"><div><p className={`text-xs md:text-sm ${ui.textoFraco}`}>{titulo}</p><h2 className="mt-3 text-[30px] font-black leading-none md:text-4xl">{valor}</h2><p className={`mt-3 text-xs md:text-sm ${cor}`}>{detalhe}</p></div><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl md:h-14 md:w-14 ${ui.card2} ${cor}`}>{icon}</div></div></div>
}

function Status({ nome }: { nome: string }) {
  const classe = nome === "Concluída" ? "bg-green-600" : nome === "Em andamento" ? "bg-blue-600" : "bg-red-600"
  return <span className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-bold text-white ${classe}`}>{nome}</span>
}
