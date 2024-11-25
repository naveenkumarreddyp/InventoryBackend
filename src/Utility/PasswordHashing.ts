import bcrypt from "bcrypt";
import "dotenv-flow/config";

class PasswordManager {
  public async hashPassword(password: string): Promise<string> {
    // try {
    const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS!));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
    // } catch (err) {
    //   throw err;
    // }
  }

  public async checkPassword(
    password: string,
    dbPassword: string
  ): Promise<boolean> {
    // try {
    const isMatched = await bcrypt.compare(password, dbPassword);
    return isMatched;
    // } catch (err) {
    //   throw err;
    // }
  }
}

export default PasswordManager;
