"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
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
  MoreHorizontal,
} from "lucide-react"

type Tema = "dark" | "light"
type StatusEntrega = "Concluída" | "Em Andamento" | "Cancelada"

const imagens = {
  logoEmpresa: "/empresa_logo.png",
  mapaSaoPaulo: "/SP-removebg-preview.png",
}

const entregas = [
  { id: "#1287", data: "18/05/2026", cliente: "Auto Peças Brasil", origem: "São Paulo - SP", destino: "Campinas - SP", motorista: "Marcos Vinícius", valor: "R$ 1.250,00", status: "Concluída" as StatusEntrega },
  { id: "#1286", data: "18/05/2026", cliente: "Construtora Nova", origem: "Santos - SP", destino: "Ribeirão Preto - SP", motorista: "João Silva", valor: "R$ 2.340,00", status: "Em Andamento" as StatusEntrega },
  { id: "#1285", data: "17/05/2026", cliente: "Mercado Central", origem: "Campinas - SP", destino: "São Paulo - SP", motorista: "Carlos Alberto", valor: "R$ 980,00", status: "Concluída" as StatusEntrega },
  { id: "#1284", data: "17/05/2026", cliente: "Indústria ABC", origem: "São Paulo - SP", destino: "Sorocaba - SP", motorista: "Rafael Costa", valor: "R$ 1.870,00", status: "Cancelada" as StatusEntrega },
  { id: "#1283", data: "16/05/2026", cliente: "Lojas Silva", origem: "Ribeirão Preto - SP", destino: "Santos - SP", motorista: "Lucas Martins", valor: "R$ 1.450,00", status: "Concluída" as StatusEntrega },
]

const destinos = [
  { cidade: "São Paulo - SP", total: 42 },
  { cidade: "Campinas - SP", total: 18 },
  { cidade: "Ribeirão Preto - SP", total: 12 },
  { cidade: "Sorocaba - SP", total: 10 },
  { cidade: "Santos - SP", total: 8 },
]

const crmColunas = [
  { nome: "Novos Leads", total: 8, cor: "border-[#ffc400]/35 bg-[#ffc400]/8", itens: [{ nome: "Empresa ABC", local: "São Paulo - SP", valor: "R$ 12.500" }, { nome: "Indústria Lima", local: "Campinas - SP", valor: "R$ 8.750" }] },
  { nome: "Contato Inicial", total: 5, cor: "border-[#d89711]/35 bg-[#d89711]/8", itens: [{ nome: "Comércio Forte", local: "Santos - SP", valor: "R$ 23.000" }, { nome: "Log Express", local: "São Paulo - SP", valor: "R$ 15.400" }] },
  { nome: "Em andamento", total: 7, cor: "border-sky-500/35 bg-sky-500/8", itens: [{ nome: "Distribuidora X", local: "Ribeirão Preto - SP", valor: "R$ 27.800" }, { nome: "Transportes Betta", local: "Sorocaba - SP", valor: "R$ 16.600" }] },
  { nome: "Negócio Fechado", total: 12, cor: "border-green-500/35 bg-green-500/8", itens: [{ nome: "Mercado Central", local: "São Paulo - SP", valor: "R$ 31.200" }, { nome: "Global Foods", local: "Curitiba - PR", valor: "R$ 22.500" }] },
]

