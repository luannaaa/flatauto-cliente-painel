"use client"

import { useEffect, useMemo, useState } from "react"
import NovoVeiculoModal from "../components/NovoVeiculoModal"
import { supabase } from "../../../lib/supabase"
import {
  Bike,
  Car,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  Truck,
  Wrench,
  X,
} from "lucide-react"

type Tema = "dark" | "light"

type Veiculo = {
  id: string
  motorista_id: string | null
  tipo_veiculo: string | null
  marca: string | null
  modelo: string | null
  ano: number | null
  placa: string | null
  cor: string | null
  capacidade_kg: number | null
  ativo: boolean | null
  created_at: string | null
}

type Motorista = {
  id: string
  nome: string | null
}

type Frete = {
  id: string
  motorista_id: string | null
  tipo_transporte: string | null
  origem: string | null
  destino: string | null
  status: string | null
}

const CHAVE_TEMA_EMPRESA = "temaEmpresa"

function normalizarTema(valor: string | null): Tema {
  if (valor === "light" || valor === "claro") return "light"
  if (valor === "dark" || valor === "escuro") return "dark"
  return "dark"
}

function formatarData(valor: string | null) {
  if (!valor) return "Sem data"

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return valor

  return data.toLocaleDateString("pt-BR")
}

function tipoNormalizado(tipo?: string | null) {
  return String(tipo || "Veículo").trim() || "Veículo"
}

function placaNormalizada(placa?: string | null) {
  return String(placa || "Sem placa").trim() || "Sem placa"
}

function IconeTipo({ tipo, size = 22 }: { tipo?: string | null; size?: number }) {
  const texto = String(tipo || "").toLowerCase()

  if (texto.includes("moto")) return <Bike size={size} />
  if (texto.includes("carro")) return <Car size={size} />

  return <Truck size={size} />
}

