"use client"

import { ArrowLeft, CheckCircle2, X, MapPin, Clock, Package, FileText, DollarSign, CalendarDays } from "lucide-react"
import { useState } from "react"

type EntregaConcluida = {
  id: string
  cliente: string
  origem: string
  destino: string
  tipoPacote: string
  dataEntrega: string
  tempoTotal: string
  valorRecebido: string
  observacaoCliente: string
  status: "Entregue"
}

const entregasConcluidas: EntregaConcluida[] = [
  {
    id: "concluida-001",
    cliente: "Mercado Central",
    origem: "Boa Viagem",
    destino: "Olinda",
    tipoPacote: "Pacote empresarial",
    dataEntrega: "Hoje às 13:20",
    tempoTotal: "32 min",
    valorRecebido: "R$ 52,00",
    observacaoCliente: "Entrega realizada no setor de estoque. Recebido pelo responsável da loja.",
    status: "Entregue",
  },
  {
    id: "concluida-002",
    cliente: "Cliente particular",
    origem: "Recife Antigo",
    destino: "Jaboatão",
    tipoPacote: "Frágil / sensível",
    dataEntrega: "Ontem às 18:10",
    tempoTotal: "41 min",
    valorRecebido: "R$ 46,00",
    observacaoCliente: "Produto entregue sem avaria. Cliente pediu cuidado com a embalagem.",
    status: "Entregue",
  },
  {
    id: "concluida-003",
    cliente: "Auto Peças Brasil",
    origem: "Imbiribeira",
    destino: "Casa Amarela",
    tipoPacote: "Pacote empresarial",
    dataEntrega: "Ontem às 10:45",
    tempoTotal: "28 min",
    valorRecebido: "R$ 39,00",
    observacaoCliente: "Peças pequenas entregues no balcão de atendimento.",
    status: "Entregue",
  },
  {
    id: "concluida-004",
    cliente: "Loja Recife",
    origem: "Centro",
    destino: "Boa Vista",
    tipoPacote: "Mercadorias pequenas",
    dataEntrega: "Segunda às 15:40",
    tempoTotal: "19 min",
    valorRecebido: "R$ 31,00",
    observacaoCliente: "Entrega concluída com nota fiscal anexada ao pacote.",
    status: "Entregue",
  },
]

export default function ConcluidasMotoristaPage() {
  const [selecionada, setSelecionada] = useState<EntregaConcluida | null>(null)

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Concluídas</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Histórico de entregas</h2>
          <p className="mt-2 text-sm text-white/60">
            Veja as corridas já finalizadas e os detalhes de cada entrega.
          </p>
        </section>

        <section className="space-y-3">
          {entregasConcluidas.map((entrega) => (
            <article
              key={entrega.id}
              onClick={() => setSelecionada(entrega)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-[#10171b] p-4 transition hover:border-[#ffc400]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black">{entrega.cliente}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {entrega.origem} → {entrega.destino}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#ffc400]">{entrega.dataEntrega}</p>
                  <p className="mt-2 text-xs font-bold text-white/45">{entrega.tipoPacote}</p>
                </div>

                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-400">
                  Entregue
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-5 sm:items-center sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#ffc400]">DETALHES DA ENTREGA</p>
                <h2 className="mt-1 text-xl font-black">Entrega concluída</h2>
              </div>

              <button
                onClick={() => setSelecionada(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <DetalheLinha titulo="Origem" valor={selecionada.origem} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Destino" valor={selecionada.destino} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Tipo de pacote" valor={selecionada.tipoPacote} icone={<Package size={18} />} />
              <DetalheLinha titulo="Data da entrega" valor={selecionada.dataEntrega} icone={<CalendarDays size={18} />} />
              <DetalheLinha titulo="Tempo total" valor={selecionada.tempoTotal} icone={<Clock size={18} />} />
              <DetalheLinha titulo="Valor recebido" valor={selecionada.valorRecebido} icone={<DollarSign size={18} />} />

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-white/45">
                  <FileText size={18} />
                  Observação do cliente
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-white">
                  {selecionada.observacaoCliente}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelecionada(null)}
              className="mt-5 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black"
            >
              Fechar detalhes
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function DetalheLinha({ titulo, valor, icone }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase text-white/45">
        <span className="text-[#ffc400]">{icone}</span>
        {titulo}
      </p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}
