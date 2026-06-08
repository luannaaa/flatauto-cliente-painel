"use client"

import NovoClienteModal from "../components/NovoClienteModal"
import { useEffect, useState } from "react"
import {
  Building2,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Package,
  CalendarDays,
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react"

type Tema = "dark" | "light"
type TipoCliente = "Empresa" | "Pessoa física"
type StatusCliente = "Ativo" | "Inativo"

type Cliente = {
  id: number
  nome: string
  responsavel: string
  tipo: TipoCliente
  documento: string
  telefone: string
  email: string
  cidade: string
  entregas: number
  ultimaEntrega: string
  valorMovimentado: string
  status: StatusCliente
}

const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: "Mercado Central",
    responsavel: "Carlos Silva",
    tipo: "Empresa",
    documento: "12.345.678/0001-90",
    telefone: "(81) 99999-2020",
    email: "contato@mercadocentral.com",
    cidade: "Recife - PE",
    entregas: 28,
    ultimaEntrega: "08/06/2026",
    valorMovimentado: "R$ 8.450,00",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Auto Peças Brasil",
    responsavel: "Mariana Costa",
    tipo: "Empresa",
    documento: "45.789.120/0001-11",
    telefone: "(81) 98888-1122",
    email: "financeiro@autopecas.com",
    cidade: "Jaboatão - PE",
    entregas: 16,
    ultimaEntrega: "07/06/2026",
    valorMovimentado: "R$ 5.980,00",
    status: "Ativo",
  },
]

export default function ClientesPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais)
  const [menuAberto, setMenuAberto] = useState<number | null>(null)
  const [modalNovoCliente, setModalNovoCliente] = useState(false)

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

  function adicionarCliente(novoCliente: any) {
    const clienteFormatado: Cliente = {
      id: Date.now(),
      nome: novoCliente.nome || novoCliente.nomeCliente || "Novo Cliente",
      responsavel: novoCliente.responsavel || "A preencher",
      tipo: novoCliente.tipo || "Pessoa física",
      documento: novoCliente.documento || "A preencher",
      telefone: novoCliente.telefone || novoCliente.whatsapp || "A preencher",
      email: novoCliente.email || "A preencher",
      cidade:
        novoCliente.cidade && novoCliente.estado
          ? `${novoCliente.cidade} - ${novoCliente.estado}`
          : novoCliente.cidade || "A preencher",
      entregas: 0,
      ultimaEntrega: "Nenhuma",
      valorMovimentado: "R$ 0,00",
      status: novoCliente.status || "Ativo",
    }

    setClientes((lista) => [clienteFormatado, ...lista])
    setModalNovoCliente(false)
  }

  function excluirCliente(id: number) {
    const confirmar = confirm("Deseja excluir este cliente?")
    if (!confirmar) return

    setClientes((lista) => lista.filter((cliente) => cliente.id !== id))
    setMenuAberto(null)
  }

  const totalClientes = clientes.length
  const ativos = clientes.filter((cliente) => cliente.status === "Ativo").length
  const empresas = clientes.filter((cliente) => cliente.tipo === "Empresa").length
  const pessoas = clientes.filter((cliente) => cliente.tipo === "Pessoa física").length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
            <h1 className="mt-1 text-2xl font-black sm:text-4xl">Clientes</h1>
            <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
              Gerencie os clientes e empresas que já solicitaram fretes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalNovoCliente(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] px-5 font-black text-black shadow"
          >
            + Novo Cliente
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardResumo ui={ui} titulo="Total de clientes" valor={totalClientes} icon={<Users />} />
          <CardResumo ui={ui} titulo="Clientes ativos" valor={ativos} icon={<CheckCircle2 />} verde />
          <CardResumo ui={ui} titulo="Empresas" valor={empresas} icon={<Building2 />} />
          <CardResumo ui={ui} titulo="Pessoa física" valor={pessoas} icon={<UserRound />} azul />
        </section>

        <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
              <Search size={19} className="text-[#ffc400]" />
              <input
                placeholder="Buscar por nome, documento, cidade ou telefone..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}>
              <Filter size={18} />
              Filtrar
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {clientes.map((cliente) => (
              <article key={cliente.id} className={`relative rounded-[26px] border p-4 sm:p-5 ${ui.card2}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                    {cliente.tipo === "Empresa" ? <Building2 size={30} /> : <UserRound size={30} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black leading-tight">{cliente.nome}</h2>
                        <p className={`mt-1 text-xs font-bold ${ui.textoFraco}`}>
                          {cliente.tipo} • {cliente.documento}
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setMenuAberto(menuAberto === cliente.id ? null : cliente.id)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${ui.card}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {menuAberto === cliente.id && (
                          <div className={`absolute right-0 top-12 z-40 w-40 rounded-xl border p-2 ${ui.card}`}>
                            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-black hover:bg-[#ffc400]/10">
                              Ver detalhes
                            </button>

                            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-black hover:bg-[#ffc400]/10">
                              Editar
                            </button>

                            <button
                              onClick={() => excluirCliente(cliente.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-black text-red-500 hover:bg-red-500/10"
                            >
                              <XCircle size={16} />
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusCliente nome={cliente.status} />
                      <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
                        {cliente.entregas} entregas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Info ui={ui} icon={<UserRound size={17} />} label="Responsável" value={cliente.responsavel} />
                  <Info ui={ui} icon={<Phone size={17} />} label="Telefone" value={cliente.telefone} />
                  <Info ui={ui} icon={<Mail size={17} />} label="E-mail" value={cliente.email} />
                  <Info ui={ui} icon={<MapPin size={17} />} label="Cidade" value={cliente.cidade} />
                  <Info ui={ui} icon={<CalendarDays size={17} />} label="Última entrega" value={cliente.ultimaEntrega} />
                  <Info ui={ui} icon={<Package size={17} />} label="Movimentado" value={cliente.valorMovimentado} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {modalNovoCliente && (
        <NovoClienteModal
          ui={ui}
          fechar={() => setModalNovoCliente(false)}
          salvar={adicionarCliente}
        />
      )}
    </main>
  )
}

function CardResumo({ titulo, valor, icon, ui, verde, azul }: any) {
  const cor = verde ? "text-green-500" : azul ? "text-sky-500" : "text-[#ffc400]"

  return (
    <div className={`rounded-[24px] border p-5 ${ui.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-4xl font-black">{valor}</h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${ui.card2} ${cor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function Info({ ui, icon, label, value }: any) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${ui.card}`}>
      <span className="mt-0.5 text-[#ffc400]">{icon}</span>
      <div className="min-w-0">
        <p className={`text-xs font-black ${ui.textoFraco}`}>{label}</p>
        <p className="mt-1 truncate text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}

function StatusCliente({ nome }: { nome: StatusCliente }) {
  const classe =
    nome === "Ativo"
      ? "bg-green-500/15 text-green-500"
      : "bg-red-500/15 text-red-500"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${classe}`}>
      {nome}
    </span>
  )
}