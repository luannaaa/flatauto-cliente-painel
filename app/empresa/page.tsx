"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import NovaEntregaModal from "./components/NovaEntregaModal"
import { supabase } from "../../lib/supabase"
import {
  Home,
  Truck,
  UserRound,
  UsersRound,
  Car,
  BarChart3,
  Wallet,
  FileText,
  MapPinned,
  Settings,
  LogOut,
  Bell,
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Package,
  DollarSign,
  Download,
  Menu,
  X,
  MoreHorizontal,
} from "lucide-react"

type Tema = "dark" | "light"
type StatusEntrega = "Concluída" | "Em Andamento" | "Cancelada"

type EmpresaReal = {
  id?: string
  nome_empresa?: string
  responsavel?: string
  email?: string
  telefone?: string
  cnpj?: string
  logo_empresa?: string
  foto_documento?: string
  created_at?: string
}

type EntregaEmpresa = {
  id: string
  data: string
  cliente: string
  origem: string
  destino: string
  motorista: string
  valor: string
  status: StatusEntrega
}

type DestinoEmpresa = { cidade: string; total: number }

type CRMColuna = {
  nome: string
  total: number
  cor: string
  itens: { nome: string; local: string; valor: string }[]
}

type FinanceiroResumo = {
  faturamentoBruto: number
  repasseMotorista: number
  faturamentoLiquido: number
  despesas: number
  lucroLiquido: number
}

const imagens = {
  logoEmpresa: "/empresa_logo.png",
  mapaSaoPaulo: "/SP-removebg-preview.png",
}

const entregasIniciais: EntregaEmpresa[] = []
const destinosIniciais: DestinoEmpresa[] = []
const crmColunasIniciais: CRMColuna[] = []

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarDataCriacao(data?: string) {
  if (!data) return "data de criação não encontrada"

  const dataConta = new Date(data)

  if (Number.isNaN(dataConta.getTime())) {
    return "data de criação não encontrada"
  }

  return dataConta.toLocaleDateString("pt-BR")
}

function formatarDataAcessoAtual() {
  return new Date().toLocaleDateString("pt-BR")
}

function normalizarStatus(status?: string | null): StatusEntrega {
  const texto = String(status || "").toLowerCase()

  if (texto.includes("conclu") || texto.includes("entreg")) return "Concluída"
  if (texto.includes("cancel")) return "Cancelada"

  return "Em Andamento"
}

