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
    year: '2006',
    text: 'Bacharelado em Sistemas de Informação.',
    media: 'logo',
    imageKey: 'placeholder-2006'
  },
  {
    id: 4,
    year: '2007',
    text: 'Na SAVOIR fui Programador Sênior e Coordenador de Equipe de desenvolvimento. Coordenei e supervisionei equipes de sistemas com utilização de alta tecnologia, da avaliação e identificação de soluções técnicas ao planejamento e entendimento das necessidades do negócio e dos clientes. Aplicando PHP, React, C#, Python, Java, .NET, Docker, Apps, DevOps, cloud computing, conectores de BI e SQL, entre outros.',
    media: 'foto',
    imageKey: 'placeholder-2007-savoir'
  },
  {
    id: 5,
    year: '2007',
    text: 'Superior em Desenvolvimento de Bancos de Dados.',
    media: 'logo',
    imageKey: 'placeholder-2007-db'
  },
  {
    id: 6,
    year: '2009',
    text: 'Dirigi o desenvolvimento de software embarcado na máquina de retornáveis da Ambev, um projeto bem à frente do seu tempo.',
    media: 'foto',
    imageKey: '2009'
  },
  {
    id: 7,
    year: '2010',
    text: 'Projetei, desenvolvi e geri um dos maiores catálogos de prêmios do mercado para incentivos, além de campanhas monumentais para Mercedes-Benz, Raízen, Diageo e outros gigantes.',
    media: 'foto',
    imageKey: '2010'
  },
  {
    id: 8,
    year: '2012',
    text: 'Tive o prazer de atender projetos e desafios técnicos e inovadores como os sites da C&A, Renault, Troller, Pedigree e ativações premiadas para a Almap BBDO, AfricaCreative e LewLaraTBWA.',
    media: 'foto',
    imageKey: 'placeholder-2012'
  },
  {
    id: 9,
    year: '2013',
    text: 'À frente da área de infraestrutura e sistemas internos das 6 agências da Holding Club e, entre uma implantação de ERP e outra de sistemas internos, ainda pude fazer ótimos amigos.',
    media: 'logo',
    imageKey: '2013'
  },
  {
    id: 10,
    year: '2015',
    text: 'Primeira diretoria operacional, de eventos e sistemas da Tangran, onde, entre outros clientes, atendemos LATAM, Philip Morris e Gomes da Costa.',
    media: 'foto',
    imageKey: '2015'
  },
  {
    id: 11,
    year: '2015',
    text: 'Certificado pelo IBOPE \\o/',
    media: 'logo',
    imageKey: 'placeholder-2015-ibope'
  },
  {
    id: 12,
    year: '2016',
    text: 'Nasce, da paixão de dois colegas de trabalho por arte e design, a "Varal Store", um marketplace de decoração e acessórios, focado em uma forte curadoria de novos designs e produtos únicos.',
    media: 'foto',
    imageKey: '2016'
  },
  {
    id: 18,
    year: '2016',
    text: 'Espalhei diversão na Páscoa em forma de games para os produtos Lacta/Mondelez, unindo experiências on e off e quatro licenciamentos incríveis.',
    media: 'fotos',
    imageKey: '2016-1'
  },
  {
    id: 19,
    year: '2016',
    text: 'MBA - Gestão de Projetos de TI.',
    media: 'logo',
    imageKey: 'placeholder-2016-mba'
  },
  {
    id: 13,
    year: '2019',
    text: 'Construímos a primeira plataforma de incentivo automatizada e personalizável aplicada inicialmente para a Ajinomoto. Deste projeto surgiram inúmeras oportunidades e clientes, além de um programa com mais de 6 anos no ar.',
    media: 'tela',
    imageKey: '2019'
  },
  {
    id: 14,
    year: '2022',
    text: 'Um novo desafio! Desta vez, uma plataforma promocional completa, também personalizável, robusta e ágil, aplicada para Brastemp e Consul, com as primeiras promoções de cashback real pagos via Pix. Hoje a plataforma já evoluiu muito e atendeu a mais de 130 promoções e diversos clientes.',
    media: 'foto',
    imageKey: '2022'
  },
  {
    id: 15,
    year: '2022',
    text: 'DIGISYSTEM - Arquiteto de Software Master. Defino padrões técnicos em projetos de desenvolvimentos complexos, desde a sua arquitetura até a validação de qualidade dos códigos e soluções aplicados. Realizando também a gestão de equipe de diversos programadores em inúmeras linguagens. Em sua maioria são projetos governamentais, voltados para diversas áreas, de educação superior até cultura, passando por qualquer demanda onde exista a necessidade de uma entrega precisa, organizada, ágil e seguindo melhores práticas de mercado.',
    media: 'logo',
    imageKey: 'placeholder-2022-digisystem'
  },
  {
    id: 16,
    year: '2024',
    text: 'Focca é oficial! Nasce a partir da indignação de dois profissionais experientes e versáteis, que acreditam que a tecnologia pode ser sim, uma ferramenta de encantamento, e também trazer agilidade, escalabilidade e resultados ímpares aos negócios.',
    media: 'logo',
    imageKey: '2024'
  },
  {
    id: 17,
    year: '2025',
    text: 'A jornada continua...\nUma plataforma de reconhecimento de imagens em tempo real para a Coca-Cola, a revitalização de um sistema complexo de pagamentos via Pix online, e a construção de um sistema sofisticado de publicações de resultados para atrair investidores de uma das maiores bets do mercado.',
    media: 'foto',
    imageKey: '2025'
  },
  {
    id: 20,
    year: '2026',
    text: 'A mil, criando novos projetos incriveis com voce.',
    media: 'foto',
    imageKey: ''
  }
];

