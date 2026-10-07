import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(RESEND_API_KEY);

const MAIL_FROM =
  process.env.MAIL_FROM ||
  "Roman Real Estate <onboarding@resend.dev>";

export const sendResetPasswordEmail = async (
  email: string,
  resetPasswordUrl: string,
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: MAIL_FROM,
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
        If you did not request a password reset,
        you can safely ignore this email.
      </p>
    `,
  });

  if (error) {
    console.error("Reset password email error:", error);

    throw new Error(
      "Failed to send reset password email",
    );
  }
};