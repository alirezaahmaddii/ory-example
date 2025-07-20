import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {oryService} from "../ory-service.ts";

export const Register = () => {
    const [flow, setFlow] = useState<any | null>(null)
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        const flowId = search.get('flow')

        if (flowId) {
            oryService.getRegistrationFlow({ id: flowId })
                .then(({ data }) => setFlow(data))
                .catch(() => createFlow())
        } else {
            createFlow()
        }
    }, [])

    const createFlow = async () => {
        try {
            const { data } = await oryService.createBrowserRegistrationFlow()
            navigate(`/register?flow=${data.id}`, { replace: true })
            setFlow(data)
        } catch (err) {
            console.error('error creating flow:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!flow) return

        try {
            const { data } = await oryService.updateRegistrationFlow({
                flow: flow.id,
                updateRegistrationFlowBody: {
                    method: 'password',
                    password,
                    csrf_token: flow?.ui?.nodes[4]?.attributes?.value,
                    traits: {
                        email,
                        role: 'doctor',
                        name: {
                            first: firstName,
                            last: lastName
                        }
                    }
                }
            })

            console.log('Registration successful:', data)
            navigate('/login')
        } catch (err: any) {
            const msg = err?.response?.data?.ui?.messages?.[0]?.text || 'Registration failed'
            console.error('Registration error:', err)
            setError(msg)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <br />
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <br />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                Register
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}
