import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, firstName, cc, pdfBase64, reportId, lastName } = await req.json();

    // 1. Basic field validation
    if (!email || !firstName || !pdfBase64 || !reportId || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Server-side PDF attachment validation (Size & Header check)
    const approximateSizeInBytes = (pdfBase64.length * 3) / 4;
    const FIVE_MB = 5 * 1024 * 1024;
    
    if (approximateSizeInBytes > FIVE_MB) {
      return NextResponse.json({ 
        error: 'PDF file size exceeds the 5MB limit.' 
      }, { status: 400 });
    }

    // Verify PDF Magic Header (%PDF- base64 is typically JVBERi0)
    if (!pdfBase64.startsWith('JVBERi0')) {
      return NextResponse.json({ 
        error: 'Invalid PDF format. Attachment must be a valid PDF.' 
      }, { status: 400 });
    }

    // 3. Sender & BCC fallback configuration from Env
    const emailFrom = process.env.EMAIL_FROM || 'Solar Release Co. <reports@solarreleaseco.com>';
    const emailBcc = process.env.EMAIL_BCC || 'clientcare@solarrelease.com';
    const subject = 'Your Solar Agreement Diagnostic Analysis Report';
    
    // 4. Construct client-facing email HTML body (Internal notes NOT included)
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #0b1324; margin: 0; font-size: 20px; letter-spacing: 1px;">SOLAR RELEASE CO.</h2>
          <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Consumer Protection Review</span>
        </div>

        <p style="font-size: 14px; margin-top: 0;">Hi ${firstName},</p>
        
        <p style="font-size: 14px;">Thank you for completing your Solar Release Co. diagnostic review.</p>
        
        <p style="font-size: 14px;">Your Solar Case Strength Score™ report is attached for your records. This report summarizes the information provided during your review, including your case score, potential concern indicators, financial projections, and next steps in the review process.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #d4af37; padding: 12px 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #0b1324;">Review Status: Phase 1 Complete</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">You have completed 3 of 6 review stages and your case has advanced into the documentation phase.</p>
        </div>
        
        <p style="font-size: 14px; font-weight: bold; color: #0b1324; margin-bottom: 8px;">Next step:</p>
        <p style="font-size: 14px; margin-top: 0;">Please upload or send your solar agreement, installation agreement, finance agreement, utility bills, and any related documents requested by your case specialist.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 12px; margin: 25px 0 15px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px;">Important Notice</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #991b1b; line-height: 1.5;">This diagnostic report is for review purposes only and does not constitute legal advice, financial advice, or a guarantee of resolution. If attorney-backed review is appropriate, your case may be escalated for legal evaluation.</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px; font-size: 12px; color: #64748b;">
          <p style="margin: 0; font-weight: bold; color: #334155;">Solar Release Co.</p>
          <p style="margin: 2px 0 0 0;">Consumer Contract Review Division</p>
          <p style="margin: 8px 0 0 0;"><a href="https://www.SolarReleaseCo.com" style="color: #d4af37; text-decoration: none; font-weight: bold;">www.SolarReleaseCo.com</a></p>
          <p style="margin: 8px 0 0 0; font-weight: bold; color: #334155;">Office:</p>
          <p style="margin: 2px 0 0 0;">1-855-396-5090</p>
          <p style="margin: 8px 0 0 0; font-weight: bold; color: #334155;">Client Care:</p>
          <p style="margin: 2px 0 0 0;"><a href="mailto:clientcare@solarrelease.com" style="color: #d4af37; text-decoration: none; font-weight: bold;">clientcare@solarrelease.com</a></p>
          <p style="margin: 12px 0 0 0; font-weight: bold; color: #334155;">Case Review Team</p>
        </div>
      </div>
    `;

    const filename = `Solar-Case-Strength-Score-${lastName}-${reportId}.pdf`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    if (resendApiKey) {
      // Send via Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [email],
          cc: cc ? [cc] : undefined,
          bcc: [emailBcc],
          subject: subject,
          html: emailHtml,
          attachments: [
            {
              filename: filename,
              content: pdfBase64
            }
          ]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Resend API error:', errorText);
        return NextResponse.json({ 
          success: false, 
          provider: 'resend', 
          error: `Resend sending failed: ${res.statusText}. Details: ${errorText}` 
        }, { status: 502 });
      }

      return NextResponse.json({ success: true, provider: 'resend' });

    } else if (sendgridApiKey) {
      // Send via SendGrid API
      const personalizations: any = {
        to: [{ email: email }],
        bcc: [{ email: emailBcc }]
      };
      if (cc) {
        personalizations.cc = [{ email: cc }];
      }

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [personalizations],
          from: { email: emailFrom.includes('<') ? emailFrom.split('<')[1].replace('>', '').trim() : emailFrom, name: 'Solar Release Co.' },
          subject: subject,
          content: [
            {
              type: 'text/html',
              value: emailHtml
            }
          ],
          attachments: [
            {
              content: pdfBase64,
              type: 'application/pdf',
              filename: filename,
              disposition: 'attachment'
            }
          ]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('SendGrid API error:', errorText);
        return NextResponse.json({ 
          success: false, 
          provider: 'sendgrid', 
          error: `SendGrid sending failed: ${res.statusText}. Details: ${errorText}` 
        }, { status: 502 });
      }

      return NextResponse.json({ success: true, provider: 'sendgrid' });

    } else {
      // No API keys configured, run in Mock Mode for verification/testing
      console.warn('Neither RESEND_API_KEY nor SENDGRID_API_KEY is configured in environment variables. Running in DEV MOCK MODE.');
      
      // Simulate slow network send
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({ 
        success: true, 
        provider: 'mock',
        message: 'Mock email sent successfully (development mode, no API keys configured).'
      });
    }

  } catch (error: any) {
    console.error('Error in send email API route:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
