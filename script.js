document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader ---
    const preloader = document.getElementById('preloader');
    if (!sessionStorage.getItem('hkfire_preloader_shown')) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }, 2500);
        sessionStorage.setItem('hkfire_preloader_shown', 'true');
    } else {
        preloader.style.display = 'none';
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }

    // --- 2. Dynamic Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.replace('nav-transparent', 'nav-solid');
        } else {
            navbar.classList.replace('nav-solid', 'nav-transparent');
        }
    });

    // --- 3. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (mobileNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans.forEach(s => s.style.transform = 'none');
            spans[1].style.opacity = '1';
        }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => s.style.transform = 'none');
            spans[1].style.opacity = '1';
        });
    });

    // --- 4. Intersection Observer for Scroll Animations ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--delay');
                if (delay) {
                    setTimeout(() => entry.target.classList.add('active'), parseInt(delay));
                } else {
                    entry.target.classList.add('active');
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // --- 5. Fire Extinguisher Mouse Tilt (3D parallax) ---
    const showcase = document.getElementById('extShowcase');
    const extBody = document.getElementById('extBody');

    if (showcase && extBody) {
        // Check if device supports hover (desktop)
        const supportsHover = window.matchMedia('(hover: hover)').matches;

        if (supportsHover) {
            showcase.addEventListener('mousemove', (e) => {
                const rect = showcase.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 18;  // max 18deg
                const rotateX = ((centerY - y) / centerY) * 12;  // max 12deg

                extBody.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            showcase.addEventListener('mouseleave', () => {
                extBody.style.transform = 'rotateX(0) rotateY(0)';
            });
        }

        // --- Synthesize hiss sound using Web Audio API ---
        function playHissSound() {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const duration = 1.2;
            const bufferSize = audioCtx.sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            // Generate filtered white noise (hiss)
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.4;
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            // Bandpass filter to make it sound like a gas hiss
            const bandpass = audioCtx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.value = 3000;
            bandpass.Q.value = 0.5;

            // Volume envelope: quick attack, sustain, fade out
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.35, audioCtx.currentTime + duration * 0.6);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            source.connect(bandpass);
            bandpass.connect(gain);
            gain.connect(audioCtx.destination);

            source.start();
            source.stop(audioCtx.currentTime + duration);
        }

        // Click to spray — INTENSE
        const sprayFx = document.getElementById('sprayFx');
        let spraying = false;

        showcase.addEventListener('click', () => {
            if (spraying) return;
            spraying = true;
            sprayFx.classList.add('active');
            showcase.classList.add('ext-spraying');

            // Play hiss sound
            playHissSound();

            // Squeeze lever hard on click
            const lever = extBody.querySelector('.ext-lever');
            if (lever) {
                lever.style.animation = 'none';
                lever.style.transform = 'rotate(2deg)';
            }

            setTimeout(() => {
                sprayFx.classList.remove('active');
                showcase.classList.remove('ext-spraying');
                if (lever) {
                    lever.style.animation = '';
                    lever.style.transform = '';
                }
                spraying = false;
            }, 1400);
        });
    }

    // --- 6. Particles.js (ember effect) ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 35, density: { enable: true, value_area: 800 } },
                color: { value: ["#ff3c00", "#ffb703", "#ff6a00"] },
                shape: { type: "circle" },
                opacity: {
                    value: 0.5, random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3, random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: { enable: false },
                move: {
                    enable: true, speed: 1.2, direction: "top",
                    random: true, straight: false, out_mode: "out", bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "bubble" },
                    onclick: { enable: false },
                    resize: true
                },
                modes: {
                    bubble: { distance: 200, size: 5, duration: 2, opacity: 0.8, speed: 3 }
                }
            },
            retina_detect: true
        });
    }
});
