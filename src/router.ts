export const router = (url: string | undefined, method: string | undefined) => {
    return {
        status: 200, 
        header: 'test', 
        body: JSON.stringify({'user': 'test'})
    }
}