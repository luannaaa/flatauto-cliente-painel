"use client"

export default function TelaBloqueio({
  onVoltar,
  onEntrarEmpresa,
}: {
  onVoltar: () => void
  onEntrarEmpresa?: () => void
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-8 text-white">
      <img
        src="/bg-web.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />

      <section className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-2xl border border-white/15 bg-[#050505]/85 shadow-[0_0_80px_rgba(0,0,0,0.95)] backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r md:p-10">
            <img
              src="/logo.png"
              alt="FlatAuto"
              className="mb-8 h-[95px] w-[300px] object-contain object-left drop-shadow-[0_0_35px_rgba(255,196,0,0.45)]"
            />

            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src="/block_pc.png"
                alt=""
                className="h-10 w-10 object-contain"
              />
            </div>

            <h1 className="mt-7 max-w-[430px] text-[32px] font-black leading-tight md:text-[38px]">
              Acesso pelo computador bloqueado.
            </h1>

            <p className="mt-5 max-w-[470px] text-[16px] leading-relaxed text-white/70">
              Para garantir uma experiência melhor e mais segura, o acesso de cliente comum
              deve ser feito pelo aplicativo no celular.
            </p>

            <button
              type="button"
              onClick={onVoltar}
              className="mt-8 h-14 w-full rounded-xl border border-[#ffc400] bg-transparent text-lg font-bold text-[#ffc400] transition hover:bg-[#ffc400] hover:text-black"
            >
              Voltar para o login
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-7 text-center md:p-10">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10 shadow-[0_0_35px_rgba(255,196,0,0.18)]">
              <img
                src="/googleplay-removebg-preview.png"
                alt=""
                className="h-16 w-16 object-contain"
              />
            </div>

            <h2 className="mt-7 text-[28px] font-black">
              Acesse pelo aplicativo
            </h2>

            <p className="mt-4 max-w-[390px] text-white/65">
              Baixe ou abra o app FlatAuto no celular para continuar usando como cliente.
            </p>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="font-bold text-[#ffc400]">Cliente comum</p>
              <p className="mt-1 text-sm text-white/60">
                Acesso pelo app no celular.
              </p>

              <p className="mt-4 font-bold text-[#ffc400]">Empresa</p>
              <p className="mt-1 text-sm text-white/60">
                O login empresarial de teste deve ser feito direto na tela inicial de login.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
