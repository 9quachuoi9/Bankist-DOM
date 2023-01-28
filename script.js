'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//     el.addEventListener('click', function (e) {
//         e.preventDefault();
//         const id = this.getAttribute('href');
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
// });

// 1. Add eventListener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//     e.preventDefault();
//     if (e.target.classList.contains('nav__link')) {
//         let id = e.target.getAttribute('href');
//         if (id) {
//             id = id.substring(1);
//             const element = document.getElementById(id);
//             if (element) element.scrollIntoView({ behavior: 'smooth' });
//         }
//     }
// });

tabContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    // guard clause
    if (!clicked) return;

    // remove all class active
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabContent.forEach(tc =>
        tc.classList.remove('operations__content--active')
    );

    // add class active
    clicked.classList.add('operations__tab--active');
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = e.target
            .closest('.nav')
            .querySelectorAll('.nav__link');
        // const logo = e.target.closest('.nav').querySelector('img');

        siblings.forEach(s => {
            if (s !== link) s.style.opacity = this;
        });
        // link.style.opacity = 1;
    }
};

// passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSection.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// lazy loading img
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    // replace src with data-arc
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// Slider

const slider = function () {
    const sliderElement = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const maxSlide = slides.length;
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    let intervalID;

    // Function
    const createDot = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activeDot = function (slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));
        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    };

    // 0 100% 200% 300%
    const preSlide = function () {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * i}%)`)
        );
    };

    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activeDot(curSlide);
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activeDot(curSlide);
    };

    const startInterval = function () {
        intervalID = setInterval(nextSlide, 2000);
    };

    const stopInterval = function () {
        clearInterval(intervalID);
    };

    const init = function () {
        goToSlide(0);
        createDot();
        startInterval();
    };
    init();
    // const hello = () => {
    //     // console.log('Hello World');
    //     sliderObserver.unobserve(sliderElement);
    // };

    // const sliderObserver = new IntersectionObserver(startInterval, {
    //     root: null,
    //     threshold: 0,
    //     rootMargin: '200px',
    // });

    // sliderObserver.observe(sliderElement);
    // event handler

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    sliderElement.addEventListener('mouseenter', stopInterval);
    sliderElement.addEventListener('mouseleave', startInterval);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        const { slide } = e.target.dataset;
        if (e.target.classList.contains('dots__dot')) {
            goToSlide(slide);
            activeDot(slide);
        }
    });
};
slider();

/*
tabs.forEach(function (el) {
    el.addEventListener('click', function (t) {
        const clicked = t.target;

        // remove all active class
        tabs.forEach(t => t.classList.remove('operations__tab--active'));
        tabContent.forEach(tc =>
            tc.classList.remove('operations__content--active')
        );

        // add active class
        clicked.classList.add('operations__tab--active');
        document
            .querySelector(`.operations__content--${clicked.dataset.tab}`)
            .classList.add('operations__content--active');
    });
});
*/

// selecting element
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = 'insert element from javascript';
// header.append(message);
// document.querySelector('body').addEventListener('click', () => {
//   message.remove(message);
// });

// message.style.backgroundColor = '#1a2b3c';
// message.style.borderRadius = '999px';
// message.style.fontSize = '2rem';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// const logo = document.querySelector('.nav__logo');
// document.documentElement.style.setProperty('--color-primary', 'yellow');
// rgb(190, 219, 158)
// const randomInt = (min, max) => Math.floor(Math.random(max - min + 1) * max);
// const randomColor = () =>
//     `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav').addEventListener(
//     'click',
//     function (e) {
//         this.style.backgroundColor = randomColor();
//         console.log('Nav: ', e.target, e.currentTarget);
//     },
//     true
// );

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Container: ', e.target, e.currentTarget);
// });

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('LINK: ', e.target, e.currentTarget);
// });

// going downwards
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentNode.children);

// intersection api
