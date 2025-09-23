document.addEventListener('DOMContentLoaded', () => {
const lista = document.getElementById('lista');
const boton = document.getElementById('btnBuscar');
const input = document.getElementById('inputBuscar');

let data = [];

fetch('https://japceibal.github.io/japflix_api/movies-data.json')
.then(response => {
    if(!response.ok){
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

    if (busqueda === ''){
     mostrarData([], lista);
     return;
    }

    const filtrado = data.filter(item => {
     return (
     item.title.toLowerCase().includes(busqueda) ||
     item.tagline.toLowerCase().includes(busqueda) ||
     item.vote_average.toString().includes(busqueda)
     );
    });
    mostrarData(filtrado, lista);
  });
});

function mostrarData(datos, lista) {
    if (datos.length === 0) {
        lista.innerHTML = `<li>No se encontraron resultados.</li>`;
        return;
    } else {
    lista.innerHTML = datos.map(item => `
        <li class="mb-3">
        <h5>${item.title} <span class="estrellas">${estrellas(item.vote_average)}</span></h5>
        <p>${item.tagline}</p>
        </li>`).join('');
    }
}

function estrellas(voto){
    const estrella = Math.round(voto / 2);
    return '★'.repeat(estrella) + '☆'.repeat(5 - estrella);
}