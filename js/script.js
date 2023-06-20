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
  const celsius = document.getElementById('c-input-field');
  const fahrenheit = document.getElementById('f-input-field');
  const checked = event ? event.target.checked : false;

  // change conversion mode name
  conversionMode.innerHTML = checked ? 'Fahrenheit to Celsius' : 'Celsius to Fahrenheit'

  // disable/enable field
  celsius.disabled = checked;
  fahrenheit.disabled = !checked;

  // focus to enabled field
  if (!checked) celsius.focus();
  else fahrenheit.focus();
}