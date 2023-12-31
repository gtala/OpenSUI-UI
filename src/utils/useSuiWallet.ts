"use client"; // This is a client component
import { useWallet, useAccountBalance } from '@suiet/wallet-kit'
import { useEffect } from 'react'

export function SuiWalletConnect() {
  const { balance } = useAccountBalance()
  const { select, address, disconnect, } = useWallet()

  const MIST_PER_SUI = BigInt(1000000000)
  
  const parsedBalance = (balance! / MIST_PER_SUI).toString() 

  useEffect(() => {
    if (address) {
      console.log('Connected account: ', address)
    }
  }, [address])

  const connectSui = async () => {
    await select('Suiet')
  }
// @ts-ignore
  const connect = async (): Promise<any> => {
    try {
      await connectSui()
    } catch (error: any) {
      if (error.code === 'WALLET.CONNECT_ERROR.USER_REJECTED') {
        throw new Error('User rejected the connection')
      } else {
        throw new Error(error)
      }
    }
  }
  return { connect, address,  disconnect, parsedBalance }
}


