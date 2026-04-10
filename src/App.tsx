import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight, Download, PenTool, Star } from 'lucide-react';
import TimelineSection from './components/TimelineSection';
import FooterMatterPills from './components/FooterMatterPills';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MEDIA_QUERY).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);
    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  return isMobile;
}

function Hero() {
  const ref = useRef(null);
  const heroBackground = new URL('../img/bg-hero.png', import.meta.url).href;
  const menuIcon = new URL('../img/menu.png', import.meta.url).href;
  const [heroBusinessWord, setHeroBusinessWord] = useState("$$$$$$$");
  const handleContactClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const footerSection = document.getElementById('footer');
    if (!footerSection) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const mobileOffset = isMobile ? 6 : 0;
    const footerTop = footerSection.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, footerTop - mobileOffset),
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroBusinessWord("negócios");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  const heroLines = [
    { text: "Nós construímos sistemas para que se tornem", color: "#C4B9A5" },
    { text: "ferramenta de encantamento", color: "#00b0f0" },
    { text: "para a audiência dos nossos clientes, e assim, ajudamos os", color: "#C4B9A5" },
    { text: "", color: "#00b0f0" },
    { text: "a serem mais", color: "#C4B9A5" },
    { text: "visíveis e relevantes", color: "#00b0f0" }
  ];
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroTextContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.25,
        staggerChildren: 0.11
      }
    }
  };
  const heroTextLine = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
    }
  };
  const heroWordContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1
      }
    }
  };
  const heroWordCharacter = {
    hidden: { opacity: 0, y: 26, filter: "blur(8px)", rotateX: -85 },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      rotateX: 0,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
      opacity: 0,
      y: -12,
      filter: "blur(6px)",
      rotateX: 55,
      transition: { duration: 0.24, ease: [0.4, 0, 1, 1] }
    }
  };

  return (
    <section id="top" ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0E0E0E]" style={{ perspective: 1000 }}>
      <motion.div 
        style={{ scale, rotate, y, opacity, transformOrigin: "center center" }} 
        className="w-full h-full flex items-center justify-center relative"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <motion.img
            src={heroBackground}
            alt=""
            aria-hidden="true"
            className="absolute w-[145%] sm:w-[130%] md:w-[115%] h-auto max-w-none"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        
        <motion.a
          href="#footer"
          onClick={handleContactClick}
          className="absolute top-6 right-4 md:top-12 md:right-12 z-20"
          aria-label="Ir para o rodapé"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={menuIcon} alt="Menu" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        </motion.a>

        <motion.div
          className="relative z-10 text-center max-w-[768px] w-full px-6 flex flex-col items-center"
          variants={heroTextContainer}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-3xl md:text-5xl font-montserrat font-bold tracking-tight leading-tight text-center">
            {heroLines.map((line, index) => (
              <motion.span
                key={index}
                className="block"
                style={{ color: line.color }}
                variants={heroTextLine}
              >
                {index === 3 ? (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={heroBusinessWord}
                      className="inline-flex"
                      style={{ perspective: 600 }}
                      variants={heroWordContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      {heroBusinessWord.split("").map((char, charIndex) => (
                        <motion.span
                          key={`${heroBusinessWord}-${charIndex}`}
                          className="inline-block"
                          variants={heroWordCharacter}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </motion.span>
                  </AnimatePresence>
                ) : (
                  line.text
                )}
              </motion.span>
            ))}
          </h1>
        </motion.div>
      </motion.div>
    </section>
  );
}

const Word = ({
  children,
  progress,
  range,
  highlight,
  startColor = "#3f3f46",
  endColor = "#C4B9A5",
  highlightColor = "#00b0f0"
}: {
  children: React.ReactNode,
  progress: any,
  range: [number, number],
  highlight?: boolean,
  startColor?: string,
  endColor?: string,
  highlightColor?: string
}) => {
  const color = useTransform(progress, range, [startColor, highlight ? highlightColor : endColor]);
  return (
    <motion.span style={{ color }}>
      {children}
    </motion.span>
  );
};

type MatchRange = { start: number; end: number; phraseKey: string };

const TextReveal = ({
  text,
  progress,
  range,
  highlightWords = [],
  boxedWords = [],
  boxedLineBreaks = {},
  startColor = "#3f3f46",
  endColor = "#C4B9A5",
  highlightColor = "#00b0f0"
}: {
  text: string,
  progress: any,
  range: [number, number],
  highlightWords?: string[],
  boxedWords?: string[],
  boxedLineBreaks?: Record<string, number>,
  startColor?: string,
  endColor?: string,
  highlightColor?: string
}) => {
  const words = text.split(" ");
  const step = (range[1] - range[0]) / words.length;
  const normalizeToken = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]/gu, "");
  const normalizePhrase = (phrase: string) =>
    phrase
      .split(" ")
      .map(normalizeToken)
      .filter(Boolean)
      .join(" ");

  const normalizedWords = words.map(normalizeToken);
  const findMatches = (phrases: string[]) => {
    const matches: MatchRange[] = [];

    phrases.forEach((phrase) => {
      const phraseWords = normalizePhrase(phrase).split(" ").filter(Boolean);
      const phraseKey = phraseWords.join(" ");

      if (!phraseWords.length) return;

      for (let i = 0; i <= normalizedWords.length - phraseWords.length; i++) {
        const isMatch = phraseWords.every((phraseWord, j) => normalizedWords[i + j] === phraseWord);
        if (isMatch) {
          matches.push({ start: i, end: i + phraseWords.length - 1, phraseKey });
        }
      }
    });

    return matches;
  };

  const highlightRanges = findMatches(highlightWords);
  const boxedRanges = findMatches(boxedWords);
  const normalizedLineBreaks = new Map<string, number>();
  const firstHighlightKey = normalizePhrase("rede de impacto");
  const highlightIndexes = new Set<number>();
  const boxedByStart = new Map<number, MatchRange>();

  Object.entries(boxedLineBreaks).forEach(([phrase, breakAfterWords]) => {
    normalizedLineBreaks.set(normalizePhrase(phrase), breakAfterWords);
  });

  highlightRanges.forEach(({ start, end }) => {
    for (let i = start; i <= end; i++) {
      highlightIndexes.add(i);
    }
  });

  boxedRanges.forEach((match) => {
    if (!boxedByStart.has(match.start)) {
      boxedByStart.set(match.start, match);
    }
  });

  const renderedWords: React.ReactNode[] = [];
  let i = 0;

  while (i < words.length) {
    const boxedMatch = boxedByStart.get(i);

    if (boxedMatch) {
      const breakAfterWords = normalizedLineBreaks.get(boxedMatch.phraseKey);
      const totalWordsInMatch = boxedMatch.end - boxedMatch.start + 1;
      const shouldStackBlocks =
        typeof breakAfterWords === "number" &&
        breakAfterWords > 0 &&
        breakAfterWords < totalWordsInMatch;

      const renderBoxedWords = (startIndex: number, endIndex: number, keyPrefix: string) => {
        const chunk: React.ReactNode[] = [];

        for (let j = startIndex; j <= endIndex; j++) {
          const start = range[0] + step * j;
          const end = range[0] + step * (j + 1);
          const isHighlight = highlightIndexes.has(j);

          chunk.push(
            <span key={`${keyPrefix}-${j}`}>
              <Word
                progress={progress}
                range={[start, end]}
                highlight={isHighlight}
                startColor={startColor}
                endColor={endColor}
                highlightColor={highlightColor}
              >
                {words[j]}
              </Word>
              {j < endIndex && " "}
            </span>
          );
        }

        return chunk;
      };

      renderedWords.push(
        <React.Fragment key={`boxed-fragment-${i}`}>
          {shouldStackBlocks ? (
            <span className="diagonal-highlight-stack">
              <span className="diagonal-highlight diagonal-highlight--stacked">
                {renderBoxedWords(
                  boxedMatch.start,
                  boxedMatch.start + breakAfterWords - 1,
                  `boxed-line-1-${boxedMatch.start}`
                )}
              </span>
              <span className="diagonal-highlight diagonal-highlight--stacked">
                {renderBoxedWords(
                  boxedMatch.start + breakAfterWords,
                  boxedMatch.end,
                  `boxed-line-2-${boxedMatch.start}`
                )}
              </span>
            </span>
          ) : (
            <span className={`diagonal-highlight ${boxedMatch.phraseKey === firstHighlightKey ? 'diagonal-highlight--first' : ''}`.trim()}>
              {renderBoxedWords(boxedMatch.start, boxedMatch.end, `boxed-line-${boxedMatch.start}`)}
            </span>
          )}
          {boxedMatch.end < words.length - 1 && " "}
        </React.Fragment>
      );

      i = boxedMatch.end + 1;
      continue;
    }

    const start = range[0] + step * i;
    const end = range[0] + step * (i + 1);
    const isHighlight = highlightIndexes.has(i);

    renderedWords.push(
      <span key={`word-${i}`}>
        <Word
          progress={progress}
          range={[start, end]}
          highlight={isHighlight}
          startColor={startColor}
          endColor={endColor}
          highlightColor={highlightColor}
        >
          {words[i]}
        </Word>
        {i < words.length - 1 && " "}
      </span>
    );

    i += 1;
  }

  return (
    <span className="font-montserrat font-bold">
      {renderedWords}
    </span>
  );
};

