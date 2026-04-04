import { useMemo, useRef, type FC } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

type TimelineMedia = 'logo' | 'foto' | 'fotos' | 'tela';

type TimelineEntry = {
  id: number;
  year: string;
  text: string;
  media: TimelineMedia;
  imageKey: string;
};

type TimelineNodeData = TimelineEntry & {
  cx: number;
  cy: number;
  side: 'left' | 'right';
};

const timelineData: TimelineEntry[] = [
  {
    id: 1,
    year: '2000',
    text: 'Estreio na área de desenvolvimento de sistemas da Ogilvy Interactive. Primeira experiência em comunicação com contas de respeito: Intel, Coca-Cola, BankBoston e Amex.',
    media: 'logo',
    imageKey: '2000'
  },
  {
    id: 2,
    year: '2001 a 2009',
    text: "Respondi pela área de infraestrutura e desenvolvimento da The Marketing Store Worldwide, dando suporte aos escritórios da América Latina e a clientes como McDonald's, Ambev, Diageo, Cosan, Unilever e muitos outros. Aqui desenhei, desenvolvi e geri meus primeiros produtos digitais: portais, intranets, sistemas de gestão e muito mais.",
    media: 'foto',
    imageKey: '2001a2009'
  },
  {
    id: 3,
    year: '2009',
    text: 'Dirigi o desenvolvimento de software embarcado na máquina de retornáveis da Ambev, um projeto bem à frente do seu tempo.',
    media: 'foto',
    imageKey: '2009'
  },
  {
    id: 4,
    year: '2010',
    text: 'Desenhei, desenvolvi e geri um dos maiores catálogos de prêmios do mercado para incentivos, além de campanhas monumentais para Mercedes-Benz, Raízen, Diageo e outros gigantes.',
    media: 'foto',
    imageKey: '2010'
  },
  {
    id: 5,
    year: '2013',
    text: 'Respondi pela área de infraestrutura e sistemas internos das 6 agências da holding Club, e, entre uma implantação de ERP e outra de sistemas internos, ainda pude fazer ótimos amigos.',
    media: 'logo',
    imageKey: '2013'
  },
  {
    id: 6,
    year: '2015',
    text: 'Atuei na diretoria operacional, de eventos e sistemas da Tangran, onde, entre outros clientes, atendemos LATAM, Philip Morris e Gomes da Costa. Foi também onde conheci minha primeira sócia, da Varal Store, e grande amiga de projetos ousados e inovadores.',
    media: 'foto',
    imageKey: '2015'
  },
  {
    id: 7,
    year: '2016',
    text: 'Nasce, da paixão de dois colegas de trabalho por arte e design, a “Varal Store”, um marketplace de decoração e acessórios, focado em uma forte curadoria de novos designs e produtos únicos.',
    media: 'foto',
    imageKey: '2016'
  },
  {
    id: 8,
    year: '2016',
    text: 'Espalhei diversão na Páscoa em forma de games para os produtos Lacta/Mondelez, unindo experiências on e off e quatro licenciamentos incríveis.',
    media: 'fotos',
    imageKey: '2016-1'
  },
  {
    id: 9,
    year: '2019',
    text: 'Nasce a primeira plataforma de incentivo desenhada por mim para a Ajinomoto. Deste projeto surgiram inúmeras oportunidades e um programa com mais de 6 anos no ar.',
    media: 'tela',
    imageKey: '2019'
  },
  {
    id: 10,
    year: '2022',
    text: 'Estreia um novo desafio: desta vez, uma plataforma promocional completa, robusta e ágil para Brastemp e Consul, com as primeiras promoções de cashback real pago via Pix no mercado.',
    media: 'foto',
    imageKey: '2022'
  },
  {
    id: 11,
    year: '2024',
    text: 'Nasce a Focca. A partir da indignação de dois profissionais experientes e versáteis, que acreditam que a tecnologia pode ser, sim, uma ferramenta de encantamento para quem usa, além de trazer agilidade, escalabilidade e resultados ímpares aos clientes.',
    media: 'logo',
    imageKey: '2024'
  },
  {
    id: 12,
    year: '2025',
    text: 'Um misto de projetos incríveis: desde uma plataforma de reconhecimento de imagens em tempo real para a Coca-Cola, passando pela revitalização de um sistema crítico de pagamentos Pix online, até um sistema sofisticado de publicações de resultados para angariar investidores de uma das maiores bets do mercado.',
    media: 'foto',
    imageKey: '2025'
  }
];

