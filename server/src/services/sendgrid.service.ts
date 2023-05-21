import sgMail from '@sendgrid/mail';
import config from '../config/config';

sgMail.setApiKey(config.sendgrid);

export async function sendSignedUpEmail(email: string) {
  const msg = {
    to: email,
    from: {
      email: 'contact@excelsimplify.com',
      name: 'ExcelSimplify',
    },
    subject: 'Welcome to ExcelSimplfy',
    templateId: 'd-159f6a0448144c65902e5d6430aefd53',
    Sender_Name: 'ExcelSimplfy by Maple GPT Software Inc',
    Sender_Address: '5325 rue de Paimpol',
    Sender_City: 'Montreal',
    Sender_Zip: 'H1S 1E1',
  };

  try {
    const response = await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
}
