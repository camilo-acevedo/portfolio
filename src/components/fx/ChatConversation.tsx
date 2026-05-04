import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Download, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCvHref } from '@/hooks/useCvHref';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface Prompt {
  id: string;
  label: string;
  question: string;
  response: string;
  cta?: { primary: string; secondary: string };
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  displayText: string;
  fullText: string;
  streaming: boolean;
  tokens: number;
  latency: number;
  cta?: { primary: string; secondary: string };
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function AssistantAvatar({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-muted ring-1 ring-inset ring-accent/30 shadow-[0_0_0_3px_rgb(var(--bg-elevated))]"
      style={{ width: size, height: size }}
    >
      <img
        src="/camilo.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: '50% 22%' }}
      />
    </span>
  );
}

export function ChatConversation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const cvHref = useCvHref();
  const prompts = t('about.chat.prompts', { returnObjects: true }) as Prompt[];

  const [messages, setMessages] = useState<Message[]>([]);
  const [consumedIds, setConsumedIds] = useState<Set<string>>(new Set());
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [typingPending, setTypingPending] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const available = useMemo(
    () => prompts.filter((p) => !consumedIds.has(p.id)),
    [prompts, consumedIds],
  );

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  const pushAssistant = useCallback(
    (fullText: string, cta?: Prompt['cta']) => {
      const id = uid();
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'assistant',
          displayText: reduced ? fullText : '',
          fullText,
          streaming: !reduced,
          tokens: reduced ? Math.ceil(fullText.length / 4) : 0,
          latency: 0,
          cta,
        },
      ]);
      if (!reduced) setIsStreaming(true);
    },
    [reduced],
  );

  const pushUser = useCallback((text: string) => {
    const id = uid();
    setMessages((prev) => [
      ...prev,
      {
        id,
        role: 'user',
        displayText: text,
        fullText: text,
        streaming: false,
        tokens: Math.ceil(text.length / 4),
        latency: 0,
      },
    ]);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setTypingPending(true);
          const greeting = t('about.chat.greeting');
          setTimeout(() => {
            setTypingPending(false);
            pushAssistant(greeting);
          }, 650);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasStarted, pushAssistant, t]);

  useEffect(() => {
    if (!isStreaming) return;
    const last = messages[messages.length - 1];
    if (!last || !last.streaming) return;

    if (last.displayText.length >= last.fullText.length) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                streaming: false,
                tokens: Math.ceil(m.fullText.length / 4),
                latency: 0.7 + Math.random() * 0.9,
              }
            : m,
        ),
      );
      setIsStreaming(false);
      return;
    }

    const remaining = last.fullText.slice(last.displayText.length);
    const nextSpace = remaining.search(/\s/);
    const chunkEnd = nextSpace === -1 ? remaining.length : nextSpace + 1;
    const delay = 26 + Math.random() * 50;

    const timer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                displayText: m.fullText.slice(0, m.displayText.length + chunkEnd),
                tokens: Math.ceil((m.displayText.length + chunkEnd) / 4),
              }
            : m,
        ),
      );
      scrollToBottom();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, typingPending, scrollToBottom]);

  const handlePrompt = (p: Prompt) => {
    if (isStreaming || typingPending) return;
    pushUser(p.question);
    setConsumedIds((prev) => new Set(prev).add(p.id));
    setTypingPending(true);
    setTimeout(() => {
      setTypingPending(false);
      pushAssistant(p.response, p.cta);
    }, 720);
  };

  const handleReset = () => {
    if (isStreaming) return;
    setConsumedIds(new Set());
    setMessages([]);
    setHasStarted(false);
  };

  const modelName = t('about.chat.modelName');
  const inputPlaceholder = t('about.chat.inputPlaceholder');

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[32px] border border-border/60 bg-bg-elevated/80 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]"
    >
      <div className="relative flex items-center justify-between gap-3 px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
        <div className="flex items-center gap-3">
          <AssistantAvatar size={36} />
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-fg">Camilo</span>
            <span className="font-mono text-[11px] text-fg-subtle">
              {modelName} · <span className="text-accent">active now</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent sm:mx-6"
      />

      <div
        ref={scrollRef}
        className="relative max-h-[380px] min-h-[280px] overflow-y-auto px-4 py-5 scrollbar-none sm:max-h-[480px] sm:min-h-[360px] sm:px-5 sm:py-6"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0, black 18px, black calc(100% - 12px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0, black 18px, black calc(100% - 12px), transparent 100%)',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout="position"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={cn(
                'mb-3 flex w-full',
                msg.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'flex max-w-[82%] flex-col gap-1',
                  msg.role === 'user' ? 'items-end' : 'items-start',
                )}
              >
                <div
                  className={cn(
                    'rounded-[22px] px-4 py-2.5 text-[15px] leading-[1.45]',
                    msg.role === 'assistant'
                      ? 'bg-bg-muted text-fg'
                      : 'bg-accent text-bg font-medium',
                  )}
                >
                  <span className="whitespace-pre-wrap break-words">{msg.displayText}</span>
                  {msg.streaming && (
                    <span
                      className={cn(
                        'ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] animate-pulse align-middle',
                        msg.role === 'assistant' ? 'bg-accent' : 'bg-bg',
                      )}
                    />
                  )}
                </div>

                {msg.role === 'assistant' && !msg.streaming && (
                  <div className="flex items-center gap-2 px-1 font-mono text-[10px] text-fg-subtle">
                    <span>{msg.tokens}</span>
                    <span>·</span>
                    <span>{msg.latency.toFixed(2)}s</span>
                    <span>·</span>
                    <span>0.7</span>
                  </div>
                )}

                {msg.cta && !msg.streaming && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.03]"
                    >
                      {msg.cta.primary}
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                    <a
                      href={cvHref}
                      download
                      className="inline-flex items-center gap-1.5 rounded-full bg-bg-muted px-4 py-2 text-[13px] font-semibold text-fg transition-colors hover:bg-bg-muted/70"
                    >
                      <Download size={13} />
                      {msg.cta.secondary}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {typingPending && (
            <motion.div
              key="typing"
              layout="position"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="mb-3 flex w-full justify-start"
            >
              <div className="rounded-[22px] bg-bg-muted px-4 py-3">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative px-5 pb-3 pt-1">
        <AnimatePresence mode="popLayout">
          {available.length > 0 ? (
            <motion.div
              key="prompts"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap justify-center gap-1.5"
            >
              {available.map((p) => (
                <motion.button
                  key={p.id}
                  layout
                  onClick={() => handlePrompt(p)}
                  disabled={isStreaming || typingPending}
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  className={cn(
                    'rounded-full bg-bg-muted px-3.5 py-1.5 font-mono text-[12px] text-fg-muted transition-colors',
                    'hover:bg-accent/15 hover:text-accent',
                    'disabled:cursor-not-allowed disabled:opacity-40',
                  )}
                >
                  {p.label}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full bg-bg-muted px-4 py-1.5 font-mono text-[12px] text-fg-muted transition-colors hover:text-fg"
              >
                <RotateCcw size={11} />
                {t('about.chat.resetLabel')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative px-4 pb-4">
        <div className="flex items-center gap-2 rounded-full bg-bg-muted/70 px-4 py-2.5 ring-1 ring-inset ring-border/40">
          <span className="flex-1 truncate font-mono text-[12px] text-fg-subtle">
            {available.length > 0
              ? `${available.length} prompt${available.length > 1 ? 's' : ''} · ${i18n.resolvedLanguage?.toUpperCase() ?? 'EN'}`
              : inputPlaceholder}
          </span>
          <button
            disabled
            aria-label="send"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent transition-colors disabled:cursor-default"
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
