"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, RefreshCw, Star, Truck, UserRound } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Frete = {
  id: string
  cliente_id?: string | null
  motorista_id?: string | null
  codigo?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  status?: string | null
  tipo_transporte?: string | null
  created_at?: string | null
}

type Motorista = {
  id: string
  nome?: string | null
  telefone?: string | null
  tipo_caminhao?: string | null
  modelo_caminhao?: string | null
  placa?: string | null
  foto_perfil?: string | null
}

type Avaliacao = {
  id?: string
  cliente_id?: string | null
  motorista_id?: string | null
  frete_id?: string | null
  nota?: number | null
  comentario?: string | null
  created_at?: string | null
}

type MotoristaComFrete = {
  motorista: Motorista
  fretes: Frete[]
  minhaNota: number
  comentario: string
}

function texto(valor?: string | null) {
  return String(valor || "").trim()
}

function rotaFrete(frete: Frete) {
  const origem = frete.origem || frete.endereco_origem || "Origem"
  const destino = frete.destino || frete.endereco_destino || "Destino"
  return `${origem} → ${destino}`
}

function codigoFrete(frete: Frete) {
  return frete.codigo ? `#${frete.codigo}` : `#${String(frete.id).slice(0, 6)}`
}

function statusAceitoOuFinalizado(status?: string | null) {
  const s = String(status || "").toLowerCase()
  return (
    s.includes("aceito") ||
    s.includes("andamento") ||
    s.includes("rota") ||
    s.includes("conclu") ||
    s.includes("entregue") ||
    s.includes("finaliz") ||
    s.includes("agendado_aceito")
  )
}

function nomeVeiculo(motorista: Motorista, frete?: Frete) {
  return (
    motorista.modelo_caminhao ||
    motorista.tipo_caminhao ||
    frete?.tipo_transporte ||
    "Veículo não informado"
  )
}