export default function PainelEmpresa() {
  const [tema, setTema] = useState<Tema>("dark")
  const [periodo, setPeriodo] = useState("12/05/2026 - 18/05/2026")
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

  return (
    <main className={`min-h-screen ${ui.pagina}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,196,0,0.14),transparent_34%)]" />
        <div className="absolute -left-44 top-44 h-[480px] w-[480px] rounded-full bg-[#ffc400]/10 blur-[150px]" />
        <div className="absolute bottom-[-150px] right-[-70px] h-[460px] w-[460px] rounded-full bg-[#ffc400]/8 blur-[160px]" />
      </div>

      <section className="relative hidden min-h-screen grid-cols-[286px_1fr] xl:grid">
        <MenuLateral ui={ui} tema={tema} setTema={setTema} />
        <section className="min-w-0 px-7 py-6">
          <Topo periodo={periodo} setPeriodo={setPeriodo} ui={ui} />
          <div className="mt-6 grid grid-cols-5 gap-4">
            <Indicador ui={ui} titulo="Total de Entregas" valor="128" detalhe="↑ 18% vs período anterior" icon={<Package />} />
            <Indicador ui={ui} titulo="Concluídas" valor="96" detalhe="75% do total" icon={<CheckCircle2 />} verde />
            <Indicador ui={ui} titulo="Em Andamento" valor="18" detalhe="14% do total" icon={<Truck />} azul />
            <Indicador ui={ui} titulo="Canceladas" valor="14" detalhe="11% do total" icon={<XCircle />} vermelho />
            <Indicador ui={ui} titulo="Receita Líquida" valor="R$ 16.220,00" detalhe="Após repasse motorista" icon={<DollarSign />} />
          </div>

          <div className="mt-5 grid grid-cols-[0.86fr_1.34fr_0.58fr] gap-5">
            <Card ui={ui} titulo="Entregas por Período" acao="7 dias"><GraficoLinha /></Card>
            <Card ui={ui} titulo="CRM - Pipeline de Negócios"><CRM ui={ui} /></Card>
            <Card ui={ui} titulo="Exportar Relatórios"><Exportar ui={ui} /></Card>
          </div>

          <div className="mt-5 grid grid-cols-[1.25fr_0.75fr] gap-5">
            <Card ui={ui} titulo="Resumo Financeiro" acao="Este mês"><Financeiro ui={ui} /></Card>
            <Card ui={ui} titulo="Entregas por Destino" acao="Mapa São Paulo"><MapaSaoPaulo ui={ui} /></Card>
          </div>

          <div className="mt-5"><Card ui={ui} titulo="Entregas Recentes" acao="Ver todas"><Tabela ui={ui} /></Card></div>
        </section>
      </section>

      <section className="relative min-h-screen px-4 pb-28 pt-5 xl:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button className={`${claro ? "text-black/80" : "text-white/80"}`}><Menu size={28} /></button>
            <LogoMarca compacto />
            <button className={`relative ${claro ? "text-black/80" : "text-white/80"}`}><Bell size={24} /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffc400]" /></button>
          </header>

          <div className="mt-7">
            <h1 className="text-[25px] font-black leading-tight">Olá, Transportes Silva LTDA 👋</h1>
            <p className={`mt-2 text-sm ${ui.textoFraco}`}>Acompanhe sua operação em tempo real.</p>
            <p className={`mt-1 text-xs ${ui.textoFraco}`}>Última atualização: 18/05/2026 16:42</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
            <div className={`flex h-12 items-center gap-2 rounded-xl border px-3 text-sm ${ui.card2}`}><CalendarDays size={18} /><input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /></div>
            <button className="flex h-12 items-center gap-1 rounded-xl bg-[#ffc400] px-4 font-black text-black"><Plus size={18} />Nova</button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Indicador ui={ui} titulo="Total de Entregas" valor="128" detalhe="↑ 18%" icon={<Package />} mobile />
            <Indicador ui={ui} titulo="Concluídas" valor="96" detalhe="75% do total" icon={<CheckCircle2 />} verde mobile />
            <Indicador ui={ui} titulo="Em Andamento" valor="18" detalhe="14% do total" icon={<Truck />} azul mobile />
            <Indicador ui={ui} titulo="Canceladas" valor="14" detalhe="11% do total" icon={<XCircle />} vermelho mobile />
          </div>

          <div className="mt-4"><Card ui={ui} titulo="Entregas por Período" acao="7 dias"><GraficoLinha mobile /></Card></div>
          <div className="mt-4"><Card ui={ui} titulo="CRM - Pipeline" acao="Ver tudo"><CRM ui={ui} mobile /></Card></div>
          <div className="mt-4"><Card ui={ui} titulo="Entregas por Destino"><MapaSaoPaulo ui={ui} mobile /></Card></div>
          <div className="mt-4"><Card ui={ui} titulo="Resumo Financeiro" acao="Este mês"><Financeiro ui={ui} mobile /></Card></div>
          <div className="mt-4"><Card ui={ui} titulo="Entregas Recentes"><ListaMobile ui={ui} /></Card></div>
        </div>

        <nav className={`fixed bottom-0 left-0 right-0 border-t px-5 py-3 backdrop-blur-2xl ${ui.card2}`}>
          <div className="mx-auto flex max-w-[430px] items-center justify-between">
            <NavMobile icon={<Home />} texto="Dashboard" href="/empresa" ativo claro={claro} />
            <NavMobile icon={<Truck />} texto="Entregas" href="/empresa/entregas" claro={claro} />
            <Link href="/empresa/entregas" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffc400] text-black shadow-[0_0_45px_rgba(255,196,0,0.45)]"><Plus size={34} strokeWidth={2.8} /></Link>
            <NavMobile icon={<UserRound />} texto="Motoristas" href="/empresa/motoristas" claro={claro} />
            <NavMobile icon={<MoreHorizontal />} texto="Mais" href="/empresa/configuracoes" claro={claro} />
          </div>
        </nav>
      </section>
    </main>
  )
}

function LogoMarca({ compacto = false }: { compacto?: boolean }) {
  return <div className="flex items-center gap-3"><img src={imagens.logoEmpresa} alt="FlatAuto" className={`${compacto ? "h-11 w-11" : "h-14 w-14"} object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.25)]`} /><div><p className={`${compacto ? "text-[18px]" : "text-[21px]"} font-black leading-none tracking-wide`}>FLAT<span className="text-[#ffc400]">AUTO</span></p><p className={`${compacto ? "text-[9px]" : "text-xs"} mt-1 font-bold tracking-[0.18em] text-[#ffc400]`}>EMPRESA</p></div></div>
}

function Topo({ periodo, setPeriodo, ui }: any) {
  return <header className="flex items-start justify-between gap-6"><div><h1 className="text-[36px] font-black leading-tight tracking-[-0.035em]">Olá, Transportes Silva LTDA 👋</h1><p className={`mt-2 text-[16px] ${ui.textoFraco}`}>Acompanhe o desempenho da sua operação em tempo real.</p><p className={`mt-1 text-[13px] ${ui.textoFraco}`}>Última atualização: 18/05/2026 16:42</p></div><div className="flex items-center gap-4"><div className={`flex h-12 w-[255px] items-center gap-3 rounded-xl border px-4 text-sm ${ui.card2}`}><CalendarDays size={18} /><input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /></div><button className="flex h-12 items-center gap-2 rounded-xl bg-[#ffc400] px-7 font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.38)]"><Plus size={18} />Nova Entrega</button><button className={`relative flex h-12 w-12 items-center justify-center rounded-xl border ${ui.card2}`}><Bell size={21} /><span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#ffc400]" /></button></div></header>
}

function MenuLateral({ ui, tema, setTema }: any) {
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
          <div className="text-[#ffc400]"><Package size={35} /></div>
          <div>
            <p className="text-sm font-bold leading-tight">Transportes Silva LTDA</p>
            <p className={`mt-1 text-xs ${ui.textoFraco}`}>Plano Empresarial</p>
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
  return <section className={`relative overflow-hidden rounded-[26px] border p-5 backdrop-blur-xl ${ui.card}`}><div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffc400]/10 blur-[38px]" /><div className="relative mb-5 flex items-center justify-between"><h2 className="font-black">{titulo}</h2>{acao && <button className={`rounded-lg border px-3 py-2 text-sm text-[#ffc400] ${ui.card2}`}>{acao}</button>}</div><div className="relative">{children}</div></section>
}

