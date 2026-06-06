"use client"

import { useEffect } from "react"

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

export default function Page() {
  useVoltarCelularParaPainel()

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px]">
        <button onClick={voltarPainel} className="font-bold text-[#ffc400]">← Voltar</button>
        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <h1 className="text-[32px] font-black text-[#ffc400]">Minhas viagens</h1>
          <p className="mt-3 text-white/60">Aqui o cliente vai acompanhar todas as viagens solicitadas.</p>
        </section>
      </div>
    </main>
  )
}
