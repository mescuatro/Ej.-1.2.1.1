document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista');
  const boton = document.getElementById('btnBuscar');
  const input = document.getElementById('inputBuscar');
  const canvas = document.getElementById('offcanvasTop');
  const offcanvas = new bootstrap.Offcanvas(canvas);
  const dropdown = document.querySelector('.dropdown');

  let currentItem = null;
  let data = [];

  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      data = json;
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  boton.addEventListener('click', () => {
    const busqueda = input.value.trim().toLowerCase();
    lista.innerHTML = '';

    const filtrado = data.filter(item => {
      return (
        item.title.toLowerCase().includes(busqueda) ||
        item.tagline.toLowerCase().includes(busqueda) ||
        item.vote_average.toString().includes(busqueda)
      );
    });

    mostrarData(filtrado);
  });

  function mostrarData(datos) {
    lista.innerHTML = '';

    if (datos.length === 0) {
      lista.innerHTML = `<li class="list-group-item">No se encontraron resultados.</li>`;
      return;
    }

    datos.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item list-group-item-action mb-3';

      li.innerHTML = `
        <h5>${item.title} <span class="estrellas">${estrellas(item.vote_average)}</span></h5>
        <p>${item.tagline}</p>
      `;

      li.addEventListener('click', () => {
        infoCanva(item);
        offcanvas.show();
      });

      lista.appendChild(li);
    });
  } 

  function estrellas(voto) {
    const estrella = Math.round(voto / 2);
    return '★'.repeat(estrella) + '☆'.repeat(5 - estrella);
  }


  function infoCanva(item) {
    const title = document.getElementById('offcanvasTopLabel');
    const body = canvas.querySelector('.offcanvas-body');
    const genres = item.genres.map(genre => genre.name).join(', ');

    title.textContent = item.title;

    body.innerHTML = `
      <p>${item.overview}</p>
      <p>Genres: ${genres}</p>
    `;

    currentItem = item;
  }


  dropdown.addEventListener('click', (event) =>{
   if (!currentItem) return;
   infoDespliegue(currentItem);
  })

  function infoDespliegue(item){
    const ye = document.getElementById('year');
    const run = document.getElementById('runtime');
    const bud = document.getElementById('budget');
    const rev = document.getElementById('revenue');

    ye.textContent = `Year: ${item.release_date.slice(0, 4)}`;
    run.textContent = `Runtime: ${item.runtime}`;
    bud.textContent = `Budget: ${item.budget}`;
    rev.textContent = `Revenue: ${item.revenue}`;
  }
});