import gsap from 'gsap';

// Intro / Loading animation
export function playLoadingAnimation() {
    return new Promise(resolve => {
        const loader = document.getElementById('loader');
        const barFill = document.querySelector('.loader-bar-fill');
        const loaderText = document.querySelector('.loader-text');
        const loaderSub = document.querySelector('.loader-subtitle');

        if (!loader) { resolve(); return; }

        // Animate loader bar
        const tl = gsap.timeline({
            onComplete: () => {
                loader.classList.add('loaded');
                setTimeout(resolve, 600);
            }
        });

        tl.to(barFill, {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut',
        })
            .to(loaderText, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out',
            }, '-=0.5')
            .to(loaderText, {
                scale: 1,
                duration: 0.2,
            })
            .to([loaderText, loaderSub, document.querySelector('.loader-bar')], {
                opacity: 0,
                y: -20,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.in',
            }, '+=0.2');
    });
}

// Hero entrance animation
export function playHeroEntrance() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Tag line
    tl.fromTo('.hero-tag-line',
        { width: 0 },
        { width: 40, duration: 0.6, ease: 'power3.out' }
    )
        .fromTo('.hero-tag-text',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
            '-=0.3'
        )

        // Title words
        .fromTo('.hero-title-word',
            { y: '110%', opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' },
            '-=0.2'
        )

        // CTA buttons
        .fromTo('.hero-cta .btn',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
            '-=0.3'
        )

        // Scroll indicator
        .fromTo('.scroll-indicator',
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            '-=0.2'
        );

    return tl;
}

// Floating shapes ambient animation
export function animateFloatingShapes() {
    document.querySelectorAll('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            x: `random(-40, 40)`,
            y: `random(-40, 40)`,
            scale: `random(0.8, 1.2)`,
            duration: `random(4, 8)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5,
        });
    });
}
