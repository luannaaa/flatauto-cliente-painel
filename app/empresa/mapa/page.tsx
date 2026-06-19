"use client"

import { useEffect, useState } from "react"
import { Bike, Building2, Bus, Car, Clock, MapPin, Navigation, Package, Truck } from "lucide-react"
import { freteAoVivo } from "../../data/freteAoVivo"

type Tema = "dark" | "light"

type Localizacao = {
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
  const [localizacaoMotorista, setLocalizacaoMotorista] = useState<Localizacao | null>(null)
  const [localizacaoEmpresa, setLocalizacaoEmpresa] = useState<Localizacao | null>(null)
  const [mensagem, setMensagem] = useState("Buscando localização...")

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)

    function carregarMotorista() {
      const salva = localStorage.getItem("flatauto_motorista_localizacao")
      if (salva) {
        try {
          setLocalizacaoMotorista(JSON.parse(salva))
          setMensagem("Motorista em tempo real.")
        } catch {
          setLocalizacaoMotorista(null)
        }
      }
    }

    carregarMotorista()
    const intervalo = setInterval(carregarMotorista, 3000)

    if (!navigator.geolocation) {
      setMensagem("Este dispositivo não suporta GPS.")
      return () => clearInterval(intervalo)
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const empresa = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          atualizadoEm: new Date().toISOString(),
        }

        setLocalizacaoEmpresa(empresa)
        localStorage.setItem("flatauto_empresa_localizacao", JSON.stringify(empresa))

        if (!localStorage.getItem("flatauto_motorista_localizacao")) {
          setMensagem("Localização da empresa ativa.")
        }
      },
      () => {
        setMensagem("Permita a localização para mostrar a empresa no mapa.")
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    )

    return () => clearInterval(intervalo)
  }, [])

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90" : "border-white/10 bg-[#10171b]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.04]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  const localizacaoAtual = localizacaoMotorista || localizacaoEmpresa
  const mostrandoMotorista = Boolean(localizacaoMotorista)
  const tipoVeiculo = localizacaoMotorista?.tipoVeiculo || freteAoVivo.tipoVeiculo || "caminhao"

  const mapaUrl = localizacaoAtual
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${localizacaoAtual.longitude - 0.01}%2C${localizacaoAtual.latitude - 0.01}%2C${localizacaoAtual.longitude + 0.01}%2C${localizacaoAtual.latitude + 0.01}&layer=mapnik&marker=${localizacaoAtual.latitude}%2C${localizacaoAtual.longitude}`
    : ""

  return (
    <main className={`min-h-screen px-4 py-6 sm:px-8 ${ui.pagina}`}>
      <div className="mx-auto max-w-[1180px]">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="text-3xl font-black sm:text-4xl">Mapa</h1>
          <p className={`mt-2 max-w-[680px] text-sm ${ui.textoFraco}`}>
            {mostrandoMotorista
              ? "Acompanhe o motorista em tempo real."
              : "Sem pedido ativo: mostrando a localização da empresa."}
          </p>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
          <aside className={`rounded-[28px] border p-5 ${ui.card}`}>
            <h2 className="text-xl font-black">
              {mostrandoMotorista ? "Entrega em andamento" : "Localização da empresa"}
            </h2>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                  {mostrandoMotorista ? <IconeVeiculo tipo={tipoVeiculo} /> : <Building2 size={22} />}
                </div>

                <div>
                  <h3 className="font-black">
                    {mostrandoMotorista ? freteAoVivo.empresa : "Empresa FlatAuto"}
                  </h3>

                  <p className={`text-xs ${ui.textoFraco}`}>
                    {mostrandoMotorista ? `${freteAoVivo.motorista} • ${tipoVeiculo}` : "Sede / ponto da empresa"}
                  </p>

                  <p className="mt-2 text-xs font-bold text-green-400">
                    📍 {mostrandoMotorista ? freteAoVivo.origem : "Local atual da empresa"}
                  </p>

                  {mostrandoMotorista && (
                    <p className="text-xs font-bold text-red-400">
                      📍 {freteAoVivo.destino}
                    </p>
                  )}

                  <p className="mt-1 text-xs font-bold text-[#ffc400]">
                    {mensagem}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className={`overflow-hidden rounded-[28px] border ${ui.card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <h2 className="text-xl font-black">
                  {mostrandoMotorista ? freteAoVivo.empresa : "Mapa da empresa"}
                </h2>

                <p className={`text-sm ${ui.textoFraco}`}>
                  {mostrandoMotorista
                    ? `${freteAoVivo.origem} → ${freteAoVivo.destino}`
                    : "Localização atual pelo GPS"}
                </p>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">
                {mostrandoMotorista ? "Em andamento" : "Empresa"}
              </span>
            </div>

            <div className="relative h-[430px] overflow-hidden bg-[#10171b]">
              {localizacaoAtual ? (
                <>
                  <iframe
                    title="Mapa real da empresa"
                    src={mapaUrl}
                    className="h-full w-full border-0"
                  />

                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                      {mostrandoMotorista ? <IconeVeiculo tipo={tipoVeiculo} size={30} /> : <Building2 size={32} />}
                    </div>

                    <div className="mt-2 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-[#ffc400]">
                      {mostrandoMotorista ? "Motorista aqui" : "Empresa aqui"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <div>
                    <MapPin className="mx-auto text-[#ffc400]" size={44} />
                    <h3 className="mt-4 text-xl font-black">Aguardando localização</h3>
                    <p className="mt-2 text-sm text-white/60">
                      Permita a localização no navegador.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl bg-black/70 p-3 backdrop-blur-md sm:grid-cols-4">
                <InfoMapa icon={<Package size={16} />} label="Origem" valor={mostrandoMotorista ? freteAoVivo.origem : "Empresa"} />
                <InfoMapa icon={mostrandoMotorista ? <IconeVeiculo tipo={tipoVeiculo} size={16} /> : <Building2 size={16} />} label="Tipo" valor={mostrandoMotorista ? tipoVeiculo : "Empresa"} />
                <InfoMapa icon={<Clock size={16} />} label="Tempo" valor={mostrandoMotorista ? freteAoVivo.previsao : "Local atual"} />
                <InfoMapa icon={<Navigation size={16} />} label="GPS" valor={localizacaoAtual ? "Ativo" : "Aguardando"} />
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