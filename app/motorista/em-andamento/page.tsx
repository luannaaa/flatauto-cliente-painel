"use client"

import { ArrowLeft, Bike, Car, Truck, Bus, MapPin, Clock, Package, FileText, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

type Veiculo = "moto" | "carro" | "van" | "caminhao"

function IconeVeiculo({ tipo, size = 28 }: { tipo: Veiculo; size?: number }) {
  if (tipo === "moto") return <Bike size={size} />
  if (tipo === "carro") return <Car size={size} />
  if (tipo === "van") return <Bus size={size} />
  return <Truck size={size} />
}

export default function EmAndamentoPage() {
  const [tipoVeiculo, setTipoVeiculo] = useState<Veiculo>("caminhao")

  useEffect(() => {
    const veiculoSalvo = localStorage.getItem("tipoVeiculoMotorista") as Veiculo | null

    if (
      veiculoSalvo === "moto" ||
      veiculoSalvo === "carro" ||
      veiculoSalvo === "van" ||
      veiculoSalvo === "caminhao"
    ) {
      setTipoVeiculo(veiculoSalvo)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-white/10 bg-[#10171b] px-4">
        <a
          href="/motorista"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <ArrowLeft size={22} />
        </a>

        <div>
          <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
          <h1 className="text-xl font-black">Em andamento</h1>
        </div>
      </header>

      <section className="relative h-[52vh] overflow-hidden bg-[#d9e4d2] pt-16">
        <div className="absolute left-[7%] top-[24%] z-20 rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white">
          Origem
        </div>

        <div className="absolute right-[8%] top-[33%] z-20 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white">
          Destino
        </div>

        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-5%] top-[33%] h-[4px] w-[115%] rotate-[12deg] bg-white/90" />
          <div className="absolute left-[-5%] top-[62%] h-[4px] w-[115%] -rotate-[7deg] bg-white/90" />
          <div className="absolute left-[23%] top-[10%] h-[100%] w-[4px] rotate-[8deg] bg-white/90" />
          <div className="absolute left-[70%] top-[0%] h-[100%] w-[4px] -rotate-[9deg] bg-white/90" />
        </div>

        <div className="absolute left-[18%] top-[38%] h-28 w-40 rounded-[35px] bg-green-500/20" />
        <div className="absolute right-[10%] top-[22%] h-32 w-48 rounded-[35px] bg-green-500/20" />
        <div className="absolute bottom-[8%] left-[35%] h-32 w-52 rounded-[35px] bg-green-500/20" />

        <div className="absolute left-[24%] top-[52%] h-[5px] w-[52%] -rotate-[8deg] rounded-full bg-[#ffc400]" />

        <div className="absolute left-[20%] top-[49%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
          <MapPin size={27} />
        </div>

        <div className="absolute left-[72%] top-[38%] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
          <MapPin size={27} />
        </div>

        <div className="absolute left-[43%] top-[43%] z-30 flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-[#ffc400] text-black shadow-[0_10px_35px_rgba(255,196,0,0.45)]">
          <IconeVeiculo tipo={tipoVeiculo} size={42} />
        </div>
      </section>

      <section className="-mt-5 rounded-t-[34px] bg-[#020507] px-4 pb-8 pt-5">
        <div className="mx-auto max-w-[480px] space-y-4">
          <div className="rounded-[28px] border border-[#ffc400]/25 bg-[#10171b] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                <IconeVeiculo tipo={tipoVeiculo} size={30} />
              </div>

              <div>
                <p className="text-xs font-black text-[#ffc400]">CORRIDA ATUAL</p>
                <h2 className="mt-1 text-xl font-black">Entrega em andamento</h2>
                <p className="mt-1 text-sm text-white/60">
                  Siga a rota até o destino indicado.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <InfoCard icon={<MapPin size={21} />} titulo="Destino" valor="Boa Viagem" />
            <InfoCard icon={<Clock size={21} />} titulo="Tempo restante" valor="18 min" />
            <InfoCard icon={<Package size={21} />} titulo="Tipo de pacote" valor="Frágil / sensível" />
            <InfoCard
              icon={<FileText size={21} />}
              titulo="Observação do cliente"
              valor="Tomar cuidado na entrega. Entregar somente ao responsável."
              maior
            />
          </div>

          <button
            onClick={() => alert("Entrega finalizada visualmente. Depois conectamos com o backend.")}
            className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] font-black text-black"
          >
            <CheckCircle2 size={22} />
            Finalizar entrega
          </button>
        </div>
      </section>
    </main>
  )
}

function InfoCard({ icon, titulo, valor, maior }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffc400]/15 text-[#ffc400]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black uppercase text-white/45">{titulo}</p>
          <p className={`mt-1 font-black text-white ${maior ? "text-sm leading-relaxed" : "text-base"}`}>
            {valor}
          </p>
        </div>
      </div>
    </article>
  )
}
