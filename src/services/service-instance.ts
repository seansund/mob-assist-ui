
const isMock = process.env.BACKEND_MOCK === 'mock'

export const getServiceInstance = <A, P extends A, M extends A> (primary: () => P, mock?: () => M): A => {
    if (isMock) {
        if (!mock) {
            throw new Error('No mock available')
        }

        return mock()
    }

    return primary()
}
