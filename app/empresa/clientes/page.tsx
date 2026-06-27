"use client"

import NovoClienteModal from "../components/NovoClienteModal"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
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
  X,
  Save,
} from "lucide-react"

type Tema = "dark" | "light"
type TipoCliente = "Empresa" | "Pessoa física"
type StatusCliente = "Ativo" | "Inativo"

type ClienteSupabase = {
  id: string
  empresa_id: string | null
  nome: string | null
  responsavel: string | null
  tipo: TipoCliente | string | null
  documento: string | null
  telefone: string | null
  email: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  status: StatusCliente | string | null
  observacoes: string | null
  created_at: string | null
}

type ClienteTela = {
  id: string
  nome: string
  responsavel: string
  tipo: TipoCliente
  documento: string
  telefone: string
  email: string
  cidade: string
  estado: string
  status: StatusCliente
  observacoes: string
  entregas: number
  ultimaEntrega: string
  valorMovimentado: string
  created_at: string | null
}

function normalizarTema(valor: string | null): Tema {
  if (valor === "light" || valor === "claro") return "light"
  return "dark"
}

function normalizarTipo(valor: any): TipoCliente {
  return valor === "Pessoa física" ? "Pessoa física" : "Empresa"
}

function normalizarStatus(valor: any): StatusCliente {
  return valor === "Inativo" ? "Inativo" : "Ativo"
}

function formatarData(data: string | null) {
  if (!data) return "Nenhuma"
  const d = new Date(data)
  if (Number.isNaN(d.getTime())) return "Nenhuma"
  return d.toLocaleDateString("pt-BR")
}

function paraClienteTela(cliente: ClienteSupabase): ClienteTela {
  return {
    id: cliente.id,
    nome: cliente.nome || "Cliente sem nome",
    responsavel: cliente.responsavel || cliente.nome || "A preencher",
    tipo: normalizarTipo(cliente.tipo),
    documento: cliente.documento || "CPF/CNPJ não informado",
    telefone: cliente.telefone || "A preencher",
    email: cliente.email || "A preencher",
    cidade: cliente.cidade || "A preencher",
    estado: cliente.estado || "",
    status: normalizarStatus(cliente.status),
    observacoes: cliente.observacoes || "",
    entregas: 0,
    ultimaEntrega: "Nenhuma",
    valorMovimentado: "R$ 0,00",
    created_at: cliente.created_at,
  }
}

