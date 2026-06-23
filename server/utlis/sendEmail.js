import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Application ${isAccepted ? "Accepted 🎉" : "Update"} — ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: ${isAccepted ? "#16a34a" : "#dc2626"}; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">
            ${isAccepted ? "🎉 Congratulations!" : "Application Update"}
          </h1>
        </div>

        <!-- Body -->
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #374151;">
            Your application for <strong>${jobTitle}</strong> at 
            <strong>${companyName}</strong> has been 
            <span style="color: ${isAccepted ? "#16a34a" : "#dc2626"}; font-weight: bold;">
              ${status.toUpperCase()}
            </span>.
          </p>

          ${isAccepted
            ? `<div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 12px; border-radius: 4px; margin: 16px 0;">
                <p style="margin: 0; color: #166534;">
                  The recruiter will contact you soon with next steps. 
                  Keep your phone and email handy!
                </p>
              </div>`
            : `<div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; border-radius: 4px; margin: 16px 0;">
                <p style="margin: 0; color: #991b1b;">
                  Don't be discouraged! Keep applying to other opportunities 
                  on our platform — the right job is out there for you.
                </p>
              </div>`
          }

          <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
            Best regards,<br/>
            <strong>JobPortal Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  });
};
