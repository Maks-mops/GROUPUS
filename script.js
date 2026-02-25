/**
 * US GROUP Website Script
 * Purpose: Handle all interactive components, animations, and modals.
 * Version: 2.0 (Overhaul)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Current Year
    const updateYear = () => {
        document.querySelectorAll('#currentYear').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    };
    updateYear();

    // 2. Header Scroll Effect
    const header = document.querySelector('#header');
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Initial check

    // 3. Mobile Menu
    const burgerBtn = document.querySelector('#burgerBtn');
    const mobileMenu = document.querySelector('#mobileMenu');
    const closeMenu = document.querySelector('#closeMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = (open) => {
        if (mobileMenu) {
            mobileMenu.classList.toggle('open', open);
            mobileMenu.setAttribute('aria-hidden', !open);
            document.body.style.overflow = open ? 'hidden' : '';
        }
    };

    if (burgerBtn) burgerBtn.addEventListener('click', () => toggleMenu(true));
    if (closeMenu) closeMenu.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // 4. Scroll-to-Top
    const scrollTopBtn = document.querySelector('#scrollTop');
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Dot Navigation
    const sections = document.querySelectorAll('section[id], footer[id]');
    const dots = document.querySelectorAll('.dot');

    const updateDotNav = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${currentSection}`) {
                dot.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateDotNav);

    // 6. Fade-in Animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));

    // 7. Counters
    const statsSection = document.querySelector('#stats');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.counter').forEach(animateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    // 8. Reviews Carousel
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');

        let currentIndex = 0;
        let isPaused = false;

        // Generate dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width + 20; // 20 is gap
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            const allDots = document.querySelectorAll('.carousel-dot');
            allDots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        };

        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Autoplay
        let interval = setInterval(() => {
            if (!isPaused) goToSlide(currentIndex + 1);
        }, 5000);

        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);

        // Touch support
        let startX = 0;
        track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
        track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) goToSlide(currentIndex + 1);
            if (endX - startX > 50) goToSlide(currentIndex - 1);
        });

        window.addEventListener('resize', updateCarousel);
    }

    // 9. FAQ Category Accordion
    const catHeaders = document.querySelectorAll('.faq-category-header');
    catHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.closest('.faq-category');
            const isActive = parent.classList.contains('active');

            // Close others (optional, let's allow multiple open for better UX on long FAQs)
            // document.querySelectorAll('.faq-category').forEach(c => c.classList.remove('active'));

            parent.classList.toggle('active');
            const body = parent.querySelector('.faq-category-body');
            if (body) {
                body.style.maxHeight = parent.classList.contains('active') ? `${body.scrollHeight}px` : '0';
            }
        });
    });

    // 10. FAQ Question Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            const expanded = q.getAttribute('aria-expanded') === 'true';

            q.setAttribute('aria-expanded', !expanded);
            item.classList.toggle('open', !expanded);

            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = !expanded ? `${answer.scrollHeight}px` : '0';
            }
        });
    });

    // 11. Modal Logic (Generic)
    const openModal = (id = 'contactModal') => {
        const modal = document.getElementById(id) || document.getElementById('modalOverlay');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modal) => {
        if (!modal) {
            document.querySelectorAll('.modal-overlay').forEach(m => {
                m.classList.remove('active');
                m.setAttribute('aria-hidden', 'true');
            });
        } else {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    };

    window.openModal = openModal;
    window.closeAllModals = () => closeModal();

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal');
            openModal(targetId);
        });
    });

    document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el.classList.contains('close-modal')) {
                closeModal(el.closest('.modal-overlay'));
            }
        });
    });

    // 12. Form Handling (Global)
    const forms = document.querySelectorAll('#contactForm, #modalForm');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Отправка...';

            // Simulate API call
            setTimeout(() => {
                closeAllModals();
                const successModal = document.querySelector('#successModal');
                if (successModal) {
                    successModal.classList.add('active');
                    successModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
                form.reset();
                btn.disabled = false;
                btn.textContent = originalText;
            }, 1500);
        });
    });

    // 13. Expertise Accordion (For Division Pages)
    document.querySelectorAll('.expertise-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.expertise-item');
            item.classList.toggle('active');

            // If we have content to reveal, we can add it here.
            // For now, it just toggles the 'active' class for styling if needed.
        });
    });

    // 13. Specialist Modal Data
    const specialists = [
        {
            name: "Сатенбаев Улан",
            role: "Управляющий партнёр",
            exp: "15+ лет практики. Специализируется на структурировании сложных сделок, M&A и защите активов. В US GROUP с момента основания, руководит стратегическим развитием группы.",
            edu: "КНУ им. Ж. Баласагына, Юридический факультет (с отличием); международные стажировки (EU, UAE).",
            spec: "Корпоративное право, инвестиционный консалтинг, антикризисное управление и GR.",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Айнура Бекова",
            role: "Руководитель US GROUP AUDIT",
            exp: "12 лет в сфере аудита. Обладает сертификатом CIPA и является действующим членом Объединения бухгалтеров и аудиторов. Под её руководством проведено более 200 внешних аудитов крупнейших компаний региона.",
            edu: "КГТУ им. И. Раззакова, факультет Инновационных технологий (Финансы).",
            spec: "Трансформация финансовой отчётности в МСФО, налоговое планирование и методология контроля.",
            img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Рустам Асанов",
            role: "Директор US GROUP CAPITAL",
            exp: "14 лет в инвестиционном банкинге и управлении коммерческой недвижимостью. Эксперт по оценке доходности объектов и управлению рисками частного капитала.",
            edu: "АУЦА (Американский университет в Центральной Азии), MBA (Business Administration).",
            spec: "Стратегия инвестирования, портфельное управление, брокеридж коммерческих площадей.",
            img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Дмитрий Кравцов",
            role: "Юридический консультант",
            exp: "9 лет экспертизы в области банковского и финансового права. Сопровождал запуск пяти крупнейших финтех-платформ в КР. Постоянный эксперт рабочих групп по регуляторным песочницам.",
            edu: "КРСУ им. Б. Ельцина, Юриспруденция.",
            spec: "Лицензирование платёжных организаций, блокчейн-регулирование, защита интеллектуальной собственности.",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Елена Морозова",
            role: "HR-директор",
            exp: "10 лет профессионального стажа. Эксперт по внедрению эффективных систем KPI и формированию корпоративной культуры, соответствующей международным стандартам консалтинга.",
            edu: "БГУ им. К. Карасаева, факультет Гуманитарных знаний.",
            spec: "Рекрутинг топ-менеджмента, управление эффективностью персонала, организационное развитие.",
            img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const specModal = document.querySelector('#specialistModal');
    const specContent = document.querySelector('#specialistModalContent');

    window.openSpecialistModal = (index) => {
        const s = specialists[index];
        if (!s || !specContent || !specModal) return;

        specContent.innerHTML = `
            <div class="spec-modal-layout">
                <div class="spec-modal-img" style="background-image: url('${s.img}')"></div>
                <div class="spec-modal-info">
                    <h2 class="spec-modal-name">${s.name}</h2>
                    <p class="spec-modal-role">${s.role}</p>
                    <div class="spec-modal-details">
                        <p><strong>Опыт:</strong> ${s.exp}</p>
                        <p><strong>Образование:</strong> ${s.edu}</p>
                        <p><strong>Специализация:</strong> ${s.spec}</p>
                    </div>
                    <button class="btn btn-primary btn-block open-modal" style="margin-top:20px" onclick="closeSpecialistModal(); openModal();">Записаться на консультацию</button>
                </div>
            </div>
        `;
        specModal.classList.add('active');
        specModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    window.closeSpecialistModal = () => {
        if (specModal) {
            specModal.classList.remove('active');
            specModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (specModal) {
        specModal.addEventListener('click', (e) => {
            if (e.target === specModal) closeSpecialistModal();
        });
    }

    // ── PARALLAX HERO ──────────────────────────────
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;
            const heroEl = document.querySelector('.hero');
            if (!heroEl) return;
            const heroHeight = heroEl.offsetHeight;

            // Двигаем фон на 40% от скорости скролла
            // (чем меньше число — тем сильнее эффект)
            if (scrollY <= heroHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
    // ───────────────────────────────────────────────

});
