import fs from 'fs';
import path from 'path';

export default function (template) {
  return async function (req, res, next) {
    const { username: email } = req.user;
    // Implement the middleware function based on the options object
    const templateHtml = path.join(__dirname, 'templates', `${template}.html`);
    const html = await fs.createReadStream(templateHtml);
    req.locals = {
      ...req.locals,
      template: html,
      email,
    };
    next()
  }
}