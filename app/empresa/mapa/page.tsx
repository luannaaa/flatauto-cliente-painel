"use client"

import { useEffect, useState } from "react"
import {
  Bike,
  Building2,
  Bus,
  Car,
  Clock,
  MapPin,
  Navigation,
  Package,
  Truck,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Tema = "dark" | "light"

type CorridaTempoReal = {
  id: string
  corrida_id?: string | null
  empresa_id: string | null
  cliente_id: string | null
  motorista_id: string | null
  origem: string | null
  destino: string | null
  cep_origem: string | null
  cep_destino: string | null
  tipo_carga: string | null
  valor_frete: number | null
  latitude_origem: number | null
  longitude_origem: number | null
  latitude_destino: number | null
  longitude_destino: number | null
  latitude_motorista: number | null
  longitude_motorista: number | null
  distancia_restante: string | null
  tempo_restante: string | null
  status: string | null
  veiculo_tipo: string | null
  veiculo_modelo: string | null
  veiculo_placa: string | null
  atualizado_em: string | null
}

type Motorista = {
  id: string
  nome: string | null
  telefone: string | null
  foto_perfil: string | null
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
  const [corrida, setCorrida] = useState<CorridaTempoReal | null>(null)
  const [motorista, setMotorista] = useState<Motorista | null>(null)
  const [localizacaoEmpresa, setLocalizacaoEmpresa] = useState<{ latitude: number; longitude: number } | null>(null)
  const [mensagem, setMensagem] = useState("Buscando corrida em tempo real...")
  const [erro, setErro] = useState("")

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)

    carregarMapa()

    const intervalo = setInterval(() => {
      carregarMapa()
    }, 3000)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoEmpresa({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          setMensagem("Sem corrida ativa. Permita a localização para mostrar a empresa.")
        }
      )
    }

    return () => clearInterval(intervalo)
  }, [])

  async function carregarMapa() {
    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setErro("Empresa não encontrada no login.")
      return
    }

    const { data, error } = await supabase
      .from("corridas_tempo_real")
      .select("*")
      .eq("empresa_id", empresaId)
      .in("status", ["Aceito", "Em andamento", "Iniciado", "Agendado em andamento"])
      .order("atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    if (!data) {
      setCorrida(null)
      setMotorista(null)
      setMensagem("Sem pedido ativo: mostrando a localização da empresa.")
      return
    }

    setCorrida(data)
    setMensagem("Motorista em tempo real.")
    setErro("")

    if (data.motorista_id) {
      const { data: motoristaData } = await supabase
        .from("motoristas")
        .select("id, nome, telefone, foto_perfil")
        .eq("id", data.motorista_id)
        .maybeSingle()

      setMotorista(motoristaData || null)
    }
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90" : "border-white/10 bg-[#10171b]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.04]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  const latitudeMotorista = Number(corrida?.latitude_motorista || 0)
  const longitudeMotorista = Number(corrida?.longitude_motorista || 0)

  const temMotoristaNoMapa =
    corrida && latitudeMotorista !== 0 && longitudeMotorista !== 0

  const latitudeAtual = temMotoristaNoMapa
    ? latitudeMotorista
    : localizacaoEmpresa?.latitude || 0

  const longitudeAtual = temMotoristaNoMapa
    ? longitudeMotorista
    : localizacaoEmpresa?.longitude || 0

  const tipoVeiculo = corrida?.veiculo_tipo || "caminhao"

  const mapaUrl =
    latitudeAtual && longitudeAtual
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitudeAtual - 0.01}%2C${latitudeAtual - 0.01}%2C${longitudeAtual + 0.01}%2C${latitudeAtual + 0.01}&layer=mapnik&marker=${latitudeAtual}%2C${longitudeAtual}`
      : ""

  return (
    <main className={`min-h-screen px-4 py-6 sm:px-8 ${ui.pagina}`}>
      <div className="mx-auto max-w-[1180px]">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="text-3xl font-black sm:text-4xl">Mapa</h1>
          <p className={`mt-2 max-w-[680px] text-sm ${ui.textoFraco}`}>
            {temMotoristaNoMapa
              ? "Acompanhe o motorista em tempo real."
              : "Sem pedido ativo: mostrando a localização da empresa."}
          </p>
        </header>

        {erro && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
          <aside className={`rounded-[28px] border p-5 ${ui.card}`}>
            <h2 className="text-xl font-black">
              {temMotoristaNoMapa ? "Entrega em andamento" : "Localização da empresa"}
            </h2>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                  {temMotoristaNoMapa ? <IconeVeiculo tipo={tipoVeiculo} /> : <Building2 size={22} />}
                </div>

                <div>
                  <h3 className="font-black">
                    {temMotoristaNoMapa ? motorista?.nome || "Motorista" : "Empresa"}
                  </h3>

                  <p className={`text-xs ${ui.textoFraco}`}>
                    {temMotoristaNoMapa
                      ? `${corrida?.veiculo_modelo || tipoVeiculo} • ${corrida?.veiculo_placa || "Sem placa"}`
                      : "Sede / ponto da empresa"}
                  </p>

                  <p className="mt-2 text-xs font-bold text-green-400">
                    📍 {temMotoristaNoMapa ? corrida?.origem || "Origem não informada" : "Local atual da empresa"}
                  </p>

                  {temMotoristaNoMapa && (
                    <p className="text-xs font-bold text-red-400">
                      📍 {corrida?.destino || "Destino não informado"}
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
                  {temMotoristaNoMapa ? "Corrida em tempo real" : "Mapa da empresa"}
                </h2>

                <p className={`text-sm ${ui.textoFraco}`}>
                  {temMotoristaNoMapa
                    ? `${corrida?.origem || "Origem"} → ${corrida?.destino || "Destino"}`
                    : "Localização atual pelo GPS"}
                </p>
              </div>

              <span className="rounded-full bg-[#ffc400]/15 px-4 py-2 text-xs font-black text-[#ffc400]">
                {temMotoristaNoMapa ? corrida?.status || "Em andamento" : "Empresa"}
              </span>
            </div>

            <div className="relative h-[430px] overflow-hidden bg-[#10171b]">
              {mapaUrl ? (
                <>
                  <iframe title="Mapa em tempo real" src={mapaUrl} className="h-full w-full border-0" />

                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,0.75)]">
                      {temMotoristaNoMapa ? <IconeVeiculo tipo={tipoVeiculo} size={30} /> : <Building2 size={32} />}
                    </div>

                    <div className="mt-2 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-[#ffc400]">
                      {temMotoristaNoMapa ? "Motorista aqui" : "Empresa aqui"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <div>
                    <MapPin className="mx-auto text-[#ffc400]" size={44} />
                    <h3 className="mt-4 text-xl font-black">Aguardando localização</h3>
                    <p className="mt-2 text-sm text-white/60">
                      Nenhuma corrida ativa encontrada no Supabase.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl bg-black/70 p-3 backdrop-blur-md sm:grid-cols-4">
                <InfoMapa icon={<Package size={16} />} label="Origem" valor={temMotoristaNoMapa ? corrida?.origem || "Não informado" : "Empresa"} />
                <InfoMapa icon={temMotoristaNoMapa ? <IconeVeiculo tipo={tipoVeiculo} size={16} /> : <Building2 size={16} />} label="Tipo" valor={temMotoristaNoMapa ? tipoVeiculo : "Empresa"} />
                <InfoMapa icon={<Clock size={16} />} label="Tempo" valor={temMotoristaNoMapa ? corrida?.tempo_restante || "Calculando" : "Local atual"} />
                <InfoMapa icon={<Navigation size={16} />} label="GPS" valor={temMotoristaNoMapa ? corrida?.distancia_restante || "Ativo" : "Aguardando"} />
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