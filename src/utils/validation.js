export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 30;
export const MAX_MESSAGE_LENGTH = 1000;

/** Trims, collapses inner whitespace and validates the player's name. */
export function validatePlayerName(raw = '') {
  const name = String(raw).trim().replace(/\s+/g, ' ');
  if (!name) return { valid: false, name: '', message: 'Please enter your name to start the game.' };
  if (name.length < MIN_NAME_LENGTH) return { valid: false, name, message: `Your name needs at least ${MIN_NAME_LENGTH} characters.` };
  if (name.length > MAX_NAME_LENGTH) return { valid: false, name, message: `Please keep your name to ${MAX_NAME_LENGTH} characters or fewer.` };
  if (name.includes('<') || name.includes('>') || name.split('').some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  })) return { valid: false, name, message: 'Names can’t contain < > or control characters.' };
  return { valid: true, name, message: '' };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns an object of field -> message (empty object means valid). */
export function validateContact({ name = '', email = '', message = '' }) {
  const errors = {};
  const n = name.trim();
  const m = message.trim();
  if (n.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  else if (n.length > 60) errors.name = 'Please keep your name under 60 characters.';
  if (!email.trim()) errors.email = 'Please enter your email address.';
  else if (email.trim().length > 254 || !EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (m.length < 10) errors.message = 'Please write at least 10 characters.';
  else if (m.length > MAX_MESSAGE_LENGTH) errors.message = `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`;
  return errors;
}
