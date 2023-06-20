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
}

// page to override error pages
const errorPage = (response) => {
  const container = document.createElement('div');
  container.className = 'container';
  const cssText = [
    'display: grid',
    'justify-content: center',
  ]
  container.style.cssText = cssText.join('; ');
  container.innerHTML = `${response.status}: ${response.statusText}`;
  return container.outerHTML;
}
