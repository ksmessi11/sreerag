import gsap from 'gsap';

// Text scramble effect — letters shuffle before resolving
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/[]{}';

export function scrambleText(element, finalText, options = {}) {
    const { duration = 1.5, delay = 0, onComplete } = options;
    const length = finalText.length;
    let frame = 0;
    const totalFrames = Math.floor(duration * 60); // ~60fps
    const resolveOrder = [];

    // Create random resolve order
    for (let i = 0; i < length; i++) {
        resolveOrder.push({
            index: i,
            resolveAt: Math.random() * 0.7 + 0.15, // resolve between 15%-85% of animation
        });
    }

    return new Promise(resolve => {
        setTimeout(() => {
            const interval = setInterval(() => {
                const progress = frame / totalFrames;
                let result = '';

                for (let i = 0; i < length; i++) {
                    const charInfo = resolveOrder[i];
                    if (finalText[i] === ' ') {
                        result += ' ';
                    } else if (progress >= charInfo.resolveAt) {
                        result += finalText[i];
                    } else {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                }

                element.textContent = result;
                frame++;

                if (frame > totalFrames) {
                    clearInterval(interval);
                    element.textContent = finalText;
                    if (onComplete) onComplete();
                    resolve();
                }
            }, 1000 / 60);
        }, delay * 1000);
    });
}

// Initialize scramble effect on scroll for [data-scramble] elements
export function initTextScramble() {
    const scrambleElements = document.querySelectorAll('[data-scramble]');

    scrambleElements.forEach(el => {
        const originalText = el.textContent;
        el.dataset.originalText = originalText;

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.dataset.scrambled) {
                    el.dataset.scrambled = 'true';
                    scrambleText(el, originalText, { duration: 1.2 });
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
    });
}

// Split text and reveal word by word
export function initSplitTextReveal() {
    const elements = document.querySelectorAll('.hero-description');

    elements.forEach(el => {
        const text = el.textContent;
        const words = text.split(' ');
        el.innerHTML = words.map(word =>
            `<span class="word-wrap"><span class="word">${word}</span></span>`
        ).join(' ');

        // Style word wraps
        el.querySelectorAll('.word-wrap').forEach(wrap => {
            wrap.style.display = 'inline-block';
            wrap.style.overflow = 'hidden';
            wrap.style.verticalAlign = 'top';
        });

        el.querySelectorAll('.word').forEach(word => {
            word.style.display = 'inline-block';
            word.style.transform = 'translateY(100%)';
            word.style.opacity = '0';
        });

        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// Animate the split text
export function animateSplitText() {
    const words = document.querySelectorAll('.hero-description .word');

    gsap.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.5,
    });
}

// Typewriter effect
export function typewriterEffect(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}
