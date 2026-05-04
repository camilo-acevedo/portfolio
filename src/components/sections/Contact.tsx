import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Copy,
  Download,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DecryptText } from '@/components/fx/DecryptText';
import { useCvHref } from '@/hooks/useCvHref';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = 'idle' | 'sending' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  budget: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function Contact() {
  const { t, i18n } = useTranslation();
  const formStrings = t('contact.form', { returnObjects: true }) as Record<string, string>;
  const budgetOptions = t('contact.budgetOptions', { returnObjects: true }) as string[];
  const direct = t('contact.direct', { returnObjects: true }) as Record<string, string>;
  const cvHref = useCvHref();

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    budget: budgetOptions[0] ?? '',
    message: '',
  });
  const [state, setState] = useState<FormState>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string>('');

  const emailValid = EMAIL_RE.test(form.email.trim());
  const canSubmit =
    form.name.trim().length > 1 &&
    emailValid &&
    form.message.trim().length > 3 &&
    state !== 'sending';

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setState('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          budget: form.budget,
          message: form.message.trim(),
          locale: i18n.resolvedLanguage ?? 'en',
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'network_error');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setErrorMsg('');
    setForm({ name: '', email: '', budget: budgetOptions[0] ?? '', message: '' });
    setTouched({});
  };

  const firstName = form.name.trim().split(/\s+/)[0] || '';

  return (
    <section id="contact" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
        <div className="mb-20 flex flex-col items-start gap-5 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          >
            <DecryptText text={t('contact.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('contact.title')}{' '}
            <span className="gradient-text italic">{t('contact.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-2xl text-base text-fg-muted md:text-lg"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {state === 'success' ? (
            <SuccessPanel
              key="success"
              name={firstName}
              title={formStrings.successTitle}
              body={formStrings.successBody}
              sendAnother={formStrings.sendAnother}
              onReset={handleReset}
            />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              onSubmit={handleSubmit}
              className="relative"
              noValidate
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                <EditorialField
                  label={formStrings.nameLabel}
                  value={form.name}
                  onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  placeholder={formStrings.namePlaceholder}
                  required
                  touched={touched.name}
                  requiredLabel={formStrings.required}
                  delay={0.3}
                />
                <EditorialField
                  label={formStrings.emailLabel}
                  value={form.email}
                  onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  placeholder={formStrings.emailPlaceholder}
                  required
                  touched={touched.email}
                  requiredLabel={formStrings.required}
                  invalidLabel={formStrings.invalidEmail}
                  type="email"
                  isValid={form.email.length === 0 || emailValid}
                  delay={0.38}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: 0.46, ease: EASE }}
                className="mt-10 md:mt-12"
              >
                <label className="block font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
                  {formStrings.budgetLabel}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {budgetOptions.map((opt) => {
                    const selected = form.budget === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, budget: opt }))}
                        className={cn(
                          'rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-all duration-300',
                          selected
                            ? 'border-fg bg-fg text-bg'
                            : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <EditorialTextarea
                label={formStrings.messageLabel}
                value={form.message}
                onChange={(v) => setForm((p) => ({ ...p, message: v }))}
                onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                placeholder={formStrings.messagePlaceholder}
                required
                touched={touched.message}
                requiredLabel={formStrings.required}
                delay={0.54}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: 0.64, ease: EASE }}
                className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4"
              >
                {state === 'error' && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-rose-500 dark:text-rose-400">
                    {formStrings.errorLabel ?? 'failed to send'} — {errorMsg}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14px] font-semibold transition-all duration-300',
                    canSubmit
                      ? 'bg-fg text-bg hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgb(var(--accent)/0.6)]'
                      : 'bg-bg-muted text-fg-subtle cursor-not-allowed',
                  )}
                >
                  {state === 'sending' ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-2"
                    >
                      <span className="flex gap-0.5">
                        <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
                      </span>
                      {formStrings.sending}
                    </motion.span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {formStrings.send}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-20 md:mt-28"
        >
          <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
            <span className="h-px w-10 bg-border-strong" />
            <span>{direct.heading}</span>
          </div>
          <div className="divide-y divide-border/60 border-y border-border/60">
            <ChannelRow
              index={0}
              icon={Mail}
              label={direct.emailLabel}
              value={direct.emailValue}
              actionCopy={direct.copy}
              actionCopied={direct.copied}
              copyText={direct.emailValue}
            />
            <ChannelRow
              index={1}
              icon={CalendarClock}
              label={direct.callLabel}
              value={direct.callValue}
              action={direct.book}
              disabled
            />
            <ChannelRow
              index={2}
              icon={Linkedin}
              label={direct.linkedinLabel}
              value={direct.linkedinValue}
              action={direct.open}
              href="https://www.linkedin.com/in/bryam-camilo-acevedo"
              external
            />
            <ChannelRow
              index={3}
              icon={Download}
              label={direct.cvLabel}
              value={direct.cvValue}
              action={direct.download}
              href={cvHref}
              download
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface EditorialFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder: string;
  required?: boolean;
  touched?: boolean;
  requiredLabel?: string;
  invalidLabel?: string;
  type?: string;
  isValid?: boolean;
  delay: number;
}

