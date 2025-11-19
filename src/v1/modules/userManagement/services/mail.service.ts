import nodemailer, { Transporter } from "nodemailer";
import pug from "pug";
import path from "path";
import logger from "@shared/utils/logger";

class MailService {
  private transporter: Transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendLoginEmail(options: any): Promise<void> {
    const data = { name: options.name }
    try {
        await this.sendMail(data, options, "login");
    } catch (error: any) {
        logger.error({error: error.message}, "Error sending mail");
    }
  }

  async sendUserAccountMail(options: any): Promise<void> {
    const data = { name: options.name,
        email: options.email,
        password: options.password,
        subject: options.subject,
        link: options.link }
    try {
        await this.sendMail(data, options, "user_account");
    } catch (error: any) {
        logger.error({error: error.message}, "Error sending mail");
    }
  }
  
  async sendAccountReactivationMail(options: any): Promise<void> {
    const data = {
        name: options.name,
        email: options.email,
        password: options.password,
        subject: options.subject,
        link: options.link,
    }
    try {
        await this.sendMail(data, options, "reactivate-account");
    } catch (error: any) {
        logger.error({error: error.message}, "Error sending mail");
    }
  }

  async sendBulkUserAccountMail(optionsList: any[]): Promise<void> {
    try {
      const promises = optionsList.map(options => {
        const data = {
          name: options.name,
          email: options.email,
          password: options.password,
          subject: options.subject,
          link: options.link,
        };
        return this.sendMail(data, options, "user_account");
      });
      await Promise.all(promises);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending bulk emails");
    }
  }
  
  async sendOTPMail(options: any): Promise<void> {
    const data = {
        name: options.name,
        email: options.email,
        otp: options.otp,
        subject: options.subject,
    }
    try {
        await this.sendMail(data, options, "otp");
    } catch (error: any) {
        logger.error({error: error.message}, "Failed to send OTP");   
    }
  }

  async policyCreationMail(options: any): Promise<void> {
    const data = {
        name: options.name,
        subject: options.subject,
        email: options.email
    }
    try {
        await this.sendMail(data, options, "policy-creation");
    } catch (error: any) {
        logger.error({error: error.message}, "Failed to send OTP"); 
    }
  }

  async policyRejectionMail(options: any): Promise<void> {
    const data = {
        name: options.name,
        subject: options.subject,
        email: options.email
    }
    try {
        await this.sendMail(data, options, "policy-rejection");
    } catch (error: any) {
        logger.error({error: error.message}, "Failed to send OTP");   
    }
  }
  
  private async sendMail(data: any, options: any, template: any): Promise<void> {
    const html = this.renderTemplate(`${template}.pug`, data);

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      logger.error({error: error.message}, "Failed to send email");
      throw new Error("Failed to send email");
    }
  }

  
  private renderTemplate(templateName: string, data: any): string {
    const templatePath = path.resolve(__dirname, "../../../../../src/shared/mailer/views", templateName);
    return pug.renderFile(templatePath, data);
  }
}

export default MailService;