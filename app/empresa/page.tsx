"use client"

import { useState } from "react"

const imagens = {
  logo: "/logo.png",
  empresa: "/empresa_cliente.png",
  entregas: "/tipo_carga.png",
  concluido: "/concluido.png",
  andamento: "/em_andamento.png",
  cancelado: "/atencao.png",
  caminhao: "/modelo_caminhao.png",
  motorista: "/motorista_proximo.png",
  financeiro: "/pagamento.png",
  relatorios: "/status_frete.png",
  notificacao: "/notificacao.png",
  configuracao: "/configuracao.png",
  sair: "/window.svg",
  inicio: "/inicio.png",
  destino: "/destino_entrega.png",
  olho: "/file.svg",
}

type Entrega = {
  id: string
  cliente: string
  destino: string
  status: "Concluída" | "Em Andamento" | "Cancelada"
  data: string
}

const entregas: Entrega[] = [
  {
    id: "#1287",
    cliente: "Auto Peças Brasil",
    destino: "São Paulo - SP",
    status: "Concluída",
    data: "20/05/2024",
  },
  {
    id: "#1286",
    cliente: "Construtora Nova",
    destino: "Campinas - SP",
    status: "Em Andamento",
    data: "20/05/2024",
  },
  {
    id: "#1285",
    cliente: "Mercado Central",
    destino: "Ribeirão Preto - SP",
    status: "Concluída",
    data: "20/05/2024",
  },
  {
    id: "#1284",
    cliente: "Indústria ABC",
    destino: "Santos - SP",
    status: "Cancelada",
    data: "19/05/2024",
  },
]

export default function PainelEmpresa() {
  const [empresaNome] = useState("Transportes Silva LTDA")

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="hidden min-h-screen md:flex">
        <SidebarEmpresa empresaNome={empresaNome} />

        <section className="flex-1 overflow-y-auto bg-[#f5f5f5] p-6 text-black">
          <div className="mx-auto max-w-[1280px] rounded-[28px] bg-[#080808] p-8 text-white shadow-2xl">
            <TopoEmpresa empresaNome={empresaNome} />

            <div className="mt-8 grid grid-cols-4 gap-4">
              <CardNumero
                titulo="Total de Entregas"
                valor="128"
                icon={imagens.entregas}
                detalhe="+18% em relação à semana anterior"
              />
              <CardNumero
                titulo="Concluídas"
                valor="96"
                icon={imagens.concluido}
                detalhe="75% do total"
              />
              <CardNumero
                titulo="Em Andamento"
                valor="18"
                icon={imagens.andamento}
                detalhe="14% do total"
              />
              <CardNumero
                titulo="Canceladas"
                valor="14"
                icon={imagens.cancelado}
                detalhe="11% do total"
              />
            </div>

            <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-5">
              <GraficoLinha />
              <GraficoStatus />
            </div>

            <div className="mt-5 grid grid-cols-[1.4fr_0.6fr] gap-5">
              <TabelaEntregas />
              <ResumoFinanceiro />
            </div>
          </div>
        </section>
      </div>

      <section className="min-h-screen bg-[#050505] px-4 py-5 md:hidden">
        <div className="mx-auto max-w-[430px]">
          <header className="flex items-center justify-between">
            <button className="text-3xl">☰</button>

            <div className="text-center">
              <img src={imagens.logo} alt="FlatAuto" className="mx-auto h-12 w-40 object-contain" />
              <p className="-mt-1 text-xs font-bold text-[#ffc400]">EMPRESA</p>
            </div>

            <img src={imagens.notificacao} alt="" className="h-7 w-7 object-contain" />
          </header>

          <div className="mt-7">
            <h1 className="text-2xl font-black">Olá, {empresaNome} 👋</h1>
            <p className="mt-2 text-sm text-white/65">
              Acompanhe suas entregas em tempo real.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <CardNumero titulo="Total de Entregas" valor="128" icon={imagens.entregas} detalhe="" mobile />
            <CardNumero titulo="Concluídas" valor="96" icon={imagens.concluido} detalhe="" mobile />
            <CardNumero titulo="Em Andamento" valor="18" icon={imagens.andamento} detalhe="" mobile />
            <CardNumero titulo="Canceladas" valor="14" icon={imagens.cancelado} detalhe="" mobile />
          </div>

          <div className="mt-4">
            <GraficoLinha mobile />
          </div>

          <div className="mt-4">
            <ListaEntregasMobile />
          </div>

          <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#080808] px-5 py-3">
            <div className="mx-auto flex max-w-[430px] items-center justify-between">
              <NavMobile icon={imagens.inicio} label="Dashboard" ativo />
              <NavMobile icon={imagens.entregas} label="Entregas" />
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400] text-3xl font-black text-black shadow-[0_0_25px_rgba(255,196,0,0.5)]">
                +
              </button>
              <NavMobile icon={imagens.motorista} label="Motoristas" />
              <NavMobile icon={imagens.configuracao} label="Mais" />
            </div>
          </nav>

          <div className="h-24" />
        </div>
      </section>
    </main>
  )
}

