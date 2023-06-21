// get DOM
const app = document.getElementById('app');
const menuButton = document.getElementById('menu-toggle-check');
const navList = document.querySelector('nav ul');

// initialize home page to display at first visit
changePage('home');

// handle page changing
function changePage (page) {
  fetch(`/pages/${page}.html`) // get requested page
    .then((response) => {
      return response.ok ? response.text() : errorPage(response); // use the requested page or error page
    })
    .then((thePage) => {
      app.innerHTML = thePage; // place the page in 'app'
      menuButton.checked = false; // hide menu in mobile view

      Array.from(navList.children).forEach((element) => { // make related menu active
        const ancor = element.querySelector('a');
        ancor.className = ancor.id === `${page}-page` ? 'active' : '';
      });

      return page; // send page data to next step
    })
    .then((page) => {
      if (page === 'home') reverseChange(); // make initial condition to home page
    })
}

// page to override error pages
const errorPage = (response) => {
  const container = document.createElement('div');
  container.className = 'container';
  const cssText = [
    'display: grid',
    'justify-content: center',
    'align-items: center',
    'height: 100%',
    'font-size: 2rem',
    'font-weight: 200',
  ]
  container.style.cssText = cssText.join('; ');
  container.innerHTML = `${response.status}: ${response.statusText}`;
  return container.outerHTML;
}

/********** used in home page (main page) **********/

// run when the reverse button clicked
function reverseChange (event = null) {
  // get DOM
  const conversionMode = document.getElementById('conversion-mode');
  const celcius = document.getElementById('c-input-field');
  const fahrenheit = document.getElementById('f-input-field');
  const explanationCF = document.getElementById('explanation-c-f');
  const explanationFC = document.getElementById('explanation-f-c');
  const checked = event ? event.target.checked : false;

  // change conversion mode name
  conversionMode.innerHTML = checked ? 'Fahrenheit to Celcius' : 'Celcius to Fahrenheit'

  // disable/enable field
  celcius.disabled = checked;
  fahrenheit.disabled = !checked;

  // focus to enabled field
  if (!checked) celcius.focus();
  else fahrenheit.focus();

  // show/hide explanation section
  explanationCF.style.display = !checked ? 'flex' : 'none';
  explanationFC.style.display = checked ? 'flex' : 'none';
}

function calculate (event) {
  event.preventDefault();

  const field = {
    celcius: document.getElementById('c-input-field'),
    fahrenheit: document.getElementById('f-input-field'),
  }

  const formData = new FormData(event.target);
  const isCelcius = formData.has('celcius') && formData.get('celcius') !== '';
  const isFahrenheit = formData.has('fahrenheit') && formData.get('fahrenheit') !== '';
  let from = '';
  let to = '';

  if (isCelcius) {
    from = 'celcius';
    to = 'fahrenheit';
  } else if (isFahrenheit) {
    from = 'fahrenheit';
    to = 'celcius';
  } else {
    field.celcius.value = '';
    field.fahrenheit.value = '';
    return;
  }

  const converted = calculateTemp(from, formData.get(from));
  field[to].value = converted;
}

function calculateTemp (tempName, value) {
  let first = 0;
  let last = 0;
  switch (tempName) {
    case 'celcius':
      first = (value * (9 / 5))
      last = first + 32;
      break;
    case 'fahrenheit':
      first = (value - 32)
      last = first * (5 / 9);
    default:
      break;
  }

  return last;
}