"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import NovaEntregaModal from "../components/NovaEntregaModal"
import { supabase } from "../../../lib/supabase"
import {
  Search,
  Plus,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Pause,
  Ban,
  ClipboardEdit,
  MapPin,
  MessageCircle,
} from "lucide-react"

type Tema = "dark" | "light"

type Frete = {
  id: string
  cliente_id: string | null
  motorista_id: string | null
  empresa_id: string | null
  codigo: string | null
  origem: string | null
  destino: string | null
  descricao_carga: string | null
  tipo_transporte: string | null
  valor: string | null
  valor_frete: number | null
  status: string | null
  data_frete: string | null
  horario: string | null
  created_at: string | null
}

type ClienteEmpresa = {
  id: string
  nome: string | null
  responsavel: string | null
  tipo: string | null
  documento: string | null
  telefone: string | null
  email: string | null
  cidade: string | null
  status: string | null
}

type Pessoa = {
  id: string
  nome: string | null
}

const CHAVE_TEMA_EMPRESA = "temaEmpresa"

function normalizarTema(valor: string | null): Tema {
  if (valor === "light" || valor === "claro") return "light"
  if (valor === "dark" || valor === "escuro") return "dark"
  return "dark"
}

function formatarValor(valor: string | number | null) {
  if (valor === null || valor === undefined || valor === "") return "R$ 0,00"

  if (typeof valor === "number") {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return valor
}

function statusTexto(status: string | null) {
  return String(status || "Aguardando").trim() || "Aguardando"
}

function statusBaixo(status: string | null) {
  return statusTexto(status).toLowerCase()
}

function podeEditarDireto(status: string | null) {
  const texto = statusBaixo(status)
  return texto.includes("aguardando") || texto.includes("paus")
}

function podePausar(status: string | null) {
  const texto = statusBaixo(status)
  return texto.includes("aguardando")
}

function podeCancelar(status: string | null) {
  const texto = statusBaixo(status)
  return !texto.includes("conclu") && !texto.includes("cancel")
}

function formatarData(data: string | null) {
  if (!data) return "Sem data"

  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
  }

  const dataObj = new Date(data)
  if (Number.isNaN(dataObj.getTime())) return data

  return dataObj.toLocaleDateString("pt-BR")
}

