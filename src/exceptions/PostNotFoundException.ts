import HttpException from "./HttpException";

class PostNotFoundExecption extends HttpException {
    constructor(id: string) {
        super(404, `Post with id ${id} not found`);
    }
}

export default PostNotFoundExecption;