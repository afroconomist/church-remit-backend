import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Step 1: Configure your transporter with SMTP options (e.g., Gmail, etc.)
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Step 2: Create a function to send an email using Pug for rendering HTML content
export const templateMail = async (options: {
  email: string;
  subject: string;
  name: string;
  password: string;
  link: string;
}) => {
  // Step 3: Render the Pug template to HTML
  const html = pug.renderFile(path.join(__dirname, "views", "email-template.pug"), {
    name: options.name,
    password: options.password,
    subject: options.subject,
    link: options.link,
  });

  // Step 4: Create the email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html, // Pug-rendered HTML content
  };

  // Step 5: Send the email using Nodemailer
  return transporter.sendMail(mailOptions);
};

// // Usage example
// sendEmail({
//   to: "recipient@example.com",
//   subject: "Welcome to Our Service",
//   name: "John Doe",
//   message: "Thank you for signing up!",
//   link: "https://example.com",
// })
//   .then(() => console.log("Email sent successfully!"))
//   .catch((error) => console.error("Error sending email:", error));
