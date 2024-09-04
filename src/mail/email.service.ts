import nodemailer, { Transporter } from "nodemailer";

class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  private mailOptions(
    emails: string[],
    subjects: string,
    texts: string,
    htmls: string
  ) {
    const options = {
      from: `"ProAt" ${process.env.USER}`,
      to: emails,
      subject: subjects,
      text: texts,
      html: htmls,
    };
    return options;
  }

  public async sendMail(
    emails: string[],
    subjects: string,
    texts: string,
    htmls: string
  ) {
    await this.transporter.sendMail(
      this.mailOptions(emails, subjects, texts, htmls)
    );
  }
}

export default EmailService;
