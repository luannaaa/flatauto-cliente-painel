"use client"

import { useEffect, useState } from "react"
import {
  X,
  Truck,
  Bike,
  Car,
  Bus,
  Save,
  Palette,
  CalendarDays,
  FileText,
  UserRound,
  ClipboardList,
  ImagePlus,
} from "lucide-react"

const tiposVeiculo = [
  "Moto",
  "Carro",
  "Fiorino",
  "Van",
  "VUC",
  "Truck",
  "Toco",
  "Carreta",
]

const statusVeiculo = ["Disponível", "Em rota", "Manutenção"]

const motoristas = [
  "João Carlos Silva",
  "Marcos Antônio",
  "Carlos Eduardo",
  "Roberto Lima",
]

function IconeTipo({ tipo, size = 18 }: { tipo: string; size?: number }) {
  if (tipo === "Moto") return <Bike size={size} />
  if (tipo === "Carro") return <Car size={size} />
  if (tipo === "Fiorino" || tipo === "Van") return <Bus size={size} />
  return <Truck size={size} />
}

export default function NovoVeiculoModal({ ui, fechar }: any) {
  const [tipo, setTipo] = useState("Moto")
  const [placa, setPlaca] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [ano, setAno] = useState("")
  const [cor, setCor] = useState("")
  const [renavam, setRenavam] = useState("")
  const [motorista, setMotorista] = useState("")
  const [status, setStatus] = useState("Disponível")
  const [observacoes, setObservacoes] = useState("")

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  function salvarVeiculo() {
    alert("Veículo salvo visualmente. Depois vamos ligar no backend.")
    fechar()
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border sm:max-w-[950px] sm:rounded-[30px] ${ui.card}`}>
        <header className={`flex items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-5 ${ui.linha}`}>
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Novo Veículo</h2>
            <p className={`mt-1 text-xs sm:text-sm ${ui.textoFraco}`}>
              Cadastre um veículo da frota da empresa.
            </p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 ${ui.card2}`}>
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <SelectCampo
                ui={ui}
                label="Tipo do veículo"
                value={tipo}
                onChange={setTipo}
                options={tiposVeiculo}
                icon={<IconeTipo tipo={tipo} />}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Campo ui={ui} icon={<FileText size={18} />} label="Placa" placeholder="Ex: ABC-1234" value={placa} onChange={setPlaca} />
                <Campo ui={ui} icon={<Truck size={18} />} label="Marca" placeholder="Ex: Honda, Fiat, Mercedes" value={marca} onChange={setMarca} />
                <Campo ui={ui} icon={<Truck size={18} />} label="Modelo" placeholder="Ex: CG 160, Fiorino, VUC" value={modelo} onChange={setModelo} />
                <Campo ui={ui} icon={<CalendarDays size={18} />} label="Ano" placeholder="Ex: 2024" value={ano} onChange={setAno} />
                <Campo ui={ui} icon={<Palette size={18} />} label="Cor" placeholder="Ex: Branco" value={cor} onChange={setCor} />
                <Campo ui={ui} icon={<FileText size={18} />} label="RENAVAM" placeholder="Opcional" value={renavam} onChange={setRenavam} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectCampo
                  ui={ui}
                  label="Motorista vinculado"
                  value={motorista}
                  onChange={setMotorista}
                  options={motoristas}
                  icon={<UserRound size={18} />}
                  placeholder="Selecionar motorista"
                />

                <SelectCampo
                  ui={ui}
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={statusVeiculo}
                  icon={<ClipboardList size={18} />}
                />
              </div>

              <button className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-dashed font-black ${ui.card2}`}>
                <ImagePlus size={22} className="text-[#d4af37]" />
                Adicionar foto do veículo
              </button>

              <div>
                <label className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                  Observações
                </label>

                <div className={`flex min-h-[105px] gap-3 rounded-2xl border px-4 py-3 ${ui.card2}`}>
                  <ClipboardList size={18} className="mt-1 text-[#d4af37]" />
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: veículo revisado, baú refrigerado, capacidade de carga..."
                    className="min-h-[80px] flex-1 resize-none bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <aside className={`rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37] text-white">
                <IconeTipo tipo={tipo} size={28} />
              </div>

              <h3 className="mt-5 text-xl font-black">Resumo do veículo</h3>

              <div className={`mt-5 space-y-3 border-t pt-5 ${ui.linha}`}>
                <ResumoLinha label="Tipo" valor={tipo} />
                <ResumoLinha label="Placa" valor={placa || "A preencher"} />
                <ResumoLinha label="Modelo" valor={modelo || "A preencher"} />
                <ResumoLinha label="Motorista" valor={motorista || "Não vinculado"} />
                <ResumoLinha label="Status" valor={status} />
              </div>

              <button
                onClick={salvarVeiculo}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] font-black text-white"
              >
                <Save size={19} />
                Salvar Veículo
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

function Campo({ ui, icon, label, placeholder, value, onChange }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 ${ui.card2}`}>
        <span className="text-[#d4af37]">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  )
}

function SelectCampo({ ui, label, value, onChange, options, icon, placeholder }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 ${ui.card2}`}>
        <span className="text-[#d4af37]">{icon}</span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          {placeholder && (
            <option value="" className="bg-black text-white">
              {placeholder}
            </option>
          )}

          {options.map((option: string) => (
            <option key={option} value={option} className="bg-black text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

function ResumoLinha({ label, valor }: any) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="opacity-60">{label}</span>
      <strong className="max-w-[180px] text-right text-xs sm:text-sm">{valor}</strong>
    </div>
  )
}
