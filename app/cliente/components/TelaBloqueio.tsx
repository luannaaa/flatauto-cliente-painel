"use client"

export default function TelaBloqueio({
  onVoltar,
  onEntrarEmpresa,
}: {
  onVoltar: () => void
  onEntrarEmpresa?: () => void
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
              Acesso pelo computador bloqueado para cliente comum.
            </h1>

            <p className="mt-5 max-w-[470px] text-[16px] leading-relaxed text-white/75">
              Por segurança, clientes comuns acessam a plataforma pelo aplicativo.
              Empresas podem acessar normalmente pelo computador ou pelo celular.
            </p>

            <div className="my-6 h-px w-full bg-white/15" />

            <p className="text-[17px] font-bold text-white">
              Você está entrando como empresa?
            </p>

            <button
              type="button"
              onClick={onEntrarEmpresa}
              className="mt-5 h-14 w-full rounded-xl bg-[#ffc400] text-lg font-black text-black shadow-[0_0_30px_rgba(255,196,0,0.45)]"
            >
              Entrar como empresa
            </button>

            <button
              type="button"
              onClick={onVoltar}
              className="mt-4 h-12 w-full rounded-xl border border-[#ffc400] text-base font-bold text-[#ffc400]"
            >
              Voltar para o login
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 text-center md:p-9">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src="/empresa_cliente.png"
                className="h-14 w-14 object-contain"
                alt=""
              />
            </div>

            <h2 className="mt-6 text-[28px] font-black">
              Empresa liberada no computador
            </h2>

            <p className="mt-4 max-w-[390px] text-white/70">
              O acesso empresarial terá um painel próprio, com entregas, status,
              motoristas, veículos, financeiro e relatórios.
            </p>

            <div className="mt-7 w-full max-w-[390px] rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="font-bold text-[#ffc400]">Cliente comum</p>
              <p className="mt-1 text-sm text-white/60">
                Bloqueado no computador. Usa pelo app.
              </p>

              <p className="mt-4 font-bold text-[#ffc400]">Empresa</p>
              <p className="mt-1 text-sm text-white/60">
                Liberada no computador e no celular.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
