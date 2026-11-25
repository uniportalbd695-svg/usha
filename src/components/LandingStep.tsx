import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

const NO_MESSAGES = [
  'No 🙈',
  'Are you sure? 🙈',
  'Really sure? 🥺',
  'Nice try! 💕',
  'Still no? 🌸',
  'Think again! 💗',
  'Just click Yes! ✨',
];

interface LandingStepProps {
  onYesClick: () => void;
  onBurst: () => void;
}

export default function LandingStep({ onYesClick, onBurst }: LandingStepProps) {
  const [noCount, setNoCount] = useState(0);
  const [noOffset, setNoOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const yesBtnRef = useRef<HTMLButtonElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (noCount === 0) return;

    const handleResize = () => {
      const noEl = noBtnRef.current;
      if (!noEl) return;
      const rect = noEl.getBoundingClientRect();
      const pad = 16;
      let dx = 0;
      let dy = 0;

      if (rect.left < pad) dx = pad - rect.left;
      if (rect.right > window.innerWidth - pad) {
        dx = window.innerWidth - pad - rect.right;
      }
      if (rect.top < 72) dy = 72 - rect.top;
      if (rect.bottom > window.innerHeight - pad) {
        dy = window.innerHeight - pad - rect.bottom;
      }

      if (dx !== 0 || dy !== 0) {
        setNoOffset((prev) => ({
          x: Math.round(prev.x + dx),
          y: Math.round(prev.y + dy),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noCount]);

  const moveNoButton = () => {
    const noEl = noBtnRef.current;
    if (!noEl) {
      setNoCount((c) => c + 1);
      return;
    }

    const noRect = noEl.getBoundingClientRect();
    const originLeft = noRect.left - noOffset.x;
    const originTop = noRect.top - noOffset.y;

    const estWidth = Math.max(noRect.width, 168);
    const estHeight = Math.max(noRect.height, 48);

    const minLeft = 16;
    const maxLeft = Math.max(minLeft, window.innerWidth - estWidth - 16);
    const minTop = 76;
    const maxTop = Math.max(minTop, window.innerHeight - estHeight - 20);

    const protectedRects = [
      yesBtnRef.current?.getBoundingClientRect(),
      headingRef.current?.getBoundingClientRect(),
      mediaRef.current?.getBoundingClientRect(),
    ].filter((r): r is DOMRect => Boolean(r));

    const hitsProtected = (left: number, top: number) => {
      const buffer = 14;
      const right = left + estWidth;
      const bottom = top + estHeight;
      return protectedRects.some(
        (r) =>
          !(
            right < r.left - buffer ||
            left > r.right + buffer ||
            bottom < r.top - buffer ||
            top > r.bottom + buffer
          )
      );
    };

    let chosenLeft = minLeft;
    let chosenTop = minTop;
    let bestDistance = -1;

    for (let i = 0; i < 64; i++) {
      const candLeft = minLeft + Math.random() * Math.max(1, maxLeft - minLeft);
      const candTop = minTop + Math.random() * Math.max(1, maxTop - minTop);

      if (hitsProtected(candLeft, candTop)) continue;

      const dist = Math.hypot(candLeft - noRect.left, candTop - noRect.top);
      if (dist >= 95) {
        chosenLeft = candLeft;
        chosenTop = candTop;
        bestDistance = dist;
        break;
      }

      if (dist > bestDistance) {
        bestDistance = dist;
        chosenLeft = candLeft;
        chosenTop = candTop;
      }
    }

    // Fallback: avoid Yes button even on tight viewports
    if (bestDistance < 0) {
      const yesRect = yesBtnRef.current?.getBoundingClientRect();
      chosenLeft = minLeft + Math.random() * Math.max(1, maxLeft - minLeft);
      chosenTop =
        yesRect && yesRect.top > window.innerHeight * 0.5 ? minTop : maxTop;
    }

    setNoOffset({
      x: Math.round(chosenLeft - originLeft),
      y: Math.round(chosenTop - originTop),
    });
    setNoCount((c) => c + 1);
  };

  const handleYes = () => {
    onBurst();
    onYesClick();
  };

  const noLabel = NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)];
  const yesScale = Math.min(1 + noCount * 0.05, 1.2);

  return (
    <section
      aria-label="Date invitation for Usha"
      className="flex w-full justify-center"
    >
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-rose-200/80 bg-white/88 px-6 py-8 text-center shadow-[0_24px_60px_-15px_rgba(190,24,93,0.16)] backdrop-blur-md sm:px-10 sm:py-10"
      >
        <p className="text-sm font-medium text-rose-700">
          For Usha <span aria-hidden="true">·</span> A Special Invitation
        </p>

        {/* Portrait frame inspired by the supplied couple GIF */}
        <div
          ref={mediaRef}
          className="relative mx-auto mt-5 w-44 sm:w-52 animate-gentle-float"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-rose-200/90 bg-rose-50 shadow-[0_14px_34px_-10px_rgba(225,29,72,0.25)]">
            {!imgError ? (
              <img
                src="/src/assets/images/usha_couple_portrait_1795633822807.jpg"
                alt="Cute illustrated romantic couple portrait with pink hearts for Usha"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 p-4 text-rose-700">
                <Heart className="h-12 w-12 fill-rose-500 text-rose-500" />
                <span className="mt-2 font-display text-lg font-semibold">
                  For Usha
                </span>
              </div>
            )}
          </div>

          <span
            aria-hidden="true"
            className="animate-heart-bob pointer-events-none absolute -top-2.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-base shadow-md"
          >
            💗
          </span>
          <span
            aria-hidden="true"
            style={{ animationDelay: '0.8s' }}
            className="animate-heart-bob pointer-events-none absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm shadow-md"
          >
            🌷
          </span>
        </div>

        <h1
          ref={headingRef}
          className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[#3d0e1e] sm:text-5xl"
          style={{ textWrap: 'balance' }}
        >
          USHA, Will You Go on a Date With Me? 💗
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#6b283f] sm:text-base">
          I put together a little pink adventure just for you. Say yes and let&apos;s plan our favorite day together.
        </p>

        <div className="mt-8 flex min-h-14 flex-wrap items-center justify-center gap-4">
          <button
            ref={yesBtnRef}
            type="button"
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
            className="inline-flex min-h-12 min-w-[144px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_28px_-6px_rgba(225,29,72,0.48)] transition-[transform,filter] duration-200 ease-out hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
          >
            Yes! 💖
          </button>

          <button
            ref={noBtnRef}
            type="button"
            onClick={moveNoButton}
            style={{
              transform: `translate3d(${noOffset.x}px, ${noOffset.y}px, 0)`,
            }}
            className={`inline-flex min-h-12 min-w-[128px] items-center justify-center rounded-2xl border border-rose-200 bg-white/95 px-7 py-3 text-base font-semibold text-[#5c1d33] shadow-sm transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-rotate-2 hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0 ${
              noCount > 0 ? 'relative z-40' : 'relative z-10'
            }`}
          >
            {noLabel}
          </button>
        </div>

        <p
          aria-live="polite"
          className="mt-6 min-h-5 text-xs font-medium text-[#7c354d] sm:text-sm"
        >
          {noCount === 0
            ? 'Move or tap around the background to scatter floating rose particles.'
            : noCount === 1
            ? 'Oops, that button seems shy — try the pink Yes button!'
            : `Dodged ${noCount} times! Looks like fate is voting Yes.`}
        </p>
      </div>
    </section>
  );
}
