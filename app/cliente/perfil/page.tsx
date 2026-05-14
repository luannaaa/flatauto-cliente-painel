"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function PerfilPage() {
  const router = useRouter()
  const [foto, setFoto] = useState("/foto_perfil_cadastro.png")

  function trocarFoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setFoto(URL.createObjectURL(file))
  }

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px]">
        <button onClick={() => router.push("/cliente")} className="font-bold text-[#ffc400]">← Voltar</button>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6 text-center">
          <label className="mx-auto block h-[110px] w-[110px] cursor-pointer overflow-hidden rounded-full border-4 border-[#ffc400] bg-[#ffc400]/15 p-1">
            <Image src={foto} alt="Perfil" width={110} height={110} className="h-full w-full rounded-full object-cover" />
            <input type="file" accept="image/*" onChange={trocarFoto} className="hidden" />
          </label>

          <p className="mt-3 text-sm font-bold text-[#ffc400]">Trocar foto</p>
          <h1 className="mt-5 text-[30px] font-black">Perfil do cliente</h1>

          <div className="mt-6 space-y-4 text-left">
            <Campo label="Nome" value="Cliente FlatAuto" />
            <Campo label="E-mail" value="cliente@email.com" />
            <Campo label="Telefone" value="(00) 00000-0000" />
          </div>
        </section>
      </div>
    </main>
  )
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black p-4">
      <p className="text-sm font-bold text-white/45">{label}</p>
      <p className="mt-1 text-[16px] font-bold text-white">{value}</p>
    </div>
  )
}
