"use client"

import { useState } from "react"

const imagens = {
  logo: "/logo.png",
  dashboard: "/des.png",
  entrega: "/tipo_carga.png",
  concluido: "/concluido.png",
  andamento: "/em_andamento.png",
  cancelado: "/atencao.png",
  caminhao: "/modelo_caminhao.png",
  motorista: "/motorista_proximo.png",
  empresa: "/empresa_cliente.png",
  financeiro: "/pagamento.png",
  relatorio: "/status_frete.png",
  notificacao: "/notificacao.png",
  configuracao: "/configuracao.png",
  olho: "/file.svg",
}

type StatusEntrega = "Concluída" | "Em Andamento" | "Cancelada"

const entregas = [
  {
    id: "#1287",
    cliente: "Auto Peças Brasil",
    destino: "São Paulo - SP",
    status: "Concluída" as StatusEntrega,
    data: "20/05/2024",
  },
  {
    id: "#1286",
    cliente: "Construtora Nova",
    destino: "Campinas - SP",
    status: "Em Andamento" as StatusEntrega,
    data: "20/05/2024",
  },
  {
    id: "#1285",
    cliente: "Mercado Central",
    destino: "Ribeirão Preto - SP",
    status: "Concluída" as StatusEntrega,
    data: "20/05/2024",
  },
  {
    id: "#1284",
    cliente: "Indústria ABC",
    destino: "Santos - SP",
    status: "Cancelada" as StatusEntrega,
    data: "19/05/2024",
  },
]

export default function PainelEmpresa() {
  const [empresa] = useState("Transportes Silva LTDA")

  return (
    <main className="min-h-screen bg-[#030506] text-white">
      {/* WEB */}
      <section className="hidden min-h-screen md:grid md:grid-cols-[245px_1fr]">
        <Sidebar empresa={empresa} />

        <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_75%_0%,rgba(255,196,0,0.08),transparent_34%),linear-gradient(180deg,#061014_0%,#030506_100%)] px-7 py-6">
          <div className="mx-auto max-w-[1260px]">
            <Header empresa={empresa} />

            <div className="mt-7 grid grid-cols-4 gap-4">
              <KpiCard titulo="Total de Entregas" valor="128" detalhe="↑ 18% em relação à semana anterior" icon={imagens.dashboard} />
              <KpiCard titulo="Concluídas" valor="96" detalhe="75% do total" icon={imagens.concluido} />
              <KpiCard titulo="Em Andamento" valor="18" detalhe="14% do total" icon={imagens.caminhao} azul />
              <KpiCard titulo="Canceladas" valor="14" detalhe="11% do total" icon={imagens.cancelado} vermelho />
            </div>

            <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-5">
              <Card titulo="Entregas por Período" acao="Últimos 7 dias">
                <GraficoLinha />
              </Card>

              <Card titulo="Entregas por Status">
                <GraficoRosca />
              </Card>
            </div>

            <div className="mt-5 grid grid-cols-[1.45fr_0.55fr] gap-5">
              <Card titulo="Entregas Recentes" acao="Ver todas ›">
                <TabelaEntregas />
              </Card>

              <ResumoFinanceiro />
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE */}
      <section className="min-h-screen bg-[radial-gradient(circle_at_80%_0%,rgba(255,196,0,0.10),transparent_34%),linear-gradient(180deg,#061014_0%,#030506_100%)] px-4 pb-28 pt-5 md:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button className="text-3xl text-white/80">☰</button>

            <img
              src={imagens.logo}
              alt="FlatAuto"
              className="h-11 w-40 object-contain"
            />

            <button className="relative">
              <img src={imagens.notificacao} alt="" className="h-7 w-7 object-contain opacity-90" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ffc400]" />
            </button>
          </header>

          <div className="mt-7">
            <h1 className="text-[26px] font-black leading-tight">
              Olá, {empresa} 👋
            </h1>
            <p className="mt-2 text-[15px] text-white/65">
              Acompanhe suas entregas em tempo real.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-left text-sm text-white/80">
              📅 20/05/2024 - 26/05/2024
            </button>

            <button className="h-12 rounded-xl bg-[#ffc400] px-5 font-black text-black shadow-[0_0_25px_rgba(255,196,0,0.35)]">
              + Nova
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <KpiCard titulo="Total de Entregas" valor="128" detalhe="↑ 18%" icon={imagens.dashboard} mobile />
            <KpiCard titulo="Concluídas" valor="96" detalhe="75% do total" icon={imagens.concluido} mobile />
            <KpiCard titulo="Em Andamento" valor="18" detalhe="14% do total" icon={imagens.caminhao} azul mobile />
            <KpiCard titulo="Canceladas" valor="14" detalhe="11% do total" icon={imagens.cancelado} vermelho mobile />
          </div>

          <div className="mt-4">
            <Card titulo="Entregas por Período" acao="7 dias">
              <GraficoLinha mobile />
            </Card>
          </div>

          <div className="mt-4">
            <Card titulo="Entregas por Status">
              <GraficoRosca mobile />
            </Card>
          </div>

          <div className="mt-4">
            <Card titulo="Entregas Recentes" acao="Ver todas ›">
              <ListaMobile />
            </Card>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#050606]/95 px-5 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-[430px] items-center justify-between">
            <NavItem icon={imagens.dashboard} label="Dashboard" ativo />
            <NavItem icon={imagens.entrega} label="Entregas" />
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400] text-3xl font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.45)]">
              +
            </button>
            <NavItem icon={imagens.motorista} label="Motoristas" />
            <NavItem icon={imagens.configuracao} label="Mais" />
          </div>
        </nav>
      </section>
    </main>
  )
}

