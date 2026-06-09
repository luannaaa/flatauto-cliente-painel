"use client"

import { ArrowLeft, Bike, CalendarDays, X } from "lucide-react"
import { useState } from "react"

type Agendamento = {
  id: string
  cliente: string
  local: string
  endereco: string
  destino: string
  tipoPacote: string
  horario: string
  observacaoCliente: string
  origemTipo: "cliente" | "empresa"
}

const agendamentosRegiao: Agendamento[] = [
  {
    id: "agenda-001",
    cliente: "Mercado Central",
    local: "Boa Viagem",
    endereco: "Av. Conselheiro Aguiar, Boa Viagem",
    destino: "Olinda",
    tipoPacote: "Pacote empresarial",
    horario: "Hoje às 16:30",
    observacaoCliente: "Retirar na recepção e entregar no setor de estoque.",
    origemTipo: "empresa",
  },
  {
    id: "agenda-002",
    cliente: "Cliente particular",
    local: "Recife Antigo",
    endereco: "Rua do Bom Jesus, Recife Antigo",
    destino: "Jaboatão",
    tipoPacote: "Frágil / sensível",
    horario: "Amanhã às 09:00",
    observacaoCliente: "Produto sensível. Evitar impacto e manter em pé.",
    origemTipo: "cliente",
  },
  {
    id: "agenda-003",
    cliente: "Auto Peças Brasil",
    local: "Imbiribeira",
    endereco: "Av. Marechal Mascarenhas de Morais, Imbiribeira",
    destino: "Casa Amarela",
    tipoPacote: "Pacote empresarial",
    horario: "Amanhã às 14:20",
    observacaoCliente: "Peças pequenas embaladas em caixa. Retirar no balcão.",
    origemTipo: "empresa",
  },
  {
    id: "agenda-004",
    cliente: "Cliente particular",
    local: "Pina",
    endereco: "Rua Capitão Rebelinho, Pina",
    destino: "Candeias",
    tipoPacote: "Pacote pequeno",
    horario: "Sexta às 10:00",
    observacaoCliente: "Pode chamar no WhatsApp ao chegar.",
    origemTipo: "cliente",
  },
  {
    id: "agenda-005",
    cliente: "Loja Recife",
    local: "Centro",
    endereco: "Rua da Imperatriz, Centro",
    destino: "Boa Vista",
    tipoPacote: "Pacote empresarial",
    horario: "Sexta às 15:40",
    observacaoCliente: "Retirada com nota fiscal no caixa da loja.",
    origemTipo: "empresa",
  },
]

export default function AgendamentosMotoristaPage() {
  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)

  function aceitarAgendamento() {
    alert("Agendamento aceito visualmente. Depois conectamos com o backend.")
    setSelecionado(null)
  }

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
            <h1 className="text-2xl font-black">Agendamentos</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <CalendarDays size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Agendamentos na sua região</h2>
          <p className="mt-2 text-sm text-white/60">
            Veja pedidos programados próximos da região cadastrada no perfil do motorista.
          </p>
        </section>

        <section className="space-y-3">
          {agendamentosRegiao.map((agendamento) => (
            <article
              key={agendamento.id}
              onClick={() => setSelecionado(agendamento)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-[#10171b] p-4 transition hover:border-[#ffc400]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black">{agendamento.cliente}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {agendamento.local} → {agendamento.destino}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#ffc400]">{agendamento.horario}</p>
                  <p className="mt-2 text-xs font-bold text-white/45">{agendamento.tipoPacote}</p>
                </div>

                <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
                  Agendado
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>

      {selecionado && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-5 sm:items-center sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#ffc400]">DETALHES DO AGENDAMENTO</p>
                <h2 className="mt-1 text-xl font-black">Agendamento na região</h2>
              </div>

              <button
                onClick={() => setSelecionado(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <DetalheLinha titulo="Local" valor={selecionado.local} icone="📍" />
              <DetalheLinha titulo="Endereço" valor={selecionado.endereco} icone="🗺️" />
              <DetalheLinha titulo="Destino" valor={selecionado.destino} icone="🏁" />
              <DetalheLinha titulo="Tipo de pacote" valor={selecionado.tipoPacote} icone="📦" />
              <DetalheLinha titulo="Horário" valor={selecionado.horario} icone="🗓️" />

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase text-white/45">📝 Observação do cliente</p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-white">
                  {selecionado.observacaoCliente}
                </p>
              </div>
            </div>

            <button
              onClick={aceitarAgendamento}
              className="mt-5 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black"
            >
              Aceitar agendamento
            </button>

            <button
              onClick={() => setSelecionado(null)}
              className="mt-3 h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] font-black text-white"
            >
              Fechar
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
      <p className="text-xs font-black uppercase text-white/45">
        {icone} {titulo}
      </p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}
