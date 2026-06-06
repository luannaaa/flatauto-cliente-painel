"use client"

import { useEffect, useState } from "react"

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

  function voltarPainel() {
    window.location.replace("/cliente")
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
          <Campo label="Local de saída" placeholder="Digite o endereço de origem" />
          <Campo label="CEP de origem" placeholder="Digite o CEP de origem" />
          <Campo label="Destino final" placeholder="Digite o endereço de entrega" />
          <Campo label="CEP de destino" placeholder="Digite o CEP de destino" />

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
              <p className="text-[15px] font-bold text-[#ffc400]">Selecionar arquivo da nota</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                Envie a nota fiscal em PDF ou imagem. A leitura automática dos dados será conectada depois.
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-4 w-full cursor-pointer rounded-[14px] border border-white/10 bg-[#080808] px-3 py-3 text-[13px] text-white file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#ffc400] file:px-3 file:py-2 file:font-bold file:text-black"
              />
            </div>
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

function Campo({ label, placeholder = "", type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#080808] p-4">
      <label className="mb-3 block text-[15px] font-bold text-white/80">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="h-[52px] w-full rounded-[16px] border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35 focus:border-[#ffc400]/60"
      />
    </div>
  )
}