function TopoEmpresa({ empresaNome }: { empresaNome: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[34px] font-black leading-tight">
          Olá, {empresaNome} 👋
        </h1>
        <p className="mt-2 text-white/70">
          Acompanhe o desempenho das suas entregas em tempo real.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="h-12 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm text-white/85">
          📅 20/05/2024 - 26/05/2024
        </button>

        <button className="h-12 rounded-xl bg-[#ffc400] px-6 font-black text-black shadow-[0_0_25px_rgba(255,196,0,0.35)]">
          + Nova Entrega
        </button>
      </div>
    </div>
  )
}

function SidebarEmpresa({ empresaNome }: { empresaNome: string }) {
  return (
    <aside className="w-[260px] bg-[#080808] px-5 py-7">
      <img src={imagens.logo} alt="FlatAuto" className="h-16 w-52 object-contain object-left" />
      <p className="mt-1 text-sm font-bold text-[#ffc400]">EMPRESA</p>

      <nav className="mt-10 space-y-2">
        <ItemMenu icon={imagens.inicio} label="Dashboard" ativo />
        <ItemMenu icon={imagens.entregas} label="Entregas" />
        <ItemMenu icon={imagens.motorista} label="Motoristas" />
        <ItemMenu icon={imagens.caminhao} label="Veículos" />
        <ItemMenu icon={imagens.empresa} label="Clientes" />
        <ItemMenu icon={imagens.financeiro} label="Financeiro" />
        <ItemMenu icon={imagens.relatorios} label="Relatórios" />
        <ItemMenu icon={imagens.notificacao} label="Notificações" />
        <ItemMenu icon={imagens.configuracao} label="Configurações" />
      </nav>

      <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffc400] text-[#ffc400]">
            <img src={imagens.empresa} alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold">{empresaNome}</p>
            <p className="text-xs text-white/55">Plano Empresarial</p>
          </div>
        </div>
      </div>

      <button className="mt-4 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] font-bold">
        Sair
      </button>
    </aside>
  )
}

function ItemMenu({
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
      className={`flex h-14 w-full items-center gap-4 rounded-xl px-4 text-left font-bold ${
        ativo ? "bg-[#ffc400] text-black" : "text-white/80 hover:bg-white/[0.05]"
      }`}
    >
      <img src={icon} alt="" className="h-6 w-6 object-contain" />
      {label}
    </button>
  )
}

