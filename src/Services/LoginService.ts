import { LoginDTO } from "../DTO/LoginDTO";
import { UserEntity } from "../Entity/UserEntity";
import Repository from "../Repository/BaseRepository";
import TokenManager from "../Utility/JWT_Token";
import PasswordManager from "../Utility/PasswordHashing";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import nodemailer from "nodemailer";
import {sendPasswordResetEmail}  from "../mailtrap/emails";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "../mailtrap/emailTemplates";
import { JwtPayload } from "jsonwebtoken";

export interface ISignInServiceInterface {
  getuserInfo(data: any): Promise<any>;
  signIn(data: LoginDTO): Promise<any>;
  signUp(data: LoginDTO): Promise<any>;
  signOut(data: any): Promise<any>;
  forgotPassword(data: any): Promise<any>;
  resetPassword(data: any): Promise<any>;
  getUserInfoByResetToken(data: any): Promise<any>;
}

class LoginService implements ISignInServiceInterface {
  private tokenManger: TokenManager;
  private passwordService: PasswordManager;
  private uniqueId: UniqueIDGenerator;
  constructor() {
    this.passwordService = new PasswordManager();
    this.tokenManger = new TokenManager();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async signIn(data: LoginDTO): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let { email, password } = data;
    let userData = await userRepository.getOne({ email, isActive: 1 });
    if (!userData) {
      return { error: "user is not registered or inactive" };
    }
    let isPasswordValid = await this.passwordService.checkPassword(password, userData.password);
    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    let { username } = userData;

    let acessToken = this.tokenManger.generateToken({ email, username }, 5 * 60);
    let refreshToken = this.tokenManger.generateToken(userData._id, 60 * 60 * 1000);

    return { refreshToken, acessToken, message: "login sucessfully" };
  }

  public async signUp(data: LoginDTO): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let { email, password } = data;
    let userData = await userRepository.getOne({ email });
    if (userData) {
      return { error: "Email already in use" };
    }
    let hashedPass = await this.passwordService.hashPassword(password);
    let uid = this.uniqueId.generate();
    let userInfo: UserEntity = {
      userid: uid,
      username: email.split("@")[0],
      email: email,
      password: hashedPass,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      isActive: 1,
    };
    await userRepository.insert(userInfo);
    return { message: "user created sucessfully" };
  }

  public async signOut(data: any): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    if (data?.email) {
      let userInfo = await userRepository.getOne({ email: data.email });
      if (userInfo) {
        return { message: "user signed out successfully" };
      }
    }
    throw new Error("signed out failed.");
  }

  public async getuserInfo(data: any): Promise<any> {
    return data;
  }

  public async forgotPassword(data: any): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    if (data?.email) {
      let userInfo = await userRepository.getOne({ email: data.email });
      if (!userInfo) {
        return { message: "email not registered" };
      }

      let resetToken = this.tokenManger.generateToken({ email:data?.email}, 10 * 60 * 1000);
      // Generate a token with 1-hour expiration
    //const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    // Save the token and expiration time in the user's record
    userInfo.resetPasswordToken = resetToken;
    userInfo.resetPasswordExpires = new Date(Date.now() + 600000); // 10 min from now
    await userRepository.update({email:userInfo?.email},userInfo );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const resetLink = `${process.env.FRONTEND_URL}/${resetToken}`;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data?.email,
        subject: "Password Reset Request",
        html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink),
      //    `
      //   <p>Click the button below to reset your password:</p>
      //   <a href="${resetLink}" style="background-color:blue;color:white;padding:10px 15px;text-decoration:none;">Reset Password</a>
      //   <p>If you did not request a password reset, please ignore this email.</p>
      // `      ,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // return { message: "Password reset email sent successfully" };
      // Generate reset link (could include a token for security)

    //   const transporter = nodemailer.createTransport({
    //     host: process.env.MAILTRAP_HOST,
    //     port: Number(process.env.MAILTRAP_PORT),
    //     auth: {
    //       user: process.env.MAILTRAP_USER,
    //       pass: process.env.MAILTRAP_PASS,
    //     },
    //   });
    // const resetLink = `${process.env.FRONTEND_URL}?email=${encodeURIComponent(data?.email)}`;

    // // Email content
    // const mailOptions = {
    //   from: '"Support Team" <support@example.com>', // Sender address
    //   to: data?.email,                                   // Recipient email
    //   subject: 'Password Reset Request',           // Subject line
    //   html: `
    //     <p>Click the button below to reset your password:</p>
    //     <a href="${resetLink}" style="background-color:blue;color:white;padding:10px 15px;text-decoration:none;">Reset Password</a>
    //     <p>If you did not request a password reset, please ignore this email.</p>
    //   `,
    // };

    // // Send email
    // await transporter.sendMail(mailOptions);s

    // await sendPasswordResetEmail(data?.email,resetLink)

    return { message: 'Password reset email sent successfully' };
    }
    throw new Error("failed to send password reset email.");
  }

  // reset password
  public async resetPassword(data: any): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let { newPassword, resetToken } = data;
    let decodeToken = new TokenManager().verifyToken(resetToken);
    if (!decodeToken) {
      return { message:"Unauthorized access"}
    }
    let userData = await userRepository.getOne({ 
      email: (decodeToken as JwtPayload)?.data?.email,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
       isActive: 1 });
    if (!userData) {
      return { error: "Invalid or expired token" };
    }
    let hashedPass = await this.passwordService.hashPassword(newPassword);
    userData.password = hashedPass;
    userData.resetPasswordToken = undefined;
    userData.resetPasswordExpires = undefined;
    await userRepository.update({email:userData?.email},userData );
    return {message: " reset successfully" };
  }
  public async getUserInfoByResetToken(resetToken: string): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let userData = await userRepository.getOne({ 
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
       isActive: 1 });
    if (!userData) {
      return { error: "Invalid or expired token" };
    }
    return {email:userData.email}
  }
  
}

export default LoginService;
