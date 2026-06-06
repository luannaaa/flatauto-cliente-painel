"use client"

import { useEffect, useState, type ChangeEvent } from "react"

function useVoltarCelularParaPainel() {
  useEffect(() => {
    window.history.pushState({ telaInternaCliente: true }, "", window.location.href)

    function voltarParaPainel() {
      window.location.replace("/cliente")
    }

    window.addEventListener("popstate", voltarParaPainel)

    return () => {
      window.removeEventListener("popstate", voltarParaPainel)
    }
  }, [])
}

export default function MarcarFrete() {
  useVoltarCelularParaPainel()

  const [segundaParada, setSegundaParada] = useState(false)
  const [localSaida, setLocalSaida] = useState("")
  const [cepOrigem, setCepOrigem] = useState("")
  const [destinoFinal, setDestinoFinal] = useState("")
  const [cepDestino, setCepDestino] = useState("")
  const [lendoNota, setLendoNota] = useState(false)
  const [textoNota, setTextoNota] = useState("")
  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([])
const [carregandoEndereco, setCarregandoEndereco] = useState(false)

const [latitudeOrigem, setLatitudeOrigem] = useState("")
const [longitudeOrigem, setLongitudeOrigem] = useState("")

  function voltarPainel() {
    window.location.replace("/cliente")
  }
  async function buscarEndereco(valor: string) {
  setLocalSaida(valor)

  if (valor.length < 3) {
    setSugestoesOrigem([])
    return
  }

  try {
    setCarregandoEndereco(true)

    const resposta = await fetch(
      `/api/localizacao?q=${encodeURIComponent(valor)}`
    )

    const dados = await resposta.json()

    setSugestoesOrigem(dados || [])
  } catch (erro) {
    console.error("Erro localização:", erro)
  } finally {
    setCarregandoEndereco(false)
  }
}
  async function lerNotaFiscal(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    setLendoNota(true)
    setTextoNota("")

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
      setCepOrigem(dados.cepOrigem || "")
      setDestinoFinal(dados.destinoFinal || "")
      setCepDestino(dados.cepDestino || "")
      setTextoNota(dados.textoEncontrado || "")
    } catch (error) {
      console.error("ERRO COMPLETO AO LER NOTA:", error)
      alert("Erro ao conectar com o backend da nota fiscal. Veja o console/terminal.")
    } finally {
      setLendoNota(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-7">
        <header className="flex items-center justify-between">
          <button onClick={voltarPainel} className="text-[18px] font-bold text-[#ffc400]">
            ← Voltar
          </button>
          <h1 className="text-[22px] font-black">Agendar frete</h1>
          <div className="w-[62px]" />
        </header>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-5">
          <h2 className="text-[28px] font-black leading-tight">Agendar nova entrega</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/55">
            Preencha os dados da entrega para encontrar o frete ideal.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          
  <Campo
    label="Local de saída"
    placeholder="Digite o endereço de origem"
    value={localSaida}
    onChange={buscarEndereco}
  />

  {carregandoEndereco && (
    <p className="mt-2 text-sm font-bold text-[#ffc400]">Buscando endereço...</p>
  )}

  {sugestoesOrigem.length > 0 && (
    <div className="mt-2 overflow-hidden rounded-[18px] border border-[#ffc400]/25 bg-[#080808]">
      {sugestoesOrigem.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => {
            setLocalSaida(item.display_name || "")
            setLatitudeOrigem(item.lat || "")
            setLongitudeOrigem(item.lon || "")
            setSugestoesOrigem([])
          }}
          className="w-full border-b border-white/10 px-4 py-3 text-left text-sm text-white/80 last:border-b-0"
        >
          📍 {item.display_name}
        </button>
      ))}
    </div>
  )}

          <Campo label="CEP de origem" placeholder="Digite o CEP de origem" value={cepOrigem} onChange={setCepOrigem} />
          <Campo label="Destino final" placeholder="Digite o endereço de entrega" value={destinoFinal} onChange={setDestinoFinal} />
          <Campo label="CEP de destino" placeholder="Digite o CEP de destino" value={cepDestino} onChange={setCepDestino} />

          <button
            onClick={() => setSegundaParada(!segundaParada)}
            className="w-full rounded-[20px] border border-[#ffc400]/35 bg-[#ffc400]/10 px-4 py-4 text-left font-bold text-[#ffc400]"
          >
            {segundaParada ? "− Remover segunda parada" : "+ Adicionar segunda parada"}
          </button>

          {segundaParada && <Campo label="Segunda parada" placeholder="Digite o endereço da parada" />}

          <Campo label="Data de coleta" type="date" />
          <Campo label="Data de entrega" type="date" />
          <Campo label="Horário que o caminhão vai chegar" type="time" />
          <Campo label="Horário que o caminhão vai sair" type="time" />
          <Campo label="Peso aproximado" placeholder="Ex: 800 kg" />
          <Campo label="Tipo da carga" placeholder="Ex: móveis, caixas, material de obra" />
          <Campo label="Tipo de caminhão" placeholder="Ex: pequeno, médio, grande" />

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
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={lerNotaFiscal}
                className="mt-4 w-full cursor-pointer rounded-[14px] border border-white/10 bg-[#080808] px-3 py-3 text-[13px] text-white file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#ffc400] file:px-3 file:py-2 file:font-bold file:text-black"
              />
            </div>

            {textoNota && (
              <div className="mt-4 rounded-[16px] border border-[#ffc400]/20 bg-black p-4">
                <p className="text-[13px] font-bold text-[#ffc400]">Texto encontrado na nota:</p>
                <p className="mt-2 max-h-[140px] overflow-auto text-[12px] leading-relaxed text-white/50">
                  {textoNota}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
            <label className="mb-3 block text-[15px] font-bold text-white/80">Observações</label>
            <textarea
              placeholder="Ex: carga frágil, precisa de ajudante, condomínio..."
              className="min-h-[96px] w-full resize-none rounded-[16px] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
            />
          </div>
        </section>

        <button className="mt-8 h-[58px] w-full rounded-[20px] bg-[#ffc400] text-[18px] font-black text-black">
          Agendar frete
        </button>
      </div>
    </main>
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