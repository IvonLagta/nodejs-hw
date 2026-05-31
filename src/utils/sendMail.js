import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASSWORD must be configured');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error('SMTP_FROM must be configured');
  }

  return getTransporter().sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
};
