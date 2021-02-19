const put = async (url, body) => {
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const post = async (url, body) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const fetchDelete = async (url) => {
  const res = await fetch(url, {
    method: "DELETE",
  })
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  } 
  return data
}


const get = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export { put, post, get, fetchDelete }