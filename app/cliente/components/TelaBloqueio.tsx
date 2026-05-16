"use client"

export default function TelaBloqueio({
  onVoltar,
}: {
  onVoltar: () => void
}) {
  return (
    <main className="min-h-screen bg-[#020303] text-white flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-[1080px]">
        <img
          src="/logo.png"
          alt="FlatAuto"
          className="mb-5 h-[125px] w-[380px] object-contain object-left drop-shadow-[0_0_35px_rgba(255,196,0,0.55)]"
        />

        <div className="grid overflow-hidden rounded-2xl border border-white/15 bg-black/45 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-md md:grid-cols-2">
          <div className="border-b border-white/15 p-6 md:border-b-0 md:border-r md:p-9">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src="/block_pc.png"
                alt=""
                className="h-10 w-10 object-contain"
              />
            </div>

            <h1 className="mt-6 max-w-[430px] text-[30px] font-black leading-tight md:text-[34px]">
              Acesso pelo computador bloqueado.
            </h1>

            <p className="mt-5 max-w-[470px] text-[16px] leading-relaxed text-white/75">
              Para garantir uma melhor experiência, o acesso do cliente comum pelo computador está bloqueado.
              Use o aplicativo no celular para continuar.
            </p>

            <div className="my-6 h-px w-full bg-white/15" />

            <button
              type="button"
              onClick={onVoltar}
              className="h-14 w-full rounded-xl border border-[#ffc400] text-lg font-bold text-[#ffc400]"
            >
              Voltar para o login
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 text-center md:p-9">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src="/block_pc.png"
                className="h-14 w-14 object-contain"
                alt=""
              />
            </div>

            <h2 className="mt-6 text-[28px] font-black">
              Use pelo celular
            </h2>

            <p className="mt-4 max-w-[390px] text-white/70">
              Clientes comuns acessam pelo aplicativo. O acesso empresarial de teste entra direto pelo login principal usando o e-mail e senha liberados.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
