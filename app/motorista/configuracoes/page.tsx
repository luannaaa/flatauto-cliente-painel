"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Etapa = "estados" | "cidades"

type EstadoBrasil = {
  uf: string
  nome: string
  cidades: string[]
}

type MotoristaConfig = {
  id?: string
  nome?: string | null
  email?: string | null
  regioes_atuacao?: string[] | null
  notificacao_agendamento?: boolean | null
  notificacao_perto_horario?: boolean | null
  suporte_whatsapp?: string | null
}

const estadosBrasil: EstadoBrasil[] = [
  { uf: "AC", nome: "Acre", cidades: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá"] },
  { uf: "AL", nome: "Alagoas", cidades: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "Penedo"] },
  { uf: "AP", nome: "Amapá", cidades: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque"] },
  { uf: "AM", nome: "Amazonas", cidades: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"] },
  { uf: "BA", nome: "Bahia", cidades: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas"] },
  { uf: "CE", nome: "Ceará", cidades: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato"] },
  { uf: "DF", nome: "Distrito Federal", cidades: ["Brasília", "Taguatinga", "Ceilândia", "Samambaia", "Gama"] },
  { uf: "ES", nome: "Espírito Santo", cidades: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Cachoeiro de Itapemirim"] },
  { uf: "GO", nome: "Goiás", cidades: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"] },
  { uf: "MA", nome: "Maranhão", cidades: ["São Luís", "Imperatriz", "Timon", "Caxias", "Bacabal"] },
  { uf: "MT", nome: "Mato Grosso", cidades: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"] },
  { uf: "MS", nome: "Mato Grosso do Sul", cidades: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"] },
  { uf: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Uberaba"] },
  { uf: "PA", nome: "Pará", cidades: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"] },
  { uf: "PB", nome: "Paraíba", cidades: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"] },
  { uf: "PR", nome: "Paraná", cidades: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais"] },
  { uf: "PE", nome: "Pernambuco", cidades: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Cabo de Santo Agostinho", "Paulista", "Camaragibe", "Caruaru", "Petrolina", "Ipojuca"] },
  { uf: "PI", nome: "Piauí", cidades: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"] },
  { uf: "RJ", nome: "Rio de Janeiro", cidades: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Petrópolis"] },
  { uf: "RN", nome: "Rio Grande do Norte", cidades: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Caicó"] },
  { uf: "RS", nome: "Rio Grande do Sul", cidades: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí"] },
  { uf: "RO", nome: "Rondônia", cidades: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"] },
  { uf: "RR", nome: "Roraima", cidades: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre"] },
  { uf: "SC", nome: "Santa Catarina", cidades: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí"] },
  { uf: "SP", nome: "São Paulo", cidades: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "Ribeirão Preto", "Santos"] },
  { uf: "SE", nome: "Sergipe", cidades: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"] },
  { uf: "TO", nome: "Tocantins", cidades: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"] },
]

function limparTexto(valor?: string | null) {
  return String(valor || "").trim()
}

function chaveEstado(uf: string) {
  return `ESTADO:${uf}`
}

function chaveCidade(uf: string, cidade: string) {
  return `CIDADE:${uf}:${cidade}`
}

function lerEstadosSalvos(regioes: string[]) {
  return regioes
    .filter((item) => item.startsWith("ESTADO:"))
    .map((item) => item.replace("ESTADO:", ""))
}

function lerCidadesSalvas(regioes: string[]) {
  return regioes.filter((item) => item.startsWith("CIDADE:"))
}

function formatarRegiaoSalva(regiao: string) {
  if (regiao.startsWith("ESTADO:")) {
    const uf = regiao.replace("ESTADO:", "")
    const estado = estadosBrasil.find((item) => item.uf === uf)
    return estado ? `${estado.nome} (${uf})` : uf
  }

  if (regiao.startsWith("CIDADE:")) {
    const partes = regiao.split(":")
    return `${partes[2]} - ${partes[1]}`
  }

  return regiao
}

export function freteCombinaComRegiaoMotorista(frete: any, regioes: string[]) {
  if (!regioes.length) return true

  const textoFrete = [
    frete?.origem,
    frete?.destino,
    frete?.endereco_origem,
    frete?.endereco_destino,
    frete?.cep_origem,
    frete?.cep_destino,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return regioes.some((regiao) => {
    if (regiao.startsWith("ESTADO:")) {
      const uf = regiao.replace("ESTADO:", "")
      const estado = estadosBrasil.find((item) => item.uf === uf)
      if (!estado) return false

      return (
        textoFrete.includes(estado.nome.toLowerCase()) ||
        textoFrete.includes(` ${uf.toLowerCase()} `) ||
        textoFrete.includes(`-${uf.toLowerCase()}`) ||
        textoFrete.includes(`${uf.toLowerCase()},`)
      )
    }

    if (regiao.startsWith("CIDADE:")) {
      const partes = regiao.split(":")
      const uf = partes[1] || ""
      const cidade = partes[2] || ""
      return textoFrete.includes(cidade.toLowerCase()) || textoFrete.includes(uf.toLowerCase())
    }

    return textoFrete.includes(regiao.toLowerCase())
  })
}

export default function ConfiguracoesPage() {
  const [etapa, setEtapa] = useState<Etapa>("estados")
  const [motoristaId, setMotoristaId] = useState("")
  const [nomeMotorista, setNomeMotorista] = useState("")
  const [emailMotorista, setEmailMotorista] = useState("")
  const [estadosSelecionados, setEstadosSelecionados] = useState<string[]>([])
  const [cidadesSelecionadas, setCidadesSelecionadas] = useState<string[]>([])
  const [cidadeManual, setCidadeManual] = useState("")
  const [estadoCidadeManual, setEstadoCidadeManual] = useState("PE")
  const [notificacaoAgendamento, setNotificacaoAgendamento] = useState(true)
  const [notificacaoPertoHorario, setNotificacaoPertoHorario] = useState(true)
  const [suporteWhatsapp, setSuporteWhatsapp] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  async function carregarConfiguracoes() {
    setCarregando(true)
    setErro("")
    setSucesso("")

    const idSalvo = localStorage.getItem("flatauto_motorista_id")
    const emailSalvo =
      localStorage.getItem("flatauto_motorista_email") ||
      localStorage.getItem("motoristaEmail")

    if (!idSalvo && !emailSalvo) {
      setErro("Motorista não encontrado no login.")
      setCarregando(false)
      return
    }

    let consulta = supabase
      .from("motoristas")
      .select("id,nome,email,regioes_atuacao,notificacao_agendamento,notificacao_perto_horario,suporte_whatsapp")

    if (idSalvo) {
      consulta = consulta.eq("id", idSalvo)
    } else {
      consulta = consulta.eq("email", limparTexto(emailSalvo).toLowerCase())
    }

    const { data, error } = await consulta.maybeSingle()

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    if (!data) {
      setErro("Motorista não encontrado no Supabase.")
      setCarregando(false)
      return
    }

    preencherTela(data)
    setCarregando(false)
  }

  function preencherTela(data: MotoristaConfig) {
    const regioes = Array.isArray(data.regioes_atuacao) ? data.regioes_atuacao : []

    setMotoristaId(data.id || "")
    setNomeMotorista(data.nome || "Motorista")
    setEmailMotorista(data.email || "")
    setEstadosSelecionados(lerEstadosSalvos(regioes))
    setCidadesSelecionadas(lerCidadesSalvas(regioes))
    setNotificacaoAgendamento(data.notificacao_agendamento !== false)
    setNotificacaoPertoHorario(data.notificacao_perto_horario !== false)
    setSuporteWhatsapp(data.suporte_whatsapp || "")

    if (data.id) localStorage.setItem("flatauto_motorista_id", data.id)
    if (data.email) localStorage.setItem("flatauto_motorista_email", data.email)
  }

  const estadosParaCidades = useMemo(() => {
    return estadosBrasil.filter((estado) => estadosSelecionados.includes(estado.uf))
  }, [estadosSelecionados])

  const regioesParaSalvar = useMemo(() => {
    return [
      ...estadosSelecionados.map(chaveEstado),
      ...cidadesSelecionadas,
    ]
  }, [estadosSelecionados, cidadesSelecionadas])

  const resumoRegioes = useMemo(() => {
    const totalEstados = estadosSelecionados.length
    const totalCidades = cidadesSelecionadas.length

    if (totalEstados === 0 && totalCidades === 0) return "Brasil todo / todas as regiões"
    return `${totalEstados} estado(s) e ${totalCidades} cidade(s)`
  }, [estadosSelecionados, cidadesSelecionadas])

  function alternarEstado(uf: string) {
    setSucesso("")
    setEstadosSelecionados((lista) => {
      const jaTem = lista.includes(uf)

      if (jaTem) {
        setCidadesSelecionadas((cidades) =>
          cidades.filter((cidade) => !cidade.startsWith(`CIDADE:${uf}:`))
        )

        return lista.filter((item) => item !== uf)
      }

      return [...lista, uf]
    })
  }

  function alternarCidade(uf: string, cidade: string) {
    const chave = chaveCidade(uf, cidade)
    setSucesso("")
    setCidadesSelecionadas((lista) =>
      lista.includes(chave)
        ? lista.filter((item) => item !== chave)
        : [...lista, chave]
    )
  }

  function adicionarCidadeManual() {
    const nome = limparTexto(cidadeManual)

    if (!nome) return

    const chave = chaveCidade(estadoCidadeManual, nome)

    if (!estadosSelecionados.includes(estadoCidadeManual)) {
      setEstadosSelecionados((lista) => [...lista, estadoCidadeManual])
    }

    setCidadesSelecionadas((lista) =>
      lista.includes(chave) ? lista : [...lista, chave]
    )

    setCidadeManual("")
  }

  function confirmarEstados() {
    if (estadosSelecionados.length === 0) {
      alert("Selecione pelo menos um estado, ou deixe sem selecionar para atuar no Brasil todo.")
      return
    }

    setEtapa("cidades")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function salvarConfiguracoes() {
    setSalvando(true)
    setErro("")
    setSucesso("")

    const idAtual = motoristaId || localStorage.getItem("flatauto_motorista_id") || ""
    const emailAtual =
      emailMotorista ||
      localStorage.getItem("flatauto_motorista_email") ||
      localStorage.getItem("motoristaEmail") ||
      ""

    const payload = {
      regioes_atuacao: regioesParaSalvar,
      notificacao_agendamento: notificacaoAgendamento,
      notificacao_perto_horario: notificacaoPertoHorario,
      suporte_whatsapp: limparTexto(suporteWhatsapp) || null,
    }

    let updateQuery = supabase.from("motoristas").update(payload)

    if (idAtual) {
      updateQuery = updateQuery.eq("id", idAtual)
    } else if (emailAtual) {
      updateQuery = updateQuery.eq("email", limparTexto(emailAtual).toLowerCase())
    } else {
      setSalvando(false)
      setErro("Motorista não encontrado no login.")
      return
    }

    const { error: updateError } = await updateQuery

    if (updateError) {
      setSalvando(false)
      setErro(`Erro Supabase ao salvar: ${updateError.message}`)
      return
    }

    let selectQuery = supabase
      .from("motoristas")
      .select("id,nome,email,regioes_atuacao,notificacao_agendamento,notificacao_perto_horario,suporte_whatsapp")

    if (idAtual) {
      selectQuery = selectQuery.eq("id", idAtual)
    } else {
      selectQuery = selectQuery.eq("email", limparTexto(emailAtual).toLowerCase())
    }

    const { data: dadosAtualizados, error: selectError } = await selectQuery.maybeSingle()

    setSalvando(false)

    if (selectError) {
      setErro(`Salvou, mas não consegui confirmar: ${selectError.message}`)
      return
    }

    if (!dadosAtualizados) {
      setErro("Não consegui confirmar no Supabase. Verifique se o motorista_id do login está correto.")
      return
    }

    preencherTela(dadosAtualizados)
    setSucesso("Configurações salvas no Supabase.")
  }

  function abrirSuporte() {
    const numero = limparTexto(suporteWhatsapp).replace(/\D/g, "")

    if (!numero) {
      alert("Suporte WhatsApp ainda sem número cadastrado.")
      return
    }

    window.open(`https://wa.me/${numero}`, "_blank")
  }

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-10">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Configurações</h1>
          </div>
        </header>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold text-green-400">
            {sucesso}
          </div>
        )}

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Settings size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Configurações do motorista</h2>

          <p className="mt-2 text-sm text-white/60">
            Primeiro escolha um ou mais estados. Depois toque em OK para escolher as cidades onde quer atuar.
          </p>

          {!carregando && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase text-white/45">Motorista</p>
              <p className="mt-1 font-black">{nomeMotorista}</p>
              {emailMotorista && <p className="mt-1 text-sm text-white/50">{emailMotorista}</p>}
            </div>
          )}
        </section>

        {carregando ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-6 text-center text-sm font-bold text-white/60">
            Carregando configurações do Supabase...
          </div>
        ) : (
          <>
            <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                  <MapPin size={26} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-black">Região de atuação</h2>
                  <p className="mt-1 text-sm text-white/60">
                    {etapa === "estados"
                      ? "Escolha um ou mais estados do Brasil."
                      : "Agora escolha as cidades dentro dos estados selecionados."}
                  </p>
                  <p className="mt-2 text-sm font-black text-[#ffc400]">{resumoRegioes}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEtapa("estados")}
                  className={`h-11 rounded-xl text-sm font-black ${
                    etapa === "estados"
                      ? "bg-[#ffc400] text-black"
                      : "border border-white/10 bg-[#0b1014] text-white/60"
                  }`}
                >
                  1. Estados
                </button>

                <button
                  type="button"
                  onClick={() => setEtapa("cidades")}
                  className={`h-11 rounded-xl text-sm font-black ${
                    etapa === "cidades"
                      ? "bg-[#ffc400] text-black"
                      : "border border-white/10 bg-[#0b1014] text-white/60"
                  }`}
                >
                  2. Cidades
                </button>
              </div>

              {etapa === "estados" ? (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {estadosBrasil.map((estado) => {
                      const ativo = estadosSelecionados.includes(estado.uf)

                      return (
                        <button
                          key={estado.uf}
                          type="button"
                          onClick={() => alternarEstado(estado.uf)}
                          className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-black transition ${
                            ativo
                              ? "border-[#ffc400]/60 bg-[#ffc400] text-black"
                              : "border-white/10 bg-[#0b1014] text-white/70"
                          }`}
                        >
                          <span>
                            {estado.nome}
                            <strong className="ml-1 opacity-70">({estado.uf})</strong>
                          </span>
                          {ativo && <Check size={16} />}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={confirmarEstados}
                    className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] py-4 font-black text-black"
                  >
                    OK, escolher cidades
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : (
                <>
                  {estadosParaCidades.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#0b1014] p-5 text-center text-sm font-bold text-white/55">
                      Selecione pelo menos um estado primeiro.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-5">
                      {estadosParaCidades.map((estado) => (
                        <div key={estado.uf} className="rounded-2xl border border-white/10 bg-[#0b1014] p-4">
                          <h3 className="font-black text-[#ffc400]">
                            {estado.nome} ({estado.uf})
                          </h3>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {estado.cidades.map((cidade) => {
                              const chave = chaveCidade(estado.uf, cidade)
                              const ativo = cidadesSelecionadas.includes(chave)

                              return (
                                <button
                                  key={chave}
                                  type="button"
                                  onClick={() => alternarCidade(estado.uf, cidade)}
                                  className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-black transition ${
                                    ativo
                                      ? "border-[#ffc400]/60 bg-[#ffc400] text-black"
                                      : "border-white/10 bg-[#10171b] text-white/70"
                                  }`}
                                >
                                  <span>{cidade}</span>
                                  {ativo && <Check size={15} />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1014] p-4">
                    <p className="font-black text-[#ffc400]">Adicionar cidade manual</p>
                    <p className="mt-1 text-sm text-white/50">
                      Use quando a cidade não aparecer na lista.
                    </p>

                    <div className="mt-4 grid grid-cols-[90px_1fr] gap-2">
                      <select
                        value={estadoCidadeManual}
                        onChange={(evento) => setEstadoCidadeManual(evento.target.value)}
                        className="h-12 rounded-xl border border-white/10 bg-[#10171b] px-3 text-sm font-black text-white outline-none"
                      >
                        {estadosBrasil.map((estado) => (
                          <option key={estado.uf} value={estado.uf}>
                            {estado.uf}
                          </option>
                        ))}
                      </select>

                      <input
                        value={cidadeManual}
                        onChange={(evento) => setCidadeManual(evento.target.value)}
                        placeholder="Nome da cidade"
                        className="h-12 rounded-xl border border-white/10 bg-[#10171b] px-3 text-sm font-black text-white outline-none placeholder:text-white/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={adicionarCidadeManual}
                      className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#ffc400]/30 bg-[#ffc400]/10 font-black text-[#ffc400]"
                    >
                      <Plus size={18} />
                      Adicionar cidade
                    </button>
                  </div>

                  {cidadesSelecionadas.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="mb-3 font-black text-[#ffc400]">Cidades selecionadas</p>

                      <div className="space-y-2">
                        {cidadesSelecionadas.map((regiao) => (
                          <div
                            key={regiao}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#10171b] px-3 py-2"
                          >
                            <span className="text-sm font-bold">{formatarRegiaoSalva(regiao)}</span>

                            <button
                              type="button"
                              onClick={() => setCidadesSelecionadas((lista) => lista.filter((item) => item !== regiao))}
                              className="text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                  <Bell size={26} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Notificações</h2>
                  <p className="mt-1 text-sm text-white/60">
                    Alertas no dia do agendamento e perto do horário.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <SwitchOpcao
                  titulo="Avisar no dia do agendamento"
                  texto="Quando chegar o dia da entrega aceita, o app mostra um alerta."
                  ativo={notificacaoAgendamento}
                  onClick={() => setNotificacaoAgendamento((valor) => !valor)}
                />

                <SwitchOpcao
                  titulo="Avisar perto do horário"
                  texto="Quando estiver próximo do horário agendado, o app mostra outro alerta."
                  ativo={notificacaoPertoHorario}
                  onClick={() => setNotificacaoPertoHorario((valor) => !valor)}
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
                  <MessageCircle size={26} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black">Suporte</h2>
                  <p className="mt-1 text-sm text-white/60">
                    WhatsApp do suporte FlatAuto. Por enquanto pode ficar sem número.
                  </p>
                </div>
              </div>

              <label className="mt-5 block rounded-2xl border border-white/10 bg-[#0b1014] p-4">
                <p className="text-xs font-black uppercase text-white/45">
                  WhatsApp do suporte
                </p>

                <input
                  value={suporteWhatsapp}
                  onChange={(evento) => setSuporteWhatsapp(evento.target.value)}
                  placeholder="Sem número por enquanto"
                  className="mt-1 w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-white/25"
                />
              </label>

              <button
                type="button"
                onClick={abrirSuporte}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 font-black text-green-300"
              >
                <MessageCircle size={20} />
                Abrir suporte WhatsApp
              </button>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[#10171b] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 text-[#ffc400]" size={22} />
                <div>
                  <h3 className="font-black">Lógica das corridas por região</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    Estados e cidades ficam salvos em `motoristas.regioes_atuacao`. Depois as telas de Corridas e Agendamentos usam essa lista para mostrar apenas fretes que combinam com origem ou destino.
                  </p>
                </div>
              </div>
            </section>

            <button
              type="button"
              onClick={salvarConfiguracoes}
              disabled={salvando}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] text-base font-black text-black disabled:opacity-60"
            >
              <Save size={20} />
              {salvando ? "Salvando..." : "Salvar configurações"}
            </button>
          </>
        )}
      </div>
    </main>
  )
}

function SwitchOpcao({
  titulo,
  texto,
  ativo,
  onClick,
}: {
  titulo: string
  texto: string
  ativo: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        ativo
          ? "border-[#ffc400]/50 bg-[#ffc400]/10"
          : "border-white/10 bg-[#0b1014]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">{titulo}</p>
          <p className="mt-1 text-sm text-white/60">{texto}</p>
        </div>

        <span
          className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${
            ativo ? "bg-[#ffc400]" : "bg-white/10"
          }`}
        >
          <span
            className={`h-6 w-6 rounded-full bg-white transition ${
              ativo ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </span>
      </div>
    </button>
  )
}
