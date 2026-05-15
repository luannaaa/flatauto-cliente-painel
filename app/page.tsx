function entrarComEmail() {
  if (loading) return

  const emailLimpo = email.trim().toLowerCase()
  const senhaLimpa = senha.trim()

  setMensagem("")

  // LOGIN EMPRESA TESTE
  if (
    emailLimpo === "luanacat249@gmail.com" &&
    senhaLimpa === "12345678"
  ) {
    setMensagem("Entrando como empresa...")

    setTimeout(() => {
      window.location.href = "/empresa"
    }, 300)

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
