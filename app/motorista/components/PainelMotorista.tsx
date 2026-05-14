export default function PainelMotorista() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-[430px]">
        <img
          src="/truck-bg.png"
          className="w-full rounded-[28px] border border-[#ffc400]/35"
        />

        <h1 className="mt-6 text-[34px] font-black">
          Olá, Motorista 👋
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="rounded-[22px] border border-white/10 bg-[#070707] p-5 text-[#ffc400]">
            Corridas
          </button>

          <button className="rounded-[22px] border border-white/10 bg-[#070707] p-5 text-[#ffc400]">
            Entregas
          </button>

          <button className="rounded-[22px] border border-white/10 bg-[#070707] p-5 text-[#ffc400]">
            Ganhos
          </button>

          <button className="rounded-[22px] border border-white/10 bg-[#070707] p-5 text-[#ffc400]">
            Perfil
          </button>
        </div>
      </div>
    </main>
  )
}
