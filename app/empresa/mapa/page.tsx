"use client"

import { useEffect, useState } from "react"
import {
  Bike,
  Car,
  Truck,
  Bus,
  MapPin,
  Navigation,
  Clock,
  Package,
} from "lucide-react"

type Tema = "dark" | "light"
type Veiculo = "moto" | "carro" | "van" | "caminhao"

type EntregaMapa = {
  id: number
  cliente: string
  veiculo: Veiculo
  motorista: string
  origem: string
  destino: string
  tempo: string
  status: "Em andamento"
  posicao: string
}

const entregas: EntregaMapa[] = [
  {
    id: 1,
    cliente: "Auto Peças Brasil",
    veiculo: "moto",
    motorista: "João Carlos",
    origem: "Av. Paulista",
    destino: "Moema",
    tempo: "18 min",
    status: "Em andamento",
    posicao: "top-[48%] left-[26%]",
  },
  {
    id: 2,
    cliente: "Mercado Central",
    veiculo: "carro",
    motorista: "Marcos Antônio",
    origem: "Pinheiros",
    destino: "Vila Mariana",
    tempo: "27 min",
    status: "Em andamento",
    posicao: "top-[62%] left-[58%]",
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

export default function MapaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [selecionada, setSelecionada] = useState<EntregaMapa>(entregas[0])

  useEffect(() => {
    function carregarTema() {
      const temaSalvo = localStorage.getItem("temaEmpresa")
      setTema(temaSalvo === "light" || temaSalvo === "claro" ? "light" : "dark")
    }

    carregarTema()
    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow-[0_18px_45px_rgba(80,60,20,0.10)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#dfd0a5] bg-[#f7f0dc]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#dfd0a5]" : "border-white/10",
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">Mapa</h1>
          <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
            Visual demonstrativo das entregas em andamento. Depois o backend vai
            puxar a localização real do motorista.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
          <aside className={`order-2 rounded-[30px] border p-4 sm:p-5 lg:order-1 ${ui.card}`}>
            <h2 className="text-xl font-black">Entregas em andamento</h2>
            <p className={`mt-1 text-sm ${ui.textoFraco}`}>
              Toque em uma entrega para ver o veículo no mapa.
            </p>

            <div className="mt-5 space-y-3">
              {entregas.map((entrega) => (
                <button
                  key={entrega.id}
                  onClick={() => setSelecionada(entrega)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selecionada.id === entrega.id
                      ? "border-[#ffc400] bg-[#ffc400]/10"
                      : ui.card2
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                      <IconeVeiculo tipo={entrega.veiculo} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black">{entrega.cliente}</h3>
                      <p className={`mt-1 text-xs font-bold ${ui.textoFraco}`}>
                        {entrega.motorista} • {nomeVeiculo(entrega.veiculo)}
                      </p>

                      <div className="mt-3 grid gap-2 text-xs font-bold">
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-green-500" />
                          {entrega.origem}
                        </span>

                        <span className="flex items-center gap-2">
                          <Navigation size={14} className="text-red-500" />
                          {entrega.destino}
                        </span>

                        <span className="flex items-center gap-2 text-[#ffc400]">
                          <Clock size={14} />
                          Falta {entrega.tempo}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className={`order-1 overflow-hidden rounded-[30px] border lg:order-2 ${ui.card}`}>
            <div className={`flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between ${ui.linha}`}>
              <div>
                <h2 className="text-xl font-black">{selecionada.cliente}</h2>
                <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                  {selecionada.origem} → {selecionada.destino}
                </p>
              </div>

              <span className="flex w-fit items-center gap-2 rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">
                <IconeVeiculo tipo={selecionada.veiculo} size={16} />
                {selecionada.status}
              </span>
            </div>

            <div className="relative h-[380px] overflow-hidden bg-[#d9e4d2] sm:h-[620px]">
              <div className="absolute inset-0 opacity-80">
                <div className="absolute left-[8%] top-[15%] h-[2px] w-[90%] rotate-[18deg] bg-white/80" />
                <div className="absolute left-[2%] top-[45%] h-[3px] w-[95%] -rotate-[8deg] bg-white/90" />
                <div className="absolute left-[20%] top-[75%] h-[2px] w-[70%] rotate-[4deg] bg-white/80" />
                <div className="absolute left-[25%] top-[5%] h-[95%] w-[3px] rotate-[7deg] bg-white/80" />
                <div className="absolute left-[60%] top-[0%] h-[100%] w-[3px] -rotate-[10deg] bg-white/80" />
              </div>

              <div className="absolute left-[8%] top-[8%] rounded-xl bg-green-500 px-3 py-2 text-xs font-black text-white">
                São Paulo - SP
              </div>

              <div className="absolute left-[18%] top-[30%] h-28 w-40 rounded-[35px] bg-green-500/20" />
              <div className="absolute right-[10%] top-[18%] h-32 w-48 rounded-[35px] bg-green-500/20" />
              <div className="absolute bottom-[10%] left-[35%] h-36 w-56 rounded-[35px] bg-green-500/20" />

              <div className="absolute left-[18%] top-[50%] h-[4px] w-[52%] -rotate-[10deg] rounded-full bg-[#ffc400]" />

              <div className="absolute left-[16%] top-[48%] flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                <MapPin size={20} />
              </div>

              <div className="absolute left-[68%] top-[38%] flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                <MapPin size={20} />
              </div>

              <div
                className={`absolute z-20 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_10px_35px_rgba(255,196,0,0.45)] ${selecionada.posicao}`}
              >
                <IconeVeiculo tipo={selecionada.veiculo} size={30} />
              </div>
            </div>

            <div
              className={`border-t p-4 sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-2xl sm:border ${
                claro
                  ? "border-[#dfd0a5] bg-white/95 sm:bg-white/85"
                  : "border-white/10 bg-[#0b1115]/95 sm:bg-black/70"
              } backdrop-blur-md`}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <Info ui={ui} icon={<Package size={17} />} label="Cliente" value={selecionada.cliente} />
                <Info ui={ui} icon={<Truck size={17} />} label="Veículo" value={nomeVeiculo(selecionada.veiculo)} />
                <Info ui={ui} icon={<Clock size={17} />} label="Tempo" value={selecionada.tempo} />
                <Info ui={ui} icon={<MapPin size={17} />} label="Localização" value="Simulada" />
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function Info({ ui, icon, label, value }: any) {
  return (
    <div className={`rounded-2xl border p-3 ${ui.card2}`}>
      <div className="flex items-center gap-2 text-[#ffc400]">
        {icon}
        <span className="text-xs font-black">{label}</span>
      </div>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  )
}