//Importar módulo
import { generateID, findNotes, findNotesIndex, findNote, findNoteIndex } from "./utilidades.js";

//objeto DB

let noteDB = {};

/**
 * Inicializa una base de datos local. Si los datos existen en la base de datos local,
 * los datos son cargados;
 * si no es así, se creará una nueva estructura de base de datos y se almacenará.
 */

const initDB = function () {
    // Obtiene el archivo JSON almacenado en localStorage bajo la clave 'noteDB'
    const db = localStorage.getItem('noteDB');

    if (db) {
        // Si existe un archivo JSON, lo parsea y asigna a la variable noteDB
        noteDB = JSON.parse(db);
    } else {
        // Si no existe, inicializa noteDB con un array de cuadernos vacío
        noteDB.notebooks = [];
        // Guarda esta estructura inicial en localStorage como una cadena JSON
        localStorage.setItem('noteDB', JSON.stringify(noteDB));
    }
}

initDB();

//Lee y carga los datos del almacenamiento local en la variable global denominada 'noteDB'

const readDB = function () {
    noteDB = JSON.parse(localStorage.getItem('noteDB'));
}

//Escribe el estado actual de la variable global 'noteDB' en el almacenamiento local.
const writeDB = function () {
    localStorage.setItem('noteDB', JSON.stringify(noteDB));
}

/**
 * Colección de funciones para realizar operaciones CRUD en la base de datos.
 * El manejo del estado de la base de datos es usado con variables globales y de almacenamiento local.
 * @namespace
 * @property {Object} get - Función para obtener datos de la base de datos.
 * @property {Object} post - Función para añadir datos de la base de datos.
 * @property {Object} update - Función para actualizar datos de la base de datos.
 * @property {Object} delete - Función para eliminar datos de la base de datos.
 */
export const db = {

    post: {
        /**
         * Añade una nueva nota a la base de datos local.
         * @function
         * @param {string} name - El nombre de la nota a crear.
         * @returns {Object} Retorna la nota recién creada.
         */

        notebook(name) {
            readDB();
            //console.log(name)
            const noteData = {
                id: generateID(),
                name,
                notes: []
            }
            noteDB.notebooks.push(noteData);

            //console.log(noteData);
            writeDB();

            return noteData;
        },

        note(notebookId, object) {
            readDB();

            const notebook = findNotes(noteDB, notebookId);

            const noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }

            //console.log(noteData);
            notebook.notes.unshift(noteData);
            writeDB();

            return noteData;
        }
    },

    get: {
        /**
         * Obtiene todas las notas de la base de datos
         */

        notebook() {
            readDB();

            return noteDB.notebooks;
        },

        note(notebookId) {
            readDB();

            const notebook = findNotes(noteDB, notebookId);
            return notebook.notes
        }

    },

    update: {

        /**
         * @function
         * @param {string} notebookId - El ID de la nota a actualizar.
         * @param {string} name - El nuevo nombre de la nota a actualizar.
         * @returns {Object} - El objeto "Nota" actualizado.
         */

        notebook(notebookId, name) {
            readDB();

            const notebook = findNotes(noteDB, notebookId);
            notebook.name = name;

            writeDB();

            return notebook;

        },

        note(noteId, object) {
            readDB();

            const oldNote = findNote(noteDB, noteId);
            const newNote = Object.assign(oldNote, object);

            writeDB();

            return newNote;
        }
    },

    delete: {
        /**
         * Elimina la nota de la base de datos.
         * @function
         * @param {string} notebookId - El ID de la nota a eliminar.
         */

        notebook(notebookId) {
            readDB();

            const noteIndex = findNotesIndex(noteDB, notebookId);
            //console.log(noteIndex)
            noteDB.notebooks.splice(noteIndex, 1);

            writeDB();
        },

        note(notebookId, noteId) {
            readDB();

            const notebook = findNotes(noteDB, notebookId);
            const noteIndex = findNoteIndex(notebook, noteId);

            notebook.notes.splice(noteIndex, 1);

            writeDB();

            return notebook.notes;
        }
    }

}