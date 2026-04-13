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
    year: '2006',
    text: 'Bacharelado em Sistemas de Informacao.',
    media: 'logo',
    imageKey: 'placeholder-2006'
  },
  {
    id: 2,
    year: '2007',
    text: 'Na SAVOIR fui Programador Senior e Coordenador de Equipe de desenvolvimento. Coordenei e supervisionei equipes de sistemas com utilizacao de alta tecnologia, da avaliacao e identificacao de solucoes tecnicas ao planejamento e entendimento das necessidades do negocio e dos clientes. Aplicando PHP, React, C#, Python, Java, .NET, Docker, Apps, DevOps, cloud computing, conectores de BI e SQL, entre outros.',
    media: 'foto',
    imageKey: 'placeholder-2007-savoir'
  },
  {
    id: 3,
    year: '2007',
    text: 'Superior em Desenvolvimento de Bancos de Dados.',
    media: 'logo',
    imageKey: 'placeholder-2007-db'
  },
  {
    id: 4,
    year: '2009',
    text: 'Dirigi o desenvolvimento de software embarcado na maquina de retornaveis da Ambev, um projeto bem a frente do seu tempo.',
    media: 'foto',
    imageKey: '2009'
  },
  {
    id: 5,
    year: '2010',
    text: 'Projetei, desenvolvi e geri um dos maiores catalogos de premios do mercado para incentivos, alem de campanhas monumentais para Mercedes-Benz, Raizen, Diageo e outros gigantes.',
    media: 'foto',
    imageKey: '2010'
  },
  {
    id: 6,
    year: '2012',
    text: 'Tive o prazer de atender projetos e desafios tecnicos e inovadores como os sites da C&A, Renault, Troller, Pedigree e ativacoes premiadas para a Almap BBDO, AfricaCreative e LewLaraTBWA.',
    media: 'foto',
    imageKey: 'placeholder-2012'
  },
  {
    id: 7,
    year: '2013',
    text: 'A frente da area de infraestrutura e sistemas internos das 6 agencias da Holding Club e, entre uma implantacao de ERP e outra de sistemas internos, ainda pude fazer otimos amigos.',
    media: 'logo',
    imageKey: '2013'
  },
  {
    id: 8,
    year: '2015',
    text: 'Primeira diretoria operacional, de eventos e sistemas da Tangran, onde, entre outros clientes, atendemos LATAM, Philip Morris e Gomes da Costa.',
    media: 'foto',
    imageKey: '2015'
  },
  {
    id: 9,
    year: '2015',
    text: 'Certificado pelo IBOPE \\o/',
    media: 'logo',
    imageKey: 'placeholder-2015-ibope'
  },
  {
    id: 10,
    year: '2016',
    text: 'MBA - Gestao de Projetos de TI.',
    media: 'foto',
    imageKey: '2016'
  },
  {
    id: 11,
    year: '2019',
    text: 'Construimos a primeira plataforma de incentivo automatizada e personalizavel aplicada inicialmente para a Ajinomoto. Deste projeto surgiram inumeras oportunidades e clientes, alem de um programa com mais de 6 anos no ar.',
    media: 'tela',
    imageKey: '2019'
  },
  {
    id: 12,
    year: '2022',
    text: 'Um novo desafio! Desta vez, uma plataforma promocional completa, tambem personalizavel, robusta e agil, aplicada para Brastemp e Consul, com as primeiras promocoes de cashback real pagos via Pix. Hoje a plataforma ja evoluiu muito e atendeu a mais de 130 promocoes e diversos clientes.',
    media: 'foto',
    imageKey: '2022'
  },
  {
    id: 13,
    year: '2022',
    text: 'DIGISYSTEM - Arquiteto de Software Master. Defino padroes tecnicos em projetos de desenvolvimentos complexos, desde a sua arquitetura ate a validacao de qualidade dos codigos e solucoes aplicados. Realizando tambem a gestao de equipe de diversos programadores em inumeras linguagens. Em sua maioria sao projetos governamentais, voltados para diversas areas, de educacao superior ate cultura, passando por qualquer demanda onde exista a necessidade de uma entrega precisa, organizada, agil e seguindo melhores praticas de mercado.',
    media: 'logo',
    imageKey: 'placeholder-2022-digisystem'
  },
  {
    id: 14,
    year: '2024',
    text: 'Focca e oficial! Nasce a partir da indignacao de dois profissionais experientes e versateis, que acreditam que a tecnologia pode ser sim, uma ferramenta de encantamento, e tambem trazer agilidade, escalabilidade e resultados impares aos negocios.',
    media: 'logo',
    imageKey: '2024'
  },
  {
    id: 15,
    year: '2025',
    text: 'A jornada continua...\nUma plataforma de reconhecimento de imagens em tempo real para a Coca-Cola, a revitalizacao de um sistema complexo de pagamentos via Pix online, e a construcao de um sistema sofisticado de publicacoes de resultados para atrair investidores de uma das maiores bets do mercado.',
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
const MOBILE_VIEWBOX_WIDTH = 420;
const MOBILE_CENTER_X = MOBILE_VIEWBOX_WIDTH / 2;
const MOBILE_TOP_PADDING = 95;
const MOBILE_STEP_Y = 332;
const MOBILE_CURVE_SWAY = 30;
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
  const desktopImageWidth = shouldHalfImage
    ? node.id % 3 === 0
      ? 'min(10.4vw, 150px)'
      : node.id % 3 === 1
        ? 'min(8.3vw, 120px)'
        : 'min(9.5vw, 136px)'
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
        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)] z-20"
        style={{ scale: dotScale, opacity: dotOpacity }}
      />

      <motion.article
        className={`absolute top-1/2 -translate-y-1/2 w-[min(33vw,470px)] rounded-2xl border border-white/15 bg-[#111111]/95 p-4 lg:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] ${
          node.side === 'left' ? 'right-full mr-9' : 'left-full ml-9'
        }`}
        style={{ opacity: cardOpacity, x: cardX, y: cardY }}
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
            className={`w-full h-auto block ${isCelebrationLogo2024 ? 'relative z-10' : ''}`}
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
  const cardX = useTransform(progress, [start, end], [node.side === 'left' ? 16 : -16, 0]);
  const imageOpacity = useTransform(progress, [start, end], [0.75, 1]);
  const imageY = useTransform(progress, [start, end], [16, 0]);
  const imageX = useTransform(progress, [start, end], [node.side === 'left' ? 8 : -8, 0]);
  const imageScale = useTransform(progress, [start, end], [0.88, 1]);
  const shouldHalfImage = node.imageKey === '2001a2009' || node.imageKey === '2015' || node.imageKey === '2005';
  const isCelebrationLogo2024 = node.imageKey === '2024';
  const celebrationIntroPeak = Math.min(1, start + 0.11);
  const celebrationIntroSettle = Math.min(1, start + 0.24);
  const celebrationImageOpacity = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [0, 1, 1, 1]
  );
  const celebrationImageY = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [66, -14, 2, 0]
  );
  const celebrationImageScale = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [0.46, 1.2, 0.98, 1]
  );
  const celebrationImageRotate = useTransform(
    progress,
    [start, celebrationIntroPeak, celebrationIntroSettle, end],
    [-14, 4, -1, 0]
  );
  const celebrationGlowOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 1, 0.58, 0.42]);
  const celebrationGlowScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.58, 1.2, 1.04, 1]);
  const celebrationRingOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0, 0.74, 0.16, 0]);
  const celebrationRingScale = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle, end], [0.5, 1.38, 1.64, 1.8]);
  const celebrationFlashOpacity = useTransform(progress, [start, celebrationIntroPeak, celebrationIntroSettle], [0.84, 0.14, 0]);
  const mobileImageWidth = shouldHalfImage
    ? 'min(24vw, 96px)'
    : isCelebrationLogo2024
      ? 'min(34vw, 120px)'
      : node.imageKey === '2016-1'
        ? 'min(35vw, 122px)'
        : 'min(33vw, 142px)';

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
          node.side === 'left' ? 'right-full mr-3' : 'left-full ml-3'
        }`}
        style={{ opacity: lineOpacity, scaleX: lineScale }}
      />

      <motion.div
        className="w-4 h-4 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.52)] z-20"
        style={{ scale: dotScale, opacity: dotOpacity }}
      />

      <motion.article
        className={`absolute top-1/2 -translate-y-1/2 w-[min(50vw,208px)] rounded-xl border border-white/15 bg-[#111111]/95 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.42)] ${
          node.side === 'left' ? 'left-full ml-4 text-left' : 'right-full mr-4 text-right'
        }`}
        style={{ opacity: cardOpacity, x: cardX, y: cardY }}
      >
        <div>
          <h3 className="text-[1.55rem] leading-none font-black text-sand tracking-tight">
            {node.year}
          </h3>
        </div>

        <p className="mt-2 text-[11px] leading-[1.42] text-[#d7cfbf]">
          {node.text}
        </p>
      </motion.article>

      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 ${
          node.side === 'left' ? 'right-full mr-4' : 'left-full ml-4'
        }`}
        style={{
          width: mobileImageWidth,
          opacity: isCelebrationLogo2024 ? celebrationImageOpacity : imageOpacity,
          x: imageX,
          y: isCelebrationLogo2024 ? celebrationImageY : imageY,
          scale: isCelebrationLogo2024 ? celebrationImageScale : imageScale,
          rotate: isCelebrationLogo2024 ? celebrationImageRotate : 0
        }}
      >
        <motion.figure
          className={`relative rounded-xl ${
            isCelebrationLogo2024
              ? 'overflow-visible bg-transparent shadow-none p-2'
              : 'overflow-hidden bg-[#0f0f10] border border-custom-blue/40 shadow-[0_14px_28px_rgba(0,0,0,0.45)]'
          }`}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -6, 0], rotate: [node.side === 'left' ? -1.5 : 1.5, 0, node.side === 'left' ? -1.5 : 1.5] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 4.8 + (node.id % 3), repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {isCelebrationLogo2024 && (
            <motion.span
              className="pointer-events-none absolute inset-[-8%] rounded-[28px] bg-[radial-gradient(circle,rgba(0,176,240,0.45)_0%,rgba(0,176,240,0.16)_44%,rgba(0,176,240,0)_76%)] blur-lg"
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
              className="pointer-events-none absolute inset-[4%] rounded-[18px] bg-[linear-gradient(130deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0)_55%)]"
              style={{ opacity: celebrationFlashOpacity }}
            />
          )}
          <img
            src={imageSrc}
            alt={`${node.year} - ${node.media}`}
            loading="lazy"
            decoding="async"
            className={`w-full h-auto block ${isCelebrationLogo2024 ? 'relative z-10' : ''}`}
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
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.24),transparent_55%)]" />
          )}
        </motion.figure>
      </motion.div>
    </div>
  );
};

