"use client"

import { useMemo, useState } from "react"

type Tema = "dark" | "light"
type StatusEntrega = "Concluída" | "Em Andamento" | "Cancelada"

const imagens = {
  logoEmpresa: "/empresa_logo.png",
  logoAlternativo: "/empresa_loga.png",
  dashboard: "/des.png",
  entregas: "/tipo_carga.png",
  motorista: "/motorista_proximo.png",
  veiculos: "/modelo_caminhao.png",
  clientes: "/cliente_empresa.png",
  crm: "/CRM.png",
  financeiro: "/financeiro.png",
  relatorios: "/status_frete.png",
  mapa: "/destino_entrega.png",
  analytics: "/analyt.png",
  configuracao: "/configuracao.png",
  notificacao: "/notificacao.png",
  concluido: "/concluido.png",
  andamento: "/caminhao_azul.png",
  cancelado: "/cancelado.png",
  dinheiro: "/dinheiro.png",
  pdf: "/PDF.png",
  excel: "/excel.png",
  sair: "/saida.png",
}

const entregas = [
  { id: "#1287", data: "18/05/2026", cliente: "Auto Peças Brasil", origem: "São Paulo - SP", destino: "Campinas - SP", motorista: "Marcos Vinícius", valor: "R$ 1.250,00", status: "Concluída" as StatusEntrega },
  { id: "#1286", data: "18/05/2026", cliente: "Construtora Nova", origem: "Santos - SP", destino: "Ribeirão Preto - SP", motorista: "João Silva", valor: "R$ 2.340,00", status: "Em Andamento" as StatusEntrega },
  { id: "#1285", data: "17/05/2026", cliente: "Mercado Central", origem: "Campinas - SP", destino: "São Paulo - SP", motorista: "Carlos Alberto", valor: "R$ 980,00", status: "Concluída" as StatusEntrega },
  { id: "#1284", data: "17/05/2026", cliente: "Indústria ABC", origem: "São Paulo - SP", destino: "Sorocaba - SP", motorista: "Rafael Costa", valor: "R$ 1.870,00", status: "Cancelada" as StatusEntrega },
]

const destinos = [
  { cidade: "São Paulo - SP", total: 42, left: "62%", top: "66%" },
  { cidade: "Campinas - SP", total: 18, left: "58%", top: "64%" },
  { cidade: "Ribeirão Preto - SP", total: 12, left: "57%", top: "59%" },
  { cidade: "Sorocaba - SP", total: 10, left: "59%", top: "69%" },
  { cidade: "Santos - SP", total: 8, left: "64%", top: "71%" },
]

const pipeline = [
  { titulo: "Novos Leads", cor: "border-[#ffc400]/35 bg-[#ffc400]/8", itens: [{ nome: "Empresa ABC", local: "São Paulo - SP", valor: "R$ 12.500" }, { nome: "Indústria Lima", local: "Campinas - SP", valor: "R$ 8.750" }] },
  { titulo: "Contato Inicial", cor: "border-[#d89711]/35 bg-[#d89711]/8", itens: [{ nome: "Comércio Forte", local: "Santos - SP", valor: "R$ 23.000" }, { nome: "Log Express", local: "São Paulo - SP", valor: "R$ 15.400" }] },
  { titulo: "Em andamento", cor: "border-sky-500/35 bg-sky-500/8", itens: [{ nome: "Distribuidora X", local: "Ribeirão Preto - SP", valor: "R$ 27.800" }, { nome: "Transportes Betta", local: "Sorocaba - SP", valor: "R$ 16.600" }] },
  { titulo: "Fechado", cor: "border-green-500/35 bg-green-500/8", itens: [{ nome: "Mercado Central", local: "São Paulo - SP", valor: "R$ 31.200" }, { nome: "Global Foods", local: "Curitiba - PR", valor: "R$ 22.500" }] },
]

