import pgPromise, { IDatabase } from "pg-promise"

const pgp = pgPromise()

const user = process.env.PG_USER
const password = process.env.PG_PASSWORD
const host = process.env.PG_HOST
const port = process.env.PG_PORT
const database = process.env.PG_DATABASE

const DB_KEY = Symbol.for("app.db")
const globalSymbols = Object.getOwnPropertySymbols(global)
const hasDb = globalSymbols.indexOf(DB_KEY) > -1
if (!hasDb) {
  global[DB_KEY] = pgp(
    `postgres://${user}:${password}@${host}:${port}/${database}`
  )
}

const singleton : { pg: IDatabase<{}> }= {
  pg: global[DB_KEY],
}
Object.freeze(singleton)

export default singleton
