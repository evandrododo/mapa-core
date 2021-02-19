import db from "../../lib/pg"
import jwt from 'jsonwebtoken';
import { SHA256 } from "crypto-js"

const JWT_KEY = process.env.JWT_KEY

export default async (req, res) => {
  try {
    const { username, senha } = JSON.parse(req.body)
    const usuario = await db.pg.oneOrNone(
      "SELECT * FROM usuarios WHERE username = $1",
      username
    )
    if (!usuario) {
      res.status(401).json({
        message: "Usuário ou senha incorretos",
      })
    }
    const salt = usuario.salt
    const senhaEncriptada1 = SHA256(senha + salt)
    const senhaEncriptada2 = SHA256(senhaEncriptada1 + salt)
    const senhaEncriptadaFinal = SHA256(senhaEncriptada2 + salt).toString()
    if (senhaEncriptadaFinal === usuario.senha) {
      const payload = {
        id: usuario.id,
        nome: usuario.nome,
      }
      const token = jwt.sign(payload, JWT_KEY, {
        expiresIn: 31556926, // 1 ano
      })
      res.status(200).json({
        success: true,
        token: "Bearer " + token,
      })
    } else {
      res.status(401).json({
        message: "Usuário ou senha incorretos",
      })
    }
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