function CardNumero({
  titulo,
  valor,
  icon,
  detalhe,
  mobile = false,
}: {
  titulo: string
  valor: string
  icon: string
  detalhe: string
  mobile?: boolean
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.055] ${mobile ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${mobile ? "text-xs" : "text-sm"} text-white/75`}>{titulo}</p>
          <h2 className={`${mobile ? "mt-2 text-3xl" : "mt-3 text-4xl"} font-black`}>{valor}</h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400]/10">
          <img src={icon} alt="" className="h-8 w-8 object-contain" />
        </div>
      </div>

      {detalhe && <p className="mt-3 text-xs text-green-400">{detalhe}</p>}
    </div>
  )
}

function GraficoLinha({ mobile = false }: { mobile?: boolean }) {
  const pontos = [12, 20, 14, 28, 35, 25, 33, 27]

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black">Entregas por Período</h3>
        <button className="rounded-lg border border-white/10 px-3 py-2 text-xs">7 dias</button>
      </div>

      <div className={`${mobile ? "h-[150px]" : "h-[260px]"} mt-5 flex items-end gap-3`}>
        {pontos.map((ponto, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-[#ffc400]/20 to-[#ffc400]"
              style={{ height: `${ponto * 3.5}px` }}
            />
            {!mobile && <span className="text-xs text-white/40">{20 + index}/05</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function GraficoStatus() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
      <h3 className="font-black">Entregas por Status</h3>

      <div className="mt-8 flex items-center justify-center gap-10">
        <div className="flex h-48 w-48 items-center justify-center rounded-full border-[32px] border-[#ffc400] bg-black">
          <div className="text-center">
            <p className="text-4xl font-black">128</p>
            <p className="text-white/60">Total</p>
          </div>
        </div>

        <div className="space-y-5">
          <Legenda cor="bg-[#ffc400]" label="Concluídas" valor="96 (75%)" />
          <Legenda cor="bg-yellow-700" label="Em Andamento" valor="18 (14%)" />
          <Legenda cor="bg-zinc-400" label="Canceladas" valor="14 (11%)" />
        </div>
      </div>
    </div>
  )
}

function Legenda({ cor, label, valor }: { cor: string; label: string; valor: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${cor}`} />
      <div>
        <p>{label}</p>
        <p className="font-bold">{valor}</p>
      </div>
    </div>
  )
}

function TabelaEntregas() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
      <h3 className="font-black">Entregas Recentes</h3>

      <table className="mt-5 w-full text-left text-sm">
        <thead className="text-white/55">
          <tr>
            <th className="pb-3">ID</th>
            <th className="pb-3">Cliente</th>
            <th className="pb-3">Destino</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Data</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>

        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.id} className="border-t border-white/10">
              <td className="py-4">{entrega.id}</td>
              <td>{entrega.cliente}</td>
              <td>{entrega.destino}</td>
              <td>
                <StatusTag status={entrega.status} />
              </td>
              <td>{entrega.data}</td>
              <td>
                <button className="rounded-lg border border-white/10 px-3 py-2">👁</button>
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

function ListaEntregasMobile() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black">Entregas Recentes</h3>
        <button className="text-sm font-bold text-[#ffc400]">Ver todas</button>
      </div>

      <div className="mt-4 space-y-3">
        {entregas.slice(0, 3).map((entrega) => (
          <div key={entrega.id} className="rounded-xl bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{entrega.cliente}</p>
                <p className="text-sm text-white/55">{entrega.destino}</p>
              </div>
              <StatusTag status={entrega.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusTag({ status }: { status: Entrega["status"] }) {
  const classe =
    status === "Concluída"
      ? "bg-[#ffc400] text-black"
      : status === "Em Andamento"
        ? "bg-yellow-700 text-white"
        : "bg-zinc-500 text-white"

  return (
    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${classe}`}>
      {status}
    </span>
  )
}

function ResumoFinanceiro() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black">Resumo Financeiro</h3>
        <button className="rounded-lg border border-white/10 px-3 py-2 text-xs">Este mês</button>
      </div>

      <ResumoLinha titulo="Faturamento" valor="R$ 24.560,00" detalhe="+22%" verde />
      <ResumoLinha titulo="Despesas" valor="R$ 8.340,00" detalhe="-8%" />
      <ResumoLinha titulo="Lucro Líquido" valor="R$ 16.220,00" detalhe="+26%" verde />
    </div>
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
    <div className="border-b border-white/10 py-5 last:border-b-0">
      <p className="text-sm text-white/60">{titulo}</p>
      <p className="mt-2 text-2xl font-black">{valor}</p>
      <p className={`mt-1 text-sm ${verde ? "text-green-400" : "text-red-400"}`}>
        {detalhe} em relação ao mês anterior
      </p>
    </div>
  )
}

function NavMobile({ icon, label, ativo = false }: { icon: string; label: string; ativo?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1">
      <img src={icon} alt="" className="h-6 w-6 object-contain" />
      <span className={`text-[11px] ${ativo ? "text-[#ffc400]" : "text-white/55"}`}>
        {label}
      </span>
    </button>
  )
}