export default function PainelEmpresa() {
  const [tema, setTema] = useState<Tema>("dark")
  const [periodo, setPeriodo] = useState("12/05/2026 - 18/05/2026")
  const [crmConectado, setCrmConectado] = useState(false)
  const isLight = tema === "light"

  const theme = useMemo(() => ({
    page: isLight ? "bg-[#f7f2e8] text-[#15120b]" : "bg-[#030506] text-white",
    card: isLight ? "border-[#e0d3ab] bg-white/90 shadow-[0_12px_34px_rgba(80,60,20,0.10)]" : "border-white/10 bg-[#101719]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
    soft: isLight ? "bg-[#f2ead8]" : "bg-white/[0.045]",
    border: isLight ? "border-[#e0d3ab]" : "border-white/10",
    muted: isLight ? "text-black/55" : "text-white/58",
  }), [isLight])

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,196,0,0.16),transparent_32%)]" />
        <div className="absolute left-[-160px] top-[170px] h-[440px] w-[440px] rounded-full bg-[#ffc400]/10 blur-[150px]" />
        <div className="absolute bottom-[-130px] right-[-110px] h-[390px] w-[390px] rounded-full bg-[#ffc400]/9 blur-[150px]" />
      </div>

      <section className="relative hidden min-h-screen md:grid md:grid-cols-[280px_1fr]">
        <Sidebar tema={tema} setTema={setTema} theme={theme} />
        <div className="min-h-screen overflow-y-auto px-7 py-6">
          <div className="mx-auto max-w-[1360px]">
            <Header periodo={periodo} setPeriodo={setPeriodo} theme={theme} />
            <div className="mt-6 grid grid-cols-5 gap-4">
              <KpiCard theme={theme} titulo="Total de Entregas" valor="128" detalhe="↑ 18% vs período anterior" icon={imagens.dashboard} />
              <KpiCard theme={theme} titulo="Concluídas" valor="96" detalhe="75% do total" icon={imagens.concluido} />
              <KpiCard theme={theme} titulo="Em Andamento" valor="18" detalhe="14% do total" icon={imagens.andamento} azul />
              <KpiCard theme={theme} titulo="Canceladas" valor="14" detalhe="11% do total" icon={imagens.cancelado} vermelho />
              <KpiCard theme={theme} titulo="Receita Líquida" valor="R$ 16.220,00" detalhe="↑ 26% vs período anterior" icon={imagens.dinheiro} />
            </div>

            <div className="mt-5 grid grid-cols-[0.86fr_1.34fr_0.55fr] gap-5">
              <Card theme={theme} titulo="Entregas por Período" acao="7 dias"><GraficoLinha /></Card>
              <Card theme={theme} titulo="CRM - Pipeline de Negócios">
                {crmConectado ? <KanbanCRM theme={theme} /> : <ConectarCRM theme={theme} onConectar={() => setCrmConectado(true)} />}
              </Card>
              <Card theme={theme} titulo="Exportar Relatórios"><ExportarRelatorios theme={theme} /></Card>
            </div>

            <div className="mt-5 grid grid-cols-[1.25fr_0.75fr] gap-5">
              <Card theme={theme} titulo="Resumo Financeiro" acao="Este mês"><ResumoFinanceiro theme={theme} /></Card>
              <Card theme={theme} titulo="Entregas por Destino" acao="Mapa Brasil"><MapaBrasil theme={theme} /></Card>
            </div>

            <div className="mt-5">
              <Card theme={theme} titulo="Entregas Recentes" acao="Ver todas"><TabelaEntregas theme={theme} /></Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen px-4 pb-28 pt-5 md:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button className="text-3xl">☰</button>
            <img src={imagens.logoEmpresa} onError={(e) => { e.currentTarget.src = imagens.logoAlternativo }} alt="FlatAuto Empresa" className="h-16 w-56 object-contain" />
            <button className="relative">
              <img src={imagens.notificacao} alt="" className="h-8 w-8 object-contain" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffc400]" />
            </button>
          </header>

          <div className="mt-7">
            <h1 className="text-[25px] font-black leading-tight">Olá, Transportes Silva LTDA 👋</h1>
            <p className={`mt-2 text-[14px] ${theme.muted}`}>Acompanhe sua operação em tempo real.</p>
            <p className={`mt-1 text-[12px] ${theme.muted}`}>Última atualização: 18/05/2026 16:42</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
            <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={`h-12 rounded-xl border ${theme.border} ${theme.soft} px-3 text-sm outline-none`} />
            <button className="h-12 rounded-xl bg-[#ffc400] px-4 font-black text-black shadow-[0_0_25px_rgba(255,196,0,0.35)]">+ Nova</button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <KpiCard theme={theme} titulo="Total de Entregas" valor="128" detalhe="↑ 18%" icon={imagens.dashboard} mobile />
            <KpiCard theme={theme} titulo="Concluídas" valor="96" detalhe="75% do total" icon={imagens.concluido} mobile />
            <KpiCard theme={theme} titulo="Em Andamento" valor="18" detalhe="14% do total" icon={imagens.andamento} azul mobile />
            <KpiCard theme={theme} titulo="Canceladas" valor="14" detalhe="11% do total" icon={imagens.cancelado} vermelho mobile />
          </div>

          <div className="mt-4"><Card theme={theme} titulo="Entregas por Período" acao="7 dias"><GraficoLinha mobile /></Card></div>
          <div className="mt-4"><Card theme={theme} titulo="CRM - Pipeline" acao={crmConectado ? "Ver tudo" : "Conectar"}>{crmConectado ? <KanbanCRM theme={theme} mobile /> : <ConectarCRM theme={theme} onConectar={() => setCrmConectado(true)} mobile />}</Card></div>
          <div className="mt-4"><Card theme={theme} titulo="Entregas por Destino"><MapaBrasil theme={theme} mobile /></Card></div>
          <div className="mt-4"><Card theme={theme} titulo="Resumo Financeiro" acao="Este mês"><ResumoFinanceiro theme={theme} mobile /></Card></div>
          <div className="mt-4"><Card theme={theme} titulo="Entregas Recentes"><ListaMobile theme={theme} /></Card></div>
        </div>

        <nav className={`fixed bottom-0 left-0 right-0 border-t ${theme.border} ${isLight ? "bg-white/90" : "bg-[#050606]/92"} px-5 py-3 backdrop-blur-2xl`}>
          <div className="mx-auto flex max-w-[430px] items-center justify-between">
            <NavItem icon={imagens.dashboard} label="Dashboard" ativo />
            <NavItem icon={imagens.entregas} label="Entregas" />
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffc400] text-4xl font-black text-black shadow-[0_0_45px_rgba(255,196,0,0.45)]">+</button>
            <NavItem icon={imagens.motorista} label="Motoristas" />
            <NavItem icon={imagens.configuracao} label="Mais" />
          </div>
        </nav>
      </section>
    </main>
  )
}

