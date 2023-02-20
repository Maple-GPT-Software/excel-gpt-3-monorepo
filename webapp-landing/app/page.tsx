import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import React from 'react'
import Header from '../components/Header'
import LandingPage from './LandingPage/page'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <LandingPage />
      </main>
    </>
    
  )
}
