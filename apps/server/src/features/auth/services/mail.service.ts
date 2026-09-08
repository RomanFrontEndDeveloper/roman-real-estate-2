import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string,
) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify your account",
    html: `
      <h2>Welcome to Roman Real Estate!</h2>

      <p>Please verify your email address by clicking the button below:</p>

      <p>
        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify your account
        </a>
      </p>

      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  resetPasswordUrl: string,
) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset your Roman Real Estate password</h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to choose a new password:
      </p>

      <p>
        <a
          href="${resetPasswordUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset your password
        </a>
      </p>

      <p>This link will expire in 1 hour.</p>

      <p>
        If you did not request a password reset, you can safely ignore this email.
      </p>
    `,
  });
};