export default function ClientesPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [clientes, setClientes] = useState<ClienteTela[]>([])
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState("")
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [modalNovoCliente, setModalNovoCliente] = useState(false)
  const [clienteDetalhes, setClienteDetalhes] = useState<ClienteTela | null>(null)
  const [clienteEditando, setClienteEditando] = useState<ClienteTela | null>(null)

  useEffect(() => {
    function carregarTema() {
      setTema(normalizarTema(localStorage.getItem("temaEmpresa")))
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
    carregarClientes()
  }, [])

  async function carregarClientes() {
    setCarregando(true)
    setMensagem("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    let consulta = supabase
      .from("clientes_empresa")
      .select("id,empresa_id,nome,email,telefone,documento,responsavel,tipo,status,cep,rua,numero,bairro,cidade,estado,observacoes,created_at")
      .order("created_at", { ascending: false })

    if (empresaId) {
      consulta = consulta.eq("empresa_id", empresaId)
    }

    const { data, error } = await consulta

    if (error) {
      setClientes([])
      setMensagem(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    setClientes(((data || []) as ClienteSupabase[]).map(paraClienteTela))
    setCarregando(false)
  }

  async function excluirCliente(id: string) {
    const confirmar = confirm("Deseja excluir este cliente?")
    if (!confirmar) return

    const { error } = await supabase.from("clientes_empresa").delete().eq("id", id)

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    setClientes((lista) => lista.filter((cliente) => cliente.id !== id))
    setMenuAberto(null)
  }

  async function salvarEdicao(clienteAtualizado: ClienteTela) {
    const { error } = await supabase
      .from("clientes_empresa")
      .update({
        nome: clienteAtualizado.nome,
        responsavel: clienteAtualizado.responsavel,
        tipo: clienteAtualizado.tipo,
        documento: clienteAtualizado.documento,
        telefone: clienteAtualizado.telefone,
        email: clienteAtualizado.email,
        cidade: clienteAtualizado.cidade,
        estado: clienteAtualizado.estado,
        status: clienteAtualizado.status,
        observacoes: clienteAtualizado.observacoes,
      })
      .eq("id", clienteAtualizado.id)

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    setClienteEditando(null)
    carregarClientes()
  }

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

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return clientes

    return clientes.filter((cliente) =>
      [
        cliente.nome,
        cliente.responsavel,
        cliente.documento,
        cliente.telefone,
        cliente.email,
        cliente.cidade,
        cliente.estado,
        cliente.status,
        cliente.tipo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    )
  }, [busca, clientes])

  const totalClientes = clientes.length
  const ativos = clientes.filter((cliente) => cliente.status === "Ativo").length
  const inativos = clientes.filter((cliente) => cliente.status === "Inativo").length
  const empresas = clientes.filter((cliente) => cliente.tipo === "Empresa").length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
            <h1 className="mt-1 text-2xl font-black sm:text-4xl">Clientes</h1>
            <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
              Estrutura limpa, conectada ao Supabase. Cadastre clientes reais para usar nas entregas.
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

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardResumo ui={ui} titulo="Total de clientes" valor={totalClientes} icon={<Users />} />
          <CardResumo ui={ui} titulo="Clientes ativos" valor={ativos} icon={<CheckCircle2 />} verde />
          <CardResumo ui={ui} titulo="Clientes inativos" valor={inativos} icon={<XCircle />} vermelho />
          <CardResumo ui={ui} titulo="Empresas" valor={empresas} icon={<Building2 />} azul />
        </section>

        <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
              <Search size={19} className="text-[#ffc400]" />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome, CPF, CNPJ, cidade ou telefone..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button
              type="button"
              onClick={carregarClientes}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}
            >
              <Filter size={18} />
              Atualizar
            </button>
          </div>

          {mensagem && (
            <div className="mb-4 rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10 p-3 text-sm font-bold text-[#ffc400]">
              {mensagem}
            </div>
          )}

          {carregando ? (
            <Vazio ui={ui} texto="Carregando clientes do Supabase..." />
          ) : clientesFiltrados.length === 0 ? (
            <Vazio ui={ui} texto="Nenhum cliente cadastrado ainda. Clique em Novo Cliente para começar." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {clientesFiltrados.map((cliente) => (
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
                            type="button"
                            onClick={() => setMenuAberto(menuAberto === cliente.id ? null : cliente.id)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${ui.card}`}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {menuAberto === cliente.id && (
                            <div className={`absolute right-0 top-12 z-50 w-44 rounded-xl border p-2 ${ui.card}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setClienteDetalhes(cliente)
                                  setMenuAberto(null)
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-black hover:bg-[#ffc400]/10"
                              >
                                Ver detalhes
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setClienteEditando(cliente)
                                  setMenuAberto(null)
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-black hover:bg-[#ffc400]/10"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
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
                    <Info ui={ui} icon={<CalendarDays size={17} />} label="Criado em" value={formatarData(cliente.created_at)} />
                    <Info ui={ui} icon={<Package size={17} />} label="Movimentado" value={cliente.valorMovimentado} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {modalNovoCliente && (
        <NovoClienteModal
          ui={ui}
          fechar={() => setModalNovoCliente(false)}
          onClienteSalvo={() => {
            setModalNovoCliente(false)
            carregarClientes()
          }}
        />
      )}

      {clienteDetalhes && (
        <ModalDetalhesCliente ui={ui} cliente={clienteDetalhes} fechar={() => setClienteDetalhes(null)} />
      )}

      {clienteEditando && (
        <ModalEditarCliente ui={ui} cliente={clienteEditando} fechar={() => setClienteEditando(null)} salvar={salvarEdicao} />
      )}
    </main>
  )
}

function ModalDetalhesCliente({ ui, cliente, fechar }: any) {
  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] border p-5 sm:max-w-[720px] sm:rounded-[30px] sm:p-7 ${ui.card}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Detalhes do cliente</p>
            <h2 className="mt-1 text-2xl font-black">{cliente.nome}</h2>
            <p className={`mt-1 text-sm ${ui.textoFraco}`}>{cliente.tipo} • {cliente.documento}</p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 ${ui.card2}`}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info ui={ui} icon={<UserRound size={17} />} label="Responsável" value={cliente.responsavel} />
          <Info ui={ui} icon={<Phone size={17} />} label="Telefone" value={cliente.telefone} />
          <Info ui={ui} icon={<Mail size={17} />} label="E-mail" value={cliente.email} />
          <Info ui={ui} icon={<MapPin size={17} />} label="Cidade" value={cliente.cidade} />
          <Info ui={ui} icon={<CalendarDays size={17} />} label="Criado em" value={formatarData(cliente.created_at)} />
          <Info ui={ui} icon={<Package size={17} />} label="Movimentado" value={cliente.valorMovimentado} />
        </div>

        {cliente.observacoes && (
          <div className={`mt-4 rounded-2xl border p-4 ${ui.card2}`}>
            <p className={`text-xs font-black ${ui.textoFraco}`}>Observações</p>
            <p className="mt-2 text-sm font-bold">{cliente.observacoes}</p>
          </div>
        )}

        <button onClick={fechar} className="mt-6 h-12 w-full rounded-xl bg-[#ffc400] font-black text-black">
          Fechar
        </button>
      </section>
    </div>
  )
}

function ModalEditarCliente({ ui, cliente, fechar, salvar }: any) {
  const [form, setForm] = useState<ClienteTela>(cliente)

  function atualizar(campo: keyof ClienteTela, valor: any) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] border p-5 sm:max-w-[860px] sm:rounded-[30px] sm:p-7 ${ui.card}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#ffc400]">Editar cliente</p>
            <h2 className="mt-1 text-2xl font-black">{form.nome}</h2>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 ${ui.card2}`}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Campo ui={ui} label="Nome" value={form.nome} onChange={(v: string) => atualizar("nome", v)} />
          <Campo ui={ui} label="Responsável" value={form.responsavel} onChange={(v: string) => atualizar("responsavel", v)} />
          <Campo ui={ui} label="CPF ou CNPJ" value={form.documento} onChange={(v: string) => atualizar("documento", v)} />
          <Campo ui={ui} label="Telefone" value={form.telefone} onChange={(v: string) => atualizar("telefone", v)} />
          <Campo ui={ui} label="E-mail" value={form.email} onChange={(v: string) => atualizar("email", v)} />
          <Campo ui={ui} label="Cidade" value={form.cidade} onChange={(v: string) => atualizar("cidade", v)} />
          <Campo ui={ui} label="Estado" value={form.estado} onChange={(v: string) => atualizar("estado", v)} />

          <label>
            <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>Tipo</span>
            <select
              value={form.tipo}
              onChange={(e) => atualizar("tipo", e.target.value as TipoCliente)}
              className={`h-12 w-full rounded-2xl border px-4 bg-transparent text-sm font-bold outline-none ${ui.card2}`}
            >
              <option value="Empresa" className="bg-black text-white">Empresa</option>
              <option value="Pessoa física" className="bg-black text-white">Pessoa física</option>
            </select>
          </label>

          <label>
            <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>Status</span>
            <select
              value={form.status}
              onChange={(e) => atualizar("status", e.target.value as StatusCliente)}
              className={`h-12 w-full rounded-2xl border px-4 bg-transparent text-sm font-bold outline-none ${ui.card2}`}
            >
              <option value="Ativo" className="bg-black text-white">Ativo</option>
              <option value="Inativo" className="bg-black text-white">Inativo</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={fechar} className={`h-12 flex-1 rounded-xl border font-black ${ui.card2}`}>
            Cancelar
          </button>
          <button onClick={() => salvar(form)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black">
            <Save size={18} />
            Salvar alteração
          </button>
        </div>
      </section>
    </div>
  )
}

function Campo({ ui, label, value, onChange }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-2xl border px-4 bg-transparent text-sm font-bold outline-none ${ui.card2}`}
      />
    </label>
  )
}

function CardResumo({ titulo, valor, icon, ui, verde, azul, vermelho }: any) {
  const cor = vermelho ? "text-red-500" : verde ? "text-green-500" : azul ? "text-sky-500" : "text-[#ffc400]"

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
  const classe = nome === "Ativo" ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${classe}`}>{nome}</span>
}

function Vazio({ ui, texto }: any) {
  return (
    <div className={`flex min-h-[280px] items-center justify-center rounded-[22px] border border-dashed p-6 text-center ${ui.card2}`}>
      <p className={`max-w-[360px] text-sm font-bold ${ui.textoFraco}`}>{texto}</p>
    </div>
  )
}
