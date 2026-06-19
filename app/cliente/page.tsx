'use client'

import { useEffect, useState } from 'react'
import PainelClienteMobile from './components/PainelClienteMobile'

function isMobile() {
  if (typeof window === 'undefined') return false

  const userAgentMobile = /Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(
    navigator.userAgent
  )
  const larguraMobile = window.innerWidth <= 768
  const mediaMobile = window.matchMedia('(max-width: 768px)').matches

  return userAgentMobile || larguraMobile || mediaMobile
}

export default function ClientePage() {
  const [carregou, setCarregou] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setMobile(isMobile())
    setCarregou(true)

    // Remove qualquer marca antiga do login secundário
    localStorage.removeItem('flatauto_clientes_cadastrados')

    // Garante que a rota principal do cliente sempre fique limpa
    window.history.replaceState({ pagina: 'cliente-painel' }, '', '/cliente')
    window.history.pushState({ pagina: 'cliente-painel' }, '', '/cliente')

    const bloquearVoltarParaLogin = () => {
      // Se o usuário apertar voltar no Android/navegador estando no painel,
      // mantém ele no painel do cliente e não deixa cair no login antigo.
      window.history.pushState({ pagina: 'cliente-painel' }, '', '/cliente')
    }

    window.addEventListener('popstate', bloquearVoltarParaLogin)

    return () => {
      window.removeEventListener('popstate', bloquearVoltarParaLogin)
    }
  }, [])

  function sair() {
    localStorage.removeItem('flatauto_cliente_logado')
    localStorage.removeItem('flatauto_cliente_email')
    localStorage.removeItem('flatauto_cliente_nome')
    localStorage.removeItem('flatauto_clientes_cadastrados')

    window.location.replace('/')
  }

  if (!carregou) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#030507] px-4 py-8 text-white'>
        <p className='font-bold text-[#ffc400]'>Carregando...</p>
      </main>
    )
  }

  if (!mobile) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#030507] px-4 py-8 text-white'>
        <section className='w-full max-w-[440px] rounded-[24px] border border-[#ffc400]/25 bg-[#05080b] px-6 py-10 text-center shadow-[0_0_40px_rgba(255,196,0,0.08)]'>
          <h1 className='text-[30px] font-extrabold text-[#ffc400]'>
            Acesso pelo computador bloqueado
          </h1>

          <p className='mt-4 text-[16px] text-zinc-300'>
            A área do cliente foi preparada para acesso pelo celular.
          </p>

          <button
            type='button'
            onClick={() => window.location.replace('/')}
            className='mt-7 flex h-14 w-full items-center justify-center rounded-[10px] bg-[#ffc400] text-[16px] font-extrabold text-black'
          >
            Voltar para o login principal
          </button>
        </section>
      </main>
    )
  }

  return (
    <PainelClienteMobile
      nomeCompleto='Cliente'
      onSair={sair}
    />
  )
}
