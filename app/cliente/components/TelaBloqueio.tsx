"use client"

export default function TelaBloqueio({ onVoltar }: { onVoltar: () => void }) {
  return (
    <main className="min-h-screen bg-[#020303] text-white flex items-center justify-center px-4">
      <section className="w-full max-w-[1080px]">
        <img
          src="/logo.png"
          className="mb-5 h-[125px] w-[380px] object-contain object-left"
        />

        <div className="grid overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-[0_0_80px_rgba(0,0,0,0.9)] md:grid-cols-2">
          <div className="border-b border-white/15 p-6 md:border-b-0 md:border-r md:p-9">
            <h1 className="max-w-[360px] text-[30px] font-black leading-tight md:text-[33px]">
              Ops! Essa área só está disponível no aplicativo.
            </h1>

            <p className="mt-5 max-w-[450px] text-[16px] leading-relaxed text-white/75">
              Por segurança e para garantir a melhor experiência, o acesso é permitido apenas pelo app{" "}
              <span className="font-bold text-[#ffc400]">FlatAuto.</span>
            </p>

            <div className="my-5 h-px w-full bg-white/15" />

            <p className="text-[17px] font-bold">
              Escaneie o QR Code e baixe agora:
            </p>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-[135px] w-[135px] grid-cols-7 grid-rows-7 gap-[3px] rounded-lg bg-white p-2">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      [
                        0, 1, 2, 7, 14, 15, 16,
                        4, 5, 6, 13, 20, 19, 18,
                        28, 35, 42, 43, 44, 36, 30,
                        10, 12, 17, 22, 24, 26, 31, 33, 38, 40, 45, 48,
                      ].includes(i)
                        ? "bg-black"
                        : "bg-white"
                    }
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <img
                  src="/googleplay-removebg-preview.png"
                  className="h-[62px] w-[215px] object-contain"
                />

                <img
                  src="/app_story-removebg-preview.png"
                  className="h-[62px] w-[215px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 text-center md:p-9">
            <div className="relative mb-5 flex h-[135px] w-[170px] items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#ffc400]/20 blur-3xl" />
              <div className="absolute h-[90px] w-[90px] rounded-full bg-[#ffc400]/15 blur-2xl" />
              <img
                src="/block_pc.png"
                className="relative z-10 h-[125px] w-[165px] object-contain drop-shadow-[0_0_22px_rgba(255,196,0,0.45)]"
              />
            </div>

            <h2 className="max-w-[400px] text-[29px] font-black leading-tight md:text-[33px]">
              Acesso pelo computador bloqueado
            </h2>

            <p className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-white/70">
              Você pode criar sua conta pelo site, mas para entrar precisa usar o aplicativo.
            </p>

            <button
              onClick={onVoltar}
              className="mt-7 text-[19px] font-bold text-[#ffc400]"
            >
              Voltar para o login
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/confianca.png"
              className="h-[62px] w-[62px] object-contain"
            />

            <p className="max-w-[270px] text-[14px] leading-relaxed text-white/60">
              A sua plataforma de fretes com segurança, praticidade e confiança.
            </p>
          </div>

          <button className="flex h-[46px] items-center gap-2 rounded-xl border border-[#ffc400] px-4 text-[15px] font-bold text-[#ffc400]">
            <img src="/suport1.png" className="h-5 w-5 object-contain" />
            Precisa de ajuda?
          </button>
        </div>
      </section>
    </main>
  )
}