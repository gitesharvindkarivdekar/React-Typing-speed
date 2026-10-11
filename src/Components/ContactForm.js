import React, { useEffect, useRef, useState } from 'react';
import { validateContact, MAX_MESSAGE_LENGTH } from '../utils/validation';
import { sendContactMessage } from '../utils/contactApi';

const MIN_FILL_MS = 3000; // anything submitted faster than this is almost certainly a bot

export default function ContactForm({ defaultName = '' }) {
  const [values, setValues] = useState({ name: defaultName, email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [trap, setTrap] = useState(''); // honeypot: real people never see or fill this
  const mountedAt = useRef(Date.now());
  const abortRef = useRef(null);
  const refs = { name: useRef(null), email: useRef(null), message: useRef(null) };

  useEffect(() => () => abortRef.current?.abort(), []); // cancel an in-flight request on unmount

  const setField = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || status === 'success') return; // blocks double-clicks / repeat Enter
    const found = validateContact(values);
    setErrors(found);
    const firstBad = ['name', 'email', 'message'].find((k) => found[k]);
    if (firstBad) { refs[firstBad].current?.focus(); return; }

    if (trap) { setStatus('error'); setErrorMessage('Your message couldn’t be sent.'); return; }
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus('error'); setErrorMessage('That was quick! Please review your message and press Send again.'); return;
    }

    setStatus('sending'); setErrorMessage('');
    abortRef.current = new AbortController();
    try {
      await sendContactMessage({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }, abortRef.current.signal);
      setStatus('success');
    } catch (err) {
      if (abortRef.current?.signal.aborted && !err.code) return;
      setStatus('error');
      setErrorMessage(err.userMessage || 'Something went wrong. Your message was not sent.');
    }
  };

  const reset = () => { setValues((v) => ({ ...v, message: '' })); setStatus('idle'); setErrorMessage(''); mountedAt.current = Date.now(); };

  if (status === 'success') {
    return (
      <div className='formDone' role='status'>
        <p><strong>Message sent. Thank you, {values.name.trim().split(' ')[0]}!</strong></p>
        <p className='muted'>I’ll reply to {values.email.trim()} as soon as I can.</p>
        <button type='button' className='btnSecondary' onClick={reset}>Send another message</button>
      </div>
    );
  }

  const sending = status === 'sending';
  const field = (key, label, input) => (
    <div className='field'>
      <label htmlFor={`cf-${key}`}>{label}</label>
      {input}
      {errors[key] && <p id={`cf-${key}-err`} className='fieldMsg error' role='alert'>{errors[key]}</p>}
    </div>
  );
  const common = (key) => ({
    id: `cf-${key}`, ref: refs[key], value: values[key], onChange: setField(key), disabled: sending,
    'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `cf-${key}-err` : undefined, 'aria-required': 'true',
  });

  return (
    <form className='contactForm' onSubmit={handleSubmit} noValidate>
      {field('name', 'Your name', <input type='text' autoComplete='name' maxLength={60} {...common('name')} />)}
      {field('email', 'Your email', <input type='email' autoComplete='email' maxLength={254} {...common('email')} />)}
      {field('message', 'Message', <textarea rows='5' maxLength={MAX_MESSAGE_LENGTH} {...common('message')} />)}
      <p className='counter' aria-hidden='true'>{values.message.length}/{MAX_MESSAGE_LENGTH}</p>

      <div className='hp' aria-hidden='true'>
        <label htmlFor='cf-website'>Leave this field empty</label>
        <input id='cf-website' type='text' name='_gotcha' tabIndex='-1' autoComplete='off' value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div aria-live='polite' className='formStatus'>{sending ? 'Sending your message…' : ''}</div>
      {status === 'error' && <p className='formError' role='alert'>{errorMessage}</p>}
      <button type='submit' className='btnPlay sendBtn' disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
    </form>
  );
}
