const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');

const NoteModal = function(title = '', text = '', time = '') {
    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
    <button class="icon-btn large" aria-label="Close modal" data-close-btn>
        <span class="material-symbols-rounded" aria-label="true">close</span>

        <div class="state-layer"></div>
      </button>

      <input type="text" placeholder="Sin título" value="${title}" class="modal-title text-title-medium" data-note-field>

        <textarea placeholder="Crear una nota" class="modal-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

        <div class="modal-footer">
          <span class="time text-label-large">${time}</span>

          <button class="btn text" data-submit-btn>
            <span class="text-label-large">Guardar</span>

            <div class="state-layer"></div>
          </button>
        </div>
    `;

    const $submitBtn = $modal.querySelector('[data-submit-btn]');
    $submitBtn.disabled = true;
    const [$titleField, $textField] = $modal.querySelectorAll('[data-note-field]');

    const enableSubmit = function () {
      $submitBtn.disabled = !$titleField.value && !$textField.value;
    }

    $textField.addEventListener('keyup', enableSubmit);
    $titleField.addEventListener('keyup', enableSubmit);

    const open = function() {
      document.body.appendChild($modal);
      document.body.appendChild($overlay);
      $titleField.focus();
    }

    //Cerrar modal removiendolo del cuerpo del documento
    const close = function() {
      document.body.removeChild($modal);
      document.body.removeChild($overlay);
    }

    const $closeBtn = $modal.querySelector('[data-close-btn]');
    $closeBtn.addEventListener('click', close)

    const onSubmit = function (callback) {

      $submitBtn.addEventListener('click', function() {
        const noteData = {
          title: $titleField.value,
          text: $textField.value
        }

        callback(noteData);
      })

    }


    return {open, close, onSubmit}
}

/**
 * 
 * @param {string} title - Título del ítem a eliminar.
 * @returns {Object} - Un objeto que cotiene funciones para abrir el modal,
 * cerrar este mismo y a la vez, confirmar su eliminación.
 */
const DeleteConfirmModal = function (title) {
    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
      <h3 class="modal-title text-title-medium">
        ¿Estás seguro de que quieres eliminar la nota
        <b>"${title}"</b>?
      </h3>

      <div class="modal-footer">
        <button class="btn text" data-action-btn="false">
          <span class="text-label-large">Cancelar</span>

          <div class="state-layer"></div>
        </button>
        <button class="btn fill" data-action-btn="true">
          <span class="text-label-large">Eliminar</span>

          <div class="state-layer"></div>
        </button>
      </div>
      `;
      //console.log($modal);
    
    /**
     * Abre la el modal para confirmar la eliminación de la nota en el cuerpo el documento.
     */

    const open = function () {
        document.body.appendChild($modal);
        document.body.appendChild($overlay);
    }

    /**
     * Cierra la confirmación de la eliminación de la nota quitandola del
     * cuerpo del documento.
     */

    const close = function() {
        document.body.removeChild($modal);
        document.body.removeChild($overlay);    
    }

    const $actionBtn = $modal.querySelectorAll('[data-action-btn]');

    //Se encarga de enviar la confirmación de la eliminación.

    const onSubmit = function(callback) {
        $actionBtn.forEach($btn => $btn.addEventListener('click', function() {
            const isConfirm = this.dataset.actionBtn === 'true' ? true : false;

            callback(isConfirm);
        }));
    }

    return{open, close, onSubmit}
}

export {DeleteConfirmModal, NoteModal}