function Header({ periodo, setPeriodo, theme }: { periodo: string; setPeriodo: (valor: string) => void; theme: any }) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[37px] font-black leading-tight tracking-[-0.035em]">Olá, Transportes Silva LTDA 👋</h1>
        <p className={`mt-2 text-[16px] ${theme.muted}`}>Acompanhe o desempenho da sua operação em tempo real.</p>
        <p className={`mt-1 text-[13px] ${theme.muted}`}>Última atualização: 18/05/2026 16:42</p>
      </div>
      <div className="flex items-center gap-4">
        <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={`h-12 w-[230px] rounded-xl border ${theme.border} ${theme.soft} px-5 text-sm outline-none`} />
        <button className="h-12 rounded-xl bg-[#ffc400] px-7 font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.38)]">+ Nova Entrega</button>
        <button className={`flex h-12 w-12 items-center justify-center rounded-xl border ${theme.border} ${theme.soft}`}><img src={imagens.notificacao} alt="" className="h-7 w-7 object-contain" /></button>
      </div>
    </header>
  )
}

function Sidebar({ tema, setTema, theme }: { tema: Tema; setTema: (tema: Tema) => void; theme: any }) {
  return (
    <aside className={`border-r ${theme.border} ${tema === "light" ? "bg-white/78" : "bg-[#040506]/90"} px-5 py-7 backdrop-blur-xl`}>
      <img src={imagens.logoEmpresa} onError={(e) => { e.currentTarget.src = imagens.logoAlternativo }} alt="FlatAuto Empresa" className="h-20 w-64 object-contain object-left" />
      <nav className="mt-9 space-y-2">
        <MenuItem icon={imagens.dashboard} label="Dashboard" ativo />
        <MenuItem icon={imagens.entregas} label="Entregas" />
        <MenuItem icon={imagens.motorista} label="Motoristas" />
        <MenuItem icon={imagens.veiculos} label="Veículos" />
        <MenuItem icon={imagens.clientes} label="Clientes" />
        <MenuItem icon={imagens.crm} label="CRM" />
        <MenuItem icon={imagens.financeiro} label="Financeiro" />
        <MenuItem icon={imagens.relatorios} label="Relatórios" />
        <MenuItem icon={imagens.mapa} label="Mapa" />
        <MenuItem icon={imagens.analytics} label="Analytics" badge="IA" />
        <MenuItem icon={imagens.configuracao} label="Configurações" />
      </nav>
      <div className={`mt-8 rounded-2xl border ${theme.border} ${theme.soft} p-4`}>
        <div className="flex items-center gap-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-full border border-[#ffc400]/70 bg-[#ffc400]/10"><img src={imagens.entregas} alt="" className="h-8 w-8 object-contain" /></div>
          <div><p className="text-sm font-bold leading-tight">Transportes Silva LTDA</p><p className={`mt-1 text-xs ${theme.muted}`}>Plano Empresarial</p></div>
        </div>
      </div>
      <button className={`mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border ${theme.border} ${theme.soft} font-bold`}><img src={imagens.sair} alt="" className="h-6 w-6 object-contain" />Sair</button>
      <div className={`mt-8 flex items-center justify-between rounded-full border ${theme.border} ${theme.soft} p-2`}>
        <span className="px-4 text-xs font-bold">TEMA</span>
        <button onClick={() => setTema("dark")} className={`h-9 w-9 rounded-full ${tema === "dark" ? "bg-[#ffc400] text-black" : ""}`}>☀</button>
        <button onClick={() => setTema("light")} className={`h-9 w-9 rounded-full ${tema === "light" ? "bg-[#ffc400] text-black" : ""}`}>◐</button>
      </div>
    </aside>
  )
}

