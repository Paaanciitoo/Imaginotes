//Importar módulo
import { NavItem } from "./NavItem.js"
import { activeNote } from "./utilidades.js";
import { card } from "./card.js";


const $sidebarList = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const emptyNotesTemplate = `
<div class="empty-notes">
    <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

    <div class="text-headline-small">Vacío</div>
</div>
`;

const disableNoteCreateBtns = function (isThereAnyNotebook) {
    $noteCreateBtns.forEach($item => {
        $item[isThereAnyNotebook ? 'removeAttribute' : 'setAttribute']('disabled', '')
    })
}

/**
 * El cliente hace la interacción del manejo de objetos con la interfaz de usuario
 * al realizar un CRUD (create, read, update, delete) al crear un cuaderno o una nota.
 * Esto provee el uso de funciones realizando estas operaciones y actualizando la
 * UI (User Interface) según lo planeado.
 * @namespace
 * @property {Object} notebook - Funciona para manejar las cuadernos en la UI
 * @property {Object} note - Funciona para manejar las notas en la UI
 */

export const cliente = {

    notebook: {
        create(noteData) {
            const $navItem = NavItem(noteData.id, noteData.name);
            $sidebarList.appendChild($navItem);
            activeNote.call($navItem);
            $notePanelTitle.textContent = noteData.name;
            $notePanel.innerHTML = emptyNotesTemplate;
            disableNoteCreateBtns(true);
        },

        /**
         * Lee y muestra en pantalla la lista de notas almacenadas en la
         * base de datos local.
         */

        read(noteList) {
            disableNoteCreateBtns(noteList.length);
            noteList.forEach((noteData, index) => {
                const $navItem = NavItem(noteData.id, noteData.name);

                if (index === 0) {
                    activeNote.call($navItem);
                    $notePanelTitle.textContent = noteData.name;
                }

                $sidebarList.appendChild($navItem);
            });
        },

        /**
         * 
         * @param {string} notebookId - ID de la nota a actualizar.
         * @param {Object} notebookData - Nuevos datos en la nota.
         */

        update(notebookId, notebookData) {
            const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"`);
            const $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebarList.replaceChild($newNotebook, $oldNotebook);
            activeNote.call($newNotebook);
        },

        delete(notebookId){
            const $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const $activeNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if($activeNavItem) {
                $activeNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreateBtns(false);
            }

            $deletedNotebook.remove();
        }
    },

    note: {
        create(notesData) {
            //Eliminar 'emptyNotesTemplate' del 'notePanel' si ninguna nota existe.
            if(!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';

            const $card = card(notesData);
            $notePanel.prepend($card);
        },

        read(noteList) {

            if(noteList.length) {
                $notePanel.innerHTML = '';

                noteList.forEach(noteData  => {
                    const $card = card(noteData);
                    $notePanel.appendChild($card);
                });
            } else {
                $notePanel.innerHTML = emptyNotesTemplate;
            }
        },

        update(noteId, noteData) {
            const $oldCard = document.querySelector(`[data-note="${noteId}"]`);
            const $newCard = card(noteData);
            $notePanel.replaceChild($newCard, $oldCard);
        },

        delete(noteId, isNoteExists) {
            document.querySelector(`[data-note="${noteId}"]`).remove();
            if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplate;
        }
    }

}