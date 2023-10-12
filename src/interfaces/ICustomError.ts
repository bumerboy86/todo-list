export interface ICustomError {
    error: string,
    status: number | string,
    data?: {
        message: string
    }
}