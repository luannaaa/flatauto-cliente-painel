"use client"

import { useState } from "react"

type StatusEntrega = "Concluída" | "Em Andamento" | "Cancelada"

const img = {
  logoEmpresa: "/empresa_logo.png",
  logoFallback: "/empresa_loga.png",
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
  config: "/configuracao.png",
  sino: "/notificacao.png",
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
  { id: "#1283", data: "16/05/2026", cliente: "Lojas Silva", origem: "Ribeirão Preto - SP", destino: "Santos - SP", motorista: "Lucas Martins", valor: "R$ 1.450,00", status: "Concluída" as StatusEntrega },
]

const destinos = [
  { cidade: "São Paulo - SP", total: 42, x: "63%", y: "68%" },
  { cidade: "Campinas - SP", total: 18, x: "60%", y: "65%" },
  { cidade: "Ribeirão Preto - SP", total: 12, x: "59%", y: "60%" },
  { cidade: "Sorocaba - SP", total: 10, x: "60.5%", y: "69%" },
  { cidade: "Santos - SP", total: 8, x: "65%", y: "72%" },
]

const pipeline = [
  { title: "Novos Leads", count: 8, cards: ["Empresa ABC", "Indústria Lima"] },
  { title: "Contato Inicial", count: 5, cards: ["Comércio Forte", "Log Express"] },
  { title: "Em andamento", count: 7, cards: ["Distribuidora X", "Transportes Betta"] },
  { title: "Negócio Fechado", count: 12, cards: ["Mercado Central", "Global Foods"] },
]

