const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Oussama Bouchikhi <${process.env.EMAIL_FROM}>`;
  }

  /*
  * ? Emails are sent using SendGrid in production but traped using mailtrap during development
  */
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.ENV.SENDGRID_USERNAME,
          pass: process.ENV.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1)- Render HTML based on a Pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2)- Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      // html:
    }
    // 3)- Create a transport Send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours community!');
  }

  async sendResetPassword() {
    await this.send('password', 'Your password reset token (valid only for 10 minutes)');
  }
}