const VIEWBOX_WIDTH = 1400;
const CENTER_X = VIEWBOX_WIDTH / 2;
const TOP_PADDING = 120;
const STEP_Y = 390;
const CURVE_SWAY = 130;
const BOTTOM_PADDING = 170;
const MOBILE_VIEWBOX_WIDTH = 420;
const MOBILE_LEFT_X = 122;
const MOBILE_RIGHT_X = 298;
const MOBILE_TOP_PADDING = 95;
const MOBILE_MIN_STEP_Y = 260;
const MOBILE_BOTTOM_PADDING = 120;

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

const estimateMobileNodeSpacing = (entry: TimelineEntry) => {
  const compactText = entry.text.replace(/\s+/g, ' ').trim();
  const estimatedLines = Math.max(4, Math.ceil(compactText.length / 28));
  const imageAllowance = entry.imageKey ? (entry.media === 'logo' ? 96 : 124) : 0;
  return Math.max(MOBILE_MIN_STEP_Y + imageAllowance, 150 + estimatedLines * 20 + imageAllowance);
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
  const imageOpacity = useTransform(progress, [start, end], [0.82, 1]);
  const imageY = useTransform(progress, [start, end], [20, 0]);
  const imageX = useTransform(progress, [start, end], [node.side === 'left' ? 26 : -26, 0]);
  const imageScale = useTransform(progress, [start, end], [0.93, 1]);
  const shouldHalfImage = node.imageKey === '2001a2009' || node.imageKey === '2015' || node.imageKey === '2005';
  const isCelebrationLogo2024 = node.imageKey === '2024';
  const isGraduationImage =
    node.imageKey === 'placeholder-2006' ||
    node.imageKey === 'placeholder-2007-db' ||
    node.imageKey === 'placeholder-2016-mba';
  const isSavoir2007Image = node.imageKey === 'placeholder-2007-savoir';
  const is2009Image = node.imageKey === '2009';
  const is2010Image = node.imageKey === '2010';
  const is2016Image = node.imageKey === '2016';
  const is2022Image = node.imageKey === '2022';
  const is2015IbopeImage = node.imageKey === 'placeholder-2015-ibope';
  const hasImage = Boolean(imageSrc);
  const celebrationIntroPeak = Math.min(1, start + 0.08);
  const celebrationIntroSettle = Math.min(1, start + 0.2);
  const celebrationImageOpacity = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [0, 1, 1, 1]
  );
  const celebrationImageY = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [82, -22, 2, 0]
  );
  const celebrationImageScale = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [0.34, 1.26, 0.98, 1]
  );
  const celebrationImageRotate = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [-18, 5, -1, 0]
  );
  const celebrationGlowOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 1, 0.58, 0.45]);
  const celebrationGlowScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.52, 1.24, 1.04, 1]);
  const celebrationRingOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.78, 0.18, 0]);
  const celebrationRingScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.52, 1.44, 1.7, 1.88]);
  const celebrationFlashOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle], [0.86, 0.12, 0]);
  const celebrationCardAuraOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.95, 0.65, 0.45]);
  const celebrationCardAuraScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.82, 1.14, 1.03, 1]);
  const celebrationCardBorderOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 1, 0.72, 0.58]);
  const celebrationDotRingOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.95, 0.35, 0]);
  const celebrationDotRingScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.7, 1.8, 2.25, 2.7]);
  const desktopImageWidth = shouldHalfImage
    ? node.id % 3 === 0
      ? 'min(10.4vw, 150px)'
      : node.id % 3 === 1
        ? 'min(8.3vw, 120px)'
        : 'min(9.5vw, 136px)'
    : isGraduationImage
      ? 'min(14vw, 200px)'
    : isSavoir2007Image
      ? 'min(8.6vw, 124px)'
    : is2009Image
      ? 'min(16.6vw, 238px)'
    : is2010Image
      ? 'min(14.8vw, 212px)'
    : is2016Image
      ? 'min(10.4vw, 150px)'
    : is2022Image
      ? 'min(17.5vw, 252px)'
    : is2015IbopeImage
      ? 'min(9.5vw, 137px)'
    : isCelebrationLogo2024
      ? 'min(29vw, 430px)'
      : node.imageKey === '2016-1'
      ? 'min(27vw, 485px)'
      : node.id % 3 === 0
        ? 'min(20.8vw, 300px)'
        : node.id % 3 === 1
          ? 'min(16.5vw, 238px)'
          : 'min(19vw, 274px)';

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
        className={`relative w-5 h-5 lg:w-6 lg:h-6 rounded-full z-20 ${
          isCelebrationLogo2024
            ? 'bg-[#8eeaff] shadow-[0_0_22px_rgba(0,176,240,0.95)]'
            : 'bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]'
        }`}
        style={{ scale: dotScale, opacity: dotOpacity }}
      >
        {isCelebrationLogo2024 && (
          <motion.span
            className="pointer-events-none absolute inset-[-6px] rounded-full border border-[#8eeaff]/80"
            style={{ opacity: celebrationDotRingOpacity, scale: celebrationDotRingScale }}
          />
        )}
      </motion.div>

      <motion.article
        className={`absolute top-1/2 -translate-y-1/2 w-[min(33vw,470px)] rounded-2xl p-4 lg:p-5 ${
          isCelebrationLogo2024
            ? 'border border-[#8eeaff]/55 bg-[#06121a]/94 shadow-[0_24px_60px_rgba(0,176,240,0.28)]'
            : 'border border-white/15 bg-[#111111]/95 shadow-[0_18px_45px_rgba(0,0,0,0.45)]'
        } ${node.side === 'left' ? 'right-full mr-9' : 'left-full ml-9'}`}
        style={{ opacity: cardOpacity, x: cardX, y: cardY }}
      >
        {isCelebrationLogo2024 && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-[-1px] rounded-2xl bg-[linear-gradient(125deg,rgba(142,234,255,0.45)_0%,rgba(0,176,240,0.08)_42%,rgba(255,209,102,0.42)_100%)]"
              style={{ opacity: celebrationCardBorderOpacity }}
            />
            <motion.span
              className="pointer-events-none absolute inset-[-24%] rounded-[34px] bg-[radial-gradient(circle,rgba(0,176,240,0.42)_0%,rgba(0,176,240,0)_68%)] blur-2xl"
              style={{ opacity: celebrationCardAuraOpacity, scale: celebrationCardAuraScale }}
            />
            {!prefersReducedMotion && (
              <>
                <motion.span
                  className="pointer-events-none absolute top-4 right-10 h-1.5 w-1.5 rounded-full bg-[#8eeaff]"
                  animate={{ y: [0, -7, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  className="pointer-events-none absolute bottom-5 left-7 h-1.5 w-1.5 rounded-full bg-[#ffd166]"
                  animate={{ y: [0, -6, 0], x: [0, -1, 0], opacity: [0.35, 0.95, 0.35] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                />
              </>
            )}
          </>
        )}

        <div className="relative z-10">
          <h3
            className={`text-3xl lg:text-4xl font-black tracking-tight leading-none ${
              isCelebrationLogo2024
                ? 'text-transparent bg-clip-text bg-[linear-gradient(130deg,#8eeaff_0%,#00b0f0_45%,#ffd166_100%)]'
                : 'text-sand'
            }`}
          >
            {node.year}
          </h3>

          <p className={`mt-3 text-xs lg:text-sm leading-[1.45] ${isCelebrationLogo2024 ? 'text-[#ebf9ff]' : 'text-[#d7cfbf]'}`}>
            {node.text}
          </p>
        </div>
      </motion.article>

      {hasImage && (
        <motion.div
        className={`absolute top-1/2 -translate-y-1/2 ${
          node.side === 'left' ? 'left-full ml-8' : 'right-full mr-8'
        }`}
        style={{
          width: desktopImageWidth,
          opacity: isCelebrationLogo2024 ? celebrationImageOpacity : imageOpacity,
          x: imageX,
          y: isCelebrationLogo2024 ? celebrationImageY : imageY,
          scale: isCelebrationLogo2024 ? celebrationImageScale : imageScale,
          rotate: isCelebrationLogo2024 ? celebrationImageRotate : 0
        }}
      >
        <motion.figure
          className={`relative rounded-2xl ${
            isCelebrationLogo2024
              ? 'overflow-visible bg-transparent shadow-none p-3 lg:p-4'
              : `overflow-hidden bg-[#0f0f10] shadow-[0_20px_45px_rgba(0,0,0,0.5)] ${
                  isGraduationImage ? 'p-3 lg:p-4' : ''
                }`
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
          {isCelebrationLogo2024 && (
            <motion.span
              className="pointer-events-none absolute inset-[-8%] rounded-[30px] bg-[radial-gradient(circle,rgba(0,176,240,0.46)_0%,rgba(0,176,240,0.18)_42%,rgba(0,176,240,0)_74%)] blur-xl"
              style={{ opacity: celebrationGlowOpacity, scale: celebrationGlowScale }}
            />
          )}
          {isCelebrationLogo2024 && (
            <motion.span
              className="pointer-events-none absolute inset-[14%] rounded-full border border-[#8eeaff]/80"
              style={{ opacity: celebrationRingOpacity, scale: celebrationRingScale }}
            />
          )}
          {isCelebrationLogo2024 && (
            <motion.span
              className="pointer-events-none absolute inset-[2%] rounded-[20px] bg-[linear-gradient(130deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_55%)]"
              style={{ opacity: celebrationFlashOpacity }}
            />
          )}
          <img
            src={imageSrc}
            alt={`${node.year} - ${node.media}`}
            loading="lazy"
            decoding="async"
            className={`w-full h-auto block ${isCelebrationLogo2024 ? 'relative z-10' : ''} ${
              isGraduationImage ? 'rounded-lg' : ''
            }`}
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
      )}
    </div>
  );
};

const MobileTimelineNode: FC<{
  node: TimelineNodeData;
  progress: any;
  totalHeight: number;
  imageSrc: string;
  prefersReducedMotion: boolean;
}> = ({ node, progress, totalHeight, imageSrc, prefersReducedMotion }) => {
  const progressPoint = node.cy / totalHeight;
  const start = Math.max(0, progressPoint - 0.26);
  const end = Math.min(1, progressPoint + 0.16);

  const dotScale = useTransform(progress, [start, end], [0.58, 1]);
  const dotOpacity = useTransform(progress, [start, end], [0.54, 1]);
  const lineOpacity = useTransform(progress, [start, end], [0.1, 0.65]);
  const lineScale = useTransform(progress, [start, end], [0.18, 1]);
  const cardOpacity = useTransform(progress, [start, end], [0.66, 1]);
  const cardY = useTransform(progress, [start, end], [20, 0]);
  const cardX = useTransform(progress, [start, end], [node.side === 'left' ? 10 : -10, 0]);
  const isCelebrationLogo2024 = node.imageKey === '2024';
  const celebrationIntroPeak = Math.min(1, start + 0.11);
  const celebrationIntroSettle = Math.min(1, start + 0.24);
  const celebrationCardAuraOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.9, 0.6, 0.44]);
  const celebrationCardAuraScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.84, 1.12, 1.02, 1]);
  const celebrationCardBorderOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 1, 0.7, 0.56]);
  const celebrationDotRingOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.92, 0.34, 0]);
  const celebrationDotRingScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.65, 1.65, 2.05, 2.4]);
  const hasImage = Boolean(imageSrc);
  const mobileCardImageMaxHeight = node.media === 'logo' ? 108 : node.media === 'tela' ? 150 : 136;

  return (
    <div
      className="absolute"
      style={{
        left: `${(node.cx / MOBILE_VIEWBOX_WIDTH) * 100}%`,
        top: `${(node.cy / totalHeight) * 100}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 h-px w-10 origin-center bg-white/45 ${
          node.side === 'left' ? 'left-full ml-2.5' : 'right-full mr-2.5'
        }`}
        style={{ opacity: lineOpacity, scaleX: lineScale }}
      />

      <motion.div
        className={`relative w-4 h-4 rounded-full z-20 ${
          isCelebrationLogo2024
            ? 'bg-[#8eeaff] shadow-[0_0_18px_rgba(0,176,240,0.95)]'
            : 'bg-white shadow-[0_0_16px_rgba(255,255,255,0.52)]'
        }`}
        style={{ scale: dotScale, opacity: dotOpacity }}
      >
        {isCelebrationLogo2024 && (
          <motion.span
            className="pointer-events-none absolute inset-[-5px] rounded-full border border-[#8eeaff]/80"
            style={{ opacity: celebrationDotRingOpacity, scale: celebrationDotRingScale }}
          />
        )}
      </motion.div>

      <motion.article
        className={`absolute top-1/2 -translate-y-1/2 rounded-xl p-3.5 text-left ${
          isCelebrationLogo2024
            ? 'border border-[#8eeaff]/50 bg-[#06121a]/94 shadow-[0_18px_34px_rgba(0,176,240,0.3)]'
            : 'border border-white/15 bg-[#111111]/95 shadow-[0_14px_30px_rgba(0,0,0,0.42)]'
        } ${node.side === 'left' ? 'left-full ml-3' : 'right-full mr-3'}`}
        style={{ width: 'clamp(172px, 58vw, 236px)', opacity: cardOpacity, x: cardX, y: cardY }}
      >
        {isCelebrationLogo2024 && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-[-1px] rounded-xl bg-[linear-gradient(125deg,rgba(142,234,255,0.44)_0%,rgba(0,176,240,0.06)_46%,rgba(255,209,102,0.4)_100%)]"
              style={{ opacity: celebrationCardBorderOpacity }}
            />
            <motion.span
              className="pointer-events-none absolute inset-[-24%] rounded-[24px] bg-[radial-gradient(circle,rgba(0,176,240,0.38)_0%,rgba(0,176,240,0)_68%)] blur-xl"
              style={{ opacity: celebrationCardAuraOpacity, scale: celebrationCardAuraScale }}
            />
          </>
        )}

        <div className="relative z-10">
          <h3
            className={`text-[1.55rem] leading-none font-black tracking-tight ${
              isCelebrationLogo2024
                ? 'text-transparent bg-clip-text bg-[linear-gradient(130deg,#8eeaff_0%,#00b0f0_45%,#ffd166_100%)]'
                : 'text-sand'
            }`}
          >
            {node.year}
          </h3>

          <p
            className={`mt-2.5 text-[12.5px] leading-[1.55] break-words [text-wrap:pretty] ${
              isCelebrationLogo2024 ? 'text-[#ebf9ff]' : 'text-[#d7cfbf]'
            }`}
          >
            {node.text}
          </p>

          {hasImage && (
            <figure
              className={`relative mt-3.5 rounded-lg ${
                isCelebrationLogo2024
                  ? 'overflow-hidden'
                  : 'overflow-hidden bg-[#0f0f10] shadow-[0_12px_22px_rgba(0,0,0,0.34)]'
              }`}
            >
              <img
                src={imageSrc}
                alt={`${node.year} - ${node.media}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
                style={{ maxHeight: `${mobileCardImageMaxHeight}px` }}
              />
              {!isCelebrationLogo2024 && (
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.22),transparent_58%)]" />
              )}
            </figure>
          )}
        </div>
      </motion.article>
    </div>
  );
};