function MenuItem({ icon, label, ativo = false, badge }: { icon: string; label: string; ativo?: boolean; badge?: string }) {
  return (
    <button className={`group flex min-h-[52px] w-full items-center gap-4 rounded-2xl px-4 text-left font-bold transition-all duration-300 ${ativo ? "bg-[#ffc400] text-black shadow-[0_0_28px_rgba(255,196,0,0.28)]" : "text-current opacity-75 hover:bg-white/[0.06] hover:opacity-100"}`}>
      <img src={icon} alt="" className="h-7 w-7 shrink-0 object-contain" />
      <span className="flex-1">{label}</span>
      {badge && <span className="rounded-md border border-[#ffc400]/60 px-2 py-0.5 text-[10px] text-[#ffc400]">{badge}</span>}
    </button>
  )
}

function Card({ titulo, acao, children, theme }: { titulo: string; acao?: string; children: React.ReactNode; theme: any }) {
  return (
    <section className={`relative overflow-hidden rounded-[24px] border ${theme.card} p-5 backdrop-blur-xl`}>
      <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-[110px] w-[110px] rounded-full bg-[#ffc400]/8 blur-[36px]" />
      <div className="relative mb-5 flex items-center justify-between">
        <h2 className="font-black">{titulo}</h2>
        {acao && <button className={`rounded-lg border ${theme.border} ${theme.soft} px-3 py-2 text-sm text-[#ffc400]`}>{acao}</button>}
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}

function KpiCard({ titulo, valor, detalhe, icon, theme, azul = false, vermelho = false, mobile = false }: { titulo: string; valor: string; detalhe: string; icon: string; theme: any; azul?: boolean; vermelho?: boolean; mobile?: boolean }) {
  const detalheClasse = vermelho ? "text-red-400" : azul ? "text-sky-400" : "text-green-400"
  return (
    <div className={`relative overflow-hidden rounded-[22px] border ${theme.card} ${mobile ? "p-4" : "p-5"}`}>
      <div className="absolute right-[-18px] top-[-22px] h-[80px] w-[80px] rounded-full bg-[#ffc400]/10 blur-[28px]" />
      <div className="relative flex items-start justify-between gap-3">
        <div><p className={`${mobile ? "text-xs" : "text-sm"} ${theme.muted}`}>{titulo}</p><p className={`${mobile ? "mt-3 text-[32px]" : "mt-4 text-[34px]"} font-black leading-none`}>{valor}</p></div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffc400]/20 bg-[#ffc400]/12"><img src={icon} alt="" className="h-9 w-9 object-contain" /></div>
      </div>
      <p className={`relative mt-4 text-sm ${detalheClasse}`}>{detalhe}</p>
    </div>
  )
}

function GraficoLinha({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`${mobile ? "h-[190px]" : "h-[260px]"} relative`}>
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_52px]" />
      <svg viewBox="0 0 700 260" className="relative h-full w-full overflow-visible">
        <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ffc400" stopOpacity="0.55" /><stop offset="100%" stopColor="#ffc400" stopOpacity="0.03" /></linearGradient></defs>
        <path d="M30 215 L130 160 L230 190 L330 128 L430 62 L530 118 L630 52 L630 230 L30 230 Z" fill="url(#area)" />
        <polyline points="30,215 130,160 230,190 330,128 430,62 530,118 630,52" fill="none" stroke="#ffc400" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {[30, 130, 230, 330, 430, 530, 630].map((x, i) => <circle key={x} cx={x} cy={[215, 160, 190, 128, 62, 118, 52][i]} r="8" fill="#ffc400" />)}
      </svg>
      <div className="mt-[-18px] grid grid-cols-7 text-center text-xs opacity-55">{["12/05", "13/05", "14/05", "15/05", "16/05", "17/05", "18/05"].map((d) => <span key={d}>{d}</span>)}</div>
    </div>
  )
}

