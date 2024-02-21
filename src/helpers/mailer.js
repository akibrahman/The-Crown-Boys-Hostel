import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "verify") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "reset") {
      await User.findOneAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      // port: 587,
      // secure: false,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: "checker@hostelplates.com",
      to: email,
      subject: "Verify Email",
      html: `<p>Click <a href="${process.env.CLIENT_SIDE}/verifyemail?token=${hashedToken}"> Here </a> to Verify</p>`,
    };

    const mailRes = await transport.sendMail(mailOptions);
    return mailRes;
  } catch (error) {
    console.log("Error in Mail sender");
    console.log(error);
    throw new Error(error);
  }
};
