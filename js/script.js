const bloquePeliculas = document.getElementById("lista");

document.addEventListener("DOMContentLoaded", async () => {
    const LISTADO_URL = `https://japceibal.github.io/japflix_api/movies-data.json`;
    const listado = await obtenerListado(LISTADO_URL);
    console.log(listado);

    const barrabusqueda = document.getElementById("inputBuscar");
    const btnbuscar = document.getElementById("btnBuscar");


    btnbuscar.addEventListener("click", () => {
        if (barrabusqueda.value !== "") {
            const tituloIngresado = barrabusqueda.value.toLowerCase();

            listado.forEach(pelicula => {
                const titulo = pelicula.title.toLowerCase();
                const genero = pelicula.genres;
                const subtitulo = pelicula.tagline;
                const descripcion = pelicula.overview;

                if (titulo.includes(tituloIngresado) ||
                    subtitulo.includes(tituloIngresado) ||
                    descripcion.includes(tituloIngresado)) {
                    agregarPelicula(pelicula);
                } else {
                    genero.forEach(gen => {
                        if (gen.name.includes(tituloIngresado)) {
                            agregarPelicula(pelicula);
                        }
                    })
                }
            })

        } else {
            alert("Ingrese un título para buscar");
        }
    });
});

async function obtenerListado(URL) {
    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        const datos = await response.json();

        return datos;
    } catch (error) {
        console.error('Error', error);
    }
};

function ScoreToEstrellas(score) {
    const maxStars = 5;
    const fullStar = "★";
    const emptyStar = "☆";
    const roundedScore = Math.round(score);
    const fullStars = fullStar.repeat(roundedScore);
    const emptyStars = emptyStar.repeat(maxStars - roundedScore);
    const starSpan = document.createElement("span");
    starSpan.classList.add("estrellas");
    starSpan.textContent = fullStars + emptyStars;
    return starSpan;
};

function agregarPelicula(pelicula) {
    const stars = ScoreToEstrellas((pelicula.vote_average / 2));
    const allgenres = pelicula.genres.map(genre => genre.name).join(' - ');

    bloquePeliculas.innerHTML += `
    <li class="list-group-item bg-dark nonstylelinks .text-light">
        <a data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
            <div class="justify-content-between d-flex">
                <h3>${pelicula.title}</h3>
                ${stars.outerHTML}
            </div>
            <p class="text-muted fst-italic">${pelicula.tagline}</p>
        </a>
        <div class="offcanvas offcanvas-top .text-black" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasExampleLabel">${pelicula.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                
                    ${pelicula.overview}
                    <hr>
                <div class="d-flex justify-content-between">
                    <span class="text-muted">${allgenres}</span>
                
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Más Información
                        </button>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">Año: ${pelicula.release_date.substring(0, 4)}</li>
                            <li class="dropdown-item">Duración: ${pelicula.runtime}</li>
                            <li class="dropdown-item">Presupuesto: $${pelicula.budget}</li>
                            <li class="dropdown-item">Ganancias: $${pelicula.revenue}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </li>
    `;
};