export default function TimelineSection() {
  const timelineImage = new URL('../../img/timeline.png', import.meta.url).href;
  const imageByYear: Record<string, string> = {
    'placeholder-2006': new URL('../../img/timeline/placeholder.svg', import.meta.url).href,
    'placeholder-2007-savoir': new URL('../../img/timeline/2007.png', import.meta.url).href,
    'placeholder-2007-db': new URL('../../img/timeline/2007.png', import.meta.url).href,
    '2009': new URL('../../img/timeline/2009.jpg', import.meta.url).href,
    '2010': new URL('../../img/timeline/2010.png', import.meta.url).href,
    'placeholder-2012': new URL('../../img/timeline/2012.jpg', import.meta.url).href,
    '2013': new URL('../../img/timeline/2013.jpg', import.meta.url).href,
    '2015': new URL('../../img/timeline/2015.jpg', import.meta.url).href,
    '2016': new URL('../../img/timeline/2016.jpg', import.meta.url).href,
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

  const mobileNodes = useMemo<TimelineNodeData[]>(
    () =>
      timelineData.map((item, index) => ({
        ...item,
        side: index % 2 === 0 ? 'left' : 'right',
        cx: MOBILE_CENTER_X + (index % 2 === 0 ? -MOBILE_CURVE_SWAY : MOBILE_CURVE_SWAY),
        cy: MOBILE_TOP_PADDING + index * MOBILE_STEP_Y
      })),
    []
  );

  const desktopTimelineHeight = TOP_PADDING + (timelineData.length - 1) * STEP_Y + BOTTOM_PADDING;
  const desktopPathD = useMemo(() => buildPath(desktopNodes), [desktopNodes]);
  const mobileTimelineHeight = MOBILE_TOP_PADDING + (timelineData.length - 1) * MOBILE_STEP_Y + MOBILE_BOTTOM_PADDING;
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
    <section className="relative py-24 px-6 bg-custom-black z-10">
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
            alt="Previa da timeline"
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
          className="relative w-full mx-auto overflow-hidden"
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
              imageSrc={imageByYear[node.imageKey]}
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
              imageSrc={imageByYear[node.imageKey]}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