function Header({ empresa }: { empresa: string }) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-[36px] font-black leading-tight tracking-[-0.03em]">
          Olá, {empresa} 👋
        </h1>
        <p className="mt-2 text-[16px] text-white/65">
          Acompanhe o desempenho das suas entregas em tempo real.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white/80">
          📅 20/05/2024 - 26/05/2024
        </button>

        <button className="h-12 rounded-xl bg-[#ffc400] px-7 font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.38)]">
          + Nova Entrega
        </button>
      </div>
    </header>
  )
}

function Sidebar({ empresa }: { empresa: string }) {
  return (
    <aside className="border-r border-white/10 bg-[#040506] px-4 py-7">
      <img
        src={imagens.logo}
        alt="FlatAuto"
        className="h-12 w-44 object-contain object-left"
      />

      <p className="mt-4 px-2 text-sm font-bold text-[#ffc400]">EMPRESA</p>

      <nav className="mt-9 space-y-2">
        <MenuItem icon={imagens.dashboard} label="Dashboard" ativo />
        <MenuItem icon={imagens.entrega} label="Entregas" />
        <MenuItem icon={imagens.motorista} label="Motoristas" />
        <MenuItem icon={imagens.caminhao} label="Veículos" />
        <MenuItem icon={imagens.empresa} label="Clientes" />
        <MenuItem icon={imagens.financeiro} label="Financeiro" />
        <MenuItem icon={imagens.relatorio} label="Relatórios" />
        <MenuItem icon={imagens.notificacao} label="Notificações" />
        <MenuItem icon={imagens.configuracao} label="Configurações" />
      </nav>

      <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffc400]/70 bg-[#ffc400]/10">
            <img src={imagens.caminhao} alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{empresa}</p>
            <p className="mt-1 text-xs text-white/50">Plano Empresarial</p>
          </div>
        </div>
      </div>

      <button className="mt-4 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] font-bold text-white/85">
        Sair
      </button>
    </aside>
  )
}

