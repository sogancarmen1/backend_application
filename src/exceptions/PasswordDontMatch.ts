import HttpException from "./HttpException";

class PasswordDontMatch extends HttpException {
  constructor() {
    super(400, "Password don't match");
  }
}

export default PasswordDontMatch;
