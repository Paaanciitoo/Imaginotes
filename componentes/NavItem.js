//Importar
import { Tooltip } from "./tooltip.js";
import { activeNote, makeElementEditable } from "./utilidades.js";
import { db } from "./db.js";
import { cliente } from "./cliente.js";
import { DeleteConfirmModal } from "./modal.js";

const $notePanelTitle = document.querySelector('[data-note-panel-title]');

export const NavItem = function (id, name) {
    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');
    $navItem.setAttribute('data-notebook', id);

    $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field
            >${name}</span
          >
          <button
            class="icon-btn small"
            aria-label="Editar nota"
            data-tooltip="Editar nota"
            data-edit-btn
          >
            <span class="material-symbols-rounded" aria-hidden="true"
              >Edit</span
            >

            <div class="state-layer"></div>
          </button>
          <button
            class="icon-btn small"
            aria-label="Eliminar nota"
            data-tooltip="Eliminar nota"
            data-delete-btn
          >
            <span class="material-symbols-rounded" aria-hidden="true"
              >Delete</span
            >

            <div class="state-layer"></div>
          </button>

          <div class="state-layer"></div>
    `;

    //Mostrar tooltip al presionar el botón editar y eliminar nota
    const  $tooltipElement = $navItem.querySelectorAll('[data-tooltip]');
    $tooltipElement.forEach($elem => Tooltip($elem));

    /**
     * Actualiza las el titulo del panel de notas, recupera las notas asociadas y
     * marca el ítem que está activo.
     */

    $navItem.addEventListener('click', function() {
      $notePanelTitle.textContent = name;
      activeNote.call(this);

      const noteList = db.get.note(this.dataset.notebook);
      cliente.note.read(noteList);
    });
    
    /**
     * Editar funcionalidad del cuaderno.
     */
    const $navItemEditBtn = $navItem.querySelector('[data-edit-btn]');
    const $navItemField = $navItem.querySelector('[data-notebook-field]');
    $navItemEditBtn.addEventListener('click', makeElementEditable.bind(null, $navItemField));

    $navItemField.addEventListener('keydown', function (event) {
      if(event.key === 'Enter') {

        this.removeAttribute('contenteditable');

        //Actualizar datos editados en la base de datos.
        const updateNoteData = db.update.notebook(id, this.textContent);

        //Renderizar notas actualizadas.
        cliente.notebook.update(id, updateNoteData);

      }
    })

    /**
     * Funcionalidad de eliminar una nota.
     */

    const $navItemDeleteBtn = $navItem.querySelector('[data-delete-btn]');
    $navItemDeleteBtn.addEventListener('click', function() {
      const modal = DeleteConfirmModal(name);

      modal.open();

      modal.onSubmit(function(isConfirm){
        //console.log(isConfirm);
        if(isConfirm) {
          db.delete.notebook(id);
          cliente.notebook.delete(id);
        }

        modal.close();
      });
    })


    return $navItem;
}