function Indicador({ titulo, valor, detalhe, icon, ui, azul, vermelho, verde, mobile }: any) {
  const corTexto = vermelho ? "text-red-400" : azul ? "text-sky-400" : "text-green-400"
  const corIcone = vermelho ? "text-red-500" : azul ? "text-sky-400" : verde ? "text-lime-400" : "text-[#ffc400]"
  return <div className={`relative overflow-hidden rounded-[24px] border ${ui.card} ${mobile ? "p-4" : "p-5"}`}><div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#ffc400]/10 blur-[28px]" /><div className="relative flex justify-between gap-3"><div><p className={`${mobile ? "text-xs" : "text-sm"} ${ui.textoFraco}`}>{titulo}</p><p className={`${mobile ? "mt-3 text-[32px]" : "mt-4 text-[34px]"} font-black leading-none`}>{valor}</p></div><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] ${corIcone}`}>{icon}</div></div><p className={`relative mt-4 text-sm ${corTexto}`}>{detalhe}</p></div>
}

function GraficoLinha({ mobile = false }: { mobile?: boolean }) {
  return <div className={`${mobile ? "h-[190px]" : "h-[260px]"} relative`}><div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_52px]" /><svg viewBox="0 0 700 260" className="relative h-full w-full overflow-visible"><defs><linearGradient id="graficoAreaEmpresa" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ffc400" stopOpacity="0.55" /><stop offset="100%" stopColor="#ffc400" stopOpacity="0.03" /></linearGradient></defs><path d="M30 215 L130 160 L230 190 L330 128 L430 62 L530 118 L630 52 L630 230 L30 230 Z" fill="url(#graficoAreaEmpresa)" /><polyline points="30,215 130,160 230,190 330,128 430,62 530,118 630,52" fill="none" stroke="#ffc400" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />{[30, 130, 230, 330, 430, 530, 630].map((x, i) => <circle key={x} cx={x} cy={[215, 160, 190, 128, 62, 118, 52][i]} r="8" fill="#ffc400" />)}</svg><div className="-mt-4 grid grid-cols-7 text-center text-xs opacity-55">{["12/05", "13/05", "14/05", "15/05", "16/05", "17/05", "18/05"].map((d) => <span key={d}>{d}</span>)}</div></div>
}

