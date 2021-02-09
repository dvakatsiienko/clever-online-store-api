/* Core */
import { createTransport } from 'nodemailer';

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

// transporter
const transport = createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});
