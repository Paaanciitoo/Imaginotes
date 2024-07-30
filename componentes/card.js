/**
 * Import módulo
 */
import { cliente } from "./cliente.js";
import { DeleteConfirmModal, NoteModal } from "./modal.js";
import { Tooltip } from "./tooltip.js";
import { getRelativeTime } from "./utilidades.js";
import { db } from "./db.js";

export const card = function (notesData) {
    const {id, title, text, postedOn, notebookId} = notesData;

    const $card = document.createElement('div');
    $card.classList.add('card');
    $card.setAttribute('data-note', id);

    $card.innerHTML = `
    <h3 class="card-title text-title-medium">${title}</h3>

<p class="card-text text-body-large">
  ${text}
</p>

<div class="wrapper">
  <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>

  <button
    class="icon-btn large"
    aria-label="Eliminar nota"
    data-tooltip="Eliminar nota"
    data-delete-btn
  >
    <span class="material-symbols-rounded" aria-hidden="true"
      >delete</span
    >
    <div class="state-layer"></div>
  </button>
</div>

<div class="state-layer"></div>
    `;


    Tooltip($card.querySelector('[data-tooltip]'));

    $card.addEventListener('click', function(){
      const modal = NoteModal(title, text, getRelativeTime(postedOn));
      modal.open();

      modal.onSubmit(function(noteData){
        const updatedData = db.update.note(id, noteData);

        //Actualiza la nota en la UI
        cliente.note.update(id, updatedData);
        modal.close();
      });
    });

    const $deleteBtn = $card.querySelector('[data-delete-btn]');
    $deleteBtn.addEventListener('click', function(event){
      event.stopImmediatePropagation();

      const modal = DeleteConfirmModal(title);

      modal.open();

      modal.onSubmit(function(isConfirm) {
        if (isConfirm) {
          const existedNotes = db.delete.note(notebookId, id);

          //Actualiza la UI del cliente para demostrar la eliminación de la nota.
          cliente.note.delete(id, existedNotes.length);
        }

        modal.close();
      });
    })

    return $card;
}