// The ONLY file that talks to the email service. To switch providers (Web3Forms, your own
// serverless function, ...), change this file and nothing else.
//
// Default provider: Formspree. The form URL is public by design (it is NOT a secret): the
// destination inbox is configured in your Formspree dashboard, so nobody can redirect mail elsewhere.
// No API keys or email passwords exist anywhere in this app.
const ENDPOINT = process.env.REACT_APP_FORMSPREE_ENDPOINT || '';

export class ContactError extends Error {
  constructor(userMessage, code) {
    super(userMessage);
    this.userMessage = userMessage;
    this.code = code;
  }
}

export const isContactConfigured = () => Boolean(ENDPOINT);

export async function sendContactMessage({ name, email, message }, signal) {
  if (!ENDPOINT) {
    throw new ContactError(
      'The contact form isn’t connected to an email service yet, so your message was NOT sent. Please use LinkedIn instead.',
      'not-configured'
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  if (signal) signal.addEventListener('abort', () => controller.abort());
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, message, _subject: `Typing game message from ${name}` }),
      signal: controller.signal,
    });
    if (res.ok) return; // success is ONLY reported when the service accepted the message
    let detail = '';
    try {
      const data = await res.json();
      detail = (data?.errors || []).map((e) => e.message).join(' ') || data?.error || '';
    } catch { /* body wasn't JSON */ }
    if (res.status === 429) throw new ContactError('Too many messages in a short time. Please wait a minute and try again.', 'rate');
    throw new ContactError(detail ? `The email service said: ${detail}` : 'The email service couldn’t accept your message. Please try again later.', `http-${res.status}`);
  } catch (err) {
    if (err instanceof ContactError) throw err;
    if (err?.name === 'AbortError') throw new ContactError('The request timed out. Please check your connection and try again.', 'timeout');
    throw new ContactError('Couldn’t reach the email service. Please check your connection and try again.', 'network');
  } finally {
    clearTimeout(timeout);
  }
}
