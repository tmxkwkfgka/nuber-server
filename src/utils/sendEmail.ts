import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: "sandbox00e31998e4e34e08a22111fc3eb57669.mailgun.org"
})

const sendEmail  = (subject: string, html:string)=>{
    const emailData = {
        from: "honggili2222@gmail.com",
        to: "honggili2222@gmail.com",
        subject,
        html
    }
    return mailGunClient.messages().send(emailData);
}

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello! ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject, emailBody);
  };