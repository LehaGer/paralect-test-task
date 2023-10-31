import config from 'config';
import { Resend } from 'resend';
import { renderEmailHtml, Template } from 'mailer';

import { EmailServiceConstructorProps, SendTemplateParams } from './email.types';

class EmailService {
  apiKey: string | undefined;

  from: string;

  resendInstance: Resend | undefined;

  constructor({ apiKey, from }: EmailServiceConstructorProps) {
    this.apiKey = apiKey;
    this.from = `${from.name} <${from.email}>`;

    if (apiKey) this.resendInstance = new Resend(apiKey);
  }

  async sendTemplate<T extends Template>({ to, subject, template, params }: SendTemplateParams<T>) {
    if (!this.apiKey) return null;

    const html = await renderEmailHtml({ template, params });

    return this.resendInstance?.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}


export default new EmailService({
  apiKey: config.RESEND_API_KEY,
  from: {
    email: config.RESEND_APP_EMAIL,
    name: 'Shopy',
  },
});