export default function VeiculosEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [modalNovoVeiculo, setModalNovoVeiculo] = useState(false)
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [motoristas, setMotoristas] = useState<Record<string, string>>({})
  const [fretes, setFretes] = useState<Frete[]>([])
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState("")
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)

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

  useEffect(() => {
    function fecharMenu() {
      setMenuAberto(null)
    }

    window.addEventListener("click", fecharMenu)

    return () => window.removeEventListener("click", fecharMenu)
  }, [])

  async function carregarDados() {
    setCarregando(true)
    setMensagem("")

    const { data: veiculosData, error: erroVeiculos } = await supabase
      .from("veiculos")
      .select("id,motorista_id,tipo_veiculo,marca,modelo,ano,placa,cor,capacidade_kg,ativo,created_at")
      .order("created_at", { ascending: false })

    if (erroVeiculos) {
      setVeiculos([])
      setMensagem(`Erro Supabase: ${erroVeiculos.message}`)
      setCarregando(false)
      return
    }

    const listaVeiculos = Array.isArray(veiculosData) ? (veiculosData as Veiculo[]) : []
    setVeiculos(listaVeiculos)

    const motoristaIds = Array.from(
      new Set(listaVeiculos.map((veiculo) => veiculo.motorista_id).filter(Boolean))
    ) as string[]

    if (motoristaIds.length > 0) {
      const { data: motoristasData } = await supabase
        .from("motoristas")
        .select("id,nome")
        .in("id", motoristaIds)

      const mapaMotoristas: Record<string, string> = {}

      ;((motoristasData || []) as Motorista[]).forEach((motorista) => {
        mapaMotoristas[motorista.id] = motorista.nome || "Motorista"
      })

      setMotoristas(mapaMotoristas)
    } else {
      setMotoristas({})
    }

    const { data: fretesData } = await supabase
      .from("fretes")
      .select("id,motorista_id,tipo_transporte,origem,destino,status")
      .in("status", ["Aceito", "Em andamento", "Em rota", "A caminho"])

    setFretes(Array.isArray(fretesData) ? (fretesData as Frete[]) : [])
    setCarregando(false)
  }

  async function excluirVeiculo(id: string) {
    const confirmar = window.confirm("Deseja excluir este veículo?")

    if (!confirmar) return

    setExcluindoId(id)
    setMensagem("")

    const { error } = await supabase.from("veiculos").delete().eq("id", id)

    if (error) {
      setMensagem(`Erro ao excluir: ${error.message}`)
      setExcluindoId(null)
      return
    }

    setMenuAberto(null)
    setExcluindoId(null)
    await carregarDados()
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#ffffff] text-[#111111]" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#e8dcc2] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#e8dcc2] bg-[#fbfaf7]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#e8dcc2]" : "border-white/10",
    menu: claro ? "border-[#e8dcc2] bg-white text-[#111111]" : "border-white/10 bg-[#151c20] text-white",
    menuHover: claro ? "hover:bg-black/5" : "hover:bg-white/10",
  }

  const veiculosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    if (!termo) return veiculos

    return veiculos.filter((veiculo) => {
      const motorista = veiculo.motorista_id ? motoristas[veiculo.motorista_id] : ""
      const texto = [
        veiculo.tipo_veiculo,
        veiculo.marca,
        veiculo.modelo,
        veiculo.placa,
        veiculo.cor,
        veiculo.capacidade_kg,
        veiculo.ativo ? "ativo disponivel" : "inativo manutencao",
        motorista,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return texto.includes(termo)
    })
  }, [busca, motoristas, veiculos])

  const total = veiculos.length
  const disponiveis = veiculos.filter((veiculo) => veiculo.ativo !== false).length
  const emRota = fretes.filter((frete) => frete.motorista_id).length
  const inativos = veiculos.filter((veiculo) => veiculo.ativo === false).length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black text-[#d4af37]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Veículos</h1>
          <p className={`mt-1 text-sm ${ui.textoFraco}`}>
            Estrutura limpa, conectada ao Supabase. Veículos aparecem quando forem cadastrados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovoVeiculo(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 font-black text-white shadow sm:w-auto"
        >
          <Plus size={20} />
          Novo Veículo
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardResumo ui={ui} titulo="Total" valor={total} detalhe="Veículos cadastrados" icon={<Truck />} />
        <CardResumo ui={ui} titulo="Disponíveis" valor={disponiveis} detalhe="Prontos para entrega" icon={<CheckCircle2 />} verde />
        <CardResumo ui={ui} titulo="Em rota" valor={emRota} detalhe="Operação em andamento" icon={<Clock />} azul />
        <CardResumo ui={ui} titulo="Inativos" valor={inativos} detalhe="Desativados ou manutenção" icon={<Wrench />} vermelho />
      </section>

      <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
            <Search size={19} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por placa, motorista, tipo ou status..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button
            type="button"
            onClick={carregarDados}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}
          >
            <Settings size={18} />
            Atualizar
          </button>
        </div>

        {mensagem && (
          <div className="mb-4 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 p-3 text-sm font-bold text-[#d4af37]">
            {mensagem}
          </div>
        )}

        {carregando ? (
          <Vazio ui={ui} texto="Carregando veículos do Supabase..." />
        ) : veiculosFiltrados.length === 0 ? (
          <Vazio ui={ui} texto="Nenhum veículo cadastrado ainda." />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {veiculosFiltrados.map((veiculo) => {
              const motoristaNome = veiculo.motorista_id
                ? motoristas[veiculo.motorista_id] || "Motorista não encontrado"
                : "Não vinculado"

              const freteEmRota = fretes.find((frete) => frete.motorista_id === veiculo.motorista_id)
              const status = freteEmRota ? "Em rota" : veiculo.ativo === false ? "Inativo" : "Disponível"

              return (
                <article key={veiculo.id} className={`relative rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37] text-white">
                        <IconeTipo tipo={veiculo.tipo_veiculo} size={28} />
                      </div>

                      <div>
                        <h2 className="text-lg font-black">
                          {veiculo.modelo || veiculo.marca || tipoNormalizado(veiculo.tipo_veiculo)}
                        </h2>
                        <p className={`text-xs font-bold ${ui.textoFraco}`}>
                          {tipoNormalizado(veiculo.tipo_veiculo)} • Placa {placaNormalizada(veiculo.placa)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusVeiculo status={status} />

                      <div className="relative" onClick={(event) => event.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setMenuAberto(menuAberto === veiculo.id ? null : veiculo.id)}
                          className={`rounded-xl border p-2 ${ui.card2}`}
                          disabled={excluindoId === veiculo.id}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {menuAberto === veiculo.id && (
                          <div className={`absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border shadow-2xl ${ui.menu}`}>
                            <button
                              type="button"
                              onClick={() => excluirVeiculo(veiculo.id)}
                              className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-black text-red-400 ${ui.menuHover}`}
                            >
                              <Trash2 size={17} />
                              {excluindoId === veiculo.id ? "Excluindo..." : "Excluir veículo"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoBox ui={ui} label="Motorista vinculado" valor={motoristaNome} />
                    <InfoBox ui={ui} label="Situação" valor={veiculo.ativo === false ? "Inativo" : "Ativo"} />
                    <InfoBox ui={ui} label="Capacidade" valor={veiculo.capacidade_kg ? `${veiculo.capacidade_kg} kg` : "Não informada"} />
                    <InfoBox ui={ui} label="Cadastro" valor={formatarData(veiculo.created_at)} />
                  </div>

                  {freteEmRota ? (
                    <div className={`mt-4 rounded-2xl border p-3 text-xs ${ui.card2}`}>
                      <p className="font-black text-[#d4af37]">Rota em andamento</p>
                      <p className="mt-1">
                        {freteEmRota.origem || "Origem não informada"} → {freteEmRota.destino || "Destino não informado"}
                      </p>
                    </div>
                  ) : (
                    <p className={`mt-4 text-xs font-bold ${ui.textoFraco}`}>
                      Pronto para aparecer em rota quando um motorista aceitar uma entrega.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {modalNovoVeiculo && (
        <NovoVeiculoModal
          ui={ui}
          fechar={() => {
            setModalNovoVeiculo(false)
            carregarDados()
          }}
        />
      )}
    </main>
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
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{valor}</h2>
          <p className={`mt-3 text-sm ${cor}`}>{detalhe}</p>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${ui.card2} ${cor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusVeiculo({ status }: { status: string }) {
  const classe =
    status === "Em rota"
      ? "bg-blue-600 text-white"
      : status === "Inativo"
      ? "bg-red-600 text-white"
      : "bg-green-600 text-white"

  return <span className={`rounded-lg px-3 py-1 text-xs font-black ${classe}`}>{status}</span>
}

function InfoBox({ ui, label, valor }: any) {
  return (
    <div className={`rounded-2xl border p-3 ${ui.card2}`}>
      <p className={`text-xs font-bold ${ui.textoFraco}`}>{label}</p>
      <p className="mt-1 text-sm font-black">{valor}</p>
    </div>
  )
}

function Vazio({ ui, texto }: any) {
  return (
    <div className={`flex min-h-[180px] items-center justify-center rounded-2xl border ${ui.card2}`}>
      <p className={`text-center text-sm font-bold ${ui.textoFraco}`}>{texto}</p>
    </div>
  )
}
