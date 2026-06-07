"use client"

import {
  X,
  Building2,
  UserRound,
  MapPin,
  Package,
  Truck,
  CalendarDays,
  Clock,
  DollarSign,
  ClipboardList,
  Navigation,
  Save,
} from "lucide-react"

export default function NovaEntregaModal({ ui, fechar }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section className={`w-full max-w-[980px] overflow-hidden rounded-[30px] border ${ui.card}`}>
        <header className={`flex items-center justify-between border-b px-6 py-5 ${ui.linha}`}>
          <div>
            <h2 className="text-2xl font-black">Nova Entrega</h2>
            <p className={`mt-1 text-sm ${ui.textoFraco}`}>
              Cadastre uma nova entrega para a empresa acompanhar.
            </p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-3 ${ui.card2}`}>
            <X size={22} />
          </button>
        </header>

        <div className="grid gap-5 p-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Campo ui={ui} icon={<Building2 size={18} />} label="Cliente" placeholder="Nome da empresa cliente" />
              <Campo ui={ui} icon={<UserRound size={18} />} label="Motorista" placeholder="Selecione ou digite o motorista" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Campo ui={ui} icon={<MapPin size={18} className="text-green-500" />} label="Origem" placeholder="Local de saída" />
              <Campo ui={ui} icon={<MapPin size={18} className="text-red-500" />} label="Destino" placeholder="Destino final" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Campo ui={ui} icon={<Package size={18} />} label="Tipo de carga" placeholder="Ex: Alimentos, móveis, peças..." />
              <Campo ui={ui} icon={<Truck size={18} />} label="Tipo de veículo" placeholder="Fiorino, VUC, Toco, Truck..." />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Campo ui={ui} icon={<CalendarDays size={18} />} label="Data" placeholder="18/05/2026" />
              <Campo ui={ui} icon={<Clock size={18} />} label="Horário" placeholder="14:30" />
              <Campo ui={ui} icon={<DollarSign size={18} />} label="Valor" placeholder="R$ 0,00" />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                Observações da entrega
              </label>
              <div className={`flex min-h-[110px] gap-3 rounded-2xl border px-4 py-3 ${ui.card2}`}>
                <ClipboardList size={18} className="mt-1 text-[#ffc400]" />
                <textarea
                  placeholder="Ex: carga frágil, precisa de ajudante, horário combinado..."
                  className="min-h-[85px] flex-1 resize-none bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <aside className={`rounded-[24px] border p-5 ${ui.card2}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
              <Navigation size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black">Resumo rápido</h3>
            <p className={`mt-2 text-sm ${ui.textoFraco}`}>
              Essa tela ainda está no visual. Depois vamos ligar no backend para salvar no banco.
            </p>

            <div className={`mt-5 space-y-3 border-t pt-5 ${ui.linha}`}>
              <ResumoLinha label="Status inicial" valor="Em andamento" />
              <ResumoLinha label="Origem/Destino" valor="A preencher" />
              <ResumoLinha label="Veículo" valor="Selecionado pela empresa" />
              <ResumoLinha label="Banco de dados" valor="Próxima etapa" />
            </div>

            <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black">
              <Save size={19} />
              Salvar Entrega
            </button>

            <button onClick={fechar} className={`mt-3 h-12 w-full rounded-xl border font-bold ${ui.card2}`}>
              Cancelar
            </button>
          </aside>
        </div>
      </section>
    </div>
  )
}

function Campo({ ui, icon, label, placeholder }: any) {
  return (
    <label>
      <span className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>{label}</span>
      <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 ${ui.card2}`}>
        <span className="text-[#ffc400]">{icon}</span>
        <input placeholder={placeholder} className="w-full bg-transparent text-sm outline-none" />
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