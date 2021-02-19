import db from "../../../lib/pg"
import { SHA256 } from "crypto-js"

export default async function userHandler(req, res) {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case "PUT":
      // Atualiza ou cria usuario
      const { username, nome, sobrenome, senha } = JSON.parse(req.body)
      const salt = Math.random().toString(16).substr(2, 16)
      const senhaEncriptada1 = SHA256(senha + salt)
      const senhaEncriptada2 = SHA256(senhaEncriptada1 + salt)
      const senhaEncriptadaFinal = SHA256(senhaEncriptada2 + salt).toString()
      if (!id) {
        await db.pg.none(
          `INSERT INTO usuarios 
            (username, nome, sobrenome, senha, salt, datacriacao ) 
           VALUES
            ($(username), $(nome), $(sobrenome), $(senha), $(salt), now())`,
          {
            username,
            nome,
            sobrenome,
            senha: senhaEncriptadaFinal,
            salt,
          }
        )
        res.status(200).json({ username, nome, sobrenome, senha })
        break
      } else {
        res.status(400).end("Rota não encontrada")
        break
      }
    default:
      res.setHeader("Allow", ["PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
