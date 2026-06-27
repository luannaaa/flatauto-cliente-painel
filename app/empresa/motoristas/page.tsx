"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
import {
  Bike,
  Car,
  Truck,
  Bus,
  MapPin,
  CalendarDays,
  Package,
  CheckCircle2,
  Navigation,
  RefreshCw,
} from "lucide-react"

type Tema = "dark" | "light"
type Veiculo = "moto" | "carro" | "van" | "caminhao"

type Frete = {
  id: string
  codigo: string | null
  motorista_id: string | null
  empresa_id: string | null
  origem: string | null
  destino: string | null
  descricao_carga: string | null
  tipo_transporte: string | null
  status: string | null
  data_frete: string | null
  horario: string | null
  valor: string | null
  valor_frete: number | null
  created_at: string | null
}

type Motorista = {
  id: string
  nome: string | null
  telefone: string | null
  foto_perfil: string | null
  modelo_caminhao: string | null
  placa: string | null
  tipo_caminhao: string | null
  capacidade: number | null
}

type VeiculoBanco = {
  id: string
  motorista_id: string | null
  tipo_veiculo: string | null
  marca: string | null
  modelo: string | null
  placa: string | null
  cor: string | null
  ativo: boolean | null
}

const CHAVE_TEMA_EMPRESA = "temaEmpresa"

function normalizarTema(valor: string | null): Tema {
  if (valor === "light" || valor === "claro") return "light"
  if (valor === "dark" || valor === "escuro") return "dark"
  return "dark"
}

function tipoVeiculoVisual(valor?: string | null): Veiculo {
  const texto = String(valor || "").toLowerCase()

  if (texto.includes("moto")) return "moto"
  if (texto.includes("carro")) return "carro"
  if (texto.includes("van") || texto.includes("fiorino")) return "van"
  return "caminhao"
}

