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

  /*async sendSendgridTemplate({ to, subject, templateId, dynamicTemplateData }: SendSendgridTemplateParams) {
    if (!this.apiKey) return null;

    return sendgrid.send({
      from: this.from,
      to,
      subject,
      templateId,
      dynamicTemplateData,
    });
  }*/
}


export default new EmailService({
  apiKey: config.RESEND_API_KEY,
  from: {
    email: 'alexey.gerasimchuk@api.ship-test-task.cluster.ws',
    name: 'Shopy',
  },
});
