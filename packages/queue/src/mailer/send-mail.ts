import { EmailVerification, ForgetPasswordEmail } from "@celluloid/emails";
import { render } from "@react-email/components";
import * as nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../env";
import getTransport from "./transport";

const isDev = process.env.NODE_ENV !== "production";
const isCI_TEST = process.env.CI_TEST;

export async function sendMail(to: string, subject: string, html: string) {
  // if (isCI_TEST) {
  //   return console.log(`email send to ${to}`);
  // }

  const transport = await getTransport();
  const mailOptions = {
    from: `"E-spectator" <${env.SMTP_EMAIL_FROM}>`,
    to,
    subject,
    html,
  };
  // await transport.sendMail(mailOptions);

  const resend = new Resend(env.RESEND_API_KEY);
  resend.emails.send({
    from: "contact@updates.celluloid.me",
    to,
    subject,
    html,
  });

  // if (isDev) {
  //   const url = nodemailer.getTestMessageUrl(info);
  //   if (url) {
  //     // Hex codes here equivalent to chalk.blue.underline
  //     console.log(
  //       `Development email preview: \x1B[34m\x1B[4m${url}\x1B[24m\x1B[39m`
  //     );
  //   }
  // }
  return true;
}

export async function sendForgetPassword({
  username,
  email,
  otp,
}: {
  username?: string;
  email: string;
  otp: string;
}) {
  const subject = "[e-spectator] Réinitialisation de votre mot de passe.";
  const emailHtml = await render(ForgetPasswordEmail({ username, email, otp }));
  return sendMail(email, subject, emailHtml);
}

export async function sendEmailVerification({
  username,
  email,
  otp,
}: {
  username?: string;
  email: string;
  otp: string;
}) {
  const subject = "[e-spectator] Vérification de votre email";
  const emailHtml = await render(EmailVerification({ username, otp }));
  return sendMail(email, subject, emailHtml);
}
