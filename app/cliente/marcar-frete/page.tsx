"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { supabase } from "../../../lib/supabase"

type TipoEndereco = "origem" | "destino"

function somenteNumeros(valor: string) {
  return valor.replace(/[^0-9]/g, "")
}

function formatarCep(valor: string) {
  const numeros = somenteNumeros(valor).slice(0, 8)
  if (numeros.length <= 5) return numeros
  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
}

function montarEnderecoViaCep(dados: ViaCepResposta) {
  return [dados.logradouro, dados.bairro, dados.localidade, dados.uf].filter(Boolean).join(", ")
}

function codigoFrete() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

function numeroCampo(valor: string) {
  const limpo = String(valor || "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".")
    .trim()

  const numero = Number(limpo)
  return Number.isNaN(numero) ? null : numero
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function calcularPrecoFrete(tipoTransporte: string, origem: string, destino: string, peso: string) {
  if (!tipoTransporte || !origem.trim() || !destino.trim()) return 0

  const basePorVeiculo: Record<string, number> = {
    Motoboy: 28,
    "Carro utilitário": 45,
    "Fiorino / pequeno utilitário": 75,
    Van: 120,
    VUC: 180,
    "Caminhão pequeno": 250,
    "Caminhão médio": 360,
  }

  const base = basePorVeiculo[tipoTransporte] || 80
  const pesoNumero = numeroCampo(peso) || 0
  const adicionalPeso = pesoNumero > 0 ? Math.min(pesoNumero * 0.08, 180) : 0

  const textoRota = `${origem} ${destino}`.toLowerCase()
  const intermunicipal =
    textoRota.includes("joão pessoa") ||
    textoRota.includes("joao pessoa") ||
    textoRota.includes("caruaru") ||
    textoRota.includes("petrolina") ||
    textoRota.includes("maceió") ||
    textoRota.includes("maceio")

  const adicionalRota = intermunicipal ? 180 : 45

  return Math.round(base + adicionalPeso + adicionalRota)
}

function dataHojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function dataAmanhaISO() {
  const data = new Date()
  data.setDate(data.getDate() + 1)
  return data.toISOString().slice(0, 10)
}

function formatarDataBR(valorISO: string) {
  if (!valorISO) return ""
  const partes = valorISO.split("-")
  if (partes.length !== 3) return valorISO
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function dataBRparaISO(valorBR: string) {
  const numeros = somenteNumeros(valorBR).slice(0, 8)
  if (numeros.length !== 8) return ""

  const dia = numeros.slice(0, 2)
  const mes = numeros.slice(2, 4)
  const ano = numeros.slice(4, 8)

  return `${ano}-${mes}-${dia}`
}

function mascaraDataBR(valor: string) {
  const numeros = somenteNumeros(valor).slice(0, 8)
  if (numeros.length <= 2) return numeros
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
}

type SugestaoLocalizacao = {
  display_name?: string
  lat?: string
  lon?: string
}

type ViaCepResposta = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export default function MarcarFrete() {
  const [segundaParada, setSegundaParada] = useState(false)

  const [localSaida, setLocalSaida] = useState("")
  const [cepOrigem, setCepOrigem] = useState("")

  const [destinoFinal, setDestinoFinal] = useState("")
  const [cepDestino, setCepDestino] = useState("")
  const [segundaParadaEndereco, setSegundaParadaEndereco] = useState("")

  const [dataColeta, setDataColeta] = useState("")
  const [dataEntrega, setDataEntrega] = useState("")
  const [dataColetaBR, setDataColetaBR] = useState("")
  const [dataEntregaBR, setDataEntregaBR] = useState("")
  const [modoHorario, setModoHorario] = useState<"agora" | "agendar">("agora")
  const [horarioColeta, setHorarioColeta] = useState("")
  const [peso, setPeso] = useState("")
  const [altura, setAltura] = useState("")
  const [largura, setLargura] = useState("")
  const [comprimento, setComprimento] = useState("")
  const [tipoCarga, setTipoCarga] = useState("")
  const [tipoTransporte, setTipoTransporte] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const inputNotaRef = useRef<HTMLInputElement | null>(null)
  const [arquivoNota, setArquivoNota] = useState<File | null>(null)
  const [lendoNota, setLendoNota] = useState(false)
  const [textoNota, setTextoNota] = useState("")
  const [notaAprovada, setNotaAprovada] = useState(false)

  const [sugestoesOrigem, setSugestoesOrigem] = useState<SugestaoLocalizacao[]>([])
  const [sugestoesDestino, setSugestoesDestino] = useState<SugestaoLocalizacao[]>([])

  const [carregandoOrigem, setCarregandoOrigem] = useState(false)
  const [carregandoDestino, setCarregandoDestino] = useState(false)

  const [latitudeOrigem, setLatitudeOrigem] = useState("")
  const [longitudeOrigem, setLongitudeOrigem] = useState("")
  const [latitudeDestino, setLatitudeDestino] = useState("")
  const [longitudeDestino, setLongitudeDestino] = useState("")

  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  async function buscarCep(cepDigitado: string, tipo: TipoEndereco) {
    const cepLimpo = somenteNumeros(cepDigitado)

    if (cepLimpo.length !== 8) return

    try {
      if (tipo === "origem") {
        setCarregandoOrigem(true)
      } else {
        setCarregandoDestino(true)
      }

      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = (await resposta.json()) as ViaCepResposta

      if (!resposta.ok || dados.erro) {
        alert("CEP não encontrado. Confira o número e tente novamente.")
        return
      }

      const enderecoCompleto = montarEnderecoViaCep(dados)
      const cepFormatado = formatarCep(dados.cep || cepLimpo)

      if (tipo === "origem") {
        setCepOrigem(cepFormatado)
        setLocalSaida(enderecoCompleto)
        setSugestoesOrigem([])
      } else {
        setCepDestino(cepFormatado)
        setDestinoFinal(enderecoCompleto)
        setSugestoesDestino([])
      }
    } catch (erro) {
      console.error("Erro ao buscar CEP:", erro)
      alert("Erro ao buscar CEP. Tente novamente.")
    } finally {
      setCarregandoOrigem(false)
      setCarregandoDestino(false)
    }
  }

  async function buscarEndereco(valor: string, tipo: TipoEndereco) {
    if (tipo === "origem") {
      setLocalSaida(valor)
    } else {
      setDestinoFinal(valor)
    }

    const numeros = somenteNumeros(valor)

    if (numeros.length === 8 && valor.length <= 9) {
      await buscarCep(valor, tipo)
      return
    }

    if (valor.length < 3) {
      if (tipo === "origem") {
        setSugestoesOrigem([])
      } else {
        setSugestoesDestino([])
      }

      return
    }

    try {
      if (tipo === "origem") {
        setCarregandoOrigem(true)
      } else {
        setCarregandoDestino(true)
      }

      const resposta = await fetch(`/api/localizacao?q=${encodeURIComponent(valor)}`)
      const dados = await resposta.json()

      if (tipo === "origem") {
        setSugestoesOrigem(dados || [])
      } else {
        setSugestoesDestino(dados || [])
      }
    } catch (erro) {
      console.error("Erro localização:", erro)
    } finally {
      setCarregandoOrigem(false)
      setCarregandoDestino(false)
    }
  }

  function selecionarSugestao(item: SugestaoLocalizacao, tipo: TipoEndereco) {
    if (tipo === "origem") {
      setLocalSaida(item.display_name || "")
      setLatitudeOrigem(item.lat || "")
      setLongitudeOrigem(item.lon || "")
      setSugestoesOrigem([])
    } else {
      setDestinoFinal(item.display_name || "")
      setLatitudeDestino(item.lat || "")
      setLongitudeDestino(item.lon || "")
      setSugestoesDestino([])
    }
  }

  async function alterarCep(valor: string, tipo: TipoEndereco) {
    const cepFormatado = formatarCep(valor)

    if (tipo === "origem") {
      setCepOrigem(cepFormatado)
    } else {
      setCepDestino(cepFormatado)
    }

    if (somenteNumeros(cepFormatado).length === 8) {
      await buscarCep(cepFormatado, tipo)
    }
  }

  async function lerNotaFiscal(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    setArquivoNota(arquivo)
    setLendoNota(true)
    setTextoNota("")
    setNotaAprovada(false)

    try {
      const formData = new FormData()
      formData.append("arquivo", arquivo)

      const resposta = await fetch(`${window.location.origin}/api/ler-nota`, {
        method: "POST",
        body: formData,
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        console.error("ERRO DO BACKEND:", dados)
        alert(dados.erro || "Erro ao ler a nota fiscal.")
        return
      }

      setLocalSaida(dados.localSaida || "")
      setCepOrigem(dados.cepOrigem ? formatarCep(dados.cepOrigem) : "")
      setDestinoFinal(dados.destinoFinal || "")
      setCepDestino(dados.cepDestino ? formatarCep(dados.cepDestino) : "")
      setTextoNota(dados.textoEncontrado || "")
    } catch (error) {
      console.error("ERRO COMPLETO AO LER NOTA:", error)
      alert("Erro ao conectar com o backend da nota fiscal. Veja o console/terminal.")
    } finally {
      setLendoNota(false)
    }
  }

  function aprovarNotaFiscal() {
    setNotaAprovada(true)
  }

  function apagarDadosNotaFiscal() {
    setArquivoNota(null)
    setLendoNota(false)
    setTextoNota("")
    setNotaAprovada(false)

    setLocalSaida("")
    setCepOrigem("")
    setDestinoFinal("")
    setCepDestino("")

    setLatitudeOrigem("")
    setLongitudeOrigem("")
    setLatitudeDestino("")
    setLongitudeDestino("")

    setSugestoesOrigem([])
    setSugestoesDestino([])

    if (inputNotaRef.current) {
      inputNotaRef.current.value = ""
    }
  }

  function escolherDataColeta(valorISO: string) {
    setDataColeta(valorISO)
    setDataColetaBR(formatarDataBR(valorISO))
  }

  function escolherDataEntrega(valorISO: string) {
    setDataEntrega(valorISO)
    setDataEntregaBR(formatarDataBR(valorISO))
  }

  function digitarDataColeta(valorBR: string) {
    const mascarada = mascaraDataBR(valorBR)
    setDataColetaBR(mascarada)

    const iso = dataBRparaISO(mascarada)
    if (iso) setDataColeta(iso)
  }

  function digitarDataEntrega(valorBR: string) {
    const mascarada = mascaraDataBR(valorBR)
    setDataEntregaBR(mascarada)

    const iso = dataBRparaISO(mascarada)
    if (iso) setDataEntrega(iso)
  }

  async function solicitarEntrega() {
    if (salvando) return

    setMensagem("")

    const clienteId = localStorage.getItem("flatauto_cliente_id")

    if (!clienteId) {
      setMensagem("Cliente não encontrado no login. Saia e entre novamente.")
      return
    }

    if (!localSaida.trim() || !destinoFinal.trim()) {
      setMensagem("Preencha origem e destino.")
      return
    }

    if (!dataColeta) {
      setMensagem("Escolha quando será a coleta.")
      return
    }

    if (!tipoCarga || !tipoTransporte) {
      setMensagem("Informe o tipo da carga e o tipo de transporte.")
      return
    }

    if (modoHorario === "agendar" && !horarioColeta) {
      setMensagem("Escolha o horário da coleta.")
      return
    }

    setSalvando(true)

    const alturaNumero = numeroCampo(altura)
    const larguraNumero = numeroCampo(largura)
    const comprimentoNumero = numeroCampo(comprimento)

    const cubagem =
      alturaNumero && larguraNumero && comprimentoNumero
        ? alturaNumero * larguraNumero * comprimentoNumero
        : null

    const descricaoCarga = [
      tipoCarga,
      segundaParada && segundaParadaEndereco ? `Segunda parada: ${segundaParadaEndereco}` : "",
      observacoes ? `Observação: ${observacoes}` : "",
      arquivoNota ? `Nota: ${arquivoNota.name}` : "",
    ]
      .filter(Boolean)
      .join(" | ")

    const payload = {
      cliente_id: clienteId,
      motorista_id: null,
      empresa_id: null,
      codigo: codigoFrete(),
      origem: localSaida.trim(),
      destino: destinoFinal.trim(),
      endereco_origem: localSaida.trim(),
      endereco_destino: destinoFinal.trim(),
      cep_origem: cepOrigem || null,
      cep_destino: cepDestino || null,
      descricao_carga: descricaoCarga || tipoCarga,
      peso: numeroCampo(peso),
      altura: alturaNumero,
      largura: larguraNumero,
      comprimento: comprimentoNumero,
      cubagem,
      valor: precoEstimado > 0 ? formatarMoeda(precoEstimado) : "A calcular",
      valor_frete: precoEstimado,
      tipo_carga: tipoCarga,
      tipo_transporte: tipoTransporte,
      status: modoHorario === "agora" ? "Aguardando" : "Agendado",
      data_frete: dataColeta,
      data_entrega: dataEntrega || dataColeta,
      horario: modoHorario === "agora" ? "Agora" : horarioColeta,
      observacoes: observacoes || null,
    }

    const { data, error } = await supabase
      .from("fretes")
      .insert(payload as any)
      .select("*")
      .maybeSingle()

    setSalvando(false)

    if (error) {
      setMensagem(`Erro Supabase: ${error.message}`)
      return
    }

    if (!data) {
      setMensagem("Não foi possível confirmar o frete no Supabase.")
      return
    }

    setMensagem("Entrega solicitada e salva no Supabase. Agora ela aparece para motoristas da região.")

    setTimeout(() => {
      window.location.replace("/cliente/meus-fretes")
    }, 900)
  }

  const precoEstimado = calcularPrecoFrete(tipoTransporte, localSaida, destinoFinal, peso)
  const motoristaRecebe = Math.round(precoEstimado * 0.8)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-7">
        <header className="flex items-center justify-between">
          <button onClick={voltarPainel} className="text-[18px] font-bold text-[#ffc400]">
            ← Voltar
          </button>
          <h1 className="text-[22px] font-black">Solicitar entrega</h1>
          <div className="w-[62px]" />
        </header>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-5">
          <h2 className="text-[28px] font-black leading-tight">Nova solicitação</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/55">
            Digite origem, destino, escolha solicitar agora ou marque um horário para a coleta.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
            <label className="mb-3 block text-[15px] font-bold text-white/80">Importar nota fiscal</label>

            <div className="flex min-h-[86px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#ffc400]/35 bg-black px-4 py-5 text-center">
              <p className="text-[15px] font-bold text-[#ffc400]">
                {lendoNota ? "Lendo nota fiscal..." : "Selecionar arquivo da nota"}
              </p>

              <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                Envie a nota fiscal. O sistema vai tentar puxar CEP, origem e destino automaticamente.
              </p>

              {lendoNota && (
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full animate-pulse rounded-full bg-[#ffc400]" />
                </div>
              )}

              <input
                ref={inputNotaRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={lerNotaFiscal}
                className="mt-4 w-full cursor-pointer rounded-[14px] border border-white/10 bg-[#080808] px-3 py-3 text-[13px] text-white file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#ffc400] file:px-3 file:py-2 file:font-bold file:text-black"
              />
            </div>

            {(lendoNota || arquivoNota || textoNota) && (
              <div className="mt-4 rounded-[18px] border border-[#ffc400]/25 bg-[#050505] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-black uppercase text-[#ffc400]">
                      Conferência da nota fiscal
                    </p>

                    <p className="mt-2 break-all text-[13px] font-black text-white">
                      {arquivoNota?.name || "Nota fiscal selecionada"}
                    </p>

                    <p className="mt-2 text-[12px] leading-relaxed text-white/55">
                      {lendoNota
                        ? "Lendo nota fiscal e tentando encontrar origem, destino e CEPs..."
                        : notaAprovada
                          ? "Nota aprovada. Os dados serão mantidos para solicitar a entrega."
                          : "Endereços encontrados. Confira se está tudo certo antes de solicitar."}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={apagarDadosNotaFiscal}
                      disabled={lendoNota}
                      title="Apagar tudo"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/60 bg-red-500/10 text-2xl font-black text-red-400 disabled:opacity-50"
                    >
                      ×
                    </button>

                    <button
                      type="button"
                      onClick={aprovarNotaFiscal}
                      disabled={lendoNota}
                      title="Aprovar dados"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/60 bg-green-500/10 text-2xl font-black text-green-400 disabled:opacity-50"
                    >
                      ✓
                    </button>
                  </div>
                </div>

                {(localSaida || destinoFinal) && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-[14px] border border-white/10 bg-black/40 p-3">
                      <p className="text-[11px] font-black uppercase text-white/45">Origem</p>
                      <p className="mt-2 text-[13px] font-black leading-relaxed text-white">
                        {localSaida || "Não identificada"}
                      </p>
                      {cepOrigem && (
                        <p className="mt-2 text-[12px] font-bold text-[#ffc400]">CEP: {cepOrigem}</p>
                      )}
                    </div>

                    <div className="rounded-[14px] border border-white/10 bg-black/40 p-3">
                      <p className="text-[11px] font-black uppercase text-white/45">Destino</p>
                      <p className="mt-2 text-[13px] font-black leading-relaxed text-white">
                        {destinoFinal || "Não identificado"}
                      </p>
                      {cepDestino && (
                        <p className="mt-2 text-[12px] font-bold text-[#ffc400]">CEP: {cepDestino}</p>
                      )}
                    </div>
                  </div>
                )}

                {textoNota && (
                  <details className="mt-3 rounded-[14px] border border-white/10 bg-black/40 p-3">
                    <summary className="cursor-pointer text-[12px] font-black text-[#ffc400]">
                      Ver texto lido da nota
                    </summary>
                    <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed text-white/55">
                      {textoNota}
                    </p>
                  </details>
                )}
              </div>
            )}
          </div>

          <div>
            <Campo
              label="Origem"
              placeholder="Digite CEP ou endereço de origem"
              value={localSaida}
              onChange={(valor) => buscarEndereco(valor, "origem")}
            />

            {carregandoOrigem && (
              <p className="mt-2 text-sm font-bold text-[#ffc400]">Buscando origem...</p>
            )}

            {sugestoesOrigem.length > 0 && (
              <Sugestoes
                sugestoes={sugestoesOrigem}
                onSelecionar={(item) => selecionarSugestao(item, "origem")}
              />
            )}
          </div>

          <Campo
            label="CEP de origem"
            placeholder="Digite somente o CEP de origem"
            value={cepOrigem}
            onChange={(valor) => alterarCep(valor, "origem")}
          />

          <div>
            <Campo
              label="Destino"
              placeholder="Digite CEP ou endereço de destino"
              value={destinoFinal}
              onChange={(valor) => buscarEndereco(valor, "destino")}
            />

            {carregandoDestino && (
              <p className="mt-2 text-sm font-bold text-[#ffc400]">Buscando destino...</p>
            )}

            {sugestoesDestino.length > 0 && (
              <Sugestoes
                sugestoes={sugestoesDestino}
                onSelecionar={(item) => selecionarSugestao(item, "destino")}
              />
            )}
          </div>

          <Campo
            label="CEP de destino"
            placeholder="Digite somente o CEP de destino"
            value={cepDestino}
            onChange={(valor) => alterarCep(valor, "destino")}
          />

          <button
            type="button"
            onClick={() => setSegundaParada(!segundaParada)}
            className="w-full rounded-[20px] border border-[#ffc400]/35 bg-[#ffc400]/10 px-4 py-4 text-left font-bold text-[#ffc400]"
          >
            {segundaParada ? "− Remover segunda parada" : "+ Adicionar segunda parada"}
          </button>

          {segundaParada && (
            <Campo
              label="Segunda parada"
              placeholder="Digite CEP ou endereço da parada"
              value={segundaParadaEndereco}
              onChange={setSegundaParadaEndereco}
            />
          )}

          <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
            <label className="mb-3 block text-[15px] font-bold text-white/80">
              Quando quer coletar?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => escolherDataColeta(dataHojeISO())}
                className={`h-12 rounded-[16px] border font-black ${
                  dataColeta === dataHojeISO()
                    ? "border-[#ffc400] bg-[#ffc400] text-black"
                    : "border-white/10 bg-black text-white/70"
                }`}
              >
                Hoje
              </button>

              <button
                type="button"
                onClick={() => escolherDataColeta(dataAmanhaISO())}
                className={`h-12 rounded-[16px] border font-black ${
                  dataColeta === dataAmanhaISO()
                    ? "border-[#ffc400] bg-[#ffc400] text-black"
                    : "border-white/10 bg-black text-white/70"
                }`}
              >
                Amanhã
              </button>
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={dataColetaBR}
              onChange={(event) => digitarDataColeta(event.target.value)}
              placeholder="DD/MM/AAAA"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setModoHorario("agora")
                  setHorarioColeta("")
                  if (!dataColeta) escolherDataColeta(dataHojeISO())
                }}
                className={`h-12 rounded-[16px] border font-black ${
                  modoHorario === "agora"
                    ? "border-[#ffc400] bg-[#ffc400] text-black"
                    : "border-white/10 bg-black text-white/70"
                }`}
              >
                Solicitar agora
              </button>

              <button
                type="button"
                onClick={() => setModoHorario("agendar")}
                className={`h-12 rounded-[16px] border font-black ${
                  modoHorario === "agendar"
                    ? "border-[#ffc400] bg-[#ffc400] text-black"
                    : "border-white/10 bg-black text-white/70"
                }`}
              >
                Marcar horário
              </button>
            </div>

            {modoHorario === "agendar" && (
              <div className="mt-3">
                <label className="mb-2 block text-[13px] font-black uppercase text-white/45">
                  Horário da coleta
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 14:55"
                  value={horarioColeta}
                  onChange={(event) => {
                    let valor = event.target.value.replace(/[^0-9]/g, "").slice(0,4)

                    if (valor.length > 2) {
                      valor = valor.slice(0,2) + ":" + valor.slice(2)
                    }

                    setHorarioColeta(valor)
                  }}
                  className="h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
                />

                <p className="mt-2 text-xs font-bold text-white/45">
                  Digite no formato 24 horas (ex.: 08:30, 14:55 ou 20:10).
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
            <label className="mb-3 block text-[15px] font-bold text-white/80">
              Entrega prevista
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => escolherDataEntrega(dataColeta || dataHojeISO())}
                className="h-12 rounded-[16px] border border-[#ffc400]/35 bg-[#ffc400]/10 font-black text-[#ffc400]"
              >
                Mesmo dia
              </button>

              <button
                type="button"
                onClick={() => escolherDataEntrega(dataAmanhaISO())}
                className="h-12 rounded-[16px] border border-white/10 bg-black font-black text-white/70"
              >
                Próximo dia
              </button>
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={dataEntregaBR}
              onChange={(event) => digitarDataEntrega(event.target.value)}
              placeholder="DD/MM/AAAA"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
            />
          </div>

          <Campo label="Peso aproximado" placeholder="Ex: 800 kg" value={peso} onChange={setPeso} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Campo label="Altura" placeholder="Ex: 1,80 m" value={altura} onChange={setAltura} />
            <Campo label="Largura" placeholder="Ex: 1,20 m" value={largura} onChange={setLargura} />
            <Campo label="Comprimento" placeholder="Ex: 2,50 m" value={comprimento} onChange={setComprimento} />
          </div>

          <SelectCampo
            label="Tipo da carga"
            placeholder="Selecione o tipo de carga"
            value={tipoCarga}
            onChange={setTipoCarga}
            options={[
              "Móveis",
              "Caixas",
              "Material de obra",
              "Eletrodomésticos",
              "Mercadorias",
              "Carga frágil",
              "Outros",
            ]}
          />

          <SelectCampo
            label="Tipo de transporte"
            placeholder="Selecione o tipo de transporte"
            value={tipoTransporte}
            onChange={setTipoTransporte}
            options={[
              "Motoboy",
              "Carro utilitário",
              "Fiorino / pequeno utilitário",
              "Van",
              "VUC",
              "Caminhão pequeno",
              "Caminhão médio",
            ]}
          />

          {precoEstimado > 0 && (
            <div className="rounded-[24px] border border-[#ffc400]/30 bg-[#ffc400]/10 p-5">
              <p className="text-xs font-black uppercase text-[#ffc400]">
                Preço estimado
              </p>

              <h3 className="mt-2 text-3xl font-black text-[#ffc400]">
                {formatarMoeda(precoEstimado)}
              </h3>

              <p className="mt-2 text-sm font-bold text-white/65">
                Motorista recebe aproximadamente {formatarMoeda(motoristaRecebe)}.
              </p>

              <p className="mt-2 text-xs leading-relaxed text-white/45">
                O valor é calculado pelo tipo de veículo, rota e peso informado. Depois podemos trocar por cálculo real com distância do mapa.
              </p>
            </div>
          )}

          <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
            <label className="mb-3 block text-[15px] font-bold text-white/80">Observações</label>
            <textarea
              value={observacoes}
              onChange={(event) => setObservacoes(event.target.value)}
              placeholder="Ex: carga frágil, precisa de ajudante, condomínio..."
              className="min-h-[96px] w-full resize-none rounded-[16px] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
            />
          </div>
        </section>

        {mensagem && (
          <p className="mt-5 text-center text-sm font-black text-[#ffc400]">
            {mensagem}
          </p>
        )}

        <button
          type="button"
          onClick={solicitarEntrega}
          disabled={salvando}
          className="mt-8 h-[58px] w-full rounded-[20px] bg-[#ffc400] text-[18px] font-black text-black disabled:opacity-60"
        >
          {salvando ? "Salvando no Supabase..." : "Solicitar entrega"}
        </button>
      </div>
    </main>
  )
}

function Sugestoes({
  sugestoes,
  onSelecionar,
}: {
  sugestoes: SugestaoLocalizacao[]
  onSelecionar: (item: SugestaoLocalizacao) => void
}) {
  return (
    <div className="mt-2 overflow-hidden rounded-[18px] border border-[#ffc400]/25 bg-[#080808]">
      {sugestoes.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelecionar(item)}
          className="w-full border-b border-white/10 px-4 py-3 text-left text-sm text-white/80 last:border-b-0"
        >
          📍 {item.display_name}
        </button>
      ))}
    </div>
  )
}

function Campo({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (valor: string) => void
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
      <label className="mb-3 block text-[15px] font-bold text-white/80">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
      />
    </div>
  )
}

function SelectCampo({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (valor: string) => void
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
      <label className="mb-3 block text-[15px] font-bold text-white/80">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none focus:border-[#ffc400]/60"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-black text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
