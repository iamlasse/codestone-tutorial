import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { ethereal } from './transport'

const send = async (email, subject, template) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  const service = ethereal(nodemailer);
  // create reusable transporter object using the default SMTP transport
  const templatePath = path.join(__dirname, 'templates', `${template}.html`);
  const messageHtml = await fs.createReadStream(templatePath);

  // send mail with defined transport object
  let info = await service.sendMail({
    from: '"CodeStone App 👻" <app@codestone.com>', // sender address
    to: email || "bar@example.com, baz@example.com", // list of receivers
    subject: subject || "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: messageHtml || "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default send;