function KanbanCRM({ theme, mobile = false }: { theme: any; mobile?: boolean }) {
  return (
    <div className={`grid ${mobile ? "grid-cols-3 overflow-x-auto" : "grid-cols-4"} gap-3`}>
      {pipeline.map((coluna) => (
        <div key={coluna.titulo} className={`min-w-[128px] rounded-xl border ${coluna.cor} p-3`}>
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black">{coluna.titulo}</h3><span className="rounded-full bg-[#ffc400]/20 px-2 text-xs text-[#ffc400]">{coluna.itens.length}</span></div>
          <div className="space-y-2">{coluna.itens.slice(0, mobile ? 1 : 2).map((item) => <div key={item.nome} className={`rounded-lg border ${theme.border} ${theme.soft} p-3`}><p className="text-xs font-bold">{item.nome}</p><p className={`mt-1 text-[11px] ${theme.muted}`}>{item.local}</p><p className="mt-2 text-xs font-bold">{item.valor}</p></div>)}</div>
          <button className={`mt-3 w-full text-xs ${theme.muted}`}>+ Ver mais</button>
        </div>
      ))}
    </div>
  )
}

function ConectarCRM({ theme, onConectar, mobile = false }: { theme: any; onConectar: () => void; mobile?: boolean }) {
  return (
    <div className={`flex ${mobile ? "flex-col" : "items-center"} gap-4 rounded-2xl border ${theme.border} ${theme.soft} p-5`}>
      <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-[#ffc400]/35 bg-[#ffc400]/10"><img src={imagens.crm} alt="" className="h-12 w-12 object-contain" /></div>
      <div className="flex-1"><h3 className="text-lg font-black">Conecte seu CRM</h3><p className={`mt-2 text-sm ${theme.muted}`}>Integre seu CRM para visualizar leads, negociações e oportunidades direto no painel.</p></div>
      <button onClick={onConectar} className="h-12 rounded-xl bg-[#ffc400] px-5 font-black text-black">Conectar CRM</button>
    </div>
  )
}

function ExportarRelatorios({ theme }: { theme: any }) {
  return (
    <div>
      <p className={`text-sm ${theme.muted}`}>Gere relatórios personalizados por cliente ou geral da operação.</p>
      <select className={`mt-4 h-11 w-full rounded-xl border ${theme.border} ${theme.soft} px-3 text-sm outline-none`}><option>Relatório Geral</option><option>Por Cliente</option><option>Financeiro</option><option>Entregas</option></select>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"><img src={imagens.pdf} alt="" className="h-7 w-7" />PDF</button>
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-black text-white"><img src={imagens.excel} alt="" className="h-7 w-7" />Excel</button>
      </div>
    </div>
  )
}

function MapaBrasil({ theme, mobile = false }: { theme: any; mobile?: boolean }) {
  return (
    <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-[1fr_0.9fr]"} gap-4`}>
      <div className={`relative h-[250px] overflow-hidden rounded-2xl border ${theme.border} ${theme.soft}`}>
        <svg viewBox="0 0 420 360" className="absolute inset-0 h-full w-full">
          <path d="M202 29l33 14 21 32 39 7 31 37-10 36 31 24-12 33 18 31-28 21-4 43-48 2-29 30-39-13-40 13-23-35-45-5-5-42-31-25 15-38-23-35 32-28 2-43 43-10 28-31z" fill="rgba(255,196,0,0.08)" stroke="rgba(255,196,0,0.72)" strokeWidth="2.3" />
          <path d="M160 93l41 24 49-5 37 42-15 55 30 36-42 36-61-8-38 31-39-28 8-56-35-43 38-30z" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.16)" />
          <path d="M210 118l12 54 51 38-43 38-56-22-16-55z" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.13)" />
        </svg>
        {destinos.map((destino) => <span key={destino.cidade} title={destino.cidade} className="absolute h-3.5 w-3.5 rounded-full bg-[#ffc400] shadow-[0_0_22px_#ffc400]" style={{ left: destino.left, top: destino.top }} />)}
        <div className="absolute left-4 top-4 rounded-xl bg-black/35 px-3 py-2 text-xs text-white">Mapa Brasil</div>
      </div>
      <div className="space-y-2"><p className={`text-sm font-bold ${theme.muted}`}>Top Destinos</p>{destinos.map((destino) => <div key={destino.cidade} className="flex items-center justify-between text-sm"><span>{destino.cidade}</span><strong>{destino.total}</strong></div>)}</div>
    </div>
  )
}

