"use client"

import { useState } from "react"
import { MapPin, Navigation, Clock, Package, Truck, CheckCircle2 } from "lucide-react"
import { freteAoVivo } from "../../data/freteAoVivo"

export default function MapaMotorista() {
  const [aceita, setAceita] = useState(true)

  return (
    <section className="relative h-[calc(100vh-20px)] min-h-[720px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1014] text-white">
      <div className="absolute inset-0 bg-[#dbe8d1]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-[8%] top-[55%] h-[2px] w-[92%] -rotate-8 bg-white" />
          <div className="absolute left-[20%] top-[6%] h-[90%] w-[2px] rotate-6 bg-white" />
          <div className="absolute left-[58%] top-[0] h-[100%] w-[2px] -rotate-8 bg-white" />
          <div className="absolute left-[28%] top-[70%] h-[2px] w-[70%] rotate-5 bg-white" />
        </div>

        <div className="absolute left-[18%] top-[36%] h-20 w-28 rounded-3xl bg-green-400/25" />
        <div className="absolute right-[10%] top-[18%] h-24 w-32 rounded-3xl bg-green-400/25" />
        <div className="absolute bottom-[22%] left-[40%] h-28 w-40 rounded-3xl bg-green-400/25" />
        <div className="absolute left-[21%] top-[58%] h-[4px] w-[53%] -rotate-8 rounded-full bg-[#ffc400]" />

        <div className="absolute left-[18%] top-[54%] flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-xl"><MapPin size={20} /></div>
        <div className="absolute left-[44%] top-[49%] flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.55)]"><Truck size={28} /></div>
        <div className="absolute right-[22%] top-[43%] flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-xl"><MapPin size={20} /></div>
      </div>

      <div className="absolute left-4 right-4 top-4 rounded-[24px] border border-white/10 bg-black/75 p-4 backdrop-blur-xl">
        <p className="text-xs font-black uppercase text-[#ffc400]">Mapa do motorista</p>
        <h2 className="mt-1 text-xl font-black">{freteAoVivo.codigo}</h2>
        <p className="mt-1 text-sm text-white/60">{freteAoVivo.ultimaAtualizacao}</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 rounded-[28px] border border-white/10 bg-[#10171b]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-white/40">Entrega ativa</p>
            <h3 className="mt-1 text-2xl font-black">{freteAoVivo.empresa}</h3>
            <p className="mt-1 text-sm font-bold text-[#ffc400]">{freteAoVivo.valor}</p>
          </div>

          <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">{freteAoVivo.statusTexto}</span>
        </div>

        <div className="mt-4 space-y-3">
          <LinhaMapa label="Origem" valor={freteAoVivo.origem} cor="text-green-400" />
          <LinhaMapa label="Destino" valor={freteAoVivo.destino} cor="text-red-400" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Mini icon={<Clock size={16} />} label="Tempo" valor={freteAoVivo.previsao} />
          <Mini icon={<Navigation size={16} />} label="Distância" valor={freteAoVivo.distancia} />
          <Mini icon={<Package size={16} />} label="Nota" valor={freteAoVivo.notaFiscal.replace("NF-e ", "")} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="h-12 rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10 font-black text-[#ffc400]">Ver rota</button>
          <button onClick={() => setAceita(true)} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#ffc400] font-black text-black">
            <CheckCircle2 size={18} />
            {aceita ? "Em andamento" : "Aceitar"}
          </button>
        </div>
      </div>
    </section>
  )
}

function LinhaMapa({ label, valor, cor }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className={`text-xs font-black uppercase ${cor}`}>{label}</p>
      <p className="mt-1 text-sm font-black text-white">{valor}</p>
    </div>
  )
}

function Mini({ icon, label, valor }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-white/45">{icon}{label}</p>
      <p className="mt-1 text-xs font-black text-[#ffc400]">{valor}</p>
    </div>
  )
}
