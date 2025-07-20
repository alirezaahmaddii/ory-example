import { useEffect, useState } from "react"
import { getSession } from "../auth.ts"
import { LogoutButton } from "./LogoutButton.tsx"
import {ory} from "../ory.ts";

export const Home = () => {
    const [session, setSession] = useState(null)

    const fetchSession = async () => {
        try {
            const session = await ory.toSession()
            setSession(session)
        } catch (err) {
            console.error("Error fetching session:", err)
            window.location.href = 'http://localhost:4433/self-service/login/browser'
        }
    }

    useEffect(() => {
        getSession()
        fetchSession()
    }, [])

    return (
        <div style={{ maxWidth: 500, margin: 'auto' }}>
            Home
            <LogoutButton />
        </div>
    )
}
