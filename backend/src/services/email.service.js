const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a 6-digit registration OTP verification email using the Resend SDK.
 * Defaults to using onboarding@resend.dev for developer testing.
 * @param {string} email - Destination email address
 * @param {string} otpCode - 6-digit OTP code string
 * @returns {Promise<object>} Resend response payload
 */
const sendOTPEmail = async (email, otpCode) => {
  try {
    const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';
    const { data, error } = await resend.emails.send({
      from: `Tuma App <${fromEmail}>`,
      to: [email],
      subject: 'Verify Your Tuma Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #FFFFFF; color: #1A1A1A;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1A1A1A; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">TUMA</h1>
          </div>
          <div style="border-top: 4px solid #E8A820; padding-top: 20px;">
            <h2 style="color: #1A1A1A; font-size: 20px; font-weight: bold; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 15px 0;">
              Thank you for signing up with Tuma. To complete your account verification, please enter the 6-digit verification code below:
            </p>
            <div style="background-color: #E8A820; color: #1A1A1A; font-size: 32px; font-weight: bold; text-align: center; padding: 15px 0; border-radius: 16px; margin: 25px 0; letter-spacing: 8px; font-family: monospace;">
              ${otpCode}
            </div>
            <p style="color: #777777; font-size: 14px; line-height: 1.6; margin: 15px 0;">
              This code is valid for <strong>10 minutes</strong>. If you did not request this registration code, you can safely ignore this email.
            </p>
          </div>
          <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 30px; text-align: center; color: #999999; font-size: 12px;">
            &copy; 2026 Tuma App. Nairobi, Kenya. All rights reserved.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Email sending helper error:', err.message);
    throw err;
  }
};

/**
 * Sends a security alert email informing the user that someone tried to register
 * an account using their already registered email address.
 * @param {string} email - Destination email address
 * @param {string} name - Registered user's name
 * @returns {Promise<object>} Resend response payload
 */
const sendAccountExistsEmail = async (email, name) => {
  try {
    const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';
    const { data, error } = await resend.emails.send({
      from: `Tuma App <${fromEmail}>`,
      to: [email],
      subject: 'Security Alert: Registration Attempt on Tuma',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #FFFFFF; color: #1A1A1A;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1A1A1A; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">TUMA</h1>
          </div>
          <div style="border-top: 4px solid #E8A820; padding-top: 20px;">
            <h2 style="color: #1A1A1A; font-size: 20px; font-weight: bold; margin-top: 0;">Security Alert</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 15px 0;">
              Hello ${name},
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 15px 0;">
              Someone recently tried to register a new Tuma account using your email address (<strong>${email}</strong>).
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 15px 0;">
              Since you already have a verified Tuma account, this registration attempt was blocked to protect your credentials. If this was you and you forgot your password, please use the "Forgot Password" option on the Login screen.
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 15px 0;">
              If you did not make this request, you do not need to take any action. Your account remains completely secure.
            </p>
          </div>
          <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 30px; text-align: center; color: #999999; font-size: 12px;">
            &copy; 2026 Tuma App. Nairobi, Kenya. All rights reserved.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend account alert email error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Account alert email helper error:', err.message);
    throw err;
  }
};

module.exports = { 
  sendOTPEmail,
  sendAccountExistsEmail,
};
