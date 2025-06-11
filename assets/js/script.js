const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    if (!cursor || !cursorDot) return;
    
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;

    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';

    cursorDot.style.left = dotX - 2 + 'px';
    cursorDot.style.top = dotY - 2 + 'px';

    requestAnimationFrame(animate);
}

if (cursor && cursorDot) {
    animate();
}

document.querySelectorAll('a, .project, .misc-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', (e) => {
        // Only proceed if not clicking a button or link
        if (!e.target.closest('.demo-button') && !e.target.closest('a')) {
            const ripple = document.createElement('div');
            const rect = project.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(26, 26, 26, 0.05);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                z-index: 1;
            `;

            project.style.position = 'relative';
            project.appendChild(ripple);

            ripple.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(2)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });

            setTimeout(() => ripple.remove(), 300);
        }
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floating = document.querySelectorAll('.floating');

    floating.forEach((el, index) => {
        const speed = 0.02 + (index * 0.01);
        const yPos = -(scrolled * speed);
        el.style.transform += ` translateY(${yPos}px)`;
    });
});

setTimeout(() => {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => typingIndicator.remove(), 500);
    }
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    const contactLinks = document.querySelectorAll('.contact a');
    contactLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';

        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });
});

if (window.innerWidth <= 768) {
    if (cursor) cursor.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => {
        el.style.cursor = 'auto';
    });
}

const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = darkModeToggle.querySelector('.toggle-text');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleText.textContent = isDark ? 'light' : 'dark';
    updateFavicon();
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = 'light';
}

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const readingProgress = document.querySelector('.reading-progress');
    if (readingProgress) readingProgress.style.width = `${progress}%`;
});

document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            const preview = document.createElement('div');
            preview.className = 'link-preview';
            preview.textContent = new URL(link.href).hostname.replace('www.', '');
            document.body.appendChild(preview);

            const updatePosition = (e) => {
                preview.style.left = `${e.clientX + 15}px`;
                preview.style.top = `${e.clientY + 15}px`;
            };

            link.addEventListener('mousemove', updatePosition);
            link.addEventListener('mouseleave', () => {
                preview.remove();
                link.removeEventListener('mousemove', updatePosition);
            });
        }
    });
});

const favicon = document.querySelector("link[rel='icon']");
const updateFavicon = () => {
    if (favicon) {
        const emoji = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    }
};

updateFavicon();

if (window.console) {
    const styles = [
        'color: #000000',
        'background: #f5f5f5',
        'font-size: 12px',
        'padding: 4px 8px',
        'border-radius: 3px',
        'font-family: "IBM Plex Mono"'
    ].join(';');

    console.log('%c👋 Hey there fellow developer!', styles);
    console.log('%cLooking for something interesting? The source is right here!', styles);
}

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.demo-button').forEach(button => {
        // Change this line to look for .github-icon instead of .fab.fa-github
        const githubIcon = button.querySelector('.github-icon');
        if (githubIcon) {
            githubIcon.style.display = 'inline-block';
            githubIcon.style.marginRight = '8px';
        }
    
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // This is important to prevent the project click handler from firing
            const githubUrl = button.getAttribute('data-github');
            
            if (githubUrl) {
                button.style.transform = 'translateY(0) scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                    window.open(githubUrl, '_blank');
                }, 150);
            }
        });

        button.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = '#999';
                cursor.style.background = 'rgba(0, 0, 0, 0.1)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '';
                cursor.style.background = 'transparent';
            }
        });
    });
});

document.querySelectorAll('a, .project, .misc-item, .demo-button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});

const checkFontAwesome = () => {
    const span = document.createElement('span');
    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);
    
    const beforeSpan = window.getComputedStyle(span, ':before');
    const hasFA = beforeSpan.getPropertyValue('font-family').includes('Font Awesome');
    
    document.body.removeChild(span);
    return hasFA;
};

if (!checkFontAwesome()) {
    console.warn('Font Awesome not loaded properly. Attempting to reload...');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    link.integrity = 'sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0V4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
}

document.querySelectorAll('a, .project, .misc-item, .demo-button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (!el.classList.contains('demo-button')) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});