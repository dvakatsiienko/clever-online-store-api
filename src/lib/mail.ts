/* Core */
import { createTransport, getTestMessageUrl } from 'nodemailer';

const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    FRONTEND_URL_DEV,
} = process.env;

const transport = createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

export const sendPasswordResetEmail = async (
    resetToken: string,
    to: string,
): Promise<void> => {
    const info = await transport.sendMail({
        to,
        from:    'imagnum.satellite@gmail.com',
        subject: 'Your password reset token!',
        html:    makeNiceEmail(`Your Password Reset Token is here!
        <a target="_blank" ref="noreferrer noopener" href="${FRONTEND_URL_DEV}/setup-new-password?token=${resetToken}">Click Here to reset</a>
      `),
    });

    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(
            `💌 Message Sent! Preview it at ${getTestMessageUrl(info)}`,
        );
    }
};

/* Helpers */
function makeNiceEmail(text: string) {
    return `
      <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
      ">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>😘, Dima 😈</p>
      </div>
    `;
}

/* Types */
export interface MailResponse {
    accepted?: string[] | null;
    rejected?: null[] | null;
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
}

export interface Envelope {
    from: string;
    to?: string[] | null;
}