export default function Page() {
  const [lista, setLista] = useState<MotoristaComFrete[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvandoId, setSalvandoId] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    carregarMotoristas()
  }, [])

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  async function carregarMotoristas() {
    setCarregando(true)
    setErro("")
    setSucesso("")

    const clienteId = localStorage.getItem("flatauto_cliente_id")

    if (!clienteId) {
      setErro("Cliente não encontrado no login.")
      setLista([])
      setCarregando(false)
      return
    }

    const { data: fretesData, error: erroFretes } = await supabase
      .from("fretes")
      .select("*")
      .eq("cliente_id", clienteId)
      .not("motorista_id", "is", null)
      .order("created_at", { ascending: false })

    if (erroFretes) {
      setErro(`Erro Supabase: ${erroFretes.message}`)
      setLista([])
      setCarregando(false)
      return
    }

    const fretes = (Array.isArray(fretesData) ? fretesData : []).filter((frete: Frete) =>
      statusAceitoOuFinalizado(frete.status)
    )

    const motoristaIds = Array.from(
      new Set(fretes.map((frete: Frete) => frete.motorista_id).filter(Boolean))
    ) as string[]

    if (motoristaIds.length === 0) {
      setLista([])
      setCarregando(false)
      return
    }

    const { data: motoristasData, error: erroMotoristas } = await supabase
      .from("motoristas")
      .select("*")
      .in("id", motoristaIds)

    if (erroMotoristas) {
      setErro(`Erro ao buscar motoristas: ${erroMotoristas.message}`)
      setLista([])
      setCarregando(false)
      return
    }

    const { data: avaliacoesData } = await supabase
      .from("avaliacoes")
      .select("*")
      .eq("cliente_id", clienteId)
      .in("motorista_id", motoristaIds)

    const motoristas = Array.isArray(motoristasData) ? motoristasData : []
    const avaliacoes = Array.isArray(avaliacoesData) ? avaliacoesData : []

    const montado = motoristas.map((motorista: Motorista) => {
      const fretesDoMotorista = fretes.filter(
        (frete: Frete) => frete.motorista_id === motorista.id
      )

      const avaliacao = avaliacoes.find(
        (item: Avaliacao) => item.motorista_id === motorista.id
      )

      return {
        motorista,
        fretes: fretesDoMotorista,
        minhaNota: Number(avaliacao?.nota || 0),
        comentario: texto(avaliacao?.comentario),
      }
    })

    setLista(montado)
    setCarregando(false)
  }

  async function salvarAvaliacao(item: MotoristaComFrete, nota: number) {
    const clienteId = localStorage.getItem("flatauto_cliente_id")

    if (!clienteId) {
      setErro("Cliente não encontrado no login.")
      return
    }

    const freteMaisRecente = item.fretes[0]

    setSalvandoId(item.motorista.id)
    setErro("")
    setSucesso("")

    const payloadAvaliacao = {
      cliente_id: clienteId,
      motorista_id: item.motorista.id,
      frete_id: freteMaisRecente?.id || null,
      nota,
      comentario: item.comentario || null,
    }

    const { error: erroAvaliacao } = await supabase
      .from("avaliacoes")
      .upsert(payloadAvaliacao as any, {
        onConflict: "cliente_id,motorista_id",
      })

    if (erroAvaliacao) {
      setSalvandoId("")
      setErro(`Erro ao salvar avaliação: ${erroAvaliacao.message}`)
      return
    }

    const payloadFavorito = {
      cliente_id: clienteId,
      motorista_id: item.motorista.id,
      frete_id: freteMaisRecente?.id || null,
      nota,
    }

    await supabase
      .from("favoritos")
      .upsert(payloadFavorito as any, {
        onConflict: "cliente_id,motorista_id",
      })

    setLista((atual) =>
      atual.map((motoristaItem) =>
        motoristaItem.motorista.id === item.motorista.id
          ? { ...motoristaItem, minhaNota: nota }
          : motoristaItem
      )
    )

    setSalvandoId("")
    setSucesso("Avaliação salva. Esse motorista agora aparece como favorito.")
  }

  function atualizarComentario(motoristaId: string, comentario: string) {
    setLista((atual) =>
      atual.map((item) =>
        item.motorista.id === motoristaId ? { ...item, comentario } : item
      )
    )
  }

  const totalFavoritos = useMemo(() => {
    return lista.filter((item) => item.minhaNota >= 4).length
  }, [lista])

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px] pb-10">
        <header className="flex items-center justify-between gap-3">
          <button onClick={voltarPainel} className="font-bold text-[#ffc400]">
            ← Voltar
          </button>

          <button
            onClick={carregarMotoristas}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#080808] text-[#ffc400]"
          >
            <RefreshCw size={18} />
          </button>
        </header>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffc400] text-black">
            <Star size={36} fill="currentColor" />
          </div>

          <h1 className="mt-5 text-[32px] font-black text-[#ffc400]">
            Favoritos
          </h1>

          <p className="mt-3 text-white/60">
            Avalie com estrelas os motoristas que já aceitaram seus fretes. As melhores notas aparecem no perfil do motorista e ajudam você a reconhecer os melhores entregadores.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Resumo titulo="Motoristas" valor={String(lista.length)} />
            <Resumo titulo="Favoritos" valor={String(totalFavoritos)} amarelo />
          </div>
        </section>

        {erro && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold text-green-400">
            {sucesso}
          </div>
        )}

        {carregando ? (
          <section className="mt-6 rounded-[24px] border border-white/10 bg-[#080808] p-6 text-center">
            <p className="font-bold text-[#ffc400]">Carregando motoristas do Supabase...</p>
          </section>
        ) : lista.length === 0 ? (
          <section className="mt-6 rounded-[24px] border border-white/10 bg-[#080808] p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffc400] text-3xl text-black">
              🚚
            </div>

            <h2 className="mt-4 text-xl font-black">Nenhum motorista ainda</h2>

            <p className="mt-2 text-sm text-white/55">
              Quando um motorista aceitar seu frete, ele aparecerá aqui para você avaliar.
            </p>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {lista.map((item) => {
              const freteMaisRecente = item.fretes[0]

              return (
                <article
                  key={item.motorista.id}
                  className="rounded-[24px] border border-white/10 bg-[#080808] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#ffc400] text-black">
                      {item.motorista.foto_perfil && item.motorista.foto_perfil !== "sem-foto" ? (
                        <img
                          src={item.motorista.foto_perfil}
                          alt="Foto do motorista"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={34} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-black">
                        {item.motorista.nome || "Motorista"}
                      </h2>

                      <p className="mt-1 text-sm font-bold text-[#ffc400]">
                        {nomeVeiculo(item.motorista, freteMaisRecente)}
                        {item.motorista.placa ? ` • ${item.motorista.placa}` : ""}
                      </p>

                      <p className="mt-1 text-xs text-white/45">
                        {item.fretes.length} frete(s) com você
                      </p>
                    </div>
                  </div>

                  {freteMaisRecente && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black p-4">
                      <p className="text-xs font-black uppercase text-white/40">
                        Último frete
                      </p>

                      <p className="mt-2 text-sm font-black text-white">
                        {codigoFrete(freteMaisRecente)}
                      </p>

                      <p className="mt-1 text-sm text-white/55">
                        {rotaFrete(freteMaisRecente)}
                      </p>
                    </div>
                  )}

                  <div className="mt-5">
                    <p className="mb-3 text-sm font-black text-white/70">
                      Sua avaliação
                    </p>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((nota) => {
                        const ativo = item.minhaNota >= nota

                        return (
                          <button
                            key={nota}
                            type="button"
                            onClick={() => salvarAvaliacao(item, nota)}
                            disabled={salvandoId === item.motorista.id}
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                              ativo
                                ? "border-[#ffc400] bg-[#ffc400] text-black"
                                : "border-white/10 bg-black text-white/35"
                            }`}
                          >
                            <Star size={22} fill={ativo ? "currentColor" : "none"} />
                          </button>
                        )
                      })}
                    </div>

                    <textarea
                      value={item.comentario}
                      onChange={(event) =>
                        atualizarComentario(item.motorista.id, event.target.value)
                      }
                      placeholder="Escreva uma observação sobre esse motorista..."
                      className="mt-4 min-h-[86px] w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-[#ffc400]/60"
                    />

                    <button
                      type="button"
                      onClick={() => salvarAvaliacao(item, item.minhaNota || 5)}
                      disabled={salvandoId === item.motorista.id}
                      className="mt-3 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black disabled:opacity-60"
                    >
                      {salvandoId === item.motorista.id
                        ? "Salvando..."
                        : item.minhaNota
                          ? "Atualizar avaliação"
                          : "Salvar como favorito"}
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}

function Resumo({
  titulo,
  valor,
  amarelo,
}: {
  titulo: string
  valor: string
  amarelo?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4">
      <p className="text-xs font-black uppercase text-white/40">{titulo}</p>
      <p className={`mt-1 text-2xl font-black ${amarelo ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </div>
  )
}
