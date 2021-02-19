import db from "../../../lib/pg"
import { SHA256 } from "crypto-js"

export default async function userHandler(req, res) {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case "GET":
      {
        const usuario = await db.pg.oneOrNone('SELECT * FROM usuarios WHERE id=$1', id)
        res.status(200).json(usuario)
        break
      }
    case "PUT":
      {
        // Atualiza usuario
        const { username, nome, sobrenome, senha } = JSON.parse(req.body)
        const salt = Math.random().toString(16).substr(2, 16)
        const senhaEncriptada1 = SHA256(senha + salt)
        const senhaEncriptada2 = SHA256(senhaEncriptada1 + salt)
        const senhaEncriptadaFinal = SHA256(senhaEncriptada2 + salt).toString()
        if (id) {
          await db.pg.oneOrNone(
            `UPDATE usuarios
            SET username=$(username), nome=$(nome), sobrenome=$(sobrenome), senha=$(senha)
            WHERE id=$(id)`,
            {
              username,
              nome,
              sobrenome,
              senha: senhaEncriptadaFinal,
              id
            })
          res.status(200).json({ id })
          break
        } else {
          res.status(400).end("Rota não encontrada")
          break
        }
      }
    case "DELETE":
      {
        try {
          await db.pg.oneOrNone('DELETE FROM usuarios WHERE id=$1', id)
          res.status(200).json({ id })
        } catch (e) {
          res.status(500).json(e)
        }
        break
      }
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
