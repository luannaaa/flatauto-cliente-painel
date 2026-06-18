"use client"

import { useEffect, useState } from "react"
import { Bike, Car, Truck, Bus, MapPin, Navigation, Clock, Package } from "lucide-react"
import { freteAoVivo } from "../../data/freteAoVivo"

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
    cliente: freteAoVivo.empresa,
    veiculo: freteAoVivo.tipoVeiculo,
    motorista: freteAoVivo.motorista,
    origem: freteAoVivo.origem,
    destino: freteAoVivo.destino,
    tempo: freteAoVivo.previsao,
    status: "Em andamento",
    posicao: freteAoVivo.posicaoAtual,
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
    posicao: "Simulada",
  },
]

function IconeVeiculo({ tipo, size = 20 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

export default function MapaEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [selecionada, setSelecionada] = useState<EntregaMapa>(entregas[0])

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)
  }, [])

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90" : "border-white/10 bg-[#10171b]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.04]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  return (
    <main className={`min-h-screen px-4 py-6 sm:px-8 ${ui.pagina}`}>
      <div className="mx-auto max-w-[1180px]">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="text-3xl font-black sm:text-4xl">Mapa</h1>
          <p className={`mt-2 max-w-[680px] text-sm ${ui.textoFraco}`}>
            Entregas em andamento interligadas com o motorista e o painel do cliente.
          </p>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
          <aside className={`rounded-[28px] border p-5 ${ui.card}`}>
            <h2 className="text-xl font-black">Entregas em andamento</h2>
            <p className={`mt-2 text-sm ${ui.textoFraco}`}>Toque em uma entrega para ver o veículo no mapa.</p>

            <div className="mt-5 space-y-3">
              {entregas.map((entrega) => (
                <button
                  key={entrega.id}
                  onClick={() => setSelecionada(entrega)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selecionada.id === entrega.id ? "border-[#ffc400] bg-[#ffc400]/10" : `${ui.card2}`}`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                      <IconeVeiculo tipo={entrega.veiculo} />
                    </div>

                    <div>
                      <h3 className="font-black">{entrega.cliente}</h3>
                      <p className={`text-xs ${ui.textoFraco}`}>{entrega.motorista} • {entrega.veiculo}</p>
                      <p className="mt-2 text-xs font-bold text-green-400">📍 {entrega.origem}</p>
                      <p className="text-xs font-bold text-red-400">📍 {entrega.destino}</p>
                      <p className="mt-1 text-xs font-bold text-[#ffc400]">⏱ Falta {entrega.tempo}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className={`overflow-hidden rounded-[28px] border ${ui.card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <h2 className="text-xl font-black">{selecionada.cliente}</h2>
                <p className={`text-sm ${ui.textoFraco}`}>{selecionada.origem} → {selecionada.destino}</p>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">{selecionada.status}</span>
            </div>

            <div className="relative h-[430px] overflow-hidden bg-[#dbe8d1]">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-[12%] top-[55%] h-[2px] w-[84%] -rotate-8 bg-white" />
                <div className="absolute left-[20%] top-[10%] h-[90%] w-[2px] rotate-6 bg-white" />
                <div className="absolute left-[55%] top-[0] h-[100%] w-[2px] -rotate-8 bg-white" />
                <div className="absolute left-[34%] top-[70%] h-[2px] w-[70%] rotate-5 bg-white" />
              </div>

              <div className="absolute left-[18%] top-[37%] h-20 w-28 rounded-3xl bg-green-400/25" />
              <div className="absolute right-[12%] top-[20%] h-24 w-32 rounded-3xl bg-green-400/25" />
              <div className="absolute bottom-[5%] left-[42%] h-28 w-40 rounded-3xl bg-green-400/25" />
              <div className="absolute left-[21%] top-[58%] h-[4px] w-[53%] -rotate-8 rounded-full bg-[#ffc400]" />

              <div className="absolute left-[18%] top-[54%] flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-xl"><MapPin size={18} /></div>
              <div className="absolute left-[44%] top-[49%] flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.55)]"><IconeVeiculo tipo={selecionada.veiculo} size={24} /></div>
              <div className="absolute right-[22%] top-[43%] flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-xl"><MapPin size={18} /></div>

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl bg-black/65 p-3 backdrop-blur-md sm:grid-cols-4">
                <InfoMapa icon={<Package size={16} />} label="Cliente" valor={selecionada.cliente} />
                <InfoMapa icon={<IconeVeiculo tipo={selecionada.veiculo} size={16} />} label="Veículo" valor={selecionada.veiculo} />
                <InfoMapa icon={<Clock size={16} />} label="Tempo" valor={selecionada.tempo} />
                <InfoMapa icon={<Navigation size={16} />} label="Localização" valor={selecionada.posicao} />
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function InfoMapa({ icon, label, valor }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
      <p className="flex items-center gap-1 text-xs font-bold text-[#ffc400]">{icon}{label}</p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}
