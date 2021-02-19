import React, { useState } from "react"
import Head from "next/head"
import Link from 'next/link'
import Router from 'next/router';
import Cookies from 'js-cookie';
import styles from "../styles/Home.module.css"
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { post } from '../lib/fetcher'

export default function Home() {
  const [senha, setSenha] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await post("/api/login", { username, senha })
      if (res.success && res.token) {
        Cookies.set('token', res.token);
        Router.push('/dashboard');
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Área Administrativa</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Form>
          {error !== "" && (
            <Alert key='error-login' variant='danger'>
              {error}
            </Alert>
          )}
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Nome de usuário</Form.Label>
            <Form.Control
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              placeholder='Digite seu nome de usuário'
              isInvalid={error !== ""}
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Senha</Form.Label>
            <Form.Control
              value={senha}
              onChange={({ target: { value } }) => setSenha(value)}
              type='password'
              placeholder='Digite sua senha'
              isInvalid={error !== ""}
            />
          </Form.Group>
          <Button variant='primary' onClick={handleLogin}>
            {loading ? (
              <Spinner as='span' role='status' size='sm' animation='border' />
            ) : (
              "Entrar"
            )}
          </Button>
        </Form>
        <Link href='/usuario/cadastro'>Cadastre-se</Link>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}
