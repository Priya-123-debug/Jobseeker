import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });
};

export const sendStatusEmail = async (to, name, jobTitle, companyName, status) => {
  const isAccepted = status === "accepted";

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: `Application ${isAccepted ? "Accepted 🎉" : "Update"} — ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${isAccepted ? "#16a34a" : "#dc2626"}; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">
            ${isAccepted ? "🎉 Congratulations!" : "Application Update"}
          </h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your application for <strong>${jobTitle}</strong> at 
          <strong>${companyName}</strong> has been 
          <strong style="color: ${isAccepted ? "#16a34a" : "#dc2626"};">
            ${status.toUpperCase()}
          </strong>.</p>
          <p>Best regards,<br/><strong>JobPortal Team</strong></p>
        </div>
      </div>
    `
  });
};