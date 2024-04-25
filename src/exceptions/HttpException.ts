class HttpException extends Error {
    statut: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.statut = status;
        this.message = message;
    }
}

export default HttpException;