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
  const container = document.createElement('div'); // create <div> element
  container.className = 'container'; // give the div class container
  const cssText = [ // prepare styles
    'display: grid',
    'justify-content: center',
    'align-items: center',
    'height: 100%',
    'font-size: 2rem',
    'font-weight: 200',
  ]
  container.style.cssText = cssText.join('; '); // assign the styles
  container.innerHTML = `${response.status}: ${response.statusText}`; // write errors inner the <div> element
  return container.outerHTML; // return DOM object as text
}

/********** used in home page (main page) **********/

// run when the reverse button clicked
function reverseChange (event = null) {
  // get DOM
  const conversionMode = document.getElementById('conversion-mode');
  const celcius = document.getElementById('c-input-field');
  const fahrenheit = document.getElementById('f-input-field');
  const checked = event ? event.target.checked : false;

  // change conversion mode name
  conversionMode.innerHTML = checked ? 'Fahrenheit to Celcius' : 'Celcius to Fahrenheit'

  // disable/enable & assign default value
  celcius.disabled = checked;
  celcius.value = '';
  fahrenheit.disabled = !checked;
  fahrenheit.value = '';

  setExplanation(); // hide explanation

  // focus to enabled field
  if (!checked) celcius.focus();
  else fahrenheit.focus();

}

function calculate (event) {
  event.preventDefault(); // avoid form to run default procedure

  const field = { // take related input fields
    celcius: document.getElementById('c-input-field'),
    fahrenheit: document.getElementById('f-input-field'),
  }

  const formData = new FormData(event.target); // get FormData from the form

  // check the mode
  const isCelcius = formData.has('celcius') && formData.get('celcius') !== '';
  const isFahrenheit = formData.has('fahrenheit') && formData.get('fahrenheit') !== '';

  // create variable to take name of convert from and convert to
  let from = '';
  let to = '';

  // assign related values
  if (isCelcius) {
    from = 'celcius';
    to = 'fahrenheit';
  } else if (isFahrenheit) {
    from = 'fahrenheit';
    to = 'celcius';
  } else { // clear fields if no input
    field.celcius.value = '';
    field.fahrenheit.value = '';
    setExplanation();
    return;
  }

  const converted = calculateTemp(from, formData.get(from)); // calculate the conversion
  field[to].value = parseFloat(converted.toFixed(2)); // convert the calculation value & assign it to related field
}

// execute conversion calculation
function calculateTemp (tempName, value) {
  // create variable to take calculation steps
  let first = 0;
  let last = 0;

  // calculate based on the conversion mode
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

  const prefix = tempName === 'celcius' ? 'c' : 'f'; // define element id prefix for related conversion mode

  // get related elements
  const valueSlot = document.getElementById(`${prefix}-value`);
  const firstSlot = document.getElementById(`${prefix}-first`);
  const lastSlot = document.getElementById(`${prefix}-last`);

  // assign related value to each element
  valueSlot.innerHTML = value;
  firstSlot.innerHTML = parseFloat(first.toFixed(2));
  lastSlot.innerHTML = parseFloat(last.toFixed(2));

  setExplanation(tempName); // show or hide related explanation section

  return last;
}

// clear the form
function resetForm () {
  reverseChange();
}

// show or hide explanation section based on the conversion mode
function setExplanation (mode = false) {
  const explanationCF = document.getElementById('explanation-c-f');
  const explanationFC = document.getElementById('explanation-f-c');

  explanationCF.style.display = mode === 'celcius' ? 'grid' : 'none';
  explanationFC.style.display = mode === 'fahrenheit' ? 'grid' : 'none';
}