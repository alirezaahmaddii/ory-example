import {Configuration, FrontendApi} from '@ory/client-fetch'

export const ory = new FrontendApi(
    new Configuration({
        basePath: "http://localhost:4433",
    }),
)

export async function getSession() {
    try {
        const {identity} = await ory.toSession()
        return identity
    } catch (err) {
        throw new Error('Not authenticated')
    }
}
