import { useRouter } from "next/router"
import React from "react"
import FormUsuario from "../../components/FormUsuario"
import styles from "../../styles/Cadastro.module.css"

export default function Cadastro() {
  const router = useRouter()
  const { id } = router.query
  return (
    <div className={styles.container}>
      <FormUsuario id={id.toString()}/>
    </div>
  )
}