const VIEWBOX_WIDTH = 1400;
const CENTER_X = VIEWBOX_WIDTH / 2;
const TOP_PADDING = 120;
const STEP_Y = 390;
const CURVE_SWAY = 130;
const BOTTOM_PADDING = 170;

const buildPath = (nodes: TimelineNodeData[]) => {
  if (!nodes.length) return '';

  let d = `M ${nodes[0].cx} ${nodes[0].cy}`;

  for (let i = 1; i < nodes.length; i += 1) {
    const prev = nodes[i - 1];
    const current = nodes[i];
    const deltaY = current.cy - prev.cy;
    const cp1Y = prev.cy + deltaY * 0.38;
    const cp2Y = current.cy - deltaY * 0.38;
    d += ` C ${prev.cx} ${cp1Y}, ${current.cx} ${cp2Y}, ${current.cx} ${current.cy}`;
  }

  return d;
};

const DesktopTimelineNode: FC<{
  node: TimelineNodeData;
  progress: any;
  totalHeight: number;
  imageSrc: string;
  prefersReducedMotion: boolean;
}> = ({ node, progress, totalHeight, imageSrc, prefersReducedMotion }) => {
  const progressPoint = node.cy / totalHeight;
  const start = Math.max(0, progressPoint - 0.34);
  const end = Math.min(1, progressPoint + 0.2);

  const dotScale = useTransform(progress, [start, end], [0.68, 1]);
  const dotOpacity = useTransform(progress, [start, end], [0.7, 1]);
  const lineOpacity = useTransform(progress, [start, end], [0.12, 0.72]);
  const lineScale = useTransform(progress, [start, end], [0.25, 1]);
  const cardOpacity = useTransform(progress, [start, end], [0.78, 1]);
  const cardY = useTransform(progress, [start, end], [18, 0]);
  const cardX = useTransform(progress, [start, end], [node.side === 'left' ? -26 : 26, 0]);
  const cardBlur = useTransform(progress, [start, end], ['blur(2px)', 'blur(0px)']);
  const imageOpacity = useTransform(progress, [start, end], [0.82, 1]);
  const imageY = useTransform(progress, [start, end], [20, 0]);
  const imageX = useTransform(progress, [start, end], [node.side === 'left' ? 26 : -26, 0]);
  const imageScale = useTransform(progress, [start, end], [0.93, 1]);
  const imageBlur = useTransform(progress, [start, end], ['blur(2px)', 'blur(0px)']);
  const shouldHalfImage = node.imageKey === '2001a2009' || node.imageKey === '2015' || node.imageKey === '2005';
  const isCelebrationLogo2024 = node.imageKey === '2024';
  const desktopImageWidth = shouldHalfImage
    ? node.id % 3 === 0
      ? 'min(12.5vw, 180px)'
      : node.id % 3 === 1
        ? 'min(10vw, 145px)'
        : 'min(11.5vw, 165px)'
    : isCelebrationLogo2024
      ? 'min(35vw, 520px)'
      : node.imageKey === '2016-1'
      ? 'min(33vw, 590px)'
      : node.id % 3 === 0
        ? 'min(25vw, 360px)'
        : node.id % 3 === 1
          ? 'min(20vw, 290px)'
          : 'min(23vw, 330px)';

  return (
    <div
      className="absolute"
      style={{
        left: `${(node.cx / VIEWBOX_WIDTH) * 100}%`,
        top: `${(node.cy / totalHeight) * 100}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 h-px w-14 lg:w-16 origin-center bg-white/45 ${
          node.side === 'left' ? 'right-full mr-4' : 'left-full ml-4'
        }`}
        style={{ opacity: lineOpacity, scaleX: lineScale }}
      />

      <motion.div
        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)] z-20"
        style={{ scale: dotScale, opacity: dotOpacity }}
      />

      <motion.article
        className={`absolute top-1/2 -translate-y-1/2 w-[min(33vw,470px)] rounded-2xl border border-white/15 bg-[#111111]/95 p-4 lg:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] ${
          node.side === 'left' ? 'right-full mr-9' : 'left-full ml-9'
        }`}
        style={{ opacity: cardOpacity, x: cardX, y: cardY, filter: cardBlur }}
      >
        <div>
          <h3 className="text-3xl lg:text-4xl font-black text-sand tracking-tight leading-none">
            {node.year}
          </h3>
        </div>

        <p className="mt-3 text-xs lg:text-sm leading-[1.45] text-[#d7cfbf]">
          {node.text}
        </p>
      </motion.article>

      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 ${
          node.side === 'left' ? 'left-full ml-8' : 'right-full mr-8'
        }`}
        style={{ width: desktopImageWidth, opacity: imageOpacity, x: imageX, y: imageY, scale: imageScale, filter: imageBlur }}
      >
        <motion.figure
          className={`relative rounded-2xl ${
            isCelebrationLogo2024
              ? 'overflow-visible bg-transparent shadow-none p-3 lg:p-4'
              : 'overflow-hidden bg-[#0f0f10] border border-custom-blue/40 shadow-[0_20px_45px_rgba(0,0,0,0.5)]'
          }`}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -10, 0], rotate: [node.side === 'left' ? -2 : 2, 0, node.side === 'left' ? -2 : 2] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 6 + (node.id % 4), repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <img
            src={imageSrc}
            alt={`${node.year} - ${node.media}`}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
          {isCelebrationLogo2024 && (
            <>
              <motion.span
                className="pointer-events-none absolute -top-1 left-[12%] h-2.5 w-2.5 rounded-full bg-[#8eeaff]"
                animate={prefersReducedMotion ? undefined : { y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="pointer-events-none absolute top-[16%] -right-1 h-2 w-2 rounded-full bg-[#ffd166]"
                animate={prefersReducedMotion ? undefined : { y: [0, -8, 0], x: [0, 2, 0], opacity: [0.35, 0.95, 0.35] }}
                transition={prefersReducedMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />
              <motion.span
                className="pointer-events-none absolute -bottom-1 right-[18%] h-2.5 w-2.5 rounded-full bg-[#7de4ff]"
                animate={prefersReducedMotion ? undefined : { y: [0, -9, 0], x: [0, -2, 0], opacity: [0.4, 0.95, 0.4] }}
                transition={prefersReducedMotion ? undefined : { duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
              />
            </>
          )}
          {!isCelebrationLogo2024 && (
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.3),transparent_50%)]" />
          )}
        </motion.figure>
      </motion.div>
    </div>
  );
};

export default function TimelineSection() {
  const timelineImage = new URL('../../img/timeline.png', import.meta.url).href;
  const imageByYear: Record<string, string> = {
    '2000': new URL('../../img/timeline/2000.jpg', import.meta.url).href,
    '2001a2009': new URL('../../img/timeline/2001a2009.jpg', import.meta.url).href,
    '2009': new URL('../../img/timeline/2009.jpg', import.meta.url).href,
    '2010': new URL('../../img/timeline/2010.png', import.meta.url).href,
    '2013': new URL('../../img/timeline/2013.jpg', import.meta.url).href,
    '2015': new URL('../../img/timeline/2015.jpg', import.meta.url).href,
    '2016': new URL('../../img/timeline/2016.jpg', import.meta.url).href,
    '2016-1': new URL('../../img/timeline/2016-1.jpg', import.meta.url).href,
    '2019': new URL('../../img/timeline/2019.jpg', import.meta.url).href,
    '2022': new URL('../../img/timeline/2022.jpg', import.meta.url).href,
    '2024': new URL('../../img/timeline/2024.png', import.meta.url).href,
    '2025': new URL('../../img/timeline/2025.jpg', import.meta.url).href
  };

  const nodes = useMemo<TimelineNodeData[]>(
    () =>
      timelineData.map((item, index) => ({
        ...item,
        side: index % 2 === 0 ? 'left' : 'right',
        cx: CENTER_X + (index % 2 === 0 ? -CURVE_SWAY : CURVE_SWAY),
        cy: TOP_PADDING + index * STEP_Y
      })),
    []
  );

  const timelineHeight = TOP_PADDING + (timelineData.length - 1) * STEP_Y + BOTTOM_PADDING;
  const pathD = useMemo(() => buildPath(nodes), [nodes]);

  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 45%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 145,
    damping: 29,
    mass: 0.36
  });

  const activeProgress = prefersReducedMotion ? scrollYProgress : smoothProgress;
  const introOpacity = useTransform(activeProgress, [0, 0.09], [0, 1]);

  return (
    <section className="relative py-24 px-6 bg-custom-black z-10">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
        >
          <span className="text-sand">Timeline</span>
          <br />
          <span className="text-custom-blue">de sucesso</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 w-[min(90vw,620px)] md:w-[min(62vw,620px)]"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <motion.img
            src={timelineImage}
            alt="Prévia da timeline"
            className="mx-auto w-full h-auto"
            animate={
              prefersReducedMotion
                ? { x: 0 }
                : { x: [-22, 22, -22] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 8.8, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        </motion.div>
      </div>

      <div className="md:hidden max-w-2xl mx-auto space-y-5">
        {timelineData.map((item) => {
          const shouldHalfImage = item.imageKey === '2001a2009' || item.imageKey === '2015' || item.imageKey === '2005';
          const isCelebrationLogo2024 = item.imageKey === '2024';
          const mobileImageClass = isCelebrationLogo2024
            ? 'w-[96%] mx-auto'
            : shouldHalfImage
            ? 'w-[46%] mx-auto'
            : item.id % 3 === 0
              ? 'w-[92%] mx-auto'
              : item.id % 3 === 1
                ? 'w-[84%] mx-auto'
                : 'w-[88%] mx-auto';

          return (
            <motion.div
              key={`mobile-${item.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <motion.figure
                className={`relative rounded-2xl ${
                  isCelebrationLogo2024
                    ? 'overflow-visible bg-transparent shadow-none p-2'
                    : 'overflow-hidden bg-[#0f0f10] border border-custom-blue/40 shadow-[0_18px_35px_rgba(0,0,0,0.45)]'
                } ${mobileImageClass}`}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -6, 0] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <img
                  src={imageByYear[item.imageKey]}
                  alt={`${item.year} - ${item.media}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
                {isCelebrationLogo2024 && (
                  <>
                    <motion.span
                      className="pointer-events-none absolute -top-1 left-[14%] h-2 w-2 rounded-full bg-[#8eeaff]"
                      animate={prefersReducedMotion ? undefined : { y: [0, -8, 0], opacity: [0.4, 0.95, 0.4] }}
                      transition={prefersReducedMotion ? undefined : { duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="pointer-events-none absolute top-[18%] -right-1 h-2 w-2 rounded-full bg-[#ffd166]"
                      animate={prefersReducedMotion ? undefined : { y: [0, -7, 0], x: [0, 2, 0], opacity: [0.35, 0.9, 0.35] }}
                      transition={prefersReducedMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    />
                  </>
                )}
                {!isCelebrationLogo2024 && (
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_50%)]" />
                )}
              </motion.figure>

              <motion.article className="rounded-2xl border border-white/15 bg-[#111111]/95 p-5">
                <div>
                  <h3 className="text-3xl font-black text-sand tracking-tight">{item.year}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#d7cfbf]">{item.text}</p>
              </motion.article>
            </motion.div>
          );
        })}
      </div>

      <div className="hidden md:block max-w-[1500px] mx-auto px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative w-full mx-auto"
          style={{ height: `${timelineHeight}px` }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${timelineHeight}`}
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={pathD}
              stroke="#2e2e2e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d={pathD}
              stroke="#9ca3af"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: activeProgress, opacity: introOpacity }}
            />
          </svg>

          {nodes.map((node) => (
            <DesktopTimelineNode
              key={node.id}
              node={node}
              progress={activeProgress}
              totalHeight={timelineHeight}
              imageSrc={imageByYear[node.imageKey]}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
