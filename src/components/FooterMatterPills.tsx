import { useEffect, useMemo, useRef } from 'react';
import * as Matter from 'matter-js';

const DEFAULT_LABELS = [
  'Encantamento',
  'Precisão',
  'Escalabilidade',
  'Solução em cadeia',
  'Usabilidade',
  'Velocidade',
  'React',
  'Next.js',
  'Python',
  'AWS',
  'Postgre sql',
  'Node.js'
];

type FooterMatterPillsProps = {
  labels?: string[];
  className?: string;
  showHint?: boolean;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
  lastX: number;
  lastY: number;
  velocityX: number;
  velocityY: number;
};

export default function FooterMatterPills({ labels = DEFAULT_LABELS, className = '', showHint = false }: FooterMatterPillsProps) {
  const matterBoxRef = useRef<HTMLDivElement | null>(null);
  const pillLabels = useMemo(() => labels, [labels]);

  useEffect(() => {
    const matterBox = matterBoxRef.current;
    if (!matterBox || pillLabels.length === 0) {
      return;
    }

    const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;
    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 1.1;

    const getContainerSize = () => {
      const rect = matterBox.getBoundingClientRect();
      return {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        left: rect.left,
        top: rect.top
      };
    };

    let container = getContainerSize();

    const render = Render.create({
      element: matterBox,
      engine,
      options: {
        width: container.width,
        height: container.height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
      }
    });

    render.canvas.classList.add('footer-matter-canvas');

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const pills = Array.from(matterBox.querySelectorAll('.footer-matter-pill')) as HTMLDivElement[];
    let pillBodies: Array<Matter.Body | null> = [];
    let boundaries: Matter.Body[] = [];
    let scrambled = false;

    const pointerState: PointerState = {
      x: 0,
      y: 0,
      active: false,
      lastX: 0,
      lastY: 0,
      velocityX: 0,
      velocityY: 0
    };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    const fadeHitCounts = pills.map(() => 0);
    const fadeHitThresholds = pills.map(() => Math.floor(Math.random() * 4) + 3);
    const fadeLastHitAt = pills.map(() => 0);
    const pillsRemoved = pills.map(() => false);
    const fadeHitCooldownMs = 90;
    const fadeHitRadius = 128;

    const updatePillFadeVisual = (index: number) => {
      const pillElem = pills[index];
      if (!pillElem) return;

      const threshold = Math.max(1, fadeHitThresholds[index]);
      const progress = Math.min(1, fadeHitCounts[index] / threshold);
      const opacity = Math.max(0, 1 - progress);

      pillElem.style.opacity = `${opacity}`;
      pillElem.style.filter = progress > 0 ? `blur(${(progress * 1.2).toFixed(2)}px)` : 'none';
      pillElem.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      pillElem.style.pointerEvents = progress >= 1 ? 'none' : 'auto';
    };

    const setPointerFromClient = (clientX: number, clientY: number) => {
      container = getContainerSize();

      const localX = clientX - container.left;
      const localY = clientY - container.top;
      const inside = localX >= 0 && localX <= container.width && localY >= 0 && localY <= container.height;

      if (!inside) {
        pointerState.active = false;
        pointerState.velocityX *= 0.8;
        pointerState.velocityY *= 0.8;
        return false;
      }

      pointerState.velocityX = localX - pointerState.lastX;
      pointerState.velocityY = localY - pointerState.lastY;
      pointerState.lastX = localX;
      pointerState.lastY = localY;
      pointerState.x = localX;
      pointerState.y = localY;
      pointerState.active = true;
      return true;
    };

    const positionPillsAsList = () => {
      const isMobile = container.width < 768;
      const pillWidth = isMobile ? 200 : 260;
      const pillHeight = isMobile ? 46 : 54;
      const gap = 7;
      const totalHeight = pillLabels.length * pillHeight + (pillLabels.length - 1) * gap;
      const startX = Math.round((container.width - pillWidth) / 2);
      const startY = Math.round((container.height - totalHeight) / 2);

      pills.forEach((pill, index) => {
        if (pillsRemoved[index]) {
          pill.style.opacity = '0';
          pill.style.visibility = 'hidden';
          pill.style.pointerEvents = 'none';
          return;
        }

        const x = startX;
        const y = startY + index * (pillHeight + gap);
        pill.style.left = `${x}px`;
        pill.style.top = `${y}px`;
        pill.style.transform = 'rotate(0rad)';
        updatePillFadeVisual(index);
      });
    };

    const createPills = () =>
      pills.map((pillElem, index) => {
        if (pillsRemoved[index]) {
          return null;
        }

        const pillWidth = pillElem.offsetWidth;
        const pillHeight = pillElem.offsetHeight;
        const pillPosX = pillElem.offsetLeft + pillWidth / 2;
        const pillPosY = pillElem.offsetTop + pillHeight / 2;
        const pillRadius = pillHeight / 2;

        const leftCircle = Bodies.circle(pillPosX - pillWidth / 2 + pillRadius, pillPosY, pillRadius, {
          density: 0.03,
          friction: 0.12,
          restitution: 0.78,
          render: { opacity: 0 }
        });

        const rightCircle = Bodies.circle(pillPosX + pillWidth / 2 - pillRadius, pillPosY, pillRadius, {
          density: 0.03,
          friction: 0.12,
          restitution: 0.78,
          render: { opacity: 0 }
        });

        const rect = Bodies.rectangle(pillPosX, pillPosY, pillWidth - pillHeight, pillHeight, {
          density: 0.03,
          friction: 0.12,
          restitution: 0.78,
          render: { opacity: 0 }
        });

        const pillBody = Body.create({
          parts: [leftCircle, rightCircle, rect],
          friction: 0.12,
          frictionAir: 0.018,
          restitution: 0.78
        });

        Body.setStatic(pillBody, true);
        Composite.add(engine.world, pillBody);
        return pillBody;
      });

    const createBoundaries = () => {
      const ground = Bodies.rectangle(container.width / 2, container.height + 24, container.width, 48, {
        isStatic: true,
        render: { opacity: 0 }
      });
      const leftWall = Bodies.rectangle(-24, container.height / 2, 48, container.height, {
        isStatic: true,
        render: { opacity: 0 }
      });
      const rightWall = Bodies.rectangle(container.width + 24, container.height / 2, 48, container.height, {
        isStatic: true,
        render: { opacity: 0 }
      });
      const topWall = Bodies.rectangle(container.width / 2, -24, container.width, 48, {
        isStatic: true,
        render: { opacity: 0 }
      });

      boundaries = [ground, leftWall, rightWall, topWall];
      Composite.add(engine.world, boundaries);
    };

    const clearBodies = () => {
      pillBodies.forEach((body) => {
        if (body) Composite.remove(engine.world, body);
      });
      boundaries.forEach((body) => Composite.remove(engine.world, body));
      pillBodies = [];
      boundaries = [];
    };

    const rebuildScene = () => {
      clearBodies();
      container = getContainerSize();
      positionPillsAsList();
      createBoundaries();
      pillBodies = createPills();
      scrambled = false;
    };

    const scramblePills = () => {
      if (scrambled) return;
      scrambled = true;

      pillBodies.forEach((pillBody, index) => {
        if (!pillBody || pillsRemoved[index]) return;

        Body.setStatic(pillBody, false);
        Body.applyForce(pillBody, pillBody.position, {
          x: random(-0.1, 0.1),
          y: random(-0.03, 0.02)
        });
        Body.setAngularVelocity(pillBody, random(-0.12, 0.12));

        Body.applyForce(pillBody, pillBody.position, {
          x: index % 2 === 0 ? random(0.03, 0.07) : random(-0.07, -0.03),
          y: random(-0.01, 0.01)
        });
      });
    };

    const repelPillsFromPointer = () => {
      if (!scrambled || !pointerState.active) return;

      const radius = container.width < 768 ? 260 : Math.max(360, container.width * 0.28);
      const baseStrength = container.width < 768 ? 0.01 : 0.013;
      const now = Date.now();

      pillBodies.forEach((body, index) => {
        if (!body || pillsRemoved[index]) return;

        const dx = body.position.x - pointerState.x;
        const dy = body.position.y - pointerState.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 0 || dist >= radius) return;

        const influence = 1 - dist / radius;
        const radialForce = influence * baseStrength;
        const swipeBoostX = pointerState.velocityX * 0.00035 * influence;
        const swipeBoostY = pointerState.velocityY * 0.00035 * influence;
        const chaosX = random(-0.0016, 0.0016) * influence;
        const chaosY = random(-0.0016, 0.0016) * influence;

        Body.applyForce(body, body.position, {
          x: (dx / dist) * radialForce + swipeBoostX + chaosX,
          y: (dy / dist) * radialForce + swipeBoostY + chaosY
        });

        Body.setAngularVelocity(body, body.angularVelocity + random(-0.05, 0.05));

        if (dist <= fadeHitRadius && now - fadeLastHitAt[index] >= fadeHitCooldownMs) {
          fadeLastHitAt[index] = now;
          fadeHitCounts[index] += 1;
          updatePillFadeVisual(index);

          if (fadeHitCounts[index] >= fadeHitThresholds[index]) {
            pillsRemoved[index] = true;
            Composite.remove(engine.world, body);
            pillBodies[index] = null;
            updatePillFadeVisual(index);
          }
        }
      });

      pointerState.velocityX *= 0.92;
      pointerState.velocityY *= 0.92;
    };

    const syncPillsWithBodies = () => {
      pillBodies.forEach((body, index) => {
        const pillElem = pills[index];
        if (!pillElem || !body || pillsRemoved[index]) return;

        pillElem.style.left = `${body.position.x - pillElem.offsetWidth / 2}px`;
        pillElem.style.top = `${body.position.y - pillElem.offsetHeight / 2}px`;
        pillElem.style.transform = `rotate(${body.angle}rad)`;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (setPointerFromClient(event.clientX, event.clientY)) {
        scramblePills();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (setPointerFromClient(event.clientX, event.clientY)) {
        scramblePills();
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (setPointerFromClient(touch.clientX, touch.clientY)) {
        scramblePills();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (setPointerFromClient(touch.clientX, touch.clientY)) {
        scramblePills();
      }
    };

    const onTouchEnd = () => {
      pointerState.active = false;
      pointerState.velocityX = 0;
      pointerState.velocityY = 0;
    };

    const resizeRenderer = () => {
      container = getContainerSize();
      render.canvas.width = container.width;
      render.canvas.height = container.height;
      render.options.width = container.width;
      render.options.height = container.height;
      rebuildScene();
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeRenderer();
    });

    Events.on(engine, 'beforeUpdate', repelPillsFromPointer);
    Events.on(engine, 'afterUpdate', syncPillsWithBodies);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    resizeObserver.observe(matterBox);

    rebuildScene();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      Events.off(engine, 'beforeUpdate', repelPillsFromPointer);
      Events.off(engine, 'afterUpdate', syncPillsWithBodies);
      clearBodies();

      Runner.stop(runner);
      Render.stop(render);
      Engine.clear(engine);

      render.canvas.remove();
      render.textures = {};
    };
  }, [pillLabels]);

  return (
    <div ref={matterBoxRef} className={`footer-matter-box ${className}`.trim()} aria-label="Tecnologias em movimento">
      {showHint && <p className="footer-matter-hint">Passe o mouse para soltar e embaralhar os cards</p>}
      {pillLabels.map((label) => (
        <div key={label} className="footer-matter-pill">
          {label}
        </div>
      ))}
    </div>
  );
}
