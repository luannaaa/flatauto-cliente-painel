function LoginForm({
  onGoogle,
  onCadastro,
  onLoginSuccess,
}: {
  onGoogle: () => void
  onCadastro: () => void
  onLoginSuccess: () => void
}) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [loading, setLoading] = useState(false)

  function entrarComEmail() {
    if (loading) return

    const emailLimpo = email.trim().toLowerCase()
    const senhaLimpa = senha.trim()

    setMensagem("")

    // LOGIN EMPRESA TESTE
    // Só esse login entra no painel empresa
    if (
      emailLimpo === "luanacat249@gmail.com" &&
      senhaLimpa === "12345678"
    ) {
      window.location.href = "/empresa"
      return
    }

    // LOGIN NORMAL
    if (!emailLimpo || !senhaLimpa) {
      setMensagem("Digite e-mail e senha.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      onLoginSuccess()
    }, 400)
  }

  const inputClass =
    "h-16 w-full rounded-lg border border-white/20 bg-[#070a0d]/85 px-5 text-lg text-white outline-none placeholder:text-gray-400"

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        entrarComEmail()
      }}
      className="w-full"
    >
      <button
        type="button"
        onClick={onGoogle}
        className="mt-9 flex h-16 w-full items-center justify-center gap-4 rounded-lg bg-white text-lg font-bold text-black"
      >
        <img
          src={imagens.google}
          className="h-7 w-7 object-contain"
          alt=""
        />
        Entrar com Google
      </button>

      <div className="my-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-base text-gray-400">ou</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Digite seu e-mail"
        className={inputClass}
      />

      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        type="password"
        placeholder="Digite sua senha"
        className={`${inputClass} mt-5`}
      />

      {mensagem && (
        <p className="mt-4 text-sm font-bold text-[#ffc400]">
          {mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 h-16 w-full rounded-lg bg-[#ffc400] text-xl font-black text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <button
        type="button"
        onClick={onCadastro}
        className="mt-5 w-full text-center text-base font-bold text-[#ffc400]"
      >
        Criar sua conta
      </button>
    </form>
  )
}

/*
IMPORTANTE:

No app/page.tsx inteiro:

window.location.href = "/empresa"

SÓ pode existir dentro da função entrarComEmail().

Se tiver outro igual fora dela:
APAGA.
*/