function IconeVeiculo({ tipo, size = 22 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

function nomeVeiculo(tipo: Veiculo, original?: string | null) {
  if (original) return original
  if (tipo === "moto") return "Motoboy"
  if (tipo === "carro") return "Carro"
  if (tipo === "van") return "Van / Fiorino"
  return "Caminhão"
}

function formatarData(data?: string | null) {
  if (!data) return "Sem data"

  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
  }

  const dataObj = new Date(data)
  if (Number.isNaN(dataObj.getTime())) return data

  return dataObj.toLocaleDateString("pt-BR")
}

function formatarMoeda(valor: string | number | null | undefined) {
  if (valor === null || valor === undefined || valor === "") return "R$ 0,00"

  if (typeof valor === "number") {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return valor
}

function statusTexto(status?: string | null) {
  return String(status || "Aguardando").trim()
}

function estaEmAndamento(status?: string | null) {
  const texto = statusTexto(status).toLowerCase()
  return (
    texto.includes("aceito") ||
    texto.includes("aceita") ||
    texto.includes("andamento") ||
    texto.includes("rota") ||
    texto.includes("coleta")
  )
}

function estaFinalizado(status?: string | null) {
  const texto = statusTexto(status).toLowerCase()
  return texto.includes("conclu") || texto.includes("finaliz") || texto.includes("entregue")
}

export default function MotoristasPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [fretes, setFretes] = useState<Frete[]>([])
  const [motoristas, setMotoristas] = useState<Record<string, Motorista>>({})
  const [veiculos, setVeiculos] = useState<Record<string, VeiculoBanco>>({})
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    function carregarTema() {
      const temaSalvo = normalizarTema(localStorage.getItem(CHAVE_TEMA_EMPRESA))
      setTema(temaSalvo)
    }

    carregarTema()

    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setCarregando(true)
    setErro("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setFretes([])
      setCarregando(false)
      setErro("Empresa não encontrada no login. Entre novamente.")
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select(
        "id,codigo,motorista_id,empresa_id,origem,destino,descricao_carga,tipo_transporte,status,data_frete,horario,valor,valor_frete,created_at"
      )
      .eq("empresa_id", empresaId)
      .not("motorista_id", "is", null)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setFretes([])
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? (data as Frete[]) : []
    setFretes(lista)

    const motoristaIds = Array.from(
      new Set(lista.map((frete) => frete.motorista_id).filter(Boolean))
    ) as string[]

    if (motoristaIds.length > 0) {
      const { data: motoristasData } = await supabase
        .from("motoristas")
        .select("id,nome,telefone,foto_perfil,modelo_caminhao,placa,tipo_caminhao,capacidade")
        .in("id", motoristaIds)

      const mapaMotoristas: Record<string, Motorista> = {}

      ;((motoristasData || []) as Motorista[]).forEach((motorista) => {
        mapaMotoristas[motorista.id] = motorista
      })

      setMotoristas(mapaMotoristas)

      const { data: veiculosData } = await supabase
        .from("veiculos")
        .select("id,motorista_id,tipo_veiculo,marca,modelo,placa,cor,ativo")
        .in("motorista_id", motoristaIds)

      const mapaVeiculos: Record<string, VeiculoBanco> = {}

      ;((veiculosData || []) as VeiculoBanco[]).forEach((veiculo) => {
        if (veiculo.motorista_id && !mapaVeiculos[veiculo.motorista_id]) {
          mapaVeiculos[veiculo.motorista_id] = veiculo
        }
      })

      setVeiculos(mapaVeiculos)
    } else {
      setMotoristas({})
      setVeiculos({})
    }

    setCarregando(false)
  }

  const entregasEmAndamento = useMemo(
    () => fretes.filter((frete) => estaEmAndamento(frete.status)),
    [fretes]
  )

  const historicoEntregas = useMemo(
    () => fretes.filter((frete) => estaFinalizado(frete.status)),
    [fretes]
  )

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#ffffff] text-[#111111]" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#e8dcc2] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#10171b] shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
    card2: claro
      ? "bg-[#fbfaf7] border-[#e8dcc2]"
      : "bg-white/[0.045] border-white/10",
    textoFraco: claro ? "text-black/60" : "text-white/60",
    textoMaisFraco: claro ? "text-black/45" : "text-white/45",
    linha: claro ? "border-[#e8dcc2]" : "border-white/10",
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#d4af37]">Área da Empresa</p>

            <h1 className="mt-1 text-2xl font-black sm:text-4xl">
              Motoristas e entregas
            </h1>

            <p className={`mt-2 max-w-2xl text-sm sm:text-base ${ui.textoFraco}`}>
              Estrutura limpa, sem dados de demonstração. As informações aparecem quando um motorista aceita uma entrega.
            </p>
          </div>

          <button
            type="button"
            onClick={carregarDados}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </header>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Em andamento</h2>

            <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#d4af37]">
              {entregasEmAndamento.length} ativas
            </span>
          </div>

          {carregando ? (
            <Vazio ui={ui} texto="Carregando entregas aceitas pelo Supabase..." />
          ) : entregasEmAndamento.length === 0 ? (
            <Vazio ui={ui} texto="Nenhum motorista em rota ainda. Quando um motorista aceitar uma entrega, ela aparecerá aqui." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {entregasEmAndamento.map((frete) => (
                <CardEmAndamento
                  key={frete.id}
                  frete={frete}
                  motorista={frete.motorista_id ? motoristas[frete.motorista_id] : undefined}
                  veiculo={frete.motorista_id ? veiculos[frete.motorista_id] : undefined}
                  ui={ui}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Histórico</h2>

            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-500">
              {historicoEntregas.length} finalizadas
            </span>
          </div>

          {carregando ? (
            <Vazio ui={ui} texto="Carregando histórico..." />
          ) : historicoEntregas.length === 0 ? (
            <Vazio ui={ui} texto="Nenhuma entrega finalizada ainda." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {historicoEntregas.map((frete) => (
                <CardHistorico
                  key={frete.id}
                  frete={frete}
                  motorista={frete.motorista_id ? motoristas[frete.motorista_id] : undefined}
                  veiculo={frete.motorista_id ? veiculos[frete.motorista_id] : undefined}
                  ui={ui}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function CardEmAndamento({
  frete,
  motorista,
  veiculo,
  ui,
}: {
  frete: Frete
  motorista?: Motorista
  veiculo?: VeiculoBanco
  ui: any
}) {
  const tipoOriginal = veiculo?.tipo_veiculo || motorista?.tipo_caminhao || frete.tipo_transporte
  const tipo = tipoVeiculoVisual(tipoOriginal)
  const nomeMotorista = motorista?.nome || "Motorista não encontrado"
  const foto = motorista?.foto_perfil || ""

  return (
    <article className={`rounded-[28px] border p-4 sm:p-5 ${ui.card}`}>
      <div className="flex gap-4">
        {foto ? (
          <img
            src={foto}
            alt={nomeMotorista}
            className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37] text-black sm:h-20 sm:w-20">
            <IconeVeiculo tipo={tipo} size={30} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black leading-tight">{nomeMotorista}</h3>

              <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-black text-[#d4af37]">
                <IconeVeiculo tipo={tipo} size={16} />
                {nomeVeiculo(tipo, tipoOriginal)}
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-xs font-black text-[#d4af37]">
              {statusTexto(frete.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info ui={ui} icon={<Package size={17} />} label="Mercadoria" value={frete.descricao_carga || "Sem carga"} />
        <Info ui={ui} icon={<CalendarDays size={17} />} label="Data/Hora" value={`${formatarData(frete.data_frete)}${frete.horario ? ` às ${frete.horario}` : ""}`} />
        <Info ui={ui} icon={<MapPin size={17} />} label="Origem" value={frete.origem || "Sem origem"} />
        <Info ui={ui} icon={<Navigation size={17} />} label="Destino" value={frete.destino || "Sem destino"} />
      </div>

      <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
        <div className="mb-2 flex items-center justify-between text-xs font-black">
          <span>Status da rota</span>
          <span>{statusTexto(frete.status)}</span>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-1/2 rounded-full bg-[#d4af37]" />
        </div>

        <div className={`mt-3 flex flex-col gap-2 text-xs font-bold sm:flex-row sm:items-center sm:justify-between ${ui.textoFraco}`}>
          <span>Código: {frete.codigo || frete.id}</span>
          <span>Valor: {formatarMoeda(frete.valor_frete || frete.valor)}</span>
        </div>
      </div>
    </article>
  )
}

function CardHistorico({
  frete,
  motorista,
  veiculo,
  ui,
}: {
  frete: Frete
  motorista?: Motorista
  veiculo?: VeiculoBanco
  ui: any
}) {
  const tipoOriginal = veiculo?.tipo_veiculo || motorista?.tipo_caminhao || frete.tipo_transporte
  const tipo = tipoVeiculoVisual(tipoOriginal)
  const nomeMotorista = motorista?.nome || "Motorista não encontrado"
  const foto = motorista?.foto_perfil || ""

  return (
    <article className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
      <div className="flex gap-4">
        {foto ? (
          <img
            src={foto}
            alt={nomeMotorista}
            className="h-14 w-14 rounded-2xl object-cover sm:h-16 sm:w-16"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37] text-black sm:h-16 sm:w-16">
            <IconeVeiculo tipo={tipo} size={25} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-black">{nomeMotorista}</h3>

              <div className={`mt-2 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${ui.card2}`}>
                <IconeVeiculo tipo={tipo} size={15} />
                {nomeVeiculo(tipo, tipoOriginal)}
              </div>
            </div>

            <span className="flex w-fit items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-500">
              <CheckCircle2 size={14} />
              Finalizada
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Info ui={ui} icon={<Package size={17} />} label="Mercadoria" value={frete.descricao_carga || "Sem carga"} />
        <Info ui={ui} icon={<CalendarDays size={17} />} label="Data/Hora" value={`${formatarData(frete.data_frete)}${frete.horario ? ` às ${frete.horario}` : ""}`} />
        <Info ui={ui} icon={<MapPin size={17} />} label="Origem" value={frete.origem || "Sem origem"} />
        <Info ui={ui} icon={<Navigation size={17} />} label="Destino" value={frete.destino || "Sem destino"} />
      </div>

      <div className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 ${ui.card2}`}>
        <span className={`text-sm font-bold ${ui.textoFraco}`}>Valor da entrega</span>
        <strong className="text-lg font-black">{formatarMoeda(frete.valor_frete || frete.valor)}</strong>
      </div>
    </article>
  )
}

function Vazio({ ui, texto }: { ui: any; texto: string }) {
  return (
    <div className={`rounded-[24px] border p-8 text-center ${ui.card}`}>
      <p className={`text-sm font-bold ${ui.textoFraco}`}>{texto}</p>
    </div>
  )
}

function Info({
  ui,
  icon,
  label,
  value,
}: {
  ui: any
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${ui.card2}`}>
      <span className="mt-0.5 text-[#d4af37]">{icon}</span>

      <div>
        <p className={`text-xs font-black ${ui.textoMaisFraco}`}>{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}
