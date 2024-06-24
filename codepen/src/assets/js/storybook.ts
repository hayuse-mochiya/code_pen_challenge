console.log("storybook");

let currentSection = 0;
let scrollPosition = 0;

let timeoutId: number | null = null;
const delay = 500; // 3秒

const titleData = [
    {
       class: 'js-title-1',
       logo: 'https://lottie.host/fe19e5b1-96f6-4ff1-a74a-6d96ded01bde/FYZjndTMH6.json'
    },
    {
        class: 'js-title-2',
        logo: 'https://lottie.host/fe19e5b1-96f6-4ff1-a74a-6d96ded01bde/FYZjndTMH6.json' ,
    }
]

const logoDataFunc = () => {
    titleData.forEach((title) => {
        console.log(title.logo);
        const logoElm = document.querySelector(`.${title.class}`);
        const player = document.createElement("dotlottie-player");
        player.setAttribute('src', title.logo);
        player.setAttribute('background', 'transparent');
        player.setAttribute('speed', '1');
        player.setAttribute('autoplay', '');
        if (logoElm === null) return;
        logoElm.innerHTML = '';
        logoElm.appendChild(player);
    });
}


const sections: NodeListOf<HTMLElement> = document.querySelectorAll('.p-storybook__page');

const handleWheelEvent = (event: WheelEvent): void => {
    event.preventDefault(); // Prevent default scroll behavior
    // if (event.deltaY > 0) {
    //     console.log(event.deltaY);
    //     currentSection = Math.min(currentSection + 1, sections.length - 1);
    // } else {
    //     currentSection = Math.max(currentSection - 1, 0);
    // }
    // window.scrollTo
    // console.log(event.deltaY, '|||||', currentSection);
    currentSection += event.deltaY;
    if (currentSection < 0) currentSection = 0;

    window.scrollTo({ left: currentSection });
    // currentSection = currentSection + event.deltaY;

};

const movePage = () => {
    const activePage = document.querySelector<HTMLElement>('.p-storybook__page.is-active');
    if (activePage === null) return;
    scrollPosition = activePage.offsetLeft;

    window.scrollTo({ left: scrollPosition, behavior: "smooth" });

    // currentSection = scrollPosition;
}
const onScrollEnd = () => {
    currentSection = scrollPosition;
  };
  
const scrollHandler = () => {
if (timeoutId !== null) {
    clearTimeout(timeoutId);
}
timeoutId = window.setTimeout(onScrollEnd, delay);
};
  
  
  
window.addEventListener('wheel', handleWheelEvent, { passive: false });
window.addEventListener('scroll', scrollHandler);
window.addEventListener('touchend', movePage);
window.addEventListener('scrollend', movePage);

const scrollIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.parentElement?.classList.add('is-active');
        } else {
            entry.target.parentElement?.classList.remove('is-active');
        }
    });
};

const animeIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            logoDataFunc();
            entry.target.parentElement?.classList.add('anime-start');
            const textElement = document.querySelector('.anime-start .p-storybook__page-text p');
            if (textElement) {
                const text = textElement.textContent || '';
                textElement.textContent = '';

                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.animationDelay = `${index * 0.1}s`;
                    textElement.appendChild(span);
                });
            }
        } else {
            entry.target.parentElement?.classList.remove('anime-start');
        }
    });
};

// Options for the IntersectionObserver
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Create the IntersectionObserver
const scrollObserver = new IntersectionObserver(scrollIntersect, options);

// Observe each .page-trigger element
const pageTriggers = document.querySelectorAll('.page-trigger');
pageTriggers.forEach(trigger => scrollObserver.observe(trigger));

// Create the IntersectionObserver
const animeObserver = new IntersectionObserver(animeIntersect, options);

// Observe each .page-trigger element
const animeTriggers = document.querySelectorAll('.anime-trigger');
animeTriggers.forEach(trigger => animeObserver.observe(trigger));