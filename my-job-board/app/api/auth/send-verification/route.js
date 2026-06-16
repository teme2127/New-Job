// app/api/auth/send-verification/route.js
import { NextResponse } from 'next/server';

/**
 * Placeholder email verification endpoint.
 * In a real implementation you would generate a secure token, store it (e.g., DB or cache),
 * and send an email using a service like SendGrid, Mailgun, or nodemailer.
 * Here we simply return a success response so the front‑end flow works.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  // TODO: generate token, persist it, send email.
  console.log('🔔 Verification email would be sent to:', email);

  return NextResponse.json({ message: 'Verification email sent' }, { status: 200 });
}
