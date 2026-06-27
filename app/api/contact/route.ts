import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, phone, company, message } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'JAR Website <no-reply@jarsaudi.com>',
    to: ['info@jarsaudi.com'],
    subject: `رسالة جديدة من ${name}${company ? ` — ${company}` : ''}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl;">
        <h2 style="color: #1a2e1a; margin-bottom: 24px;">رسالة جديدة من موقع جار</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; color: #666; width: 120px;">الاسم</td><td style="padding: 10px 0; color: #1a2e1a; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 10px 0; color: #666;">البريد</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #2d6a2d;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 10px 0; color: #666;">الهاتف</td><td style="padding: 10px 0; color: #1a2e1a;">${phone}</td></tr>` : ''}
          ${company ? `<tr><td style="padding: 10px 0; color: #666;">الشركة</td><td style="padding: 10px 0; color: #1a2e1a;">${company}</td></tr>` : ''}
        </table>
        ${message ? `<div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;"><p style="color: #666; margin: 0 0 8px;">الرسالة</p><p style="color: #1a2e1a; margin: 0; white-space: pre-wrap;">${message}</p></div>` : ''}
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
