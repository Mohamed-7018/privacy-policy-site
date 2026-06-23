document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // 3. Accordion / FAQ Toggle
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // If the clicked one wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. Scroll Highlight (Intersection Observer for Table of Contents)
    const sections = document.querySelectorAll('.policy-section');
    const tocLinks = document.querySelectorAll('.toc-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 5. Scroll Animations (Fade-in elements)
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    fadeSections.forEach(section => {
        animObserver.observe(section);
    });

    // 6. Interactive Search / Filter
    const searchInput = document.getElementById('search-policy');
    const originalContents = new Map();

    // Cache original HTML content to restore it on clear/backspace
    sections.forEach(section => {
        originalContents.set(section.id, section.innerHTML);
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        sections.forEach(section => {
            const originalHTML = originalContents.get(section.id);
            if (!query) {
                section.innerHTML = originalHTML;
                section.style.display = 'block';
                return;
            }

            // Simple text contents check
            const textContent = section.textContent.toLowerCase();
            if (textContent.includes(query)) {
                section.style.display = 'block';
                
                // Highlight text matching the query
                // Note: To prevent destroying elements/icons, we target child paragraphs and lists
                const children = section.querySelectorAll('p, li, h2');
                children.forEach(child => {
                    if (child.children.length === 0 || child.tagName === 'H2') {
                        const text = child.textContent;
                        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                        if (text.toLowerCase().includes(query)) {
                            child.innerHTML = text.replace(regex, '<mark>$1</mark>');
                        }
                    }
                });
            } else {
                section.style.display = 'none';
            }
        });
    });

    // Helper to escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});
