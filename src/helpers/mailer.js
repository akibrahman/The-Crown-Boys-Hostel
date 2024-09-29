import ForgotEmail from "@/Components/VerificationEmail/ForgotEmail";
import VerificationEmail from "@/Components/VerificationEmail/VerificationEmail";
import User from "@/models/userModel";
import { render } from "@react-email/render";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, emailType, userId, userName }) => {
  try {
    const transport = nodemailer.createTransport({
      host: "mail.thecrownboyshostel.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.VERIFY_EMAIL_USERNAME,
        pass: process.env.VERIFY_EMAIL_PASSWORD,
      },
    });
    let emailHtml;
    let mailOptions;
    if (emailType === "verify") {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
      emailHtml = render(
        VerificationEmail({
          userFirstname: userName,
          url: `${process.env.CLIENT_SIDE}/verifyemail?token=${hashedToken}`,
        })
      );
      mailOptions = {
        from: `'The Crown Boys Hostel' <${process.env.VERIFY_EMAIL_USERNAME}>`,
        to: email,
        subject: "E-mail Verification | The Crown Boys Hostel",
        html: emailHtml,
      };
    } else if (emailType === "reset") {
      const hashedToken = await bcryptjs.hash(email, 10);
      await User.findOneAndUpdate(
        { email },
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        }
      );
      emailHtml = render(
        ForgotEmail({
          userFirstname: userName,
          url: `${process.env.CLIENT_SIDE}/forgotPassword?token=${hashedToken}`,
        })
      );
      mailOptions = {
        from: `'The Crown Boys Hostel' <${process.env.VERIFY_EMAIL_USERNAME}>`,
        to: email,
        subject: "Password Reset | The Crown Boys Hostel",
        html: emailHtml,
      };
    }
    const mailRes = await transport.sendMail(mailOptions);
    return mailRes;
  } catch (error) {
    console.log("Error in Mail sender");
    console.log(error);
    throw new Error(error);
  }
};
