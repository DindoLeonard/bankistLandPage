'use strict';

// selections
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelector('.operations__content');
// nav
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
// header
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// adding button to the modals
// simplified forEach()
btnsOpenModal.forEach(function (button) {
  return button.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.querySelector('.modal').innerHTML;

/////////////////////////////////////////////////////////////////  button scrolling

// here we select the element of btn--scroll-to to make it smoothly scroll towards section 1
document
  .querySelector('.btn--scroll-to')
  .addEventListener('click', function (e) {
    // first we created a variable that has the gets the coordinates of "#section--1"
    const s1coor = document
      .querySelector('#section--1')
      .getBoundingClientRect();
    console.log('s1', s1coor);

    console.log(e.target.getBoundingClientRect());

    console.log('current scroll y/x', window.pageXOffset, window.pageYOffset); //  the coordinates from the window edge of your browser from top to the uppermost part of the page.

    // to scroll into view manually, you need to give in a parameter like this into the scrollInto() function
    // scrollTo({
    //   left: s1coor.left,
    //   top: s1coor.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });

    // a much prefered way to have the windows scroll Into a view of the element class/id
    document
      .querySelector('#section--1')
      .scrollIntoView({ behavior: 'smooth' });
  });

//// ///////// Selecting all elements and using forEach and assigning function to each of it, function is smooth scrolling

// this is the inefficient way

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   console.log(el);
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const sect = el.getAttribute('href');
//     document.querySelector(sect).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////// EVENT DELEGATION by selecting the parent element

//1. Add event listener to common parent element
// 2. Determine what element orginated the event
document.querySelector('.nav__links').addEventListener('click', function (el) {
  el.preventDefault();

  // 3. matching strategy
  if (el.target.classList.contains('nav__link')) {
    console.log;
    const id = el.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////  // TABBED COMPONENT

tabsContainer.addEventListener('click', function (el) {
  const clicked = el.target.closest('.operations__tab');
  console.log(clicked);

  // GUARD CLAUSE
  if (!clicked) return;

  // removing the 'operations__tab--active' class
  console.log(tabs);
  tabs.forEach(function (tab) {
    tab.classList.remove('operations__tab--active');
  });

  // adding the 'oprations__tab--active' class
  clicked.classList.add('operations__tab--active');

  // active Content area
  console.log(clicked.dataset.tab); // accessing the data-tab value
  // selecting all the oprations content class and remove 'operations__content--active' if found any
  document
    .querySelectorAll(`.operations__content`)
    .forEach(item => item.classList.remove('operations__content--active'));

  // adding the operations__content--active to the clicked element.
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////// MENU FADE ANIMATION
//
// hover over nav element function
function hoverOverElement(e) {
  if (e.target.classList.contains('nav__link')) {
    // the target
    const link = e.target;
    // siblings of target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // the logo
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
}

nav.addEventListener('mouseover', hoverOverElement.bind(0.5));
nav.addEventListener('mouseout', hoverOverElement.bind(1));

//////////// STICKY NAVIGATION

// const initialCoor = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (initialCoor.top < window.scrollY) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

/////////////////////////////////////////////////////////////////// A BETTER WAY: THE INTERSECTION OBSERVER API

// getting the height of the navigation bar
const headerEndHeight = nav.getBoundingClientRect().height;

// headerCallback function
const headerCallback = function (entries) {
  // deconstructed the entries and storing it as entry variable
  const [entry] = entries;
  //console.log(entry); // making sure I got the correct one

  // adding conditional statement that if the header is gone at the window view, sticky nav will be added
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky'); // also added remove if back at the header section
  }
};
// headerOptions parameters/options
const headerOptions = {
  root: null, // as of now always null - dindo
  threshold: 0,
  rootMargin: `-${headerEndHeight}px`, // simply setting margin before the actuall margin (-pixels)
};

// storing the Intersection API function into a variable
const headerObserver = new IntersectionObserver(headerCallback, headerOptions);

// calling the headerObserver with attached function of headerCallback
headerObserver.observe(header);

//////////////////////////////////////////////////////////////////// REVEALING ELEMENTS ON SCROLL

// all sections
const allSections = document.querySelectorAll('.section');

// sections parameters/options
const sectionObsOptions = {
  root: null,
  threshold: 0.15,
};

// sectionObsFunction functions
const sectionObsFunction = function (entries, obs) {
  const [entry] = entries;
  // console.log(entry); // checked if entry is working
  // guard clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  obs.unobserve(entry.target); // here we can see how the second parameter of the function is really important, the "obs", so you can unobserve the target element for performance
};

// section Observer
const sectionObserver = new IntersectionObserver(
  sectionObsFunction,
  sectionObsOptions
);

// this is the way on how to add the sectionObserver API function to all of the sections
allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//////////////////////////////////////////////////////////////////// LAZY LOADING IMAGES

const allImages = document.querySelectorAll('img[data-src]');

const imgFunc = function (entries, obs) {
  const [entry] = entries;
  // console.log(entry.target); // check if entry is working

  // guad clause
  if (!entry.isIntersecting) return;

  // changing the src to the stores dataset within element
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    obs.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(imgFunc, {
  root: null,
  threshold: 0,
  rootMargin: `-100px`,
});

allImages.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////////////////// Building a Slider Component pt.1

const allSliderFunction = function () {
  const slides = document.querySelectorAll('.slide');
  const slidesLength = slides.length;
  const slider = document.querySelector('.slider');
  // console.log(slides);
  // slider.style.overflow = `visible`;

  let currentSlide = 0;

  const leftButton = document.querySelector('.slider__btn--left');
  const rightButton = document.querySelector('.slider__btn--right');

  // you can put in the currentSlide variable to make the slide either go left or right
  const goToSlide = function (slide) {
    // for each slide, we assigned to with a 100% difference in x axis to have it side by side
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // changing the currentSlide value to move every element in slides to left thus viewing the next right element.
  const nextSlide = function () {
    if (currentSlide == slidesLength - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // contrary to the former, it does the same but towards different direction
  const prevSlide = function () {
    if (currentSlide == 0) {
      currentSlide = slidesLength - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // at the beginning of the page, immidiately choose the first slide and have the other slide arranged like an array
  const init = function () {
    createDots();
    activateDot(currentSlide);
    goToSlide(0);
  };

  // event listeners for the buttons
  rightButton.addEventListener('click', nextSlide);
  leftButton.addEventListener('click', prevSlide);

  ///////////////////////////////////////////////////////////////////////// Building a Slider Component pt.2

  document.addEventListener('keydown', function (e) {
    // console.log(e); // checking if there keydown is working
    if (e.key == 'ArrowRight') {
      nextSlide();
    } else if (e.key == 'ArrowLeft') {
      prevSlide();
    }
  });

  //////// creating dots
  const dotsContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // // // ActivateDot function
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  init();
};
allSliderFunction();

/*
/////
// select documentelement
console.log(document.documentElement);
// select document head
console.log(document.head);
// select document body
console.log(document.body);
// select document class header
console.log(document.querySelector('.header'));

// select all document class section
// save it in a variable and call it
const allSection = document.querySelectorAll('.section');
console.log(allSection);

// select section--1 element by id
console.log(document.getElementById('section--1'));
console.log(document.querySelector('#section--1'));
// select all button elements that has a tag name of button
const allButton = document.getElementsByTagName('button');
console.log(allButton);

// select elements by class name
console.log(document.getElementsByClassName('section'));



// // // CREATING AND INSERTING ELEMENT
// created an html element
const message = document.createElement('div');
// added a style element named "cookie message on css document"
message.classList.add('cookie-message');
// added an inner html element in the Div
const ttt = "This is a cookie button <button class='btn btnCookie'>Get it?</>";
message.innerHTML = ttt;

// selected header html element and added message <div> element into it. append means at the end within the div
document.querySelector('.header').append(message);

// added an eventListenter to the button within our newly created <div> and added remove upon click
document.querySelector('.btnCookie').addEventListener('click', function () {
  // this is the old way below
  // message.parentElement.removeChild(message);
  // and this is the new way below
  message.remove();
});

///////////////////////////////////////////////////////////////////////// STYLE, ATTRIBUTE, CLASSES

// // // STYLE
// here i accessed the style and change it accordingly
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// getting all the style
// here i get the detailed innate info of the DOM element
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height);

// I adjusted the height by getting the default height at the DOM element by getting the detailed info by using getComputedStyle(dom_element) and added a number value to it
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

console.log(message.style.height);

// // // ATTRIBUTE

// it you wanna change the style in css, use the style method after the element.
// I accessed the root style of the css and set another property or choose a property then change the value of it in the second argument
document.documentElement.style.setProperty('--color-primary', 'orangered');

// here i accessed the attributes by choosing the element followed by a dot notation of the absolute attribute
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// Non-standard
console.log(logo.designer); // null
// because it's not a standard property, you can only access it by using get attribute
console.log(logo.getAttribute('designer'));
logo.setAttribute('daughter', 'Rafaela'); // set any attribute... prototype.setAttribute("key","value")
console.log(logo.getAttribute('daughter'));

console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative

// DATA ATTRIBUTE
// this is a data_attribute, a uniformed method of storing a dataset to the element
console.log(logo.dataset.someData);
logo.dataset.someData = 'revised data';
console.log(logo.dataset.someData);

// CLASSES
logo.classList.add('d');
logo.classList.remove('d');
console.log(logo.classList.contains('d')); // false
logo.classList.toggle('d');


/////////////////////////////////////////////////////////////////////// TYPES OF EVENTS AND EVENT HANDLERS

// first i pick the h1 element as a subject
const h1 = document.querySelector('h1');

// the function variable name of alertH1
const alertH1 = function (e) {
  alert('okok');
  // removes event listener to h1 after it does the alert
  h1.removeEventListener('mouseenter', alertH1);
};

// added eventListen to h1 which is when mousenter, do function alertH1
h1.addEventListener('mouseenter', alertH1);

setTimeout(function () {
  return h1.removeEventListener('mouseenter', alertH1);
}, 3000);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = function () {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
};
console.log(randomColor());

// attach event hander on features element
// also including the nav list

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(e.currentTarget);
  // stop propagation or stop bubbling to others
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('origin target', e.target);
  console.log('current', e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('current', e.currentTarget);
  console.log('boolean', e.currentTarget === this);
});



//////////////////////////////////////////////////////////////////////////////  Event Delegation: Implementing Page Navigation

/////////////////////////////////////////////////////////////////////////////  DOM Traversing

const h1 = document.querySelector('h1');

// going donwards : child
// in here traverse to the nodes, nodes are[document, text, element, comment]
console.log(h1.childNodes);
// traversing through the element
console.log(h1.children);
// traversing and getting the last element of the child element
console.log(h1.lastElementChild);
// getting the first element in the child
console.log(h1.firstElementChild);
// choosing the first child element and changing the color style
h1.firstElementChild.style.color = 'white';
// choosing the last child element and changing the color style
h1.lastElementChild.style.color = 'orangered';

// going upwards : parent
// traversing through the parent of the h1, which is "header_title"
console.log(h1.parentNode);
// traversing above the h1 element and going to the parent Element
console.log(h1.parentElement);

// closest means accessing the closest parent element
h1.closest('.header').style.backgroundColor = `green`;
// also accessing the parent element
h1.closest('h1').style.backgroundColor = 'grey';

// going sideways : siblings
console.log(h1.previousSibling);
console.log(h1.nextSibling);
// here we could access the children by going to the parents first then accessing all the children which the the siblings of h1
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = `scale(0.5)`;
  }
});
*/

/////////////////////////////////////////////////////////////////////// A Better Way: The Intersection Observer API

/////////////////////////////////////////////////////////////////////// REVEALING ELEMENTS ON SCROLL
/*
const height = nav.getBoundingClientRect().height;
const allSection = document.querySelectorAll('section');
const secFunc = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObs = new IntersectionObserver(secFunc, {
  root: null,
  threshold: 0.15,
  rootMargin: `-${height}px`,
});

allSection.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObs.observe(section);
});

/////////////////////////////////////////////////////////////////////// RLifecycle DOM Events

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('HTML fully parsed and loaded');
});

// load full webpage with css
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
*/
