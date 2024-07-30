/**
 * @param {Array<HTMLElement>} $elements - un array DOM que adjunta un event listener
 * @param {string} eventType - Un tipo de evento para escuchar (´click´, 'mouseover')
 * @param {Function} callback - Una función que se debe ejecutar cuando un evento (event) ocurre
*/

const addEventOnElements = function ($elements, eventType, callback) {
    //console.log($elements)
    $elements.forEach($element => $element.addEventListener(eventType, callback));
}

/**
 * 
 * @param {Number} currentHour - Este determina la hora en tiempo real de 0 a 23 para estimar una correcta bienvenida
 * @return {string} - Un mensaje de bienvenida con el saludo correspondiente según la hora del día
 */

const getGreetingMessage = function (currentHour) {
    const greeting = 
    currentHour < 5 ? 'Buenas noches' : 
    currentHour < 12 ? 'Buenos días' : 
    currentHour < 15 ? 'Buenas tardes' : 
    currentHour <  20 ? 'Buenas tardes' : 
    'Buenas noches';
    return `${greeting}`;
}

let $lastActiveNavItem;

/** 
 * Activa un ítem de navegación añadiendo la clase 'active' y desactiva el ítem previo a que estaba con active.
*/

const activeNote = function () {
    $lastActiveNavItem?.classList.remove('active');
    this.classList.add('active'); //this: $navItem
    $lastActiveNavItem = this; //this: $navItem
}

/**
 * Hace que el contenido del DOM sea editable con la configuración del atributo 'contenteditable'
 * y que este sea verdadero, para poder centrarlo en él.
 * @param {HTMLElement} $element - El elemento DOM que lo hace editable.
 */

const makeElementEditable = function ($element) {
    $element.setAttribute('contenteditable', true);
    $element.focus();
}

/**
 * @returns {string} - Una cadena de texto en representación de la hora actual
 */
const generateID = function () {
    return new Date().getTime().toString();
}

/**
 * 
 * @param {Object} db - La base de datos que contiene todas las notas.
 * @param {string} notebookId - El ID de la nota a encontrar.
 * @returns {Object | undefined} - La nota encontrada o la undefined si la nota no fue encontrada.
 */


const findNotes = function(db, notebookId) {
    return db.notebooks.find(notebook => notebook.id === notebookId);
}

const findNotesIndex = function(db, notebookId) {
    return db.notebooks.findIndex(item => item.id === notebookId);
}

//Representa el tiempo que ha pasado desde que se publicó la nota.
const getRelativeTime = function(milliseconds) {
    const currentTime = new Date().getTime();

    const minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
    const hour = Math.floor(minute / 60);
    const day = Math.floor(hour / 24);

    return minute < 1 ? 'Justo ahora' : minute < 60 ? `Hace ${minute} minuto(s)` : hour < 24 ? `Hace ${hour} hora(s)` : `$Hace ${day} día(s)`;
}

const findNote = (db, noteId) => {
    let note;
    for (const notebook of db.notebooks) {
        note = notebook.notes.find(note => note.id === noteId);
        if (note) break;
    }
    return note;
}

const findNoteIndex = function (notebook, notebookId) {
    return notebook.notes.findIndex(note => note.id === note.id);
}

export {
    addEventOnElements,
    getGreetingMessage,
    activeNote,
    makeElementEditable,
    generateID,
    findNotes,
    findNotesIndex,
    getRelativeTime,
    findNote,
    findNoteIndex
}