import jwt from "jsonwebtoken"

const JWT_KEY = process.env.JWT_KEY

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export function verifyToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, JWT_KEY)
  } catch (e) {
    console.log("e:", e)
    return null
  }
}

/*
 * @params {request} extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
export function getAppCookies(req):any {
  const parsedItems = {}
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split("; ")
    cookiesItems.forEach((cookies) => {
      const parsedItem = cookies.split("=")
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1])
    })
  }
  return parsedItems
}
