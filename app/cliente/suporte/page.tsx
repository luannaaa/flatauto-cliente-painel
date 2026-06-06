"use client"

import { FaWhatsapp } from "react-icons/fa"

export default function Page() {
  function abrirWhatsapp() {
    window.open("https://wa.me/5511950509391", "_blank")
  }

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px]">

        <button
          onClick={() => window.location.href = "/cliente"}
          className="font-bold text-[#ffc400]"
        >
          ← Voltar
        </button>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <h1 className="text-[32px] font-black text-[#ffc400]">Ajuda</h1>

          <p className="mt-3 text-white/60">
            Precisa de ajuda? Fale com nossa equipe.
          </p>

          <button
            onClick={abrirWhatsapp}
            className="mt-6 w-full rounded-[22px] border-2 border-green-500 bg-green-500/10 p-5 text-left transition hover:bg-green-500/20"
          >
            <div className="flex items-center gap-4">
              <FaWhatsapp className="text-[38px] text-green-500" />

              <div>
                <h2 className="font-black text-green-500">
                  Central de Ajuda
                </h2>

                <p className="text-white">
                  +55 11 95050-9391
                </p>
              </div>
            </div>
          </button>

          <div className="mt-4 w-full rounded-[22px] border-2 border-green-500 bg-green-500/10 p-5">
            <div className="flex items-center gap-4">
              <FaWhatsapp className="text-[38px] text-green-500" />

              <div>
                <h2 className="font-black text-green-500">
                  Motorista
                </h2>

                <p className="text-white/70">
                  Aguardando corrida
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
