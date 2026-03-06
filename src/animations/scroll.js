import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
    // Reveal text (paragraph-level reveal)
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    // Reveal up (cards, items)
    gsap.utils.toArray('.reveal-up').forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    // Skill bar fill
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
        const width = bar.dataset.width || 80;
        gsap.to(bar, {
            width: `${width}%`,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // Section lines
    gsap.utils.toArray('.section-line').forEach(line => {
        gsap.fromTo(line,
            { width: 0 },
            {
                width: 60,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    // Floating shapes parallax
    gsap.utils.toArray('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            y: (i % 2 === 0 ? -80 : 80),
            x: (i % 3 === 0 ? 40 : -40),
            scrollTrigger: {
                trigger: '.section-home',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    });

    // Project cards tilt on hover
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotateY: x * 8,
                rotateX: -y * 8,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 800,
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        });
    });
}

export function initNavScrollBehavior() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar background on scroll
    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            if (self.scroll() > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        },
    });

    // Active nav link based on scroll
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setActiveLink(section.id),
            onEnterBack: () => setActiveLink(section.id),
        });
    });

    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    }
}
