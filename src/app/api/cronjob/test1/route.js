import nodemailer from "nodemailer";

export const GET = async (req) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: "cron-job@hostelplates.com",
    to: "akibrahman5200@gmail.com",
    subject: "Cron Job",
    html: `<p>This is the Prove</p>`,
  };

  await transport.sendMail(mailOptions);
};