function CRM({ ui, mobile }: any) {
  return <div className={`grid ${mobile ? "grid-cols-3 overflow-x-auto" : "grid-cols-4"} gap-3`}>{crmColunas.map((coluna) => <div key={coluna.nome} className={`min-w-[132px] rounded-xl border p-3 ${coluna.cor}`}><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black">{coluna.nome}</h3><span className="rounded-full bg-[#ffc400]/20 px-2 text-xs text-[#ffc400]">{coluna.total}</span></div><div className="space-y-2">{coluna.itens.slice(0, mobile ? 1 : 2).map((item) => <div key={item.nome} className={`rounded-lg border p-3 ${ui.card2}`}><p className="text-xs font-bold">{item.nome}</p><p className={`mt-1 text-[11px] ${ui.textoFraco}`}>{item.local}</p><p className="mt-2 text-xs font-bold">{item.valor}</p></div>)}</div></div>)}</div>
}

function Exportar({ ui }: any) {
  return <div><p className={`text-sm ${ui.textoFraco}`}>Gere relatórios personalizados por cliente ou geral da operação.</p><select className={`mt-4 h-11 w-full rounded-xl border px-3 text-sm outline-none ${ui.card2}`}><option>Relatório Geral</option><option>Por Cliente</option><option>Financeiro</option></select><div className="mt-5 grid grid-cols-2 gap-3"><button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"><Download size={18} />PDF</button><button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-black text-white"><FileText size={18} />Excel</button></div></div>
}

function MapaSaoPaulo({ ui, mobile }: any) {
  return <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-[1fr_0.9fr]"} gap-4`}><div className={`relative h-[260px] overflow-hidden rounded-2xl border ${ui.card2}`}><img src={imagens.mapaSaoPaulo} alt="Mapa de São Paulo" className="absolute inset-0 h-full w-full object-contain p-4 opacity-95" onError={(e) => { e.currentTarget.style.display = "none" }} /><div className="absolute left-4 top-4 rounded-xl bg-black/45 px-3 py-2 text-xs text-white">Mapa de São Paulo</div></div><div className="space-y-2"><p className={`text-sm font-bold ${ui.textoFraco}`}>Top Destinos SP</p>{destinos.map((destino) => <div key={destino.cidade} className="flex items-center justify-between text-sm"><span>{destino.cidade}</span><strong>{destino.total}</strong></div>)}<button className="pt-1 text-sm font-bold text-[#ffc400]">Ver mapa completo</button></div></div>
}

function Financeiro({ ui, mobile }: any) {
  const faturamentoBruto = 24560
  const repasseMotorista = 8340
  const faturamentoLiquido = faturamentoBruto - repasseMotorista
  const despesas = 5420
  const lucroLiquido = faturamentoLiquido - despesas

  const percentualDespesas = ((despesas / faturamentoBruto) * 100).toFixed(2).replace(".", ",")
  const percentualLucro = ((lucroLiquido / faturamentoBruto) * 100).toFixed(2).replace(".", ",")

  const itens = [
    ["Faturamento Bruto", "R$ 24.560,00", "+ entrada total do período", "text-green-400"],
    ["Repasse Motorista", "R$ 8.340,00", "- valor repassado aos motoristas", "text-red-400"],
    ["Faturamento Líquido", "R$ 16.220,00", "= bruto menos repasse", "text-green-400"],
    ["Despesas", "R$ 5.420,00", `${percentualDespesas}% do faturamento bruto`, "text-red-400"],
    ["Lucro Líquido", "R$ 10.800,00", `${percentualLucro}% do faturamento bruto`, "text-green-400"],
  ]

  return <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-5"} gap-3`}>{itens.map(([titulo, valor, detalhe, cor]) => <div key={titulo} className={`rounded-xl border p-4 ${ui.card2}`}><p className={`text-xs ${ui.textoFraco}`}>{titulo}</p><p className="mt-3 text-[22px] font-black">{valor}</p><p className={`mt-2 text-xs ${cor}`}>{detalhe}</p></div>)}</div>
}

function Tabela({ ui }: any) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className={`border-b ${ui.linha} ${ui.textoFraco}`}><th className="pb-4">ID</th><th className="pb-4">Data</th><th className="pb-4">Cliente</th><th className="pb-4">Origem</th><th className="pb-4">Destino</th><th className="pb-4">Motorista</th><th className="pb-4">Valor</th><th className="pb-4">Status</th></tr></thead><tbody>{entregas.map((entrega) => <tr key={entrega.id} className={`border-b ${ui.linha}`}><td className="py-4">{entrega.id}</td><td>{entrega.data}</td><td>{entrega.cliente}</td><td>{entrega.origem}</td><td>{entrega.destino}</td><td>{entrega.motorista}</td><td>{entrega.valor}</td><td><Status status={entrega.status} /></td></tr>)}</tbody></table></div>
}

function ListaMobile({ ui }: any) {
  return <div className="space-y-3">{entregas.map((entrega) => <div key={entrega.id} className={`rounded-xl border p-4 ${ui.card2}`}><div className="flex items-start justify-between gap-3"><div><p className={`text-sm ${ui.textoFraco}`}>{entrega.id} • {entrega.data}</p><p className="mt-1 font-bold">{entrega.cliente}</p><p className={`mt-1 text-sm ${ui.textoFraco}`}>{entrega.origem} → {entrega.destino}</p><p className="mt-2 text-sm font-bold">{entrega.valor}</p></div><Status status={entrega.status} /></div></div>)}</div>
}

function Status({ status }: { status: StatusEntrega }) {
  const classe = status === "Concluída" ? "bg-green-600" : status === "Em Andamento" ? "bg-blue-600" : "bg-red-600"
  return <span className={`rounded-md px-3 py-1 text-xs font-bold text-white ${classe}`}>{status}</span>
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