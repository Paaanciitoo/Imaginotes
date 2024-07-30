//Importación de modulos
import { addEventOnElements, getGreetingMessage, activeNote, makeElementEditable } from "./utilidades.js";
import { Tooltip } from "./tooltip.js";
import { db } from "./db.js";
import { cliente } from "./cliente.js";
import { NoteModal } from "./modal.js";

//Alternar la barra lateral en pantallas pequeñas

//Elemento HTML
const $sidebar = document.querySelector('[data-sidebar]');
const $overlay = document.querySelector('[data-sidebar-overlay]');
//Array Elementos HTML
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');

addEventOnElements($sidebarTogglers, 'click', function(){
    $sidebar.classList.toggle('active');
    $overlay.classList.toggle('active');
});

//Inicializar el comportamiento del tooltip para todos los elementos del DOM con el atributo 'data-tooltip'.

const $tooltipElement = document.querySelectorAll('[data-tooltip]');      
$tooltipElement.forEach($elem => Tooltip($elem));

//Mostrar mensaje de bienvenida en la página de inicio

//Elemento HTML
const $greetElement = document.querySelector('[data-greeting]');

//Hora en tiempo real
const currentHour = new Date().getHours();

$greetElement.textContent = getGreetingMessage(currentHour);

//Mostrar la fecha actual en la página de inicio
const currentDateElement = document.querySelector('[data-current-date]');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const date = new Date().toLocaleDateString('es-ES', options);
currentDateElement.textContent = date;

//Sección -> Crear una nota

const $sidebarList = document.querySelector('[data-sidebar-list]');
const $addNoteBtn = document.querySelector('[data-add-notebook]');

/*Muestra el campo de creación de la nota en la barra lateral cuando el botón "Nueva nota" es presionado.
* La función de forma dinámica añade una nueva nota, la cual la hace editable y escuchada por la tecla
"Enter" cuando esta está presionada*/

const showNoteField = function () {
    //console.log('Creaste una nota')
    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');

    $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>

    <div class="state-layer"></div>
    `;

    $sidebarList.appendChild($navItem);

    const $navItemField = $navItem.querySelector('[data-notebook-field]');

    //Activa una nuevo nota creada y desactiva la anterior.
    activeNote.call($navItem);

    //Hace que el campo de la nota sea editable y quede seleccionado.
    makeElementEditable($navItemField);

    //Cuando el usuario presiona "Enter" después de crear una nota.
    $navItemField.addEventListener('keydown', createNote);
}

$addNoteBtn.addEventListener('click', showNoteField);

const createNote = function (event) {
    if(event.key === 'Enter') {
        //Almacena una nueva nota creada en la base de datos.
        const noteData = db.post.notebook(this.textContent || 'Sin título'); // this: $navItemField
        this.parentElement.remove();

        //Renderizar navItem
        cliente.notebook.create(noteData);
    }
}

/**
 * Renderiza las notas ya existentes guardadas en la base
 * de datos local de la página web y finalmente son mostradas
 * en la UI
 */

const renderExistedNote = function () {
    const noteList = db.get.notebook();
    //console.log(noteList);
    cliente.notebook.read(noteList);
}

renderExistedNote();


/**
 * Crear una nueva nota
 */

const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElements($noteCreateBtns, 'click', function() {
    //Crea y abre un nuevo modal
    const modal = NoteModal();
    modal.open();

    modal.onSubmit(noteObj => {
        const activeNoteId = document.querySelector('[data-notebook].active').dataset.notebook;

        const notesData = db.post.note(activeNoteId, noteObj);
        cliente.note.create(notesData);
        modal.close()

        /* console.log(noteObj);
        console.log(activeNoteId); */
    })
});

/**
 * Renderiza notas activas en el cuaderno. Trae la nota desde la base de datos local
 * basado en el ID del cuaderno activo y utiliza el cliente para ser mostrado en pantalla.
 */

const renderExistedNotes = function() {
    const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

    if (activeNotebookId){
        const noteList = db.get.note(activeNotebookId);
        //console.log(noteList)

        //Muestra la nota existente
        cliente.note.read(noteList);
    }
}

renderExistedNotes();