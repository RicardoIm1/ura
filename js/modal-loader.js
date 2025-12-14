// js/modal-loader.js

// Configuración de temas disponibles
const temasConfig = {
    '1.1': {
        titulo: '1.1. Matrices: Definición, orden y nomenclatura',
        archivo: 'temas/1.1-matrices.html',
        descripcion: 'Introducción a matrices, orden y notación'
    },
    '1.2': {
        titulo: '1.2. Operaciones con matrices',
        archivo: 'temas/1.2-operaciones.html',
        descripcion: 'Suma, resta y multiplicación de matrices'
    },
    '1.3': {
        titulo: '1.3. Determinantes',
        archivo: 'temas/1.3-determinantes.html',
        descripcion: 'Cálculo y propiedades de determinantes'
    }
    // Agrega más temas aquí...
};

// Elementos del DOM
const modal = document.getElementById('modal-info');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-text');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Variable para almacenar el contenido cargado
let contenidoCargado = {};

// Función para cargar contenido desde archivo
async function cargarContenido(idTema) {
    const tema = temasConfig[idTema];
    if (!tema) {
        console.error('Tema no encontrado:', idTema);
        return null;
    }

    // Si ya está cargado en caché, usarlo
    if (contenidoCargado[idTema]) {
        return contenidoCargado[idTema];
    }

    try {
        const response = await fetch(tema.archivo);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        const html = await response.text();
        
        // Guardar en caché
        contenidoCargado[idTema] = {
            titulo: tema.titulo,
            contenido: html
        };
        
        return contenidoCargado[idTema];
    } catch (error) {
        console.error('Error cargando el tema:', error);
        return {
            titulo: tema.titulo,
            contenido: `<div class="error-carga">
                <p>❌ No se pudo cargar el contenido.</p>
                <p>Error: ${error.message}</p>
            </div>`
        };
    }
}

// Función para abrir modal con un tema específico
async function abrirTema(idTema) {
    // Mostrar carga
    modalContent.innerHTML = `
        <div class="cargando">
            <div class="spinner"></div>
            <p>Cargando contenido...</p>
        </div>
    `;
    modalTitle.textContent = temasConfig[idTema]?.titulo || 'Cargando...';
    modal.classList.add('show');
    modal.style.display = 'block';

    // Cargar contenido
    const tema = await cargarContenido(idTema);
    
    if (tema) {
        modalTitle.textContent = tema.titulo;
        modalContent.innerHTML = tema.contenido;
        
        // Re-ejecutar scripts dentro del contenido cargado
        const scripts = modalContent.querySelectorAll('script');
        scripts.forEach(script => {
            const nuevoScript = document.createElement('script');
            if (script.src) {
                nuevoScript.src = script.src;
            } else {
                nuevoScript.textContent = script.textContent;
            }
            document.body.appendChild(nuevoScript);
        });
        
        // Re-aplicar MathJax si es necesario
        if (window.MathJax) {
            MathJax.typeset();
        }
    }
}

// Función para cerrar modal
function cerrarModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        // Limpiar contenido al cerrar (opcional)
        // modalContent.innerHTML = '';
    }, 300);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });
    
    // Delegación de eventos para botones de tema
    document.body.addEventListener('click', function(e) {
        const btnTema = e.target.closest('[data-tema]');
        if (btnTema) {
            e.preventDefault();
            const idTema = btnTema.getAttribute('data-tema');
            abrirTema(idTema);
        }
    });
    
    // Eventos de cierre
    if (modalClose) {
        modalClose.addEventListener('click', cerrarModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', cerrarModal);
    }
});

// Exportar funciones para uso global
window.abrirTema = abrirTema;
window.cerrarModal = cerrarModal;