export default function EntregasEmpresaPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [modalNovaEntrega, setModalNovaEntrega] = useState(false)
  const [fretes, setFretes] = useState<Frete[]>([])
  const [clientes, setClientes] = useState<Record<string, string>>({})
  const [motoristas, setMotoristas] = useState<Record<string, string>>({})
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState("")
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [processandoId, setProcessandoId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
    carregarFretes()
  }, [])

  useEffect(() => {
    function fecharMenu(event: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) setMenuAberto(null)
    }

    document.addEventListener("mousedown", fecharMenu)
    return () => document.removeEventListener("mousedown", fecharMenu)
  }, [])

  async function carregarFretes() {
    setCarregando(true)
    setMensagem("")

    const empresaId = localStorage.getItem("flatauto_empresa_id")

    if (!empresaId) {
      setFretes([])
      setCarregando(false)
      setMensagem("Empresa não encontrada no login. Entre novamente.")
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select(
        `
        id,
        cliente_id,
        motorista_id,
        empresa_id,
        codigo,
        origem,
        destino,
        descricao_carga,
        tipo_transporte,
        valor,
        valor_frete,
        status,
        data_frete,
        horario,
        created_at
      `
      )
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false })

    if (error) {
      setFretes([])
      setMensagem(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? (data as Frete[]) : []
    setFretes(lista)

    const clienteIds = Array.from(new Set(lista.map((frete) => frete.cliente_id).filter(Boolean))) as string[]
    const motoristaIds = Array.from(new Set(lista.map((frete) => frete.motorista_id).filter(Boolean))) as string[]

    if (clienteIds.length > 0) {
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes_empresa")
        .select("id,nome,responsavel,tipo,documento,telefone,email,cidade,status")
        .in("id", clienteIds)

      if (clientesError) {
        setMensagem(`Fretes carregados, mas erro ao buscar clientes: ${clientesError.message}`)
        setClientes({})
      } else {
        const mapaClientes: Record<string, string> = {}
        ;((clientesData || []) as ClienteEmpresa[]).forEach((cliente) => {
          mapaClientes[cliente.id] = cliente.nome || cliente.responsavel || "Cliente da empresa"
        })
        setClientes(mapaClientes)
      }
    } else {
      setClientes({})
    }

    if (motoristaIds.length > 0) {
      const { data: motoristasData } = await supabase
        .from("motoristas")
        .select("id,nome")
        .in("id", motoristaIds)

      const mapaMotoristas: Record<string, string> = {}
      ;((motoristasData || []) as Pessoa[]).forEach((motorista) => {
        mapaMotoristas[motorista.id] = motorista.nome || "Motorista"
      })
      setMotoristas(mapaMotoristas)
    } else {
      setMotoristas({})
    }

    setCarregando(false)
  }

  async function registrarStatusHistorico(frete: Frete, novoStatus: string, descricao: string, acao: string) {
    const { error: statusError } = await supabase.from("frete_status").insert({
      frete_id: frete.id,
      status: novoStatus,
      descricao,
    })

    if (statusError) {
      setMensagem(`Status atualizado, mas erro ao salvar frete_status: ${statusError.message}`)
      return
    }

    const { error: historicoError } = await supabase.from("frete_historico").insert({
      frete_id: frete.id,
      motorista_id: frete.motorista_id || null,
      acao,
      observacao: descricao,
    })

    if (historicoError) {
      setMensagem(`Status atualizado, mas erro ao salvar frete_historico: ${historicoError.message}`)
    }
  }

  async function alterarStatus(frete: Frete, novoStatus: string, descricao: string, acao: string) {
    setProcessandoId(frete.id)
    setMensagem("")

    const { error } = await supabase
      .from("fretes")
      .update({ status: novoStatus })
      .eq("id", frete.id)

    if (error) {
      setMensagem(`Erro Supabase: ${error.message}`)
      setProcessandoId(null)
      return
    }

    await registrarStatusHistorico(frete, novoStatus, descricao, acao)
    setMenuAberto(null)
    setProcessandoId(null)
    await carregarFretes()
  }

  function verDetalhes(frete: Frete) {
    const cliente = frete.cliente_id ? clientes[frete.cliente_id] || "Cliente não encontrado" : "Sem cliente"
    const motorista = frete.motorista_id ? motoristas[frete.motorista_id] || "Motorista não encontrado" : "Aguardando motorista"

    alert(
      `Detalhes da entrega\n\n` +
        `Código: ${frete.codigo || frete.id}\n` +
        `Cliente: ${cliente}\n` +
        `Origem: ${frete.origem || "Sem origem"}\n` +
        `Destino: ${frete.destino || "Sem destino"}\n` +
        `Motorista: ${motorista}\n` +
        `Valor: ${formatarValor(frete.valor_frete || frete.valor)}\n` +
        `Status: ${statusTexto(frete.status)}`
    )

    setMenuAberto(null)
  }

  function editarEntrega(frete: Frete) {
    if (!podeEditarDireto(frete.status)) {
      solicitarAlteracao(frete)
      return
    }

    alert("Edição direta liberada porque a entrega ainda está aguardando motorista. O próximo passo é abrir o modal preenchido para editar esta entrega.")
    setMenuAberto(null)
  }

  async function solicitarAlteracao(frete: Frete) {
    setProcessandoId(frete.id)
    setMensagem("")

    const descricao = "Empresa solicitou alteração. Como a entrega já foi aceita ou está em andamento, motorista e cliente precisam confirmar antes de aplicar mudanças."

    const { error } = await supabase.from("frete_historico").insert({
      frete_id: frete.id,
      motorista_id: frete.motorista_id || null,
      acao: "Solicitação de alteração",
      observacao: descricao,
    })

    if (error) {
      setMensagem(`Erro ao registrar solicitação: ${error.message}`)
    } else {
      setMensagem("Solicitação de alteração registrada. A edição só deve ser aplicada depois da confirmação do motorista e do cliente.")
    }

    setMenuAberto(null)
    setProcessandoId(null)
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#ffffff] text-[#111111]" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#e8dcc2] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#e8dcc2] bg-[#fbfaf7]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#e8dcc2]" : "border-white/10",
  }

  const fretesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    if (!termo) return fretes

    return fretes.filter((frete) => {
      const nomeCliente = frete.cliente_id ? clientes[frete.cliente_id] : ""
      const nomeMotorista = frete.motorista_id ? motoristas[frete.motorista_id] : ""

      const texto = [
        frete.codigo,
        frete.id,
        nomeCliente,
        nomeMotorista,
        frete.origem,
        frete.destino,
        frete.descricao_carga,
        frete.tipo_transporte,
        frete.status,
        frete.data_frete,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return texto.includes(termo)
    })
  }, [busca, fretes, clientes, motoristas])

  const total = fretes.length
  const concluidas = fretes.filter((frete) => statusBaixo(frete.status).includes("conclu")).length
  const emAndamento = fretes.filter((frete) => {
    const status = statusBaixo(frete.status)
    return status.includes("andamento") || status.includes("rota") || status.includes("aceito")
  }).length
  const canceladas = fretes.filter((frete) => statusBaixo(frete.status).includes("cancel")).length

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Entregas</h1>
          <p className={`mt-1 text-sm ${ui.textoFraco}`}>
            Entregas reais carregadas da tabela fretes no Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovaEntrega(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 font-black text-white shadow sm:w-auto"
        >
          <Plus size={20} />
          Nova Entrega
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardResumo ui={ui} titulo="Total" valor={total} detalhe="Entregas cadastradas" icon={<Package />} />
        <CardResumo ui={ui} titulo="Concluídas" valor={concluidas} detalhe="Finalizadas" icon={<CheckCircle2 />} verde />
        <CardResumo ui={ui} titulo="Em andamento" valor={emAndamento} detalhe="Em rota ou aceitas" icon={<Clock />} azul />
        <CardResumo ui={ui} titulo="Canceladas" valor={canceladas} detalhe="Cancelamentos" icon={<XCircle />} vermelho />
      </section>

      <section className={`rounded-[26px] border p-4 sm:p-5 ${ui.card}`}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex h-12 flex-1 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
            <Search size={19} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por cliente, motorista, cidade ou ID..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button
            type="button"
            onClick={carregarFretes}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 font-bold ${ui.card2}`}
          >
            <Filter size={18} />
            Atualizar
          </button>
        </div>

        {mensagem && (
          <div className="mb-4 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 p-3 text-sm font-bold text-[#d4af37]">
            {mensagem}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead>
              <tr className={`border-b ${ui.linha} ${ui.textoFraco}`}>
                <th className="pb-4">ID</th>
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Origem</th>
                <th className="pb-4">Destino</th>
                <th className="pb-4">Motorista</th>
                <th className="pb-4">Carga</th>
                <th className="pb-4">Veículo</th>
                <th className="pb-4">Data</th>
                <th className="pb-4">Valor</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={11} className={`py-10 text-center ${ui.textoFraco}`}>
                    Carregando entregas do Supabase...
                  </td>
                </tr>
              ) : fretesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={11} className={`py-10 text-center ${ui.textoFraco}`}>
                    Nenhuma entrega cadastrada ainda.
                  </td>
                </tr>
              ) : (
                fretesFiltrados.map((frete, index) => {
                  const nomeCliente = frete.cliente_id
                    ? clientes[frete.cliente_id] || "Cliente não encontrado"
                    : "Sem cliente"

                  const nomeMotorista = frete.motorista_id
                    ? motoristas[frete.motorista_id] || "Motorista não encontrado"
                    : "Aguardando motorista"

                  return (
                    <tr key={frete.id || index} className={`border-b ${ui.linha}`}>
                      <td className="py-4 font-bold">{frete.codigo || frete.id}</td>
                      <td className="py-4">{nomeCliente}</td>
                      <td className="py-4">{frete.origem || "Sem origem"}</td>
                      <td className="py-4">{frete.destino || "Sem destino"}</td>
                      <td className="py-4">{nomeMotorista}</td>
                      <td className="py-4">{frete.descricao_carga || "Sem carga"}</td>
                      <td className="py-4">{frete.tipo_transporte || "Sem veículo"}</td>
                      <td className="py-4">
                        {formatarData(frete.data_frete)}
                        {frete.horario ? ` • ${frete.horario}` : ""}
                      </td>
                      <td className="py-4 font-bold">{formatarValor(frete.valor_frete || frete.valor)}</td>
                      <td className="py-4">
                        <Status nome={statusTexto(frete.status)} />
                      </td>
                      <td className="relative py-4 text-right">
                        <div ref={menuAberto === frete.id ? menuRef : null} className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setMenuAberto(menuAberto === frete.id ? null : frete.id)}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${ui.card2}`}
                          >
                            <MoreHorizontal size={19} />
                          </button>

                          {menuAberto === frete.id && (
                            <div className={`absolute right-0 z-50 mt-2 w-64 rounded-2xl border p-2 text-left shadow-2xl ${ui.card}`}>
                              <MenuBotao icon={<Eye size={17} />} texto="Ver detalhes" onClick={() => verDetalhes(frete)} />

                              {podeEditarDireto(frete.status) ? (
                                <MenuBotao icon={<Pencil size={17} />} texto="Editar entrega" onClick={() => editarEntrega(frete)} />
                              ) : (
                                <MenuBotao icon={<ClipboardEdit size={17} />} texto="Solicitar alteração" onClick={() => solicitarAlteracao(frete)} />
                              )}

                              {podePausar(frete.status) && (
                                <MenuBotao
                                  icon={<Pause size={17} />}
                                  texto={processandoId === frete.id ? "Pausando..." : "Pausar oferta"}
                                  onClick={() =>
                                    alterarStatus(
                                      frete,
                                      "Pausada",
                                      "Oferta pausada pela empresa antes de um motorista aceitar.",
                                      "Oferta pausada"
                                    )
                                  }
                                />
                              )}

                              {statusBaixo(frete.status).includes("andamento") || statusBaixo(frete.status).includes("aceito") ? (
                                <>
                                  <MenuBotao
                                    icon={<MapPin size={17} />}
                                    texto="Acompanhar motorista"
                                    onClick={() => {
                                      alert("Acompanhamento do motorista será conectado na próxima etapa do mapa em tempo real.")
                                      setMenuAberto(null)
                                    }}
                                  />
                                  <MenuBotao
                                    icon={<MessageCircle size={17} />}
                                    texto="Falar com motorista"
                                    onClick={() => {
                                      alert("Chat/WhatsApp do motorista será conectado depois.")
                                      setMenuAberto(null)
                                    }}
                                  />
                                </>
                              ) : null}

                              {podeCancelar(frete.status) && (
                                <MenuBotao
                                  perigo
                                  icon={<Ban size={17} />}
                                  texto={processandoId === frete.id ? "Cancelando..." : "Cancelar entrega"}
                                  onClick={() =>
                                    alterarStatus(
                                      frete,
                                      "Cancelada",
                                      "Entrega cancelada pela empresa.",
                                      "Entrega cancelada"
                                    )
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalNovaEntrega && <NovaEntregaModal ui={ui} fechar={() => setModalNovaEntrega(false)} />}
    </main>
  )
}

function CardResumo({ titulo, valor, detalhe, icon, verde, azul, vermelho, ui }: any) {
  const cor = vermelho ? "text-red-500" : azul ? "text-sky-500" : verde ? "text-green-500" : "text-[#d4af37]"

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

function Status({ nome }: { nome: string }) {
  const status = nome.toLowerCase()

  const classe = status.includes("conclu")
    ? "bg-green-600"
    : status.includes("andamento") || status.includes("rota") || status.includes("aceito")
      ? "bg-blue-600"
      : status.includes("cancel")
        ? "bg-red-600"
        : status.includes("paus")
          ? "bg-zinc-600"
          : "bg-yellow-500 text-black"

  return <span className={`rounded-md px-3 py-1 text-xs font-bold text-white ${classe}`}>{nome}</span>
}

function MenuBotao({ icon, texto, onClick, perigo = false }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-white/10 ${
        perigo ? "text-red-400" : "text-inherit"
      }`}
    >
      <span>{icon}</span>
      <span>{texto}</span>
    </button>
  )
}