function ResumoFinanceiro({ theme, mobile = false }: { theme: any; mobile?: boolean }) {
  const itens = [
    { titulo: "Faturamento Bruto", valor: "R$ 24.560,00", detalhe: "↑ 22% vs mês anterior", cor: "text-green-400" },
    { titulo: "Repasse Motorista", valor: "R$ 8.340,00", detalhe: "34% do bruto", cor: "text-red-400" },
    { titulo: "Despesas", valor: "R$ 5.420,00", detalhe: "22% do líquido", cor: "text-red-400" },
    { titulo: "Faturamento Líquido", valor: "R$ 10.800,00", detalhe: "↑ 18% vs mês anterior", cor: "text-green-400" },
    { titulo: "Lucro Líquido", valor: "R$ 4.380,00", detalhe: "↑ 26% vs mês anterior", cor: "text-green-400" },
  ]
  return <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-5"} gap-3`}>{itens.map((item) => <div key={item.titulo} className={`rounded-xl border ${theme.border} ${theme.soft} p-4`}><p className={`text-xs ${theme.muted}`}>{item.titulo}</p><p className="mt-3 text-[22px] font-black">{item.valor}</p><p className={`mt-2 text-xs ${item.cor}`}>{item.detalhe}</p></div>)}</div>
}

function TabelaEntregas({ theme }: { theme: any }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead><tr className={`border-b ${theme.border} ${theme.muted}`}><th className="pb-4">ID</th><th className="pb-4">Data</th><th className="pb-4">Cliente</th><th className="pb-4">Origem</th><th className="pb-4">Destino</th><th className="pb-4">Motorista</th><th className="pb-4">Valor</th><th className="pb-4">Status</th></tr></thead>
        <tbody>{entregas.map((entrega) => <tr key={entrega.id} className={`border-b ${theme.border}`}><td className="py-4">{entrega.id}</td><td>{entrega.data}</td><td>{entrega.cliente}</td><td>{entrega.origem}</td><td>{entrega.destino}</td><td>{entrega.motorista}</td><td>{entrega.valor}</td><td><StatusTag status={entrega.status} /></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function ListaMobile({ theme }: { theme: any }) {
  return <div className="space-y-3">{entregas.map((entrega) => <div key={entrega.id} className={`rounded-xl border ${theme.border} ${theme.soft} p-4`}><div className="flex items-start justify-between gap-3"><div><p className={`text-sm ${theme.muted}`}>{entrega.id} • {entrega.data}</p><p className="mt-1 font-bold">{entrega.cliente}</p><p className={`mt-1 text-sm ${theme.muted}`}>{entrega.origem} → {entrega.destino}</p><p className="mt-2 text-sm font-bold">{entrega.valor}</p></div><StatusTag status={entrega.status} /></div></div>)}</div>
}

function StatusTag({ status }: { status: StatusEntrega }) {
  const classe = status === "Concluída" ? "bg-green-600 text-white" : status === "Em Andamento" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
  return <span className={`rounded-md px-3 py-1 text-xs font-bold ${classe}`}>{status}</span>
}

function NavItem({ icon, label, ativo = false }: { icon: string; label: string; ativo?: boolean }) {
  return <button className="flex flex-col items-center gap-1"><img src={icon} alt="" className="h-7 w-7 object-contain" /><span className={`text-[11px] ${ativo ? "text-[#ffc400]" : "opacity-55"}`}>{label}</span></button>
}
