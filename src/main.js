// Main entry point — Sreerag N K Portfolio
import './styles/main.css';
import { CustomCursor, initMagneticButtons } from './animations/cursor.js';
import { initScrollAnimations, initNavScrollBehavior } from './animations/scroll.js';
import { initTextScramble, initSplitTextReveal, animateSplitText } from './animations/text.js';
import { playLoadingAnimation, playHeroEntrance, animateFloatingShapes } from './animations/transitions.js';
import { GameScene3D, MiniScene3D, TicTacToe3D } from './animations/scene3d.js';
import { TicTacToe } from './animations/tictactoe.js';

// Initialize everything after DOM is ready
document.addEventListener('DOMContentLoaded', async () => {

    // 1. Split text setup (must happen before animations)
    initSplitTextReveal();

    // 2. Play loading animation
    await playLoadingAnimation();

    // 3. Initialize all systems
    new CustomCursor();
    initMagneticButtons();
    initScrollAnimations();
    initNavScrollBehavior();
    initTextScramble();

    // 4. Play hero entrance animation
    playHeroEntrance();
    animateSplitText();
    animateFloatingShapes();

    // 5. Initialize 3D scenes
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
        // Hero background 3D scene with gaming objects
        new GameScene3D('hero-3d-scene');

        // Section divider 3D scenes
        new MiniScene3D('divider-swords', 'swords');
        new MiniScene3D('divider-portal', 'portal');

        // Contact section background gems
        new MiniScene3D('contact-3d-scene', 'gems');
    }

    // 6. Initialize Tic-Tac-Toe
    const tictactoe = new TicTacToe('.game-board', '#game-status', '#reset-game');
    if (!isMobile) {
        const ttt3D = new TicTacToe3D('game-3d-scene');
        tictactoe.setScene3D(ttt3D);
    }

    // 7. Animate stat counters
    animateStatCounters();

    // 7. Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('open');
            }
        });
    });

    // 8. Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    // 9. Contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.querySelector('.btn-text').textContent;
            btn.querySelector('.btn-text').textContent = 'Message Sent! ✓';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // 10. Parallax on mouse move for hero
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && !isMobile) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
});

// Counter animation for hero stats
function animateStatCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.count);
                let current = 0;
                const duration = 2000;
                const step = target / (duration / 16);

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current);
                }, 16);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}
