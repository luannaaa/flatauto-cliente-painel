"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Package,
  Truck,
  UserRound,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

type Frete = {
  id: string
  codigo?: string | null
  cliente_id?: string | null
  motorista_id?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  status?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor?: string | null
  valor_frete?: number | null
  observacoes?: string | null
  descricao_carga?: string | null
  created_at?: string | null
}

type Cliente = {
  id: string
  nome?: string | null
  telefone?: string | null
  email?: string | null
}

function IconeVeiculo({ tipo, size = 28 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function ehEmAndamento(status?: string | null) {
  const s = texto(status)
  return s.includes("andamento") || s.includes("rota") || s.includes("em_rota")
}

function origemFrete(frete?: Frete | null) {
  return frete?.origem || frete?.endereco_origem || "Origem não informada"
}

function destinoFrete(frete?: Frete | null) {
  return frete?.destino || frete?.endereco_destino || "Destino não informado"
}

function formatarMoeda(frete?: Frete | null) {
  if (!frete) return "R$ 0,00"

  if (typeof frete.valor_frete === "number" && frete.valor_frete > 0) {
    return frete.valor_frete.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return frete.valor || "A calcular"
}

function hojeBR(data?: string | null) {
  if (!data) return "--"
  const limpa = String(data).slice(0, 10)
  const partes = limpa.split("-")
  if (partes.length !== 3) return limpa
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

export default function EmAndamentoPage() {
  const [tipoVeiculo, setTipoVeiculo] = useState<Veiculo>("caminhao")
  const [frete, setFrete] = useState<Frete | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [finalizando, setFinalizando] = useState(false)

  useEffect(() => {
    const veiculoSalvo = localStorage.getItem("tipoVeiculoMotorista") as Veiculo | null

    if (
      veiculoSalvo === "moto" ||
      veiculoSalvo === "carro" ||
      veiculoSalvo === "van" ||
      veiculoSalvo === "caminhao"
    ) {
      setTipoVeiculo(veiculoSalvo)
    }

    carregarCorridaAtual()
  }, [])

  async function carregarCorridaAtual() {
    setCarregando(true)
    setErro("")

    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      setErro("Motorista não encontrado no login.")
      setCarregando(false)
      return
    }

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .eq("motorista_id", motoristaId)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []
    const corridaAtual =
      lista.find((item: Frete) => ehEmAndamento(item.status)) || lista[0] || null

    setFrete(corridaAtual)

    if (corridaAtual?.cliente_id) {
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id,nome,telefone,email")
        .eq("id", corridaAtual.cliente_id)
        .maybeSingle()

      if (clienteData) setCliente(clienteData)
    }

    setCarregando(false)
  }

  async function finalizarCorrida() {
    if (!frete || finalizando) return

    setFinalizando(true)
    setErro("")

    const { error } = await supabase
      .from("fretes")
      .update({
        status: "concluido",
      })
      .eq("id", frete.id)

    setFinalizando(false)

    if (error) {
      setErro(`Erro ao finalizar: ${error.message}`)
      return
    }

    window.location.replace("/motorista/concluidas")
  }

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-white/10 bg-[#10171b] px-4">
        <a
          href="/motorista"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
        >
          <ArrowLeft size={20} />
        </a>

        <div>
          <p className="text-[10px] font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
          <h1 className="text-lg font-black">Em andamento</h1>
        </div>
      </header>

      <section className="relative h-[36vh] min-h-[250px] overflow-hidden bg-[#d9e4d2] pt-14">
        <div className="absolute left-[7%] top-[28%] z-20 rounded-lg bg-green-600 px-3 py-1 text-xs font-black text-white">
          Origem
        </div>

        <div className="absolute right-[8%] top-[35%] z-20 rounded-lg bg-red-600 px-3 py-1 text-xs font-black text-white">
          Destino
        </div>

        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-5%] top-[34%] h-[3px] w-[115%] rotate-[12deg] bg-white/90" />
          <div className="absolute left-[-5%] top-[62%] h-[3px] w-[115%] -rotate-[7deg] bg-white/90" />
          <div className="absolute left-[23%] top-[10%] h-[100%] w-[3px] rotate-[8deg] bg-white/90" />
          <div className="absolute left-[70%] top-[0%] h-[100%] w-[3px] -rotate-[9deg] bg-white/90" />
        </div>

        <div className="absolute left-[24%] top-[54%] h-[4px] w-[52%] -rotate-[8deg] rounded-full bg-[#ffc400]" />

        <div className="absolute left-[20%] top-[50%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
          <MapPin size={20} />
        </div>

        <div className="absolute left-[72%] top-[40%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
          <MapPin size={20} />
        </div>

        <div className="absolute left-[43%] top-[43%] z-30 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_10px_35px_rgba(255,196,0,0.45)]">
          <IconeVeiculo tipo={tipoVeiculo} size={30} />
        </div>
      </section>

      <section className="-mt-4 rounded-t-[26px] bg-[#020507] px-4 pb-6 pt-4">
        <div className="mx-auto max-w-[480px] space-y-3">
          {erro && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-400">
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
              Carregando corrida do Supabase...
            </div>
          ) : !frete ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center">
              <Package className="mx-auto text-[#ffc400]" size={34} />
              <h2 className="mt-3 text-lg font-black">Sem corrida em andamento</h2>
              <p className="mt-2 text-sm text-white/60">
                Quando você aceitar uma corrida de hoje, ela aparece aqui.
              </p>
            </div>
          ) : (
            <>
              <article className="rounded-[22px] border border-[#ffc400]/25 bg-[#10171b] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
                    <IconeVeiculo tipo={tipoVeiculo} size={26} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase text-[#ffc400]">
                      Corrida atual
                    </p>
                    <h2 className="mt-1 text-lg font-black leading-tight">
                      {frete.codigo ? `Frete #${frete.codigo}` : "Entrega em andamento"}
                    </h2>
                    <p className="mt-1 text-xs font-bold text-white/50">
                      {frete.status || "em_andamento"}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-[10px] font-black text-[#ffc400]">
                    Em rota
                  </span>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/10 bg-[#10171b] p-4">
                <div className="space-y-3">
                  <LinhaCompleta
                    icon={<MapPin size={18} />}
                    titulo="Onde pegar"
                    valor={origemFrete(frete)}
                    cor="text-green-400"
                  />

                  <LinhaCompleta
                    icon={<MapPin size={18} />}
                    titulo="Onde entregar"
                    valor={destinoFrete(frete)}
                    cor="text-red-400"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <MiniInfo
                      icon={<Package size={17} />}
                      titulo="Pacote"
                      valor={frete.tipo_carga || frete.tipo_transporte || "Não informado"}
                    />

                    <MiniInfo
                      icon={<Clock size={17} />}
                      titulo="Horário"
                      valor={frete.horario || "--"}
                    />

                    <MiniInfo
                      icon={<UserRound size={17} />}
                      titulo="Cliente"
                      valor={cliente?.nome || "Cliente não informado"}
                    />

                    <MiniInfo
                      icon={<Package size={17} />}
                      titulo="Valor"
                      valor={formatarMoeda(frete)}
                      destaque
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <MiniInfo
                      icon={<CalendarIcon />}
                      titulo="Coleta"
                      valor={hojeBR(frete.data_frete)}
                    />

                    <MiniInfo
                      icon={<CalendarIcon />}
                      titulo="Entrega"
                      valor={hojeBR(frete.data_entrega)}
                    />
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 text-[#ffc400]">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase text-white/40">
                          Observação
                        </p>
                        <p className="mt-1 break-words text-sm font-black leading-snug text-white">
                          {frete.observacoes || frete.descricao_carga || "Sem observação."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <button
                onClick={finalizarCorrida}
                disabled={finalizando}
                className="sticky bottom-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] text-base font-black text-black shadow-[0_0_28px_rgba(255,196,0,0.25)] disabled:opacity-60"
              >
                <CheckCircle2 size={21} />
                {finalizando ? "Finalizando..." : "Finalizar corrida"}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function LinhaCompleta({
  icon,
  titulo,
  valor,
  cor,
}: {
  icon: React.ReactNode
  titulo: string
  valor: string
  cor: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-3">
      <div className="flex items-start gap-2">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 ${cor}`}>
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase text-white/40">{titulo}</p>
          <p className="mt-1 break-words text-sm font-black leading-snug text-white">
            {valor}
          </p>
        </div>
      </div>
    </div>
  )
}

function MiniInfo({
  icon,
  titulo,
  valor,
  destaque,
}: {
  icon: React.ReactNode
  titulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-3">
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ffc400]/15 text-[#ffc400]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase text-white/40">{titulo}</p>
          <p className={`mt-1 break-words text-xs font-black leading-snug ${destaque ? "text-[#ffc400]" : "text-white"}`}>
            {valor}
          </p>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <span className="text-sm">📅</span>
  )
}
