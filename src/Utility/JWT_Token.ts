import jwt from "jsonwebtoken";
import "dotenv-flow/config";

class TokenManager {
  public generateToken(data: any, expiry: string | number) {
    // try {

    const token = jwt.sign({ data }, process.env.JWT_SECRET_KEY!, {
      expiresIn: expiry,
    });
    return token;
    // } catch (err) {
    //   throw err;
    // }
  }

  public verifyToken(token: string) {
    // try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    return decoded;
    // } catch (err) {
    //   throw err;
    // }
  }
}

export default TokenManager;
