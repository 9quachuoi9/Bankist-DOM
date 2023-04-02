'use strict';

const body = document.querySelector('body');
const html = document.querySelector('html');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

// Navbar
//  Show & close modal

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    html.classList.add('disableScrolling');
    body.classList.add('disableScrolling');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    html.classList.remove('disableScrolling');
    body.classList.remove('disableScrolling');
};

btnOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
});

// active Nav
// const getComputedStyle = window.getComputedStyle(nav);
// const navHeight = getComputedStyle.getPropertyValue('height');
const navHeight = nav.getBoundingClientRect().height;
const activeNav = function (entries, observe) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(activeNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        let id = e.target.getAttribute('href');
        // if id is not empty (only # instead #section--xxx)
        if (id) {
            id = id.substring(1);
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

//  menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = e.target
            .closest('.nav')
            .querySelectorAll('.nav__link');

        siblings.forEach(sibling => {
            if (sibling !== link) sibling.style.opacity = this;
        });
    }
};

// passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// operations
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    // guard clause
    if (!clicked) return;

    // remove all class active
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabContents.forEach(tc =>
        tc.classList.remove('operations__content--active')
    );

    // add class active
    clicked.classList.add('operations__tab--active');
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Reveal section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observe) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSection.forEach(s => {
    s.classList.add('section--hidden');
    sectionObserver.observe(s);
});

// lazy load
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observe) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    // replace data with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observe.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

// ---------------slider

const slider = function () {
    const sliderElement = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    const maxSlide = slides.length - 1;

    let curSlide = 0;

    const createDot = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `
                <button class="dots__dot" data-slide="${i}"></button>
        `
            );
        });
    };

    const activeDot = function (slideNum) {
        document.querySelectorAll('.dots__dot').forEach(d => {
            d.classList.remove('dots__dot--active');
        });
        document
            .querySelector(`.dots__dot[data-slide="${slideNum}"]`)
            .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    };

    const prevSlide = function () {
        if (curSlide === 0) curSlide = maxSlide;
        else curSlide--;
        activeDot(curSlide);
        goToSlide(curSlide);
    };

    const nextSlide = function () {
        if (curSlide === maxSlide) curSlide = 0;
        else curSlide++;
        activeDot(curSlide);
        goToSlide(curSlide);
    };

    const init = function () {
        goToSlide(curSlide);
        createDot();
        activeDot(curSlide);
    };

    init();

    // event handle

    btnLeft.addEventListener('click', prevSlide);
    btnRight.addEventListener('click', nextSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const slide = e.target.dataset.slide;
            activeDot(slide);
            goToSlide(slide);
        }
    });
};

slider();