export default function PainelEmpresa() {
  const [temaClaro, setTemaClaro] = useState(false)
  const [crmConectado, setCrmConectado] = useState(false)
  const [periodo, setPeriodo] = useState("12/05/2026 - 18/05/2026")

  const page = temaClaro ? "bg-[#f6f0df] text-[#15120c]" : "bg-[#030609] text-white"
  const card = temaClaro
    ? "border-[#d7c58f] bg-white/90 shadow-[0_18px_45px_rgba(90,70,20,.10)]"
    : "border-white/10 bg-[#10171b]/88 shadow-[0_18px_45px_rgba(0,0,0,.28)]"
  const soft = temaClaro ? "bg-[#f0e6cc] border-[#d7c58f]" : "bg-white/[0.045] border-white/10"
  const muted = temaClaro ? "text-black/55" : "text-white/60"

  return (
    <main className={`min-h-screen ${page}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,196,0,.14),transparent_32%)]" />
        <div className="absolute -left-40 top-40 h-[480px] w-[480px] rounded-full bg-[#ffc400]/10 blur-[150px]" />
        <div className="absolute -bottom-36 right-0 h-[460px] w-[460px] rounded-full bg-[#ffc400]/10 blur-[160px]" />
      </div>

      <section className="relative hidden min-h-screen grid-cols-[282px_1fr] xl:grid">
        <Sidebar card={card} soft={soft} muted={muted} temaClaro={temaClaro} setTemaClaro={setTemaClaro} />

        <section className="px-7 py-6">
          <Header periodo={periodo} setPeriodo={setPeriodo} soft={soft} muted={muted} />

          <div className="mt-6 grid grid-cols-5 gap-4">
            <Kpi card={card} muted={muted} title="Total de Entregas" value="128" info="↑ 18% vs período anterior" icon={img.dashboard} />
            <Kpi card={card} muted={muted} title="Concluídas" value="96" info="75% do total" icon={img.concluido} />
            <Kpi card={card} muted={muted} title="Em Andamento" value="18" info="14% do total" icon={img.andamento} blue />
            <Kpi card={card} muted={muted} title="Canceladas" value="14" info="11% do total" icon={img.cancelado} red />
            <Kpi card={card} muted={muted} title="Receita Líquida" value="R$ 16.220,00" info="↑ 26% vs período anterior" icon={img.dinheiro} />
          </div>

          <div className="mt-5 grid grid-cols-[.85fr_1.35fr_.55fr] gap-5">
            <Box card={card} soft={soft} title="Entregas por Período" action="7 dias">
              <LineChart />
            </Box>

            <Box card={card} soft={soft} title="CRM - Pipeline de Negócios">
              {crmConectado ? (
                <CRMKanban soft={soft} muted={muted} />
              ) : (
                <ConnectCRM soft={soft} muted={muted} onClick={() => setCrmConectado(true)} />
              )}
            </Box>

            <Box card={card} soft={soft} title="Exportar Relatórios">
              <ExportBox soft={soft} muted={muted} />
            </Box>
          </div>

          <div className="mt-5 grid grid-cols-[1.25fr_.75fr] gap-5">
            <Box card={card} soft={soft} title="Resumo Financeiro" action="Este mês">
              <FinanceCards soft={soft} muted={muted} />
            </Box>

            <Box card={card} soft={soft} title="Entregas por Destino" action="Mapa Brasil">
              <BrazilMap soft={soft} muted={muted} />
            </Box>
          </div>

          <div className="mt-5">
            <Box card={card} soft={soft} title="Entregas Recentes" action="Ver todas">
              <DeliveriesTable muted={muted} />
            </Box>
          </div>
        </section>
      </section>

      <section className="relative min-h-screen px-4 pb-28 pt-5 xl:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button className="text-3xl">☰</button>
            <Logo className="h-16 w-56 object-contain" />
            <img src={img.sino} className="h-8 w-8 object-contain" alt="" />
          </header>

          <div className="mt-7">
            <h1 className="text-[25px] font-black leading-tight">Olá, Transportes Silva LTDA 👋</h1>
            <p className={`mt-2 text-sm ${muted}`}>Acompanhe sua operação em tempo real.</p>
            <p className={`mt-1 text-xs ${muted}`}>Última atualização: 18/05/2026 16:42</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
            <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={`h-12 rounded-xl border px-3 text-sm outline-none ${soft}`} />
            <button className="h-12 rounded-xl bg-[#ffc400] px-4 font-black text-black">+ Nova</button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Kpi card={card} muted={muted} title="Total de Entregas" value="128" info="↑ 18%" icon={img.dashboard} mobile />
            <Kpi card={card} muted={muted} title="Concluídas" value="96" info="75% do total" icon={img.concluido} mobile />
            <Kpi card={card} muted={muted} title="Em Andamento" value="18" info="14% do total" icon={img.andamento} blue mobile />
            <Kpi card={card} muted={muted} title="Canceladas" value="14" info="11% do total" icon={img.cancelado} red mobile />
          </div>

          <div className="mt-4"><Box card={card} soft={soft} title="Entregas por Período" action="7 dias"><LineChart mobile /></Box></div>
          <div className="mt-4"><Box card={card} soft={soft} title="CRM - Pipeline" action={crmConectado ? "Ver tudo" : "Conectar"}>{crmConectado ? <CRMKanban soft={soft} muted={muted} mobile /> : <ConnectCRM soft={soft} muted={muted} onClick={() => setCrmConectado(true)} mobile />}</Box></div>
          <div className="mt-4"><Box card={card} soft={soft} title="Entregas por Destino"><BrazilMap soft={soft} muted={muted} mobile /></Box></div>
          <div className="mt-4"><Box card={card} soft={soft} title="Resumo Financeiro" action="Este mês"><FinanceCards soft={soft} muted={muted} mobile /></Box></div>
          <div className="mt-4"><Box card={card} soft={soft} title="Entregas Recentes"><MobileList muted={muted} soft={soft} /></Box></div>
        </div>

        <nav className={`fixed bottom-0 left-0 right-0 border-t px-5 py-3 backdrop-blur-2xl ${soft}`}>
          <div className="mx-auto flex max-w-[430px] items-center justify-between">
            <MobileNav icon={img.dashboard} text="Dashboard" active />
            <MobileNav icon={img.entregas} text="Entregas" />
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffc400] text-4xl font-black text-black shadow-[0_0_45px_rgba(255,196,0,.45)]">+</button>
            <MobileNav icon={img.motorista} text="Motoristas" />
            <MobileNav icon={img.config} text="Mais" />
          </div>
        </nav>
      </section>
    </main>
  )
}

function Logo({ className }: { className: string }) {
  return <img src={img.logoEmpresa} onError={(e) => { e.currentTarget.src = img.logoFallback }} alt="FlatAuto Empresa" className={className} />
}

function Header({ periodo, setPeriodo, soft, muted }: { periodo: string; setPeriodo: (v: string) => void; soft: string; muted: string }) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[36px] font-black leading-tight tracking-[-0.035em]">Olá, Transportes Silva LTDA 👋</h1>
        <p className={`mt-2 text-[16px] ${muted}`}>Acompanhe o desempenho da sua operação em tempo real.</p>
        <p className={`mt-1 text-[13px] ${muted}`}>Última atualização: 18/05/2026 16:42</p>
      </div>
      <div className="flex items-center gap-4">
        <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={`h-12 w-[245px] rounded-xl border px-5 text-sm outline-none ${soft}`} />
        <button className="h-12 rounded-xl bg-[#ffc400] px-7 font-black text-black shadow-[0_0_28px_rgba(255,196,0,.38)]">+ Nova Entrega</button>
        <button className={`flex h-12 w-12 items-center justify-center rounded-xl border ${soft}`}><img src={img.sino} className="h-7 w-7 object-contain" alt="" /></button>
      </div>
    </header>
  )
}

function Sidebar({ card, soft, muted, temaClaro, setTemaClaro }: { card: string; soft: string; muted: string; temaClaro: boolean; setTemaClaro: (v: boolean) => void }) {
  const menu = [
    [img.dashboard, "Dashboard", true], [img.entregas, "Entregas"], [img.motorista, "Motoristas"], [img.veiculos, "Veículos"], [img.clientes, "Clientes"], [img.crm, "CRM"], [img.financeiro, "Financeiro"], [img.relatorios, "Relatórios"], [img.mapa, "Mapa"], [img.analytics, "Analytics"], [img.config, "Configurações"],
  ] as const

  return (
    <aside className={`border-r border-white/10 px-5 py-7 ${temaClaro ? "bg-white/80" : "bg-[#040506]/92"}`}>
      <Logo className="h-24 w-[240px] object-contain object-left drop-shadow-[0_0_22px_rgba(255,196,0,.25)]" />

      <nav className="mt-6 space-y-2">
        {menu.map(([icon, label, active]) => (
          <button key={label} className={`flex min-h-[52px] w-full items-center gap-4 rounded-2xl px-4 text-left font-bold transition ${active ? "bg-[#ffc400] text-black shadow-[0_0_30px_rgba(255,196,0,.25)]" : "opacity-75 hover:bg-white/[.06] hover:opacity-100"}`}>
            <img src={icon} className="h-7 w-7 shrink-0 object-contain" alt="" />
            <span className="flex-1">{label}</span>
            {label === "Analytics" && <span className="rounded-md border border-[#ffc400]/70 px-2 py-0.5 text-[10px] text-[#ffc400]">IA</span>}
          </button>
        ))}
      </nav>

      <div className={`mt-8 rounded-2xl border p-4 ${card}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc400]/70 bg-[#ffc400]/10">
            <img src={img.entregas} className="h-9 w-9 object-contain" alt="" />
          </div>
          <div><p className="text-sm font-bold leading-tight">Transportes Silva LTDA</p><p className={`mt-1 text-xs ${muted}`}>Plano Empresarial</p></div>
        </div>
      </div>

      <button className={`mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border font-bold ${soft}`}><img src={img.sair} className="h-6 w-6 object-contain" alt="" />Sair</button>
      <div className={`mt-8 flex items-center justify-between rounded-full border p-2 ${soft}`}>
        <span className="px-4 text-xs font-bold">TEMA</span>
        <button onClick={() => setTemaClaro(false)} className={`h-9 w-9 rounded-full ${!temaClaro ? "bg-[#ffc400] text-black" : ""}`}>☀</button>
        <button onClick={() => setTemaClaro(true)} className={`h-9 w-9 rounded-full ${temaClaro ? "bg-[#ffc400] text-black" : ""}`}>◐</button>
      </div>
    </aside>
  )
}

function Box({ title, action, children, card, soft }: { title: string; action?: string; children: React.ReactNode; card: string; soft: string }) {
  return (
    <section className={`relative overflow-hidden rounded-[26px] border p-5 backdrop-blur-xl ${card}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffc400]/10 blur-[38px]" />
      <div className="relative mb-5 flex items-center justify-between">
        <h2 className="font-black">{title}</h2>
        {action && <button className={`rounded-lg border px-3 py-2 text-sm text-[#ffc400] ${soft}`}>{action}</button>}
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}

function Kpi({ title, value, info, icon, card, muted, blue, red, mobile }: { title: string; value: string; info: string; icon: string; card: string; muted: string; blue?: boolean; red?: boolean; mobile?: boolean }) {
  const color = red ? "text-red-400" : blue ? "text-sky-400" : "text-green-400"
  return (
    <div className={`relative overflow-hidden rounded-[24px] border ${card} ${mobile ? "p-4" : "p-5"}`}>
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#ffc400]/10 blur-[28px]" />
      <div className="relative flex justify-between gap-3">
        <div><p className={`${mobile ? "text-xs" : "text-sm"} ${muted}`}>{title}</p><p className={`${mobile ? "mt-3 text-[32px]" : "mt-4 text-[34px]"} font-black leading-none`}>{value}</p></div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffc400]/20 bg-[#ffc400]/12"><img src={icon} className="h-9 w-9 object-contain" alt="" /></div>
      </div>
      <p className={`relative mt-4 text-sm ${color}`}>{info}</p>
    </div>
  )
}

function LineChart({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`${mobile ? "h-[190px]" : "h-[260px]"} relative`}>
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:100%_52px]" />
      <svg viewBox="0 0 700 260" className="relative h-full w-full overflow-visible">
        <defs><linearGradient id="areaEmpresa" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ffc400" stopOpacity=".55" /><stop offset="100%" stopColor="#ffc400" stopOpacity=".03" /></linearGradient></defs>
        <path d="M30 215 L130 160 L230 190 L330 128 L430 62 L530 118 L630 52 L630 230 L30 230 Z" fill="url(#areaEmpresa)" />
        <polyline points="30,215 130,160 230,190 330,128 430,62 530,118 630,52" fill="none" stroke="#ffc400" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {[30, 130, 230, 330, 430, 530, 630].map((x, i) => <circle key={x} cx={x} cy={[215, 160, 190, 128, 62, 118, 52][i]} r="8" fill="#ffc400" />)}
      </svg>
      <div className="-mt-4 grid grid-cols-7 text-center text-xs opacity-55">{["12/05", "13/05", "14/05", "15/05", "16/05", "17/05", "18/05"].map(d => <span key={d}>{d}</span>)}</div>
    </div>
  )
}

function ConnectCRM({ soft, muted, onClick, mobile }: { soft: string; muted: string; onClick: () => void; mobile?: boolean }) {
  return (
    <div className={`flex ${mobile ? "flex-col" : "items-center"} gap-4 rounded-2xl border p-5 ${soft}`}>
      <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-[#ffc400]/35 bg-[#ffc400]/10"><img src={img.crm} className="h-12 w-12 object-contain" alt="" /></div>
      <div className="flex-1"><h3 className="text-lg font-black">Conecte seu CRM</h3><p className={`mt-2 text-sm ${muted}`}>Integre seu CRM para visualizar leads, negociações e oportunidades direto no painel.</p></div>
      <button onClick={onClick} className="h-12 rounded-xl bg-[#ffc400] px-5 font-black text-black">Conectar CRM</button>
    </div>
  )
}

function CRMKanban({ soft, muted, mobile }: { soft: string; muted: string; mobile?: boolean }) {
  return (
    <div className={`grid ${mobile ? "grid-cols-3 overflow-x-auto" : "grid-cols-4"} gap-3`}>
      {pipeline.map(col => (
        <div key={col.title} className="min-w-[130px] rounded-xl border border-white/10 bg-black/15 p-3">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black">{col.title}</h3><span className="rounded-full bg-[#ffc400]/20 px-2 text-xs text-[#ffc400]">{col.count}</span></div>
          <div className="space-y-2">{col.cards.slice(0, mobile ? 1 : 2).map(c => <div key={c} className={`rounded-lg border p-3 ${soft}`}><p className="text-xs font-bold">{c}</p><p className={`mt-1 text-[11px] ${muted}`}>São Paulo - SP</p><p className="mt-2 text-xs font-bold">R$ 12.500</p></div>)}</div>
        </div>
      ))}
    </div>
  )
}

function ExportBox({ soft, muted }: { soft: string; muted: string }) {
  return (
    <div>
      <p className={`text-sm ${muted}`}>Gere relatórios personalizados por cliente ou geral da operação.</p>
      <select className={`mt-4 h-11 w-full rounded-xl border px-3 text-sm outline-none ${soft}`}><option>Relatório Geral</option><option>Por Cliente</option><option>Financeiro</option></select>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"><img src={img.pdf} className="h-7 w-7" alt="" />PDF</button>
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-black text-white"><img src={img.excel} className="h-7 w-7" alt="" />Excel</button>
      </div>
    </div>
  )
}

function BrazilMap({ soft, muted, mobile }: { soft: string; muted: string; mobile?: boolean }) {
  return (
    <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-[1fr_.9fr]"} gap-4`}>
      <div className={`relative h-[255px] overflow-hidden rounded-2xl border ${soft}`}>
        <svg viewBox="0 0 430 360" className="absolute inset-0 h-full w-full">
          <path d="M197 18 L233 31 L255 66 L297 76 L328 113 L319 151 L352 178 L339 215 L356 242 L330 266 L323 309 L277 311 L247 340 L208 326 L170 342 L143 309 L99 302 L95 260 L64 235 L78 197 L55 162 L88 134 L92 91 L136 79 L162 48 Z" fill="rgba(255,196,0,.09)" stroke="rgba(255,196,0,.76)" strokeWidth="2.5" />
          <path d="M145 84 L198 118 L247 108 L287 151 L273 207 L304 245 L258 282 L200 272 L162 306 L122 278 L130 223 L94 179 L132 147 Z" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.16)" />
          <path d="M202 116 L219 171 L271 208 L229 249 L173 228 L156 171 Z" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.14)" />
          <path d="M162 48 L198 118 M233 31 L247 108 M328 113 L287 151 M339 215 L304 245 M247 340 L229 249 M143 309 L162 306 M64 235 L122 278" stroke="rgba(255,255,255,.08)" />
        </svg>
        {destinos.map(d => <span key={d.cidade} className="absolute h-3.5 w-3.5 rounded-full bg-[#ffc400] shadow-[0_0_22px_#ffc400]" style={{ left: d.x, top: d.y }} title={d.cidade} />)}
        <div className="absolute left-4 top-4 rounded-xl bg-black/35 px-3 py-2 text-xs text-white">Mapa do Brasil</div>
      </div>
      <div className="space-y-2"><p className={`text-sm font-bold ${muted}`}>Top Destinos</p>{destinos.map(d => <div key={d.cidade} className="flex items-center justify-between text-sm"><span>{d.cidade}</span><strong>{d.total}</strong></div>)}<button className="pt-1 text-sm font-bold text-[#ffc400]">Ver mapa completo</button></div>
    </div>
  )
}

function FinanceCards({ soft, muted, mobile }: { soft: string; muted: string; mobile?: boolean }) {
  const itens = [["Faturamento Bruto", "R$ 24.560,00", "↑ 22% vs mês anterior", "text-green-400"], ["Repasse Motorista", "R$ 8.340,00", "34% do bruto", "text-red-400"], ["Despesas", "R$ 5.420,00", "22% do líquido", "text-red-400"], ["Faturamento Líquido", "R$ 10.800,00", "↑ 18% vs mês anterior", "text-green-400"], ["Lucro Líquido", "R$ 4.380,00", "↑ 26% vs mês anterior", "text-green-400"]]
  return <div className={`grid ${mobile ? "grid-cols-1" : "grid-cols-5"} gap-3`}>{itens.map(([t, v, d, c]) => <div key={t} className={`rounded-xl border p-4 ${soft}`}><p className={`text-xs ${muted}`}>{t}</p><p className="mt-3 text-[22px] font-black">{v}</p><p className={`mt-2 text-xs ${c}`}>{d}</p></div>)}</div>
}

function DeliveriesTable({ muted }: { muted: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead><tr className={`border-b border-white/10 ${muted}`}><th className="pb-4">ID</th><th className="pb-4">Data</th><th className="pb-4">Cliente</th><th className="pb-4">Origem</th><th className="pb-4">Destino</th><th className="pb-4">Motorista</th><th className="pb-4">Valor</th><th className="pb-4">Status</th></tr></thead>
        <tbody>{entregas.map(e => <tr key={e.id} className="border-b border-white/10"><td className="py-4">{e.id}</td><td>{e.data}</td><td>{e.cliente}</td><td>{e.origem}</td><td>{e.destino}</td><td>{e.motorista}</td><td>{e.valor}</td><td><Status status={e.status} /></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function MobileList({ soft, muted }: { soft: string; muted: string }) {
  return <div className="space-y-3">{entregas.map(e => <div key={e.id} className={`rounded-xl border p-4 ${soft}`}><div className="flex items-start justify-between gap-3"><div><p className={`text-sm ${muted}`}>{e.id} • {e.data}</p><p className="mt-1 font-bold">{e.cliente}</p><p className={`mt-1 text-sm ${muted}`}>{e.origem} → {e.destino}</p><p className="mt-2 text-sm font-bold">{e.valor}</p></div><Status status={e.status} /></div></div>)}</div>
}

function Status({ status }: { status: StatusEntrega }) {
  const cls = status === "Concluída" ? "bg-green-600" : status === "Em Andamento" ? "bg-blue-600" : "bg-red-600"
  return <span className={`rounded-md px-3 py-1 text-xs font-bold text-white ${cls}`}>{status}</span>
}

function MobileNav({ icon, text, active }: { icon: string; text: string; active?: boolean }) {
  return <button className="flex flex-col items-center gap-1"><img src={icon} className="h-7 w-7 object-contain" alt="" /><span className={`text-[11px] ${active ? "text-[#ffc400]" : "opacity-55"}`}>{text}</span></button>
}