function Intro() {
  const ref = useRef(null);
  const handIcon = new URL('../img/mao.png', import.meta.url).href;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "center center"]
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["center start", "end start"]
  });

  const scale = useTransform(exitProgress, [0, 1], [1, 0.7]);
  const rotate = useTransform(exitProgress, [0, 1], [0, 7]);
  const y = useTransform(exitProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(exitProgress, [0, 1], [1, 0]);
  const introContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.08
      }
    }
  };
  const introLine = {
    hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center py-32 px-6 text-center relative z-10 bg-custom-black overflow-hidden" style={{ perspective: 1000 }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute left-1/2 top-1/2 h-[42vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,176,240,0.16)_0%,rgba(0,176,240,0.08)_28%,transparent_70%)] blur-2xl" />
      </motion.div>

      <motion.div 
        style={{ scale, rotate, y, opacity, transformOrigin: "center center" }}
        className="max-w-4xl mx-auto space-y-16 text-3xl md:text-5xl leading-tight w-full"
        variants={introContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.p variants={introLine}>
          <span className="inline-flex items-center gap-2">
            <motion.img
              src={handIcon}
              alt="Mão"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              initial={{ opacity: 0, scale: 0.6, rotate: -28, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, rotate: [0, 16, 0], y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                opacity: { duration: 0.35, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                rotate: { duration: 0.9, delay: 0.28, ease: 'easeInOut' }
              }}
            />
            <TextReveal
              text="Prazer em conhecer você,"
              progress={scrollYProgress}
              range={[0, 0.2]}
            />
          </span>
          <br />
          <motion.span variants={introLine} className="inline-block">
            <TextReveal 
              text="Somos uma desenvolvedora de sistemas, que tem como regra analisar o problema e demanda em toda sua rede de impacto para entregar sempre a melhor solução visual e funcional sem fricção na utilização."
              progress={scrollYProgress} 
              range={[0.2, 0.95]} 
              highlightWords={[
                "rede de impacto",
                "sem fricção"
              ]}
              boxedWords={[
                "rede de impacto",
                "sem fricção"
              ]}
              boxedLineBreaks={{
                "sem fricção": 1
              }}
              startColor="#C4B9A5"
              endColor="#00b0f0"
            />
          </motion.span>
        </motion.p>
      </motion.div>
    </section>
  );
}

function PerspectiveZoomPhrase() {
  const ref = useRef<HTMLElement | null>(null);
  const projectTitleRef = useRef<HTMLDivElement | null>(null);
  const isMobileViewport = useIsMobileViewport();
  const h2ProjectImage = new URL('../img/projetos/h2.png', import.meta.url).href;
  const batuxProjectImage = new URL('../img/projetos/batux.png', import.meta.url).href;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackViewportRef = useRef<HTMLDivElement | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const pointerId = useRef<number | null>(null);
  const projectTitleOffset = isMobileViewport
    ? (['start 98%', 'end 62%'] as ['start 98%', 'end 62%'])
    : (['start 90%', 'end end'] as ['start 90%', 'end end']);
  const { scrollYProgress: projectTitleScrollProgress } = useScroll({
    target: projectTitleRef,
    offset: projectTitleOffset
  });
  const smoothProjectTitleProgress = useSpring(projectTitleScrollProgress, {
    stiffness: isMobileViewport ? 170 : 130,
    damping: isMobileViewport ? 30 : 26,
    mass: 0.35
  });
  const projectTitleSlideDistance = isMobileViewport ? 260 : 560;
  const projetosX = useTransform(smoothProjectTitleProgress, [0, 1], [-projectTitleSlideDistance, 0]);
  const recentesX = useTransform(smoothProjectTitleProgress, [0, 1], [projectTitleSlideDistance, 0]);
  const projectTitleOpacity = useTransform(smoothProjectTitleProgress, [0, 0.1, 1], [0.7, 1, 1]);
  const projectTitleScale = useTransform(smoothProjectTitleProgress, [0, 1], [isMobileViewport ? 1.04 : 1.08, 1]);

  const projectSlides = useMemo(
    () => [
      {
        id: "h2-1",
        title: "H2 Gaming Opportunity",
        description:
          "Plataforma de conteúdos para apresentação de iniciativas e resultados, voltada para captação de novos investidores.",
        image: h2ProjectImage
      },
      {
        id: "batux-1",
        title: "Batuxpay",
        description:
          "Sistema automatizado de gestão e pagamento de premiações para promoções em formatos pix",
        image: batuxProjectImage
      }
    ],
    [batuxProjectImage, h2ProjectImage]
  );

  const totalSlides = projectSlides.length;
  const goToSlide = useCallback((index: number) => {
    setActiveSlide((index + totalSlides) % totalSlides);
  }, [totalSlides]);
  const goToNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);
  const goToPrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || totalSlides <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [isPaused, prefersReducedMotion, totalSlides]);

  const handleSliderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrev();
    } else if (event.key === 'Home') {
      event.preventDefault();
      goToSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToSlide(totalSlides - 1);
    }
  };

  const getSwipeThreshold = () => {
    const width = trackViewportRef.current?.clientWidth ?? 560;
    return Math.max(36, Math.min(92, width * 0.12));
  };

  const endDrag = useCallback(() => {
    const threshold = getSwipeThreshold();
    if (Math.abs(dragOffset) >= threshold) {
      if (dragOffset < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    pointerStartX.current = null;
    pointerId.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setIsPaused(false);
  }, [dragOffset, goToNext, goToPrev]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setIsPaused(true);
    setIsDragging(true);
    pointerStartX.current = event.clientX;
    pointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerStartX.current === null || pointerId.current !== event.pointerId) return;
    const maxDrag = (trackViewportRef.current?.clientWidth ?? 560) * 0.35;
    const delta = event.clientX - pointerStartX.current;
    setDragOffset(Math.max(-maxDrag, Math.min(maxDrag, delta)));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endDrag();
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
    pointerId.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setIsPaused(false);
  };
  return (
    <section ref={ref} className="relative bg-custom-black z-10 min-h-screen flex items-center py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center gap-6 md:gap-9">
        <div ref={projectTitleRef} className="relative [perspective:1500px]">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[min(78vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,176,240,0.48)_0%,rgba(0,176,240,0.18)_40%,rgba(0,176,240,0)_74%)] blur-2xl"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.28 }}
            whileInView={prefersReducedMotion ? { opacity: 0.45 } : { opacity: 0.92, scale: 1.18 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: prefersReducedMotion ? 0.4 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.h2
            style={{ scale: projectTitleScale, opacity: projectTitleOpacity }}
            className="relative w-full text-center font-black tracking-tight leading-[0.78] text-[clamp(3rem,16vw,14rem)]"
          >
            <motion.span
              style={{ x: projetosX }}
              className="block text-custom-blue will-change-transform whitespace-nowrap"
            >
              Projetos
            </motion.span>
            <motion.span
              style={{ x: recentesX }}
              className="block text-sand will-change-transform whitespace-nowrap"
            >
              Recentes
            </motion.span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[980px]"
        >
          <div
            tabIndex={0}
            role="region"
            aria-label="Slider de projetos recentes"
            onKeyDown={handleSliderKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDragging) setIsPaused(false);
            }}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => {
              if (!isDragging) setIsPaused(false);
            }}
            className="outline-none select-none touch-pan-y"
          >
            <div className="relative">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Slide anterior"
                className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-[#c4b9a5]/50 text-[#d8cfbe] bg-black/35 backdrop-blur-sm hover:border-custom-blue hover:text-custom-blue transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Próximo slide"
                className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-[#c4b9a5]/50 text-[#d8cfbe] bg-black/35 backdrop-blur-sm hover:border-custom-blue hover:text-custom-blue transition-colors flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>

              <div
                ref={trackViewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className="overflow-hidden rounded-[28px] cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  className="flex will-change-transform"
                  animate={{ x: `calc(-${activeSlide * 100}% + ${dragOffset}px)` }}
                  transition={{
                    duration: prefersReducedMotion || isDragging ? 0 : 0.65,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {projectSlides.map((slide, index) => (
                    <article key={slide.id} className="min-w-full px-4 py-3 md:px-6 md:py-4 pointer-events-none">
                      <div className="w-full flex justify-center">
                        <div className="w-[min(68vw,520px)]">
                          <h3 className="mb-3 md:mb-4 text-sand text-xl md:text-3xl font-montserrat font-black tracking-tight text-center">
                            {slide.title}
                          </h3>
                          <img
                            src={slide.image}
                            alt={slide.title}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            draggable={false}
                            onDragStart={(event) => event.preventDefault()}
                            className="w-full max-h-[24vh] md:max-h-[32vh] object-contain rounded-xl shadow-[0_16px_38px_rgba(0,0,0,0.4)]"
                          />
                        </div>
                      </div>
                      <div className="mt-4 md:mt-6 max-w-3xl mx-auto text-center">
                        <p className="text-custom-blue font-montserrat uppercase tracking-[0.24em] text-[10px] md:text-xs font-bold">
                          {slide.badge}
                        </p>
                        <p className="mt-2.5 text-[#d7cfbf] text-sm md:text-base font-montserrat font-semibold leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {projectSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : "false"}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-custom-blue"
                      : "w-2.5 bg-[#c4b9a5]/40 hover:bg-[#c4b9a5]/65"
                  }`}
                >
                  <span className="sr-only">{`Slide ${index + 1}`}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Projects() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-custom-black d-none">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex h-full items-center gap-32 px-[10vw]">
          
          {/* Title Slide */}
          <div className="w-screen flex-shrink-0 flex flex-col items-center justify-center">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase text-center text-sand">
              What I've been<br/>Working On
            </h2>
          </div>

          {/* Bingeable Slide */}
          <div className="w-screen max-w-6xl flex-shrink-0 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <img src="https://picsum.photos/seed/bingeable/800/1000" alt="Bingeable App" className="w-full rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <h3 className="text-6xl md:text-8xl font-black text-sand">Bingeable</h3>
              <p className="text-2xl md:text-3xl font-bold text-sand/80">A social media for film lovers and filmmakers.</p>
              <div className="flex gap-8 pt-8">
                <div className="flex flex-col items-center gap-2">
                  <Download size={32} className="text-custom-blue" />
                  <span className="text-3xl font-bold text-sand">10k+</span>
                  <span className="text-sm text-sand/60">downloads</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <PenTool size={32} className="text-custom-blue" />
                  <span className="text-3xl font-bold text-sand">5k+</span>
                  <span className="text-sm text-sand/60">sign-ups</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Star size={32} className="text-custom-blue" />
                  <span className="text-3xl font-bold text-sand">4.8</span>
                  <span className="text-sm text-sand/60">rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Front End Slide */}
          <div className="w-screen max-w-6xl flex-shrink-0 flex flex-col justify-center gap-8">
            <h2 className="text-custom-blue font-bold tracking-[0.3em] uppercase text-xl">The Front End</h2>
            <p className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight text-sand">
              All about the UI and client logic. Take a closer look at how I approached the front end with real production code snippets.
            </p>
            <div className="flex gap-4 flex-wrap mt-8">
              {['Custom Hooks', 'Infinite Scrolling', 'Optimistic UI', 'Global State'].map(tag => (
                <span key={tag} className="px-6 py-2 border-2 border-sand/20 rounded-full text-sm font-bold text-sand">{tag}</span>
              ))}
            </div>
            <div className="mt-8 h-[400px] w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8 overflow-hidden relative shadow-2xl">
               <pre className="text-sm md:text-base text-green-400 font-mono overflow-auto h-full">
                 {`function useFilmReview(id) {
  const { data, error, isLoading } = useSWR(\`/api/reviews/\${id}\`, fetcher);
  
  return {
    review: data,
    isLoading,
    isError: error
  };
}`}
               </pre>
            </div>
          </div>

          {/* Back End Slide */}
          <div className="w-screen max-w-6xl flex-shrink-0 flex flex-col justify-center gap-8">
            <h2 className="text-custom-blue font-bold tracking-[0.3em] uppercase text-xl">The Back End</h2>
            <p className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight text-sand">
              A robust backend is needed to support the front end. Here are snippets from my production server code.
            </p>
            <div className="flex gap-4 flex-wrap mt-8">
              {['Cursor Pagination', 'Redis Caching', 'AWS S3', 'URL Previews'].map(tag => (
                <span key={tag} className="px-6 py-2 border-2 border-sand/20 rounded-full text-sm font-bold text-sand">{tag}</span>
              ))}
            </div>
            <div className="mt-8 h-[400px] w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8 overflow-hidden relative shadow-2xl">
               <pre className="text-sm md:text-base text-blue-400 font-mono overflow-auto h-full">
                 {`app.get('/api/feed', async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  
  const posts = await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  // ...
});`}
               </pre>
            </div>
          </div>

          {/* Challenges Slide */}
          <div className="w-screen max-w-6xl flex-shrink-0 flex flex-col justify-center gap-12">
            <h2 className="text-custom-blue font-bold tracking-[0.3em] uppercase text-xl">Challenges</h2>
            <p className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight text-sand">
              Here were some of my biggest challenges and takeaways from building this app.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50">
                <h3 className="text-xl font-bold mb-4 text-custom-blue">Challenge #1</h3>
                <p className="text-sm leading-relaxed text-sand/80">Building a full production app with a framework and tools I've never used before. Approach: Watch videos, read documentation and adapt as I go.</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50">
                <h3 className="text-xl font-bold mb-4 text-custom-blue">Challenge #2</h3>
                <p className="text-sm leading-relaxed text-sand/80">Building the algorithm for user's feeds. Approach: I didn't want to overcomplicate this early in the app. So for now, the feed is more chronological based.</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50">
                <h3 className="text-xl font-bold mb-4 text-custom-blue">Challenge #3</h3>
                <p className="text-sm leading-relaxed text-sand/80">Learning about System Design. Approach: Without much prior knowledge in system design, I wanted to set myself up in the case the app scales in the future.</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const isMobileViewport = useIsMobileViewport();
  const testimonialTitleOffset = isMobileViewport
    ? (['start 98%', 'end 62%'] as ['start 98%', 'end 62%'])
    : (['start 90%', 'end end'] as ['start 90%', 'end end']);
  const { scrollYProgress: titleScrollProgress } = useScroll({
    target: titleRef,
    offset: testimonialTitleOffset
  });
  const smoothTitleProgress = useSpring(titleScrollProgress, {
    stiffness: isMobileViewport ? 170 : 130,
    damping: isMobileViewport ? 30 : 26,
    mass: 0.35
  });
  const testimonialTitleSlideDistance = isMobileViewport ? 260 : 560;
  const algunsX = useTransform(smoothTitleProgress, [0, 1], [-testimonialTitleSlideDistance, 0]);
  const depoimentosX = useTransform(smoothTitleProgress, [0, 1], [testimonialTitleSlideDistance, 0]);
  const titleOpacity = useTransform(smoothTitleProgress, [0, 0.1, 1], [0.7, 1, 1]);
  const titleScale = useTransform(smoothTitleProgress, [0, 1], [isMobileViewport ? 1.04 : 1.08, 1]);

  const testimonials = [
    {
      text: "A experiência com o Focca foi ótima.\nA missão não era simples, com alta expectativa da diretoria e dos sócios, prazos voláteis e alto volume de alteração.\nO atendimento sempre foi muito prestativo e transparente.\nSuper recomendo o trabalho do Ivan e seu time.",
      author: "Henrique Yamagutt",
      role: "Head de Marketing do Grupo H2"
    },
    {
      text: "Minha experiência em trabalhar com o Focca foi mais que uma prestação de serviços, foi uma parceria.\nO projeto que iniciou como um simples desenvolvimento foi ganhando vida, crescendo e se tornou um sistema rico e versátil, muito desse resultado foi graças aos insights do Ale e sua experiência.\n\nSuper recomendo Ale e todo time.",
      author: "Alexandra Lucas",
      role: "Gerente Financeira"
    },
    {
      text: "A Focca foi crucial na entrega e no desenvolvimento do projeto.\nUm bom site sempre é construído a quatro mãos, e quem é da área sabe que ele passa por diversas mudanças ao longo do processo.\nEm cada etapa, houve troca, ajuste e evolução. O pessoal da agência cumpriu o combinado com muita dedicação e parceria. No fim, isso fez toda a diferença no resultado entregue.",
      author: "Fernando Castellon",
      role: "Gerente Projetos do Grupo H2"
    }
  ];

  return (
    <section className="bg-custom-black relative z-10">
      <div ref={titleRef} className="relative h-[50vh] md:h-[200vh]">
        <div className="sticky top-0 h-[50vh] md:h-screen overflow-hidden flex items-center justify-center px-4">
          <motion.h2
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="w-full text-center font-black tracking-tight leading-[0.78] text-[clamp(3rem,16vw,14rem)]"
          >
            <motion.span style={{ x: algunsX }} className="block text-custom-blue will-change-transform whitespace-nowrap">
              Alguns
            </motion.span>
            <motion.span style={{ x: depoimentosX }} className="block text-sand will-change-transform whitespace-nowrap">
              Depoimentos
            </motion.span>
          </motion.h2>
        </div>
      </div>

      <div className="px-6 pb-28 md:pb-40">
        <div className="space-y-20 md:space-y-40 max-w-4xl mx-auto px-3 sm:px-5 md:px-0">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const TestimonialCard: React.FC<{
  t: { text: string; author: string; role: string };
  i: number;
}> = ({ t, i }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 85%', 'end 35%']
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.35
  });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <h3 className="testimonial-quote text-xl sm:text-2xl md:text-4xl font-bold leading-tight relative z-10 mb-12">
        <ProgressiveText text={t.text} progress={smoothProgress} />
      </h3>
      <div className="flex items-center gap-6">
        <img src={`https://picsum.photos/seed/user${i}/100/100`} alt={t.author} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
        <div>
          <p className="font-bold text-xl text-sand">{t.author}</p>
          <p className="text-zinc-400">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ProgressiveWord: React.FC<{
  word: string;
  progress: any;
  index: number;
  total: number;
}> = ({ word, progress, index, total }) => {
  const safeTotal = Math.max(total, 1);
  const start = (index / safeTotal) * 0.88;
  const end = Math.min(1, start + 0.2);
  const color = useTransform(
    progress,
    [0, start, end, 1],
    ['#f4f0ea', '#f4f0ea', '#00b0f0', '#00b0f0']
  );

  return <motion.span style={{ color }}>{word}</motion.span>;
};

const ProgressiveText: React.FC<{ text: string; progress: any }> = ({ text, progress }) => {
  const lines = text.split('\n');
  const totalWords = lines.reduce((acc, line) => acc + line.split(' ').filter(Boolean).length, 0);
  let wordIndex = 0;

  return (
    <>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ').filter(Boolean);

        return (
          <React.Fragment key={`line-${lineIndex}`}>
            {words.map((word, i) => {
              const currentIndex = wordIndex;
              wordIndex += 1;

              return (
                <React.Fragment key={`word-${lineIndex}-${i}`}>
                  <ProgressiveWord
                    word={word}
                    progress={progress}
                    index={currentIndex}
                    total={totalWords}
                  />
                  {i < words.length - 1 && ' '}
                </React.Fragment>
              );
            })}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
};

function Footer() {
  const foccaIcon = new URL('../img/focca.png', import.meta.url).href;
  const upIcon = new URL('../img/up.png', import.meta.url).href;
  const emailIcon = new URL('../img/email.png', import.meta.url).href;
  const whatsappIcon = new URL('../img/whatsapp.png', import.meta.url).href;
  const linkedinIcon = new URL('../img/linkedin.png', import.meta.url).href;
  const footerRef = useRef<HTMLElement | null>(null);
  const isFooterInView = useInView(footerRef, { once: true, amount: 0.35 });
  const [showFooterContent, setShowFooterContent] = useState(false);
  const footerContentDelayMs = 3400;

  useEffect(() => {
    if (!isFooterInView) return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const contentDelay = isMobile ? 900 : footerContentDelayMs;
    const timeoutId = window.setTimeout(() => {
      setShowFooterContent(true);
    }, contentDelay);

    return () => window.clearTimeout(timeoutId);
  }, [isFooterInView, footerContentDelayMs]);

  return (
    <footer ref={footerRef} id="footer" className="min-h-screen bg-custom-blue relative overflow-hidden px-6 py-20 text-center z-10">
      <FooterMatterPills className="hidden md:block absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.34),rgba(255,255,255,0.10)_34%,rgba(255,255,255,0.00)_68%)]" />
      <a
        href="#top"
        aria-label="Voltar ao início"
        className="absolute left-4 md:left-8 top-6 md:top-8 z-30"
      >
        <img src={upIcon} alt="Voltar ao topo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
      </a>

      <div className="relative z-20 max-w-6xl mx-auto min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        {showFooterContent && (
          <motion.div
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto space-y-8 -mt-10 md:-mt-14"
          >
            <div>
              <div className="md:hidden leading-tight">
                <h2 className="text-4xl font-bold text-white mb-1">Vamos tomar um café?</h2>
                <h2 className="text-3xl font-bold text-white/80">É só nos mandar uma mensagem.</h2>
              </div>
              <h2 className="hidden md:block text-4xl md:text-6xl font-bold text-white mb-2">Vamos tomar um café?</h2>
              <h2 className="hidden md:block text-3xl md:text-5xl font-bold text-white/80">É só nos mandar uma mensagem.</h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 pt-3">
              <img src={foccaIcon} alt="Focca" className="w-20 md:w-24 h-auto" />
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <a href="mailto:ivan.torres@focca.dev.br" aria-label="Enviar email para ivan.torres@focca.dev.br">
                  <img src={emailIcon} alt="Email" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </a>
                <a href="https://wa.me/5511994950509" target="_blank" rel="noopener noreferrer" aria-label="Enviar mensagem no WhatsApp para +55 11 99495-0509">
                  <img src={whatsappIcon} alt="WhatsApp" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </a>
                <a href="https://www.linkedin.com/company/focca-dev" target="_blank" rel="noopener noreferrer" aria-label="Abrir LinkedIn da FOCCA DEV">
                  <img src={linkedinIcon} alt="LinkedIn" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </footer>
  );
}
export default function App() {
  useEffect(() => {
    const defaultTitle = 'FOCCA-DEV';
    const tabTitles = ['Oi...', 'continuamos aqui te aguardando...'];
    let titleIndex = 0;
    let intervalId: number | null = null;

    const startTitleAlternation = () => {
      if (intervalId !== null) return;
      titleIndex = 0;
      document.title = tabTitles[titleIndex];
      intervalId = window.setInterval(() => {
        titleIndex = (titleIndex + 1) % tabTitles.length;
        document.title = tabTitles[titleIndex];
      }, 2000);
    };

    const stopTitleAlternation = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      document.title = defaultTitle;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startTitleAlternation();
        return;
      }
      stopTitleAlternation();
    };

    stopTitleAlternation();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className="bg-custom-black min-h-screen font-sans selection:bg-custom-blue selection:text-white">
      <Hero />
      <Intro />
      <PerspectiveZoomPhrase />
      <Testimonials />
      <TimelineSection />
      <Footer />
    </div>
  );
}
