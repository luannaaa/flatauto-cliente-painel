"use client"

import { useEffect, useState } from "react"
import {
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  Gauge,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react"

type Tema = "dark" | "light"
type TipoVeiculo = "moto" | "carro" | "van" | "caminhao"
type StatusVeiculo = "Disponível" | "Em rota" | "Manutenção" | "Inativo"

type Veiculo = {
  id: number
  tipo: TipoVeiculo
  nome: string
  placa: string
  documento: string
  motorista: string
  origem?: string
  destino?: string
  status: StatusVeiculo
  km: string
  ultimaAtualizacao: string
}

const veiculos: Veiculo[] = [
  {
    id: 1,
    tipo: "moto",
    nome: "Honda CG 160",
    placa: "MOT-2A45",
    documento: "CRLV ativo",
    motorista: "João Carlos Silva",
    origem: "Recife - PE",
    destino: "Jaboatão - PE",
    status: "Em rota",
    km: "28.450 km",
    ultimaAtualizacao: "08/06/2026 14:50",
  },
  {
    id: 2,
    tipo: "carro",
    nome: "Fiat Strada",
    placa: "CAR-8B92",
    documento: "CRLV ativo",
    motorista: "Marcos Antônio",
    status: "Disponível",
    km: "64.210 km",
    ultimaAtualizacao: "08/06/2026 13:20",
  },
  {
    id: 3,
    tipo: "van",
    nome: "Fiorino / Van",
    placa: "VAN-4C17",
    documento: "Vistoria pendente",
    motorista: "Carlos Eduardo",
    status: "Manutenção",
    km: "83.900 km",
    ultimaAtualizacao: "07/06/2026 18:05",
  },
  {
    id: 4,
    tipo: "caminhao",
    nome: "VUC Delivery",
    placa: "TRK-7D33",
    documento: "CRLV ativo",
    motorista: "Roberto Lima",
    origem: "Camaragibe - PE",
    destino: "Cabo - PE",
    status: "Em rota",
    km: "120.300 km",
    ultimaAtualizacao: "08/06/2026 15:10",
  },
]

function carregarTemaGlobal(): Tema {
  if (typeof window === "undefined") return "dark"

  const temaSalvo = localStorage.getItem("temaEmpresa")

  if (temaSalvo === "light" || temaSalvo === "claro") return "light"
  return "dark"
}

function IconeVeiculo({ tipo, size = 24 }: { tipo: TipoVeiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

function nomeTipo(tipo: TipoVeiculo) {
  if (tipo === "moto") return "Motoboy"
  if (tipo === "carro") return "Carro utilitário"
  if (tipo === "van") return "Van / Fiorino"
  return "Caminhão / VUC"
}

export default function VeiculosPage() {
  const [tema, setTema] = useState<Tema>("dark")

  useEffect(() => {
    function atualizarTema() {
      setTema(carregarTemaGlobal())
    }

    atualizarTema()

    window.addEventListener("storage", atualizarTema)
    window.addEventListener("temaEmpresaAtualizado", atualizarTema)

    return () => {
      window.removeEventListener("storage", atualizarTema)
      window.removeEventListener("temaEmpresaAtualizado", atualizarTema)
    }
  }, [])

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#ffffff] text-[#111111]" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#e8dcc2] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#e8dcc2] bg-[#fbfaf7]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/58" : "text-white/60",
    textoMaisFraco: claro ? "text-black/42" : "text-white/42",
    linha: claro ? "border-[#e8dcc2]" : "border-white/10",
    input: claro ? "placeholder:text-black/35" : "placeholder:text-white/35",
  }

  const disponiveis = veiculos.filter((item) => item.status === "Disponível").length
  const emRota = veiculos.filter((item) => item.status === "Em rota").length
  const manutencao = veiculos.filter((item) => item.status === "Manutenção").length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#d4af37]">Área da Empresa</p>
            <h1 className="mt-1 text-2xl font-black sm:text-4xl">Veículos</h1>
            <p className={`mt-2 max-w-2xl text-sm sm:text-base ${ui.textoFraco}`}>
              Controle a frota da empresa, documentos, motoristas vinculados e status de operação.
            </p>
          </div>

          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 font-black text-white shadow sm:w-auto">
            <Plus size={20} />
            Novo Veículo
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardResumo ui={ui} titulo="Total" valor={String(veiculos.length)} detalhe="Veículos cadastrados" icon={<Truck />} />
          <CardResumo ui={ui} titulo="Disponíveis" valor={String(disponiveis)} detalhe="Prontos para entrega" icon={<CheckCircle2 />} verde />
          <CardResumo ui={ui} titulo="Em rota" valor={String(emRota)} detalhe="Operação em andamento" icon={<Clock />} azul />
          <CardResumo ui={ui} titulo="Manutenção" valor={String(manutencao)} detalhe="Aguardando ajuste" icon={<Wrench />} vermelho />
        </section>

        <section className={`rounded-[28px] border p-4 sm:p-5 ${ui.card}`}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
              <Search size={19} className="text-[#d4af37]" />
              <input
                placeholder="Buscar por placa, motorista, tipo ou status..."
                className={`w-full bg-transparent text-sm outline-none ${ui.input}`}
              />
            </div>

            <button className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}>
              <Settings size={18} />
              Filtros
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {veiculos.map((veiculo) => (
              <CardVeiculo key={veiculo.id} veiculo={veiculo} ui={ui} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function CardVeiculo({ veiculo, ui }: { veiculo: Veiculo; ui: any }) {
  return (
    <article className={`rounded-[26px] border p-4 sm:p-5 ${ui.card2}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37] text-white shadow-[0_12px_35px_rgba(212,175,55,0.22)] sm:h-20 sm:w-20">
          <IconeVeiculo tipo={veiculo.tipo} size={34} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black leading-tight sm:text-xl">{veiculo.nome}</h2>
              <p className={`mt-1 text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
                {nomeTipo(veiculo.tipo)} • Placa {veiculo.placa}
              </p>
            </div>

            <StatusVeiculo nome={veiculo.status} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Info ui={ui} icon={<UserRound size={17} />} label="Motorista vinculado" value={veiculo.motorista} />
            <Info ui={ui} icon={<FileText size={17} />} label="Documento" value={veiculo.documento} />
            <Info ui={ui} icon={<Gauge size={17} />} label="Quilometragem" value={veiculo.km} />
            <Info ui={ui} icon={<Clock size={17} />} label="Atualização" value={veiculo.ultimaAtualizacao} />
          </div>

          {veiculo.status === "Em rota" && (
            <div className={`mt-4 rounded-2xl border p-3 ${ui.card}`}>
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-green-500" />
                  <span className="font-bold">{veiculo.origem}</span>
                </div>

                <div className="hidden h-[2px] flex-1 rounded-full bg-[#d4af37] sm:block" />

                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-red-500" />
                  <span className="font-bold">{veiculo.destino}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className={`flex items-center gap-2 text-xs font-bold ${ui.textoFraco}`}>
              <ShieldCheck size={16} className="text-[#d4af37]" />
              Pronto para backend/API
            </div>

            <button className={`rounded-xl border p-2 ${ui.card2}`}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function CardResumo({ titulo, valor, detalhe, icon, verde, azul, vermelho, ui }: any) {
  const cor = vermelho
    ? "text-red-500"
    : azul
    ? "text-sky-500"
    : verde
    ? "text-green-500"
    : "text-[#d4af37]"

  return (
    <div className={`rounded-[24px] border p-5 ${ui.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{valor}</h2>
          <p className={`mt-3 text-sm font-bold ${cor}`}>{detalhe}</p>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${ui.card2} ${cor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusVeiculo({ nome }: { nome: StatusVeiculo }) {
  const classe =
    nome === "Disponível"
      ? "bg-green-500/15 text-green-500 border-green-500/30"
      : nome === "Em rota"
      ? "bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/30"
      : nome === "Manutenção"
      ? "bg-red-500/15 text-red-500 border-red-500/30"
      : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"

  return (
    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${classe}`}>
      {nome}
    </span>
  )
}

function Info({ ui, icon, label, value }: { ui: any; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${ui.card}`}>
      <span className="mt-0.5 text-[#d4af37]">{icon}</span>
      <div className="min-w-0">
        <p className={`text-xs font-black ${ui.textoMaisFraco}`}>{label}</p>
        <p className="mt-1 truncate text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}
