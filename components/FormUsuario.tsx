import React, { useEffect, useState } from "react"
import { Form, Button, Alert, Spinner } from "react-bootstrap"
import useSWR from "swr"
import { get, put } from "../lib/fetcher"

const FormUsuario = ({ id = ''}) => {
    const { data } = useSWR(`/api/usuario/${id}`, get)
    const [senha, setSenha] = useState("")
    const [username, setUsername] = useState(data?.username || "")
    const [nome, setNome] = useState(data?.nome || "")
    const [sobrenome, setSobrenome] = useState(data?.sobrenome || "")
    const [error, setError] = useState("")
    const [cadastrado, setCadastrado] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!data) return
        setNome(data.nome)
        setSobrenome(data.sobrenome)
        setUsername(data.username)
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            if (!username || !senha || !nome || !sobrenome) {
                throw new Error('Todos os campos são obrigatórios')
            }
            await put(`/api/usuario/${id}`, { username, senha, nome, sobrenome })
            setCadastrado(true)
        } catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }
    return <Form>
        {error !== "" && (
            <Alert key='error-login' variant='danger'>
                {error}
            </Alert>
        )}
        {cadastrado && (
            <Alert key='success-login' variant='success'>
                Informações gravadas com sucesso!
            </Alert>
        )}
        <Form.Group controlId='formBasicEmail'>
            <Form.Label>Nome</Form.Label>
            <Form.Control
                value={nome}
                onChange={({ target: { value } }) => setNome(value)}
                isValid={nome.length > 3}
                isInvalid={error !== "" && nome.length == 0}
            />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
                value={sobrenome}
                onChange={({ target: { value } }) => setSobrenome(value)}
                isValid={sobrenome.length > 0}
                isInvalid={error !== "" && sobrenome.length == 0}
            />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
            <Form.Label>Nome de usuário</Form.Label>
            <Form.Control
                value={username}
                onChange={({ target: { value } }) => setUsername(value)}
                placeholder='Digite seu nome de usuário'
                isValid={username.length > 4}
                isInvalid={error !== "" && username.length == 0}
            />
        </Form.Group>

        <Form.Group controlId='formBasicPassword'>
            <Form.Label>Senha</Form.Label>
            <Form.Control
                value={senha}
                onChange={({ target: { value } }) => setSenha(value)}
                type='password'
                placeholder='Digite sua senha'
                isInvalid={error !== "" && senha.length == 0}
            />
        </Form.Group>
        <Button variant='primary' onClick={handleSubmit}>
            {loading ? (
                <Spinner as='span' role='status' size='sm' animation='border' />
            ) : (
                    "Cadastrar"
                )}
        </Button>
    </Form>
}

export default FormUsuario