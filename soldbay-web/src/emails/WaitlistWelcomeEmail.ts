export function generateWaitlistEmailHtml(data: { name: string; role: string; email: string; university: string; [key: string]: any }) {
  // A clean, modern HTML design matching the Soldbay Landing Page aesthetic
  const isBuyer = data.role.toUpperCase() === 'BUYER';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Soldbay Waitlist</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9fa; padding: 40px 20px; margin: 0;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <h1 style="color: #111827; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">
            Welcome to Soldbay! 🎉
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
            Hi <strong>${data.name}</strong>,<br/><br/>
            You're officially on the list. We're building the campus marketplace where money moves last, and we're thrilled to have you join us as a <strong>${data.role}</strong>.
          </p>
          
          <!-- Details Box -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <h2 style="color: #1e293b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-top: 0; margin-bottom: 16px;">
              Your Waitlist Details
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-size: 14px; width: 40%;"><strong>Email</strong></td>
                <td style="padding: 4px 0; color: #334155; font-size: 14px;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-size: 14px;"><strong>University</strong></td>
                <td style="padding: 4px 0; color: #334155; font-size: 14px;">${data.university}</td>
              </tr>
              ${isBuyer ? `
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-size: 14px;"><strong>Level</strong></td>
                <td style="padding: 4px 0; color: #334155; font-size: 14px;">${data.level || 'N/A'}</td>
              </tr>
              ` : `
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-size: 14px;"><strong>Sells</strong></td>
                <td style="padding: 4px 0; color: #334155; font-size: 14px;">${data.sellsWhat || 'N/A'}</td>
              </tr>
              `}
            </table>
          </div>

          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0;">
            We'll reach out as soon as we're ready to let you in. Stay tuned!
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #f3f4f6; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            &copy; ${new Date().getFullYear()} Soldbay. All rights reserved.<br/>
            Your campus marketplace.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}
