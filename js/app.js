const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const resgistrosPorPagina = 50;
let totalPages;
let iterador;
const paginacion = document.querySelector("#paginacion");
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", () => {
	formulario.addEventListener("submit", listenFormulario);
});

//#region Funciones
function listenFormulario(e) {
	e.preventDefault();

	if (termino.length == 0) mostrarAlerta();
	else buscarImgs();
}

function mostrarAlerta(msj = "Campo Requerido") {
	const existeAlerta = document.querySelector(".alerta");
	if (!existeAlerta) {
		const alerta = document.createElement("p");
		alerta.className =
			"alerta bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center";
		alerta.innerHTML = `<strong class='font-bold'>ERROR!</strong>
        <span class='block sm:inline'>${msj}</span>`;

		formulario.appendChild(alerta);

		setTimeout(() => {
			alerta.remove();
		}, 2000);
	}
}

function buscarImgs() {
	const termino = formulario.querySelector("#termino").value;
	const key = "24005056-80e2e3418239df85016560a9e";
	const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${resgistrosPorPagina}&page=${paginaActual}`;
	fetch(url)
		.then((response) => response.json())
		.then((response) => {
			totalPages = calcularPaginas(response.totalHits);
			mostrarImgs(response.hits);
		});
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

function clearPaginacion() {
	while (paginacion.firstChild) {
		paginacion.firstChild.remove();
	}
}

function mostrarImgs(imagenes) {
	clearHTML();
	imagenes.forEach((hit) => {
		const { previewURL, likes, views, largeImageURL } = hit;
		resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4  " >
            <div class="bg-white rounded-md  transform hover:-translate-y-2 ">
                <img class="w-full rounded-tr-md rounded-tl-md " src="${previewURL}"/>

                <div class="p-4">
                    <p class="font-bold">${likes}<span class="font-light"> Likes</span></p>
                    <p class="font-bold">${views}<span class="font-light"> Views</span></p>

                    <a href="${largeImageURL}" target="_blanck" rel="noopener noreferrer"
                    class="block  w-full bg-blue-800 hover:bg-blue-500 text-white uppercase text-center font-bold rounded mt-5 p-1">Ver Imagen HD</a>
                </div>
            </div>
        </div>`;
	});
	imprimirPaginador();
	setTimeout(() => {
		const p = document.querySelector(`button[data-pagina="${paginaActual}"]`);
		p.classList.add("actual");
	}, 1000);
}

function imprimirPaginador() {
	clearPaginacion();
	iterador = crearPaginador(totalPages);
	while (true) {
		const { value, done } = iterador.next();
		if (!done) {
			const boton = document.createElement("button");
			boton.href = "#";
			boton.dataset.pagina = value;
			boton.textContent = value;
			boton.className =
				"siguiente bg-yellow-400 px-3 py-1 mr-2 font-bold mb-4 rounded";
			boton.onclick = () => {
				window.scrollTo(0, 0);

				setTimeout(() => {
					paginaActual = value;
					buscarImgs();
				}, 100);
			};

			paginacion.appendChild(boton);
		} else return;
	}
}

function clearHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}
//#endregion

function calcularPaginas(total) {
	return parseInt(Math.ceil(total / resgistrosPorPagina));
}
