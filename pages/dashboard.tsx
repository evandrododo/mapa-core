import React, { useState } from "react"
import Head from "next/head"
import useSWR, { mutate } from "swr"
import Router from "next/router"
import Cookies from "js-cookie"
import { fetchDelete, get } from "../lib/fetcher"
import { Button, Navbar, Table } from "react-bootstrap"
import styles from "../styles/Dashboard.module.css"
import { getAppCookies, verifyToken } from "../lib/auth"
import { FaSignOutAlt, FaUserAlt, FaTrash, FaRegEdit } from 'react-icons/fa';
import Link from "next/link"

export default function Dashboard({ user }) {
  const { nome } = user

  const { data, error } = useSWR("/api/usuarios", get)

  const handleLogout = () => {
    Cookies.remove("token")
    Router.push("/")
  }

  const handleDelete = async (e, id) => {
    e.preventDefault()
    var confirmaDelete = confirm("Ao excluir os dados de um usuário, não será mais possível consultar estas informações. Deseja excluir os dados desse usuário?");
    if (confirmaDelete) {
      await fetchDelete(`/api/usuario/${id}`)
      mutate('/api/usuarios')
    }
  }

  return (
    <>
      <Head>
        <title>Área Administrativa</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar bg='dark' expand='lg' className={styles.navbar}>
        <FaUserAlt />
        &nbsp;{nome}
        <Button onClick={handleLogout}>
          Sair <FaSignOutAlt />
        </Button>
      </Navbar>
      <div className={styles.container}>
        <div className={styles.table}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Username</th>
                <th>Data de criação</th>
                <th style={{ width: '7rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((usuario) => {
                const { id, nome, sobrenome, username } = usuario
                const datacriacao = new Date(usuario.datacriacao)
                return <Link href={`/usuario/${usuario.id}`}>
                  <tr className={styles.row}>
                    <td>{id}</td>
                    <td>{nome}</td>
                    <td>{sobrenome}</td>
                    <td>{username}</td>
                    <td>
                      {datacriacao.toLocaleDateString("pt-BR")}
                      {" - "}
                      {datacriacao.toLocaleTimeString("pt-BR")}
                    </td>
                    <td>
                      <Button variant='link'>
                        <FaRegEdit />
                      </Button>
                      <Button 
                        variant='link'
                        className={styles.deletebutton}
                        onClick={(e) => handleDelete(e, id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                </Link>
              })
              }
            </tbody>
          </Table>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { res, req } = context;
  const { token } = getAppCookies(req);
  const user = token ? verifyToken(token.split(' ')[1]) : '';
  if (!user) {
    res.setHeader("location", "/")
    res.statusCode = 302
    res.end()
  }
  return {
    props: {
      user,
    },
  };
}