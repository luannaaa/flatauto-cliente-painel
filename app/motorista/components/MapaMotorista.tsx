"use client"

import { useEffect, useState } from "react"
import {
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Package,
  Truck,
} from "lucide-react"
import { freteAoVivo } from "../../data/freteAoVivo"

type LocalizacaoMotorista = {
  latitude: number
  longitude: number
  accuracy?: number
}

export default function MapaMotorista() {
  const [aceita, setAceita] = useState(true)
  const [tipoVeiculo, setTipoVeiculo] = useState("caminhao")
  const [localizacao, setLocalizacao] = useState<LocalizacaoMotorista | null>(null)
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState(
    "Permita a localização para mostrar sua posição no mapa."
  )

  useEffect(() => {
    const tipoSalvo = localStorage.getItem("tipoVeiculoMotorista")
    if (tipoSalvo) setTipoVeiculo(tipoSalvo)

    if (!navigator.geolocation) {
      setMensagemLocalizacao("Este celular não suporta localização.")
      return
    }

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const novaLocalizacao = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        setLocalizacao(novaLocalizacao)
        setMensagemLocalizacao("Localização em tempo real ativa.")

        localStorage.setItem(
          "flatauto_motorista_localizacao",
          JSON.stringify({
            ...novaLocalizacao,
            tipoVeiculo: tipoSalvo || "caminhao",
            atualizadoEm: new Date().toISOString(),
          })
        )
      },
      () => {
        setMensagemLocalizacao(
          "Permissão de localização negada. Ative o GPS do celular."
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watcherId)
    }
  }, [])

  const mapaUrl = localizacao
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${localizacao.longitude - 0.01}%2C${localizacao.latitude - 0.01}%2C${localizacao.longitude + 0.01}%2C${localizacao.latitude + 0.01}&layer=mapnik&marker=${localizacao.latitude}%2C${localizacao.longitude}`
    : ""

  return (
    <section className="relative h-[calc(100vh-20px)] min-h-[720px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1014] text-white">
      <div className="absolute inset-0 bg-[#dbe8d1]">
        {localizacao ? (
          <>
            <iframe
              title="Mapa real do motorista"
              src={mapaUrl}
              className="h-full w-full border-0"
            />

            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                <IconeVeiculo tipo={tipoVeiculo} />
              </div>

              <div className="mt-2 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-[#ffc400]">
                Você está aqui
              </div>
            </div>

            <div className="pointer-events-none absolute left-[58%] top-[48%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-xl">
              <Car size={25} />
            </div>

            <div className="pointer-events-none absolute left-[38%] top-[55%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-xl">
              <Bike size={25} />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#10171b] px-8 text-center">
            <div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ffc400] text-black">
                <MapPin size={42} />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                Aguardando localização
              </h2>

              <p className="mt-3 text-sm text-white/60">
                Permita o acesso ao GPS para mostrar o motorista no mapa real.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-4 right-4 top-4 rounded-[24px] border border-white/10 bg-black/75 p-4 backdrop-blur-xl">
        <p className="text-xs font-black uppercase text-[#ffc400]">
          Mapa real do motorista
        </p>

        <h2 className="mt-1 text-xl font-black">{freteAoVivo.codigo}</h2>

        <p className="mt-1 text-sm text-white/60">
          {mensagemLocalizacao}
        </p>

        {localizacao && (
          <p className="mt-2 text-xs font-bold text-[#ffc400]">
            Lat: {localizacao.latitude.toFixed(5)} • Long:{" "}
            {localizacao.longitude.toFixed(5)}
          </p>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 rounded-[28px] border border-white/10 bg-[#10171b]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-white/40">
              Entrega ativa
            </p>

            <h3 className="mt-1 text-2xl font-black">
              {freteAoVivo.empresa}
            </h3>

            <p className="mt-1 text-sm font-bold text-[#ffc400]">
              {freteAoVivo.valor}
            </p>
          </div>

          <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
            {freteAoVivo.statusTexto}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <LinhaMapa label="Origem" valor={freteAoVivo.origem} cor="text-green-400" />
          <LinhaMapa label="Destino" valor={freteAoVivo.destino} cor="text-red-400" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Mini icon={<Clock size={16} />} label="Tempo" valor={freteAoVivo.previsao} />
          <Mini icon={<Navigation size={16} />} label="Distância" valor={freteAoVivo.distancia} />
          <Mini icon={<Package size={16} />} label="Nota" valor={freteAoVivo.notaFiscal.replace("NF-e ", "")} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="h-12 rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10 font-black text-[#ffc400]">
            Ver rota
          </button>

          <button
            onClick={() => setAceita(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#ffc400] font-black text-black"
          >
            <CheckCircle2 size={18} />
            {aceita ? "Em andamento" : "Aceitar"}
          </button>
        </div>
      </div>
    </section>
  )
}

function IconeVeiculo({ tipo }: { tipo: string }) {
  const tipoNormalizado = tipo.toLowerCase()

  if (tipoNormalizado.includes("moto")) return <Bike size={30} />
  if (tipoNormalizado.includes("carro")) return <Car size={30} />
  if (tipoNormalizado.includes("van")) return <Bus size={30} />

  return <Truck size={30} />
}

function LinhaMapa({ label, valor, cor }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className={`text-xs font-black uppercase ${cor}`}>{label}</p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}

function Mini({ icon, label, valor }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-white/45">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-xs font-black text-[#ffc400]">{valor}</p>
    </div>
  )
}