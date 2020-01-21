
export const ethereal = nodemailer => nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'coby.ritchie@ethereal.email',
      pass: '6YFBFs7jPKbESwrzzu'
  }
});

