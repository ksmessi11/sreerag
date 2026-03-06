// Custom Cursor with trailing particles
export class CustomCursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    this.canvas = document.getElementById('cursor-trail');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.mouse = { x: 0, y: 0 };
    this.dotPos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.particles = [];
    this.isHovering = false;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (!this.isMobile) {
      this.init();
    }
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Track hover targets
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, [data-magnetic], input, textarea, .project-card');
      if (target) {
        this.isHovering = true;
        this.dot.classList.add('hover');
        this.ring.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, [data-magnetic], input, textarea, .project-card');
      if (target) {
        this.isHovering = false;
        this.dot.classList.remove('hover');
        this.ring.classList.remove('hover');
      }
    });

    this.animate();
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    // Spawn trail particles
    if (Math.random() > 0.5) {
      this.particles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        hue: Math.random() > 0.5 ? 185 : 270, // cyan or purple
      });
    }
  }

  animate() {
    // Smooth cursor follow
    const dotSpeed = 0.2;
    const ringSpeed = 0.08;

    this.dotPos.x += (this.mouse.x - this.dotPos.x) * dotSpeed;
    this.dotPos.y += (this.mouse.y - this.dotPos.y) * dotSpeed;
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * ringSpeed;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * ringSpeed;

    if (this.dot) {
      this.dot.style.left = `${this.dotPos.x}px`;
      this.dot.style.top = `${this.dotPos.y}px`;
    }
    if (this.ring) {
      this.ring.style.left = `${this.ringPos.x}px`;
      this.ring.style.top = `${this.ringPos.y}px`;
    }

    // Draw particle trail
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= p.decay;
        p.size *= 0.98;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.life * 0.6})`;
        this.ctx.fill();

        // Glow
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.life * 0.15})`;
        this.ctx.fill();
      }

      // Limit particle count
      if (this.particles.length > 80) {
        this.particles.splice(0, this.particles.length - 80);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Magnetic button effect
export function initMagneticButtons() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
}
