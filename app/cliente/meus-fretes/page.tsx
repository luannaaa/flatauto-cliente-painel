"use client"

import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px]">
        <button onClick={() => router.push("/cliente")} className="font-bold text-[#ffc400]">← Voltar</button>
        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <h1 className="text-[32px] font-black text-[#ffc400]">Meus fretes</h1>
          <p className="mt-3 text-white/60">Aqui o cliente vai acompanhar todos os fretes solicitados.</p>
        </section>
      </div>
    </main>
  )
}
