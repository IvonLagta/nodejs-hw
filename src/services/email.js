import nodemailer from 'nodemailer';

let transporter;

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

const getTransporter = () => {
  if (transporter) return transporter;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER and SMTP_PASSWORD must be configured');
  }

  transporter = nodemailer.createTransport(getSmtpConfig());
  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('SMTP_FROM or SMTP_USER must be configured');
  }

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  return getTransporter().sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Notes App',
    text: 'Your account was created successfully.',
    html: '<p>Your account was created successfully.</p>',
  });
};
