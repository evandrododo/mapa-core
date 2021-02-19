import db from "../../lib/pg";

export default async (req, res) => {
  try {
     const { query: { id } } = req;
     const usuarios = await db.pg.any('SELECT * FROM usuarios', id);
     res.status(200).json(usuarios);
  } catch (e) {
     console.error(e);
     res.status(500).end();
  }
};