import {ory} from "../ory.ts";

export function LogoutButton() {
    const handleLogout = async () => {
        try {
            const { data: flow } = await ory.createBrowserLogoutFlow()
            await frontend.updateLogoutFlow({
                token: flow.logout_token,
            })
        } catch (error) {
            console.log(error)
        }

        console.log('successfully logged out9')
    }

    return <button onClick={handleLogout}>Logout</button>
}