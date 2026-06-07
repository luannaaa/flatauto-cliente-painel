"use client"

import { useEffect } from "react"
import {
  X,
  MapPin,
  CalendarDays,
  Clock,
  DollarSign,
  ClipboardList,
  Navigation,
  Save,
  FileSearch,
  UserRound,
} from "lucide-react"

export default function NovaEntregaModal({ ui, fechar }: any) {
  useEffect(() => {
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = overflowOriginal
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border sm:max-w-[980px] sm:rounded-[30px] ${ui.card}`}>
        <header className={`flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-5 ${ui.linha}`}>
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Nova Entrega</h2>
            <p className={`mt-1 text-xs sm:text-sm ${ui.textoFraco}`}>
              Preencha os dados da entrega ou leia uma nota fiscal.
            </p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 sm:p-3 ${ui.card2}`}>
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.8fr]">
            <div className="space-y-4 sm:space-y-5">
              <button className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#ffc400]/50 bg-[#ffc400]/15 px-4 font-black text-[#ffc400]`}>
                <FileSearch size={22} />
                Ler nota fiscal
              </button>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <Campo ui={ui} icon={<MapPin size={18} className="text-green-500" />} label="Origem" placeholder="Local de saída" />
                <Campo ui={ui} icon={<MapPin size={18} className="text-red-500" />} label="Destino" placeholder="Destino final" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <Campo ui={ui} icon={<CalendarDays size={18} />} label="Data" placeholder="18/05/2026" />
                <Campo ui={ui} icon={<Clock size={18} />} label="Horário" placeholder="14:30" />
                <Campo ui={ui} icon={<DollarSign size={18} />} label="Valor" placeholder="R$ 0,00" />
              </div>

              <Campo ui={ui} icon={<UserRound size={18} />} label="Transportador" placeholder="A definir ou selecionar depois" />

              <div>
                <label className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                  Observações da entrega
                </label>

                <div className={`flex min-h-[96px] gap-3 rounded-2xl border px-4 py-3 sm:min-h-[110px] ${ui.card2}`}>
                  <ClipboardList size={18} className="mt-1 text-[#ffc400]" />
                  <textarea
                    placeholder="Ex: carga frágil, precisa de ajudante, entregar até 16h..."
                    className="min-h-[72px] flex-1 resize-none bg-transparent text-sm outline-none sm:min-h-[85px]"
                  />
                </div>
              </div>
            </div>

            <aside className={`rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400] text-black sm:h-14 sm:w-14">
                <Navigation size={26} />
              </div>

              <h3 className="mt-4 text-lg font-black sm:mt-5 sm:text-xl">Resumo rápido</h3>

              <p className={`mt-2 text-sm ${ui.textoFraco}`}>
                Depois o backend vai puxar os dados da nota fiscal e preencher automaticamente.
              </p>

              <div className={`mt-4 space-y-3 border-t pt-4 sm:mt-5 sm:pt-5 ${ui.linha}`}>
                <ResumoLinha label="Status inicial" valor="Em andamento" />
                <ResumoLinha label="Origem/Destino" valor="A preencher" />
                <ResumoLinha label="Transportador" valor="A definir" />
                <ResumoLinha label="Nota fiscal" valor="Próxima etapa" />
              </div>

              <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black sm:mt-6">
                <Save size={19} />
                Salvar Entrega
              </button>

              <button onClick={fechar} className={`mt-3 h-12 w-full rounded-xl border font-bold ${ui.card2}`}>
                Cancelar
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

function Campo({ ui, icon, label, placeholder }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-11 items-center gap-3 rounded-2xl border px-3 sm:h-12 sm:px-4 ${ui.card2}`}>
        <span className="text-[#ffc400]">{icon}</span>
        <input
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  )
}

function ResumoLinha({ label, valor }: any) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="opacity-60">{label}</span>
      <strong className="text-right">{valor}</strong>
    </div>
  )
}