export default function TimelineSection() {
  const timelineImage = new URL('../../img/timeline.png', import.meta.url).href;
  const imageByYear: Record<string, string> = {
    '2000': new URL('../../img/timeline/2000.jpg', import.meta.url).href,
    '2001a2009': new URL('../../img/timeline/2001a2009.jpg', import.meta.url).href,
    'placeholder-2006': new URL('../../img/timeline/graduacao.png', import.meta.url).href,
    'placeholder-2007-savoir': new URL('../../img/timeline/2007.png', import.meta.url).href,
    'placeholder-2007-db': new URL('../../img/timeline/graduacao.png', import.meta.url).href,
    'placeholder-2016-mba': new URL('../../img/timeline/graduacao.png', import.meta.url).href,
    '2009': new URL('../../img/timeline/2009.jpg', import.meta.url).href,
    '2010': new URL('../../img/timeline/2010.png', import.meta.url).href,
    'placeholder-2012': new URL('../../img/timeline/2012.jpg', import.meta.url).href,
    '2013': new URL('../../img/timeline/2013.jpg', import.meta.url).href,
    '2015': new URL('../../img/timeline/2015.jpg', import.meta.url).href,
    '2016': new URL('../../img/timeline/2016.jpg', import.meta.url).href,
    '2016-1': new URL('../../img/timeline/2016-1.jpg', import.meta.url).href,
    'placeholder-2015-ibope': new URL('../../img/timeline/2015-ibope.jpg', import.meta.url).href,
    '2019': new URL('../../img/timeline/2019.jpg', import.meta.url).href,
    '2022': new URL('../../img/timeline/2022.jpg', import.meta.url).href,
    'placeholder-2022-digisystem': new URL('../../img/timeline/2022-digisystem.jpg', import.meta.url).href,
    '2024': new URL('../../img/timeline/2024.png', import.meta.url).href,
    '2025': new URL('../../img/timeline/2025.jpg', import.meta.url).href
  };

  const desktopNodes = useMemo<TimelineNodeData[]>(
    () =>
      timelineData.map((item, index) => ({
        ...item,
        side: index % 2 === 0 ? 'left' : 'right',
        cx: CENTER_X + (index % 2 === 0 ? -CURVE_SWAY : CURVE_SWAY),
        cy: TOP_PADDING + index * STEP_Y
      })),
    []
  );

  const mobileNodeSpacing = useMemo<number[]>(
    () => timelineData.map((item) => estimateMobileNodeSpacing(item)),
    []
  );

  const mobileNodes = useMemo<TimelineNodeData[]>(() => {
    let currentY = MOBILE_TOP_PADDING;

    return timelineData.map((item, index) => {
      const side: TimelineNodeData['side'] = index % 2 === 0 ? 'left' : 'right';
      const node: TimelineNodeData = {
        ...item,
        side,
        cx: side === 'left' ? MOBILE_LEFT_X : MOBILE_RIGHT_X,
        cy: currentY
      };

      currentY += mobileNodeSpacing[index];
      return node;
    });
  }, [mobileNodeSpacing]);

  const desktopTimelineHeight = TOP_PADDING + (timelineData.length - 1) * STEP_Y + BOTTOM_PADDING;
  const desktopPathD = useMemo(() => buildPath(desktopNodes), [desktopNodes]);
  const mobileTimelineHeight =
    MOBILE_TOP_PADDING + mobileNodeSpacing.reduce((sum, spacing) => sum + spacing, 0) + MOBILE_BOTTOM_PADDING;
  const mobilePathD = useMemo(() => buildPath(mobileNodes), [mobileNodes]);

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: desktopScrollYProgress } = useScroll({
    target: desktopContainerRef,
    offset: ['start 85%', 'end 45%']
  });
  const { scrollYProgress: mobileScrollYProgress } = useScroll({
    target: mobileContainerRef,
    offset: ['start 88%', 'end 44%']
  });

  const desktopSmoothProgress = useSpring(desktopScrollYProgress, {
    stiffness: 145,
    damping: 29,
    mass: 0.36
  });
  const mobileSmoothProgress = useSpring(mobileScrollYProgress, {
    stiffness: 152,
    damping: 30,
    mass: 0.34
  });

  const desktopActiveProgress = prefersReducedMotion ? desktopScrollYProgress : desktopSmoothProgress;
  const mobileActiveProgress = prefersReducedMotion ? mobileScrollYProgress : mobileSmoothProgress;
  const desktopIntroOpacity = useTransform(desktopActiveProgress, [0, 0.09], [0, 1]);
  const mobileIntroOpacity = useTransform(mobileActiveProgress, [0, 0.1], [0, 1]);

  return (
    <section className="relative py-24 px-4 md:px-6 bg-custom-black z-10">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]"
        >
          <span className="text-sand">Timeline</span>
          <br />
          <span className="text-custom-blue">de sucesso</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
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

      <div className="md:hidden max-w-[430px] mx-auto">
        <div
          ref={mobileContainerRef}
          className="relative w-full mx-auto overflow-visible"
          style={{ height: `${mobileTimelineHeight}px` }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${MOBILE_VIEWBOX_WIDTH} ${mobileTimelineHeight}`}
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={mobilePathD}
              stroke="#2b2b2b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d={mobilePathD}
              stroke="#9ca3af"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: mobileActiveProgress, opacity: mobileIntroOpacity }}
            />
          </svg>

          {mobileNodes.map((node) => (
            <MobileTimelineNode
              key={`mobile-${node.id}`}
              node={node}
              progress={mobileActiveProgress}
              totalHeight={mobileTimelineHeight}
              imageSrc={imageByYear[node.imageKey] || ''}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:block max-w-[1500px] mx-auto px-6 lg:px-8">
        <div
          ref={desktopContainerRef}
          className="relative w-full mx-auto"
          style={{ height: `${desktopTimelineHeight}px` }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${desktopTimelineHeight}`}
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d={desktopPathD}
              stroke="#2e2e2e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d={desktopPathD}
              stroke="#9ca3af"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: desktopActiveProgress, opacity: desktopIntroOpacity }}
            />
          </svg>

          {desktopNodes.map((node) => (
            <DesktopTimelineNode
              key={node.id}
              node={node}
              progress={desktopActiveProgress}
              totalHeight={desktopTimelineHeight}
              imageSrc={imageByYear[node.imageKey] || ''}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

