"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"

type Tema = "dark" | "light"

export default function ConfiguracõesPage() {
  const [tema, setTema] = useState<Tema>("dark")

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEmpresa") as Tema | null
    if (temaSalvo === "dark" || temaSalvo === "light") setTema(temaSalvo)
  }, [])

  const claro = tema === "light"
  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro ? "border-[#dfd0a5] bg-white/90 shadow" : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  return (
    <main className={`min-h-screen px-6 py-6 ${ui.pagina}`}>
      <section className={`rounded-[30px] border p-8 ${ui.card}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
          <Settings size={34} />
        </div>
        <h1 className="mt-6 text-3xl font-black">Configurações</h1>
        <p className={`mt-2 max-w-[620px] text-sm ${ui.textoFraco}`}>Ajustes da área empresa.</p>
        <div className={`mt-8 rounded-2xl border p-5 ${ui.card2}`}>
          <p className="font-bold">Área preparada para o backend</p>
          <p className={`mt-1 text-sm ${ui.textoFraco}`}>Depois essa tela vai puxar os dados do banco e da API.</p>
        </div>
      </section>
    </main>
  )
}