function MenuItem({
  icon,
  label,
  ativo = false,
}: {
  icon: string
  label: string
  ativo?: boolean
}) {
  return (
    <button
      className={`flex h-14 w-full items-center gap-4 rounded-xl px-4 text-left font-bold transition ${
        ativo
          ? "bg-[#ffc400] text-black shadow-[0_0_22px_rgba(255,196,0,0.22)]"
          : "text-white/70 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <img src={icon} alt="" className="h-5 w-5 object-contain" />
      {label}
    </button>
  )
}

function Card({
  titulo,
  acao,
  children,
}: {
  titulo: string
  acao?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101719]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-black text-white">{titulo}</h2>
        {acao && (
          <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[#ffc400]">
            {acao}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function KpiCard({
  titulo,
  valor,
  detalhe,
  icon,
  azul = false,
  vermelho = false,
  mobile = false,
}: {
  titulo: string
  valor: string
  detalhe: string
  icon: string
  azul?: boolean
  vermelho?: boolean
  mobile?: boolean
}) {
  const detalheClasse = vermelho
    ? "text-red-400"
    : azul
      ? "text-sky-400"
      : "text-green-400"

  return (
    <div className={`rounded-2xl border border-white/10 bg-[#101719]/75 ${mobile ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`${mobile ? "text-xs" : "text-sm"} text-white/65`}>{titulo}</p>
          <p className={`${mobile ? "mt-3 text-[34px]" : "mt-4 text-[36px]"} font-black leading-none`}>
            {valor}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffc400]/10">
          <img src={icon} alt="" className="h-7 w-7 object-contain" />
        </div>
      </div>

      <p className={`mt-4 text-sm ${detalheClasse}`}>{detalhe}</p>
    </div>
  )
}

function GraficoLinha({ mobile = false }: { mobile?: boolean }) {
  const pontos = [10, 18, 12, 24, 36, 25, 31]

  return (
    <div className={`${mobile ? "h-[190px]" : "h-[265px]"} flex items-end gap-4 border-l border-white/10 border-b border-white/10 px-3 pb-6`}>
      {pontos.map((ponto, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-[#ffc400]/20 to-[#ffc400] shadow-[0_0_20px_rgba(255,196,0,0.22)]"
            style={{ height: `${ponto * (mobile ? 3 : 4)}px` }}
          />
          <span className="text-[11px] text-white/45">{20 + index}/05</span>
        </div>
      ))}
    </div>
  )
}

function GraficoRosca({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`flex ${mobile ? "flex-col gap-5" : "items-center justify-center gap-10"} py-2`}>
      <div
        className={`${mobile ? "mx-auto h-40 w-40" : "h-52 w-52"} flex items-center justify-center rounded-full`}
        style={{
          background:
            "conic-gradient(#ffc400 0deg 270deg, #3b82f6 270deg 320deg, #ef4444 320deg 360deg)",
        }}
      >
        <div className={`${mobile ? "h-24 w-24" : "h-32 w-32"} flex items-center justify-center rounded-full bg-[#050809] text-center`}>
          <div>
            <p className="text-4xl font-black">128</p>
            <p className="text-sm text-white/60">Total</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Legenda cor="bg-[#ffc400]" label="Concluídas" valor="96 (75%)" />
        <Legenda cor="bg-blue-500" label="Em Andamento" valor="18 (14%)" />
        <Legenda cor="bg-red-500" label="Canceladas" valor="14 (11%)" />
      </div>
    </div>
  )
}

function Legenda({ cor, label, valor }: { cor: string; label: string; valor: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${cor}`} />
      <p className="min-w-[135px] text-white/80">{label}</p>
      <p className="font-bold">{valor}</p>
    </div>
  )
}

function TabelaEntregas() {
  return (
    <div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/45">
            <th className="pb-4">ID</th>
            <th className="pb-4">Cliente</th>
            <th className="pb-4">Destino</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Data</th>
            <th className="pb-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.id} className="border-b border-white/6">
              <td className="py-4">{entrega.id}</td>
              <td>{entrega.cliente}</td>
              <td>{entrega.destino}</td>
              <td><StatusTag status={entrega.status} /></td>
              <td>{entrega.data}</td>
              <td>
                <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                  👁
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="mt-4 h-11 w-full rounded-xl bg-white/[0.04] font-bold text-[#ffc400]">
        Ver todas as entregas ›
      </button>
    </div>
  )
}

function ListaMobile() {
  return (
    <div className="space-y-3">
      {entregas.map((entrega) => (
        <div key={entrega.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white/40">{entrega.id}</p>
              <p className="mt-1 font-bold">{entrega.cliente}</p>
              <p className="mt-1 text-sm text-white/55">{entrega.destino}</p>
            </div>
            <StatusTag status={entrega.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusTag({ status }: { status: StatusEntrega }) {
  const classe =
    status === "Concluída"
      ? "bg-green-600 text-white"
      : status === "Em Andamento"
        ? "bg-blue-600 text-white"
        : "bg-red-600 text-white"

  return <span className={`rounded-md px-3 py-1 text-xs font-bold ${classe}`}>{status}</span>
}

function ResumoFinanceiro() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101719]/70 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-black">Resumo Financeiro</h2>
        <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
          Este mês
        </button>
      </div>

      <ResumoLinha titulo="Faturamento" valor="R$ 24.560,00" detalhe="↑ 22% em relação ao mês anterior" verde />
      <ResumoLinha titulo="Despesas" valor="R$ 8.340,00" detalhe="↓ 8% em relação ao mês anterior" />
      <ResumoLinha titulo="Lucro Líquido" valor="R$ 16.220,00" detalhe="↑ 26% em relação ao mês anterior" verde />

      <button className="mt-4 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] text-sm text-white/80">
        Ver relatório completo ›
      </button>
    </section>
  )
}

function ResumoLinha({
  titulo,
  valor,
  detalhe,
  verde = false,
}: {
  titulo: string
  valor: string
  detalhe: string
  verde?: boolean
}) {
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <p className="text-sm text-white/50">{titulo}</p>
      <p className="mt-2 text-[24px] font-black">{valor}</p>
      <p className={`mt-1 text-sm ${verde ? "text-green-400" : "text-red-400"}`}>{detalhe}</p>
    </div>
  )
}

function NavItem({ icon, label, ativo = false }: { icon: string; label: string; ativo?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1">
      <img src={icon} alt="" className="h-6 w-6 object-contain" />
      <span className={`text-[11px] ${ativo ? "text-[#ffc400]" : "text-white/50"}`}>{label}</span>
    </button>
  )
}