export default function PainelEmpresa() {
  const [tema, setTema] = useState<Tema>("dark")
  const [modalNovaEntrega, setModalNovaEntrega] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [empresa, setEmpresa] = useState<EmpresaReal | null>(null)
  const [entregas, setEntregas] = useState<EntregaEmpresa[]>(entregasIniciais)
  const [destinos, setDestinos] = useState<DestinoEmpresa[]>(destinosIniciais)
  const [crmColunas, setCrmColunas] = useState<CRMColuna[]>(crmColunasIniciais)
  const [financeiroResumo, setFinanceiroResumo] = useState<FinanceiroResumo>({
    faturamentoBruto: 0,
    repasseMotorista: 0,
    faturamentoLiquido: 0,
    despesas: 0,
    lucroLiquido: 0,
  })

  useEffect(() => {
    function carregarTemaEmpresa() {
      const temaSalvo = localStorage.getItem("temaEmpresa")

      if (temaSalvo === "light" || temaSalvo === "claro") {
        setTema("light")
      } else {
        setTema("dark")
      }
    }

    carregarTemaEmpresa()

    window.addEventListener("storage", carregarTemaEmpresa)
    window.addEventListener("temaEmpresaAtualizado", carregarTemaEmpresa)

    return () => {
      window.removeEventListener("storage", carregarTemaEmpresa)
      window.removeEventListener("temaEmpresaAtualizado", carregarTemaEmpresa)
    }
  }, [])

  useEffect(() => {
    async function carregarEmpresaReal() {
      if (typeof window === "undefined") return

      const dadosSalvos = localStorage.getItem("flatauto_empresa_dados")
      const empresaIdSalvo = localStorage.getItem("flatauto_empresa_id")
      const emailUsuarioSalvo = localStorage.getItem("flatauto_usuario_email")
      const emailEmpresaSalvo = localStorage.getItem("flatauto_empresa_email")

      let dadosLocais: EmpresaReal | null = null

      if (dadosSalvos) {
        try {
          dadosLocais = JSON.parse(dadosSalvos)
          setEmpresa(dadosLocais)

          if (dadosLocais?.id) {
            await carregarDadosDashboard(dadosLocais.id)
          }
        } catch {
          localStorage.removeItem("flatauto_empresa_dados")
        }
      }

      const idParaBuscar = empresaIdSalvo || dadosLocais?.id || ""
      const emailParaBuscar = (emailUsuarioSalvo || emailEmpresaSalvo || dadosLocais?.email || "")
        .trim()
        .toLowerCase()

      if (!idParaBuscar && !emailParaBuscar) return

      let consulta = supabase
        .from("empresas")
        .select("id,nome_empresa,email,senha,telefone,cnpj,logo_empresa,responsavel,foto_documento,created_at")

      if (idParaBuscar) {
        consulta = consulta.eq("id", idParaBuscar)
      } else {
        consulta = consulta.eq("email", emailParaBuscar)
      }

      const { data, error } = await consulta.maybeSingle()

      if (error) {
        console.error("Erro ao buscar empresa no Supabase:", error.message)
        return
      }

      if (data) {
        setEmpresa(data)
        localStorage.setItem("flatauto_empresa_logada", "true")
        localStorage.setItem("flatauto_empresa_dados", JSON.stringify(data))

        if (data.id) {
          localStorage.setItem("flatauto_empresa_id", data.id)
          await carregarDadosDashboard(data.id)
        }

        if (data.email) {
          localStorage.setItem("flatauto_empresa_email", data.email)
          localStorage.setItem("flatauto_usuario_email", data.email)
        }
      }
    }

    carregarEmpresaReal()
  }, [])

  async function carregarDadosDashboard(empresaId: string) {
    const [fretesResp, financeiroResp, clientesResp, motoristasResp, crmResp] =
      await Promise.all([
        supabase
          .from("fretes")
          .select("*")
          .eq("empresa_id", empresaId)
          .order("created_at", { ascending: false }),

        supabase
          .from("financeiro")
          .select("*")
          .eq("empresa_id", empresaId)
          .order("created_at", { ascending: false }),

        supabase
          .from("clientes_empresa")
          .select("*")
          .eq("empresa_id", empresaId),

        supabase
          .from("motoristas")
          .select("*"),

        supabase
          .from("crm_integracoes")
          .select("*")
          .eq("empresa_id", empresaId),
      ])

    if (fretesResp.error) console.error("Erro ao buscar fretes:", fretesResp.error.message)
    if (financeiroResp.error) console.error("Erro ao buscar financeiro:", financeiroResp.error.message)
    if (clientesResp.error) console.error("Erro ao buscar clientes:", clientesResp.error.message)
    if (motoristasResp.error) console.error("Erro ao buscar motoristas:", motoristasResp.error.message)
    if (crmResp.error) console.error("Erro ao buscar CRM:", crmResp.error.message)

    const fretes = Array.isArray(fretesResp.data) ? fretesResp.data : []
    const financeiro = Array.isArray(financeiroResp.data) ? financeiroResp.data : []
    const clientes = Array.isArray(clientesResp.data) ? clientesResp.data : []
    const motoristas = Array.isArray(motoristasResp.data) ? motoristasResp.data : []
    const crm = Array.isArray(crmResp.data) ? crmResp.data : []

    const clientesPorId = new Map(
      clientes.map((cliente: any) => [
        cliente.id,
        cliente.nome || cliente.responsavel || "Cliente",
      ])
    )

    const motoristasPorId = new Map(
      motoristas.map((motorista: any) => [
        motorista.id,
        motorista.nome || "Motorista",
      ])
    )

    const entregasFormatadas: EntregaEmpresa[] = fretes.map((frete: any) => {
      return {
        id: frete.codigo || frete.id,
        data: frete.created_at
          ? new Date(frete.created_at).toLocaleDateString("pt-BR")
          : "Sem data",
        cliente: clientesPorId.get(frete.cliente_id) || "Não informado",
        origem: frete.origem || frete.endereco_origem || "Não informado",
        destino: frete.destino || frete.endereco_destino || "Não informado",
        motorista: motoristasPorId.get(frete.motorista_id) || "Não vinculado",
        valor: formatarMoeda(Number(frete.valor_frete || 0)),
        status: normalizarStatus(frete.status),
      }
    })

    const destinosMap = new Map<string, number>()

    fretes.forEach((frete: any) => {
      const destinoCompleto = frete.destino || frete.endereco_destino || "Não informado"
      const destinoCurto = String(destinoCompleto).split(",")[0].trim() || "Não informado"

      destinosMap.set(destinoCurto, (destinosMap.get(destinoCurto) || 0) + 1)
    })

    const destinosFormatados: DestinoEmpresa[] = Array.from(destinosMap.entries()).map(
      ([cidade, total]) => ({
        cidade,
        total,
      })
    )

    const faturamentoBruto = financeiro.reduce(
      (total: number, item: any) => total + Number(item.valor_frete || 0),
      0
    )

    const repasseMotorista = financeiro.reduce(
      (total: number, item: any) => total + Number(item.valor_motorista || 0),
      0
    )

    const faturamentoLiquido = financeiro.reduce(
      (total: number, item: any) =>
        total + Number(item.valor_empresa || 0) + Number(item.valor_app || 0),
      0
    )

    const despesas = financeiro.reduce(
      (total: number, item: any) => total + Number(item.despesas || 0),
      0
    )

    const lucroLiquido = financeiro.reduce(
      (total: number, item: any) => total + Number(item.lucro_liquido || 0),
      0
    )

    const crmFormatado: CRMColuna[] = crm.length
      ? [
          {
            nome: "Integrações",
            total: crm.length,
            cor: "border-[#ffc400]/30 bg-[#ffc400]/5",
            itens: crm.map((item: any) => ({
              nome: item.crm || "CRM",
              local: item.conectado ? "Conectado" : "Desconectado",
              valor: item.conectado ? "Ativo" : "Off",
            })),
          },
        ]
      : []

    setEntregas(entregasFormatadas)
    setDestinos(destinosFormatados)
    setCrmColunas(crmFormatado)
    setFinanceiroResumo({
      faturamentoBruto,
      repasseMotorista,
      faturamentoLiquido,
      despesas,
      lucroLiquido,
    })
  }

  function mudarTema(novoTema: Tema) {
    setTema(novoTema)
    localStorage.setItem("temaEmpresa", novoTema)
    window.dispatchEvent(new Event("temaEmpresaAtualizado"))
  }

  const claro = tema === "light"

  const ui = useMemo(() => ({
    pagina: claro ? "bg-[#f6f0df] text-[#111]" : "bg-[#020507] text-white",
    sidebar: claro ? "bg-white/90 border-[#dfd0a5] text-black" : "bg-[#030506]/94 border-white/10 text-white",
    menuInativo: claro ? "text-black/70 hover:bg-black/[0.04] hover:text-black" : "text-white/75 hover:bg-white/[0.06] hover:text-[#ffc400]",
    card: claro ? "border-[#dfd0a5] bg-white/90 shadow-[0_16px_45px_rgba(80,60,20,0.11)]" : "border-white/10 bg-[#10171b]/88 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/58",
    linha: claro ? "border-[#dfd0a5]" : "border-white/10",
  }), [claro])

  const nomeEmpresa = empresa?.nome_empresa || "Empresa"
  const responsavelEmpresa = empresa?.responsavel || "Empresa"
  const emailEmpresa = empresa?.email || ""
  const dataCriacaoEmpresa = formatarDataCriacao(empresa?.created_at)
  const dataAcessoAtual = formatarDataAcessoAtual()
  const periodoConta = `${dataCriacaoEmpresa} - ${dataAcessoAtual}`

  const totalEntregas = entregas.length
  const concluidas = entregas.filter((entrega) => entrega.status === "Concluída").length
  const emAndamento = entregas.filter((entrega) => entrega.status === "Em Andamento").length
  const canceladas = entregas.filter((entrega) => entrega.status === "Cancelada").length

  return (
    <main className={`min-h-screen ${ui.pagina}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" />

      <section className="relative hidden min-h-screen grid-cols-[286px_1fr] md:grid">
        <MenuLateral ui={ui} tema={tema} setTema={mudarTema} nomeEmpresa={nomeEmpresa} responsavelEmpresa={responsavelEmpresa} emailEmpresa={emailEmpresa} />

        <section className="min-w-0 px-7 py-6">
          <Topo periodoConta={periodoConta} ui={ui} nomeEmpresa={nomeEmpresa} dataAcessoAtual={dataAcessoAtual} abrirNovaEntrega={() => setModalNovaEntrega(true)} />

          <div className="mt-6 grid grid-cols-5 gap-4">
            <Indicador ui={ui} titulo="Total de Entregas" valor={String(totalEntregas)} detalhe={totalEntregas ? "Dados reais do Supabase" : "Sem dados cadastrados"} icon={<Package />} />
            <Indicador ui={ui} titulo="Concluídas" valor={String(concluidas)} detalhe={concluidas ? "Entregas finalizadas" : "Sem dados cadastrados"} icon={<CheckCircle2 />} verde />
            <Indicador ui={ui} titulo="Em Andamento" valor={String(emAndamento)} detalhe={emAndamento ? "Entregas ativas" : "Sem dados cadastrados"} icon={<Truck />} azul />
            <Indicador ui={ui} titulo="Canceladas" valor={String(canceladas)} detalhe={canceladas ? "Entregas canceladas" : "Sem dados cadastrados"} icon={<XCircle />} vermelho />
            <Indicador ui={ui} titulo="Receita Líquida" valor={formatarMoeda(financeiroResumo.faturamentoLiquido)} detalhe={financeiroResumo.faturamentoLiquido ? "Financeiro real" : "Sem financeiro cadastrado"} icon={<DollarSign />} />
          </div>

          <div className="mt-5 grid grid-cols-[0.86fr_1.34fr_0.58fr] gap-5">
            <Card ui={ui} titulo="Entregas por Período" acao="7 dias">
              <GraficoLinha entregas={entregas} />
            </Card>

            <Card ui={ui} titulo="CRM - Pipeline de Negócios">
              <CRM ui={ui} colunas={crmColunas} />
            </Card>

            <Card ui={ui} titulo="Exportar Relatórios">
              <Exportar ui={ui} />
            </Card>
          </div>

          <div className="mt-5 grid grid-cols-[1.25fr_0.75fr] gap-5">
            <Card ui={ui} titulo="Resumo Financeiro" acao="Este mês">
              <Financeiro ui={ui} resumo={financeiroResumo} />
            </Card>

            <Card ui={ui} titulo="Entregas por Região">
              <MapaSaoPaulo ui={ui} destinos={destinos} />
            </Card>
          </div>

          <div className="mt-5">
            <Card ui={ui} titulo="Entregas Recentes" acao="Ver todas">
              <Tabela ui={ui} entregas={entregas} />
            </Card>
          </div>
        </section>
      </section>

      <section className="relative min-h-screen px-4 pb-28 pt-5 md:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMenuMobileAberto(true)}
              className={`${claro ? "text-black/80" : "text-white/80"}`}
            >
              <Menu size={28} />
            </button>

            <LogoMarca compacto />

            <button className={`relative ${claro ? "text-black/80" : "text-white/80"}`}>
              <Bell size={24} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffc400]" />
            </button>
          </header>

          <div className="mt-7">
            <h1 className="text-[25px] font-black leading-tight">Olá, {nomeEmpresa} 👋</h1>
            <p className={`mt-2 text-sm ${ui.textoFraco}`}>Acompanhe o desempenho da sua operação em tempo real.</p>
            <p className={`mt-1 text-xs ${ui.textoFraco}`}>Atualização da conta: {dataAcessoAtual}</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
            <div className={`flex h-12 items-center gap-2 rounded-xl border px-3 text-xs font-bold ${ui.card2}`}>
              <CalendarDays size={18} />
              <span className="min-w-0 flex-1">{periodoConta}</span>
            </div>

            <button onClick={() => setModalNovaEntrega(true)} className="flex h-12 items-center gap-1 rounded-xl bg-[#ffc400] px-4 font-black text-black">
              <Plus size={18} />
              Nova
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Indicador ui={ui} titulo="Total de Entregas" valor={String(totalEntregas)} detalhe="Supabase" icon={<Package />} mobile />
            <Indicador ui={ui} titulo="Concluídas" valor={String(concluidas)} detalhe="Supabase" icon={<CheckCircle2 />} verde mobile />
            <Indicador ui={ui} titulo="Em Andamento" valor={String(emAndamento)} detalhe="Supabase" icon={<Truck />} azul mobile />
            <Indicador ui={ui} titulo="Canceladas" valor={String(canceladas)} detalhe="Supabase" icon={<XCircle />} vermelho mobile />
          </div>

          <div className="mt-4">
            <Card ui={ui} titulo="Entregas por Período" acao="7 dias">
              <GraficoLinha mobile entregas={entregas} />
            </Card>
          </div>

          <div className="mt-4">
            <Card ui={ui} titulo="CRM - Pipeline" acao="Ver tudo">
              <CRM ui={ui} colunas={crmColunas} mobile />
            </Card>
          </div>

          <div className="mt-4">
            <Card ui={ui} titulo="Entregas por Região">
              <MapaSaoPaulo ui={ui} destinos={destinos} mobile />
            </Card>
          </div>

          <div className="mt-4">
            <Card ui={ui} titulo="Resumo Financeiro" acao="Este mês">
              <Financeiro ui={ui} mobile resumo={financeiroResumo} />
            </Card>
          </div>

          <div className="mt-4">
            <Card ui={ui} titulo="Entregas Recentes">
              <ListaMobile ui={ui} entregas={entregas} />
            </Card>
          </div>
        </div>

        <nav className={`fixed bottom-0 left-0 right-0 border-t px-5 py-3 backdrop-blur-2xl ${ui.card2}`}>
          <div className="mx-auto flex max-w-[430px] items-center justify-between">
            <NavMobile icon={<Home />} texto="Dashboard" href="/empresa" ativo claro={claro} />
            <NavMobile icon={<Truck />} texto="Entregas" href="/empresa/entregas" claro={claro} />
            <Link href="/empresa/entregas" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffc400] text-black shadow-[0_0_45px_rgba(255,196,0,0.45)]">
              <Plus size={34} strokeWidth={2.8} />
            </Link>
            <NavMobile icon={<UserRound />} texto="Motoristas" href="/empresa/motoristas" claro={claro} />
            <NavMobile icon={<MoreHorizontal />} texto="Mais" href="/empresa/configuracoes" claro={claro} />
          </div>
        </nav>
      </section>

      {menuMobileAberto && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 h-full w-full bg-black/70"
            onClick={() => setMenuMobileAberto(false)}
          />

          <aside className={`absolute left-0 top-0 h-full w-[84%] max-w-[340px] overflow-y-auto border-r p-5 ${ui.sidebar}`}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <LogoMarca compacto />

              <button
                type="button"
                onClick={() => setMenuMobileAberto(false)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${ui.card2}`}
              >
                <X size={21} />
              </button>
            </div>

            <nav className="space-y-2">
              {[
                ["Dashboard", "/empresa", <Home key="dashboard" />],
                ["Entregas", "/empresa/entregas", <Truck key="entregas" />],
                ["Motoristas", "/empresa/motoristas", <UserRound key="motoristas" />],
                ["Veículos", "/empresa/veiculos", <Car key="veiculos" />],
                ["Clientes", "/empresa/clientes", <UsersRound key="clientes" />],
                ["CRM", "/empresa/crm", <BarChart3 key="crm" />],
                ["Financeiro", "/empresa/financeiro", <Wallet key="financeiro" />],
                ["Relatórios", "/empresa/relatorios", <FileText key="relatorios" />],
                ["Mapa", "/empresa/mapa", <MapPinned key="mapa" />],
                ["Analytics", "/empresa/analytics", <BarChart3 key="analytics" />],
                ["Configurações", "/empresa/configuracoes", <Settings key="configuracoes" />],
              ].map(([texto, href, icon]: any) => (
                <Link
                  key={texto}
                  href={href}
                  onClick={() => setMenuMobileAberto(false)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black ${ui.card2}`}
                >
                  <span className="text-[#ffc400]">{icon}</span>
                  {texto}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => mudarTema(tema === "light" ? "dark" : "light")}
              className={`mt-5 w-full rounded-2xl border px-4 py-3 text-sm font-black ${ui.card2}`}
            >
              Mudar para {tema === "light" ? "modo escuro" : "modo claro"}
            </button>
          </aside>
        </div>
      )}

      {modalNovaEntrega && (
        <NovaEntregaModal ui={ui} fechar={() => setModalNovaEntrega(false)} />
      )}
    </main>
  )
}

function LogoMarca({ compacto = false }: { compacto?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={imagens.logoEmpresa}
        alt="FlatAuto"
        className={`${compacto ? "h-11 w-11" : "h-14 w-14"} object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.25)]`}
      />
      <div>
        <p className={`${compacto ? "text-[18px]" : "text-[21px]"} font-black leading-none tracking-wide`}>
          FLAT<span className="text-[#ffc400]">AUTO</span>
        </p>
        <p className={`${compacto ? "text-[9px]" : "text-xs"} mt-1 font-bold tracking-[0.18em] text-[#ffc400]`}>
          EMPRESA
        </p>
      </div>
    </div>
  )
}

function Topo({ periodoConta, ui, nomeEmpresa, dataAcessoAtual, abrirNovaEntrega }: any) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[36px] font-black leading-tight tracking-[-0.035em]">
          Olá, {nomeEmpresa} 👋
        </h1>
        <p className={`mt-2 text-[16px] ${ui.textoFraco}`}>
          Acompanhe o desempenho da sua operação em tempo real.
        </p>
        <p className={`mt-1 text-[13px] ${ui.textoFraco}`}>
          Atualização da conta: {dataAcessoAtual}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-[255px] items-center gap-3 rounded-xl border px-4 text-sm font-bold ${ui.card2}`}>
          <CalendarDays size={18} />
          <span className="min-w-0 flex-1">{periodoConta}</span>
        </div>

        <button onClick={abrirNovaEntrega} className="flex h-12 items-center gap-2 rounded-xl bg-[#ffc400] px-7 font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.38)]">
          <Plus size={18} />
          Nova Entrega
        </button>

        <button className={`relative flex h-12 w-12 items-center justify-center rounded-xl border ${ui.card2}`}>
          <Bell size={21} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#ffc400]" />
        </button>
      </div>
    </header>
  )
}

function MenuLateral({ ui, tema, setTema, nomeEmpresa }: any) {
  const menu = [
    { texto: "Dashboard", href: "/empresa", icon: <Home />, ativo: true },
    { texto: "Entregas", href: "/empresa/entregas", icon: <Truck /> },
    { texto: "Motoristas", href: "/empresa/motoristas", icon: <UserRound /> },
    { texto: "Veículos", href: "/empresa/veiculos", icon: <Car /> },
    { texto: "Clientes", href: "/empresa/clientes", icon: <UsersRound /> },
    { texto: "CRM", href: "/empresa/crm", icon: <BarChart3 /> },
    { texto: "Financeiro", href: "/empresa/financeiro", icon: <Wallet /> },
    { texto: "Relatórios", href: "/empresa/relatorios", icon: <FileText /> },
    { texto: "Mapa", href: "/empresa/mapa", icon: <MapPinned /> },
    { texto: "Analytics", href: "/empresa/analytics", icon: <BarChart3 />, badge: "IA" },
    { texto: "Configurações", href: "/empresa/configuracoes", icon: <Settings /> },
  ]

  return (
    <aside className={`border-r px-5 py-7 backdrop-blur-xl ${ui.sidebar}`}>
      <Link href="/empresa">
        <LogoMarca />
      </Link>

      <nav className="mt-9 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.texto}
            href={item.href}
            className={`group flex min-h-[52px] w-full items-center gap-4 rounded-2xl px-4 text-left font-bold transition ${
              item.ativo
                ? "bg-[#ffc400] text-black shadow-[0_0_28px_rgba(255,196,0,0.22)]"
                : ui.menuInativo
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">{item.icon}</span>
            <span className="flex-1">{item.texto}</span>
            {item.badge && (
              <span className="rounded-md border border-[#ffc400]/70 px-2 py-0.5 text-[10px] text-[#ffc400]">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className={`mt-8 rounded-2xl border p-4 ${ui.card}`}>
        <div className="flex items-center gap-3">
          <div className="text-[#ffc400]">
            <Package size={35} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{nomeEmpresa}</p>
            <p className={`mt-1 text-xs ${ui.textoFraco}`}>Área Empresa</p>
          </div>
        </div>
      </div>

      <Link href="/" className={`mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border font-bold ${ui.card2}`}>
        <LogOut size={22} />
        Sair
      </Link>

      <div className={`mt-8 flex items-center justify-between rounded-full border p-2 ${ui.card2}`}>
        <span className="px-4 text-xs font-bold">TEMA</span>
        <button onClick={() => setTema("dark")} className={`flex h-9 w-9 items-center justify-center rounded-full ${tema === "dark" ? "bg-[#ffc400] text-black" : ""}`}>☀</button>
        <button onClick={() => setTema("light")} className={`flex h-9 w-9 items-center justify-center rounded-full ${tema === "light" ? "bg-[#ffc400] text-black" : ""}`}>◐</button>
      </div>
    </aside>
  )
}

function Card({ titulo, acao, children, ui }: any) {
  return (
    <section className={`relative overflow-hidden rounded-[26px] border p-5 backdrop-blur-xl ${ui.card}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffc400]/10 blur-[38px]" />
      <div className="relative mb-5 flex items-center justify-between">
        <h2 className="font-black">{titulo}</h2>
        {acao && <button className={`rounded-lg border px-3 py-2 text-sm text-[#ffc400] ${ui.card2}`}>{acao}</button>}
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}

function Indicador({ titulo, valor, detalhe, icon, ui, azul, vermelho, verde, mobile }: any) {
  const corTexto = vermelho ? "text-red-400" : azul ? "text-sky-400" : verde ? "text-lime-400" : "text-[#ffc400]"
  const corIcone = vermelho ? "text-red-500" : azul ? "text-sky-400" : verde ? "text-lime-400" : "text-[#ffc400]"

  return (
    <div className={`relative overflow-hidden rounded-[24px] border ${ui.card} ${mobile ? "p-4" : "p-5"}`}>
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#ffc400]/10 blur-[28px]" />
      <div className="relative flex justify-between gap-3">
        <div>
          <p className={`${mobile ? "text-xs" : "text-sm"} ${ui.textoFraco}`}>{titulo}</p>
          <p className={`${mobile ? "mt-3 text-[32px]" : "mt-4 text-[34px]"} font-black leading-none`}>{valor}</p>
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] ${corIcone}`}>
          {icon}
        </div>
      </div>
      <p className={`relative mt-4 text-sm ${corTexto}`}>{detalhe}</p>
    </div>
  )
}

function GraficoLinha({ mobile = false, entregas = [] }: { mobile?: boolean; entregas?: EntregaEmpresa[] }) {
  if (!entregas.length) {
    return (
      <div className={`${mobile ? "h-[190px]" : "h-[260px]"} relative flex items-center justify-center rounded-2xl border border-dashed border-white/10`}>
        <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_52px]" />
        <p className="relative text-center text-sm opacity-55">Nenhum dado de entregas para montar o gráfico.</p>
      </div>
    )
  }

  const ultimas = entregas.slice(0, 7).reverse()

  return (
    <div className={`${mobile ? "h-[190px]" : "h-[260px]"} relative rounded-2xl border border-white/10 p-4`}>
      <div className="flex h-full items-end gap-3">
        {ultimas.map((entrega) => (
          <div key={entrega.id} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-xl bg-[#ffc400]" style={{ height: "55%" }} />
            <span className="max-w-[60px] truncate text-[10px] opacity-60">{entrega.data}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CRM({ ui, colunas = [], mobile }: any) {
  if (!colunas.length) {
    return <Vazio ui={ui} texto="Nenhum CRM conectado ainda." />
  }

  return (
    <div className={mobile ? "flex flex-col gap-4" : "grid grid-cols-4 gap-4"}>
      {colunas.map((coluna: CRMColuna) => (
        <div key={coluna.nome} className={`rounded-2xl border p-4 ${coluna.cor} ${mobile ? "w-full" : ""}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-black md:text-base">{coluna.nome}</h3>
            <span className="rounded-full bg-[#d4af37]/20 px-2 py-1 text-xs font-bold text-[#d4af37]">
              {coluna.total}
            </span>
          </div>

          <div className="space-y-3">
            {coluna.itens.map((item) => (
              <div key={item.nome} className={`rounded-xl border p-3 ${ui.card2}`}>
                <p className="text-sm font-bold">{item.nome}</p>
                <p className={`mt-1 text-xs ${ui.textoFraco}`}>{item.local}</p>
                <p className="mt-2 text-sm font-black text-[#d4af37]">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Exportar({ ui }: any) {
  return (
    <div>
      <p className={`text-sm ${ui.textoFraco}`}>Gere relatórios personalizados por cliente ou geral da operação.</p>
      <select className={`mt-4 h-11 w-full rounded-xl border px-3 text-sm outline-none ${ui.card2}`}>
        <option>Relatório Geral</option>
        <option>Por Cliente</option>
        <option>Financeiro</option>
      </select>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black">
          <Download size={18} />
          PDF
        </button>
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-black text-white">
          <FileText size={18} />
          Excel
        </button>
      </div>
    </div>
  )
}

function MapaSaoPaulo({ ui, destinos = [], mobile }: any) {
  return (
    <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-[1fr_0.9fr]"} gap-4`}>
      <div className={`relative h-[260px] overflow-hidden rounded-2xl border ${ui.card2}`}>
        <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/70 px-3 py-1 text-[10px] font-black text-white backdrop-blur">
          Regiões
        </div>

        <img
          src={imagens.mapaSaoPaulo}
          alt="Mapa"
          className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-75"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10171b] to-transparent" />
      </div>

      <div className="space-y-2">
        <p className={`text-sm font-bold ${ui.textoFraco}`}>Entregas por região</p>

        {destinos.length ? destinos.map((destino: DestinoEmpresa) => (
          <div key={destino.cidade} className="flex items-center justify-between text-sm">
            <span>{destino.cidade}</span>
            <strong>{destino.total}</strong>
          </div>
        )) : <Vazio ui={ui} texto="Nenhuma região com entregas ainda." compacto />}

        <Link href="/empresa/mapa" className="block pt-1 text-sm font-bold text-[#ffc400]">
          Ver mapa completo
        </Link>
      </div>
    </div>
  )
}

function Financeiro({ ui, mobile, resumo }: any) {
  const itens = [
    ["Faturamento Bruto", formatarMoeda(resumo.faturamentoBruto), resumo.faturamentoBruto ? "Total dos fretes" : "Sem dados financeiros", "text-[#ffc400]"],
    ["Repasse Motorista", formatarMoeda(resumo.repasseMotorista), resumo.repasseMotorista ? "Total repassado" : "Sem repasses cadastrados", "text-sky-400"],
    ["Faturamento Líquido", formatarMoeda(resumo.faturamentoLiquido), resumo.faturamentoLiquido ? "Empresa + app" : "Sem dados financeiros", "text-green-400"],
    ["Despesas", formatarMoeda(resumo.despesas), resumo.despesas ? "Despesas registradas" : "Sem despesas cadastradas", "text-red-400"],
    ["Lucro Líquido", formatarMoeda(resumo.lucroLiquido), resumo.lucroLiquido ? "Lucro final" : "Sem dados financeiros", "text-lime-400"],
  ]

  return (
    <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-5"} gap-3`}>
      {itens.map(([titulo, valor, detalhe, cor]) => (
        <div key={String(titulo)} className={`rounded-xl border p-4 ${ui.card2}`}>
          <p className={`text-xs ${ui.textoFraco}`}>{titulo}</p>
          <p className="mt-3 text-[22px] font-black">{valor}</p>
          <p className={`mt-2 text-xs ${cor}`}>{detalhe}</p>
        </div>
      ))}
    </div>
  )
}

function Tabela({ ui, entregas = [] }: any) {
  if (!entregas.length) {
    return <Vazio ui={ui} texto="Nenhuma entrega cadastrada ainda." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead>
          <tr className={`border-b ${ui.linha} ${ui.textoFraco}`}>
            <th className="pb-4">ID</th>
            <th className="pb-4">Data</th>
            <th className="pb-4">Cliente</th>
            <th className="pb-4">Origem</th>
            <th className="pb-4">Destino</th>
            <th className="pb-4">Motorista</th>
            <th className="pb-4">Valor</th>
            <th className="pb-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega: EntregaEmpresa) => (
            <tr key={entrega.id} className={`border-b ${ui.linha}`}>
              <td className="py-4">{entrega.id}</td>
              <td>{entrega.data}</td>
              <td>{entrega.cliente}</td>
              <td>{entrega.origem}</td>
              <td>{entrega.destino}</td>
              <td>{entrega.motorista}</td>
              <td>{entrega.valor}</td>
              <td><Status status={entrega.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ListaMobile({ ui, entregas = [] }: any) {
  if (!entregas.length) {
    return <Vazio ui={ui} texto="Nenhuma entrega cadastrada ainda." />
  }

  return (
    <div className="space-y-3">
      {entregas.map((entrega: EntregaEmpresa) => (
        <div key={entrega.id} className={`rounded-xl border p-4 ${ui.card2}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-sm ${ui.textoFraco}`}>{entrega.id} • {entrega.data}</p>
              <p className="mt-1 font-bold">{entrega.cliente}</p>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>{entrega.origem} → {entrega.destino}</p>
              <p className="mt-2 text-sm font-bold">{entrega.valor}</p>
            </div>
            <Status status={entrega.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Status({ status }: { status: StatusEntrega }) {
  const classe =
    status === "Concluída"
      ? "bg-green-600"
      : status === "Em Andamento"
        ? "bg-blue-600"
        : "bg-red-600"

  return <span className={`rounded-md px-3 py-1 text-xs font-bold text-white ${classe}`}>{status}</span>
}

function Vazio({ ui, texto, compacto = false }: any) {
  return (
    <div className={`flex ${compacto ? "min-h-[74px]" : "min-h-[180px]"} items-center justify-center rounded-2xl border border-dashed p-5 text-center ${ui.card2}`}>
      <p className={`max-w-[320px] text-sm ${ui.textoFraco}`}>{texto}</p>
    </div>
  )
}

function NavMobile({ icon, texto, ativo, claro, href = "/empresa" }: any) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${ativo ? "text-[#ffc400]" : claro ? "text-black/55" : "text-white/55"}`}
    >
      <span className="flex h-7 w-7 items-center justify-center">{icon}</span>
      <span className="text-[11px]">{texto}</span>
    </Link>
  )
}