function EditorialField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  touched,
  requiredLabel,
  invalidLabel,
  type = 'text',
  isValid = true,
  delay,
}: EditorialFieldProps) {
  const showRequired = required && touched && value.trim() === '';
  const showInvalid = touched && !isValid && value.trim() !== '';
  const error = showRequired || showInvalid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="flex flex-col"
    >
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
        {error && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-rose-500 dark:text-rose-400">
            {showRequired ? requiredLabel : invalidLabel}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          'mt-2 w-full bg-transparent pb-2.5 pt-1 font-serif text-xl text-fg caret-accent outline-none transition-colors placeholder:text-fg-subtle/60 md:text-2xl',
          'border-b',
          error ? 'border-rose-500/40 focus:border-rose-500' : 'border-border focus:border-accent',
        )}
        autoComplete="off"
        spellCheck={false}
      />
    </motion.div>
  );
}

interface EditorialTextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder: string;
  required?: boolean;
  touched?: boolean;
  requiredLabel?: string;
  delay: number;
}

function EditorialTextarea({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  touched,
  requiredLabel,
  delay,
}: EditorialTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const showRequired = required && touched && value.trim() === '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(96, el.scrollHeight) + 'px';
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="mt-10 flex flex-col md:mt-12"
    >
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
        {showRequired && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-rose-500 dark:text-rose-400">
            {requiredLabel}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={3}
        className={cn(
          'mt-2 w-full resize-none bg-transparent pb-2.5 pt-1 font-serif text-lg leading-relaxed text-fg caret-accent outline-none transition-colors placeholder:text-fg-subtle/60 md:text-xl',
          'border-b',
          showRequired
            ? 'border-rose-500/40 focus:border-rose-500'
            : 'border-border focus:border-accent',
        )}
        spellCheck={false}
      />
    </motion.div>
  );
}

interface ChannelRowProps {
  index: number;
  icon: LucideIcon;
  label: string;
  value: string;
  action?: string;
  actionCopy?: string;
  actionCopied?: string;
  copyText?: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  disabled?: boolean;
}

function ChannelRow({
  index,
  icon: Icon,
  label,
  value,
  action,
  actionCopy,
  actionCopied,
  copyText,
  href,
  external,
  download,
  disabled,
}: ChannelRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const isCopy = Boolean(copyText);
  const actionLabel = isCopy ? (copied ? actionCopied : actionCopy) : action;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.08, ease: EASE }}
      className={cn(
        'group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-1 py-5 transition-colors duration-300 md:gap-6 md:px-2 md:py-6',
        !disabled && 'hover:bg-accent/[0.03]',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
            isCopy && copied
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
              : 'border-border text-fg-muted group-hover:border-border-strong group-hover:text-fg',
          )}
        >
          {isCopy && copied ? (
            <Check size={13} strokeWidth={2} />
          ) : (
            <Icon size={13} strokeWidth={1.8} />
          )}
        </span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle sm:inline">
          {label}
        </span>
      </div>
      <span className="truncate font-serif text-lg text-fg md:text-xl">{value}</span>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
          disabled
            ? 'text-fg-subtle opacity-50'
            : copied
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-fg-subtle group-hover:text-accent',
        )}
      >
        {isCopy ? (
          copied ? (
            <Check size={11} />
          ) : (
            <Copy size={11} />
          )
        ) : (
          <ArrowUpRight size={11} />
        )}
        <span className="hidden sm:inline">{actionLabel}</span>
      </span>
    </motion.div>
  );

  if (isCopy) {
    return (
      <button onClick={handleCopy} className="w-full text-left" type="button">
        {content}
      </button>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download ? '' : undefined}
        className="block"
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <div className={cn('block', disabled && 'cursor-not-allowed')} aria-disabled={disabled}>
      {content}
    </div>
  );
}

interface SuccessPanelProps {
  name: string;
  title: string;
  body: string;
  sendAnother: string;
  onReset: () => void;
}

function SuccessPanel({ name, title, body, sendAnother, onReset }: SuccessPanelProps) {
  const greeting = title.replace('{{name}}', name || 'there');
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative py-8"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-70" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        </span>
        received
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        className="mt-6 font-serif text-4xl italic leading-tight text-fg md:text-6xl lg:text-7xl text-balance"
      >
        {greeting}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
        className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg"
      >
        {body}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-subtle transition-colors hover:text-accent"
        type="button"
      >
        <span className="h-px w-6 bg-current" />
        {sendAnother}
      </motion.button>
    </motion.div>
  );
}
