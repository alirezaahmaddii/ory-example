import {ory} from "./ory.ts";

export async function getSession() {
    try {
        const {data} = await ory.toSession()
        return data.identity
    } catch (err) {
        throw new Error('Not authenticated')
    }
}
