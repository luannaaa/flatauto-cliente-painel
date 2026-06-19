"use client"

import { useEffect, useState } from "react"
import { Bike, Bus, Car, Clock, MapPin, Navigation, Package, Truck } from "lucide-react"
import { freteAoVivo } from "../../data/freteAoVivo"

type Tema = "dark" | "light"
type Veiculo = "moto" | "carro" | "van" | "caminhao"

type LocalizacaoMotorista = {
  latitude: number
  longitude: number
  accuracy?: number
  tipoVeiculo?: string
  atualizadoEm?: string
}

function IconeVeiculo({ tipo, size = 20 }: { tipo: string; size?: number }) {
  const t = tipo.toLowerCase()
  if (t.includes("moto")) return <Bike size={size} />
  if (t.includes("carro")) return <Car size={size} />
  if (t.includes("van")) return <Bus size={size} />
  return <Truck size={size} />
}

export default function MapaEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [localizacao, setLocalizacao] = useState<LocalizacaoMotorista | null>(null)

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)

    function carregarLocalizacao() {
      const salva = localStorage.getItem("flatauto_motorista_localizacao")
      if (salva) setLocalizacao(JSON.parse(salva))
    }

    carregarLocalizacao()
    const intervalo = setInterval(carregarLocalizacao, 3000)

    return () => clearInterval(intervalo)
  }, [])

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90" : "border-white/10 bg-[#10171b]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.04]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  const tipoVeiculo = localizacao?.tipoVeiculo || freteAoVivo.tipoVeiculo || "caminhao"

  const mapaUrl = localizacao
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${localizacao.longitude - 0.01}%2C${localizacao.latitude - 0.01}%2C${localizacao.longitude + 0.01}%2C${localizacao.latitude + 0.01}&layer=mapnik&marker=${localizacao.latitude}%2C${localizacao.longitude}`
    : ""

  return (
    <main className={`min-h-screen px-4 py-6 sm:px-8 ${ui.pagina}`}>
      <div className="mx-auto max-w-[1180px]">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="text-3xl font-black sm:text-4xl">Mapa</h1>
          <p className={`mt-2 max-w-[680px] text-sm ${ui.textoFraco}`}>
            Acompanhe a localização em tempo real do motorista.
          </p>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
          <aside className={`rounded-[28px] border p-5 ${ui.card}`}>
            <h2 className="text-xl font-black">Entrega em andamento</h2>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                  <IconeVeiculo tipo={tipoVeiculo} />
                </div>

                <div>
                  <h3 className="font-black">{freteAoVivo.empresa}</h3>
                  <p className={`text-xs ${ui.textoFraco}`}>
                    {freteAoVivo.motorista} • {tipoVeiculo}
                  </p>
                  <p className="mt-2 text-xs font-bold text-green-400">📍 {freteAoVivo.origem}</p>
                  <p className="text-xs font-bold text-red-400">📍 {freteAoVivo.destino}</p>
                  <p className="mt-1 text-xs font-bold text-[#ffc400]">⏱ Falta {freteAoVivo.previsao}</p>
                </div>
              </div>
            </div>
          </aside>

          <section className={`overflow-hidden rounded-[28px] border ${ui.card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <h2 className="text-xl font-black">{freteAoVivo.empresa}</h2>
                <p className={`text-sm ${ui.textoFraco}`}>
                  {freteAoVivo.origem} → {freteAoVivo.destino}
                </p>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">
                Em andamento
              </span>
            </div>

            <div className="relative h-[430px] overflow-hidden bg-[#10171b]">
              {localizacao ? (
                <>
                  <iframe
                    title="Mapa real da empresa"
                    src={mapaUrl}
                    className="h-full w-full border-0"
                  />

                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                      <IconeVeiculo tipo={tipoVeiculo} size={30} />
                    </div>

                    <div className="mt-2 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-[#ffc400]">
                      Motorista aqui
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <div>
                    <MapPin className="mx-auto text-[#ffc400]" size={44} />
                    <h3 className="mt-4 text-xl font-black">Aguardando localização</h3>
                    <p className="mt-2 text-sm text-white/60">
                      Abra o painel do motorista e permita a localização.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl bg-black/70 p-3 backdrop-blur-md sm:grid-cols-4">
                <InfoMapa icon={<Package size={16} />} label="Cliente" valor={freteAoVivo.empresa} />
                <InfoMapa icon={<IconeVeiculo tipo={tipoVeiculo} size={16} />} label="Veículo" valor={tipoVeiculo} />
                <InfoMapa icon={<Clock size={16} />} label="Tempo" valor={freteAoVivo.previsao} />
                <InfoMapa
                  icon={<Navigation size={16} />}
                  label="Localização"
                  valor={localizacao ? "Tempo real" : "Aguardando"}
                />
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
      <p className="flex items-center gap-1 text-xs font-bold text-[#ffc400]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}