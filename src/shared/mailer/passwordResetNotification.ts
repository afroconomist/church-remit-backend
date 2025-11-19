import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv"
dotenv.config();

var transporter = nodemailer.createTransport({
  service:  process.env.MAIL_SERVICE,
  auth: {
    user:  process.env.MAIL_USERNAME,
    pass:  process.env.MAIL_PASSWORD
  },
});

var option = {
    viewEngine : {
        extname: '.hbs', // handlebars extension
        layoutsDir: __dirname+'/views/', // location of handlebars templates
        defaultLayout: 'password_reset_notification', // name of main template
    },
    viewPath: __dirname+'/views/',
    extName: '.hbs'
};

const send = async (options:any) => {

    await transporter.use('compile', hbs(option));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: `${options.email}`,
      subject: `${options.message}`,
      template: 'password_reset_notification',
      context: {
        name: `${options.username}`
      }
    };
  
    const info = await transporter.sendMail(message);
    //console.log(info);
    return info;
}


export default { send };



