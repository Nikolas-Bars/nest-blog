import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  constructor() {}

  static async sendEmailConfirmationMassage(email: string, subject: string, code: string) {

    const message = ` <h1>Thank for your registration</h1><a href=\'https://blog-t57v.onrender.com/confirm-email?code=${code}\'>complete registration</a>`

    const result: string | null = await this.sendEmail(email, subject, message)

    return result
  }

  static async sendEmail(email: string, subject: string, message: string): Promise<string | null> {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'docum.magic0@gmail.com',
        pass: 'uybtwkdqvbetsvmm'
      }
    })

    let info = await transporter.sendMail({
      from: 'Nikolas Bars <docum.magic0@gmail.com>',
      to: email,
      subject,
      html: message
    })

    return info ? info.messageId : null
  }
}