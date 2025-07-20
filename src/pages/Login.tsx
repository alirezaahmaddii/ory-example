import { useEffect, useState } from 'react'
import { Configuration, FrontendApi } from '@ory/client'
import { useNavigate } from 'react-router-dom'

const ory = new FrontendApi(
    new Configuration({
        basePath: 'http://localhost:4433',
        baseOptions: {
            withCredentials: true,
        },
    })
)

export const Login = () => {
    const [flow, setFlow] = useState<any | null>(null)
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        const flowId = search.get('flow')

        if (flowId) {
            ory
                .getLoginFlow({ id: flowId })
                .then(({ data }) => {
                    setFlow(data)
                })
                .catch((err) => {
                    console.error('error getting flow:', err)
                    createFlow()
                })
        } else {
            createFlow()
        }
    }, [])

    const createFlow = async () => {
        try {
            const { data } = await ory.createBrowserLoginFlow()
            navigate(`/login?flow=${data.id}`, { replace: true })
            setFlow(data)
        } catch (err) {
            console.error('error creating flow:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!flow) return

        try {
            const { data } = await ory.updateLoginFlow({
                flow: flow.id,
                updateLoginFlowBody: {
                    method: 'password',
                    identifier,
                    password,
                    csrf_token: flow?.ui?.nodes[0]?.attributes?.value
                },
            })

            console.log('✅ Login successful:', data)
            navigate('/')
        } catch (err: any) {
            const msg = err?.response?.data?.ui?.messages?.[0]?.text || 'Login failed'
            console.error('Login error:', err)
            setError(msg)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br />
            <button type="submit" disabled={!flow}>
                Login
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}
