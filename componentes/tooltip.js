
/**
 * 
 * @param {*HTMLElement} $element - El elemento DOM al que se añade el comportamiento tooltip
 */


export const Tooltip = function ($element){
    const $tooltip = document.createElement('span');
    $tooltip.classList.add('tooltip', 'text-body-small');

    $element.addEventListener('mouseenter', function () {
        $tooltip.textContent = this.dataset.tooltip;

        const {
            top,
            left,
            height,
            width
        } = this.getBoundingClientRect();

        $tooltip.style.top = top + height + 4 + 'px';
        $tooltip.style.left = left + (width / 2) + 'px';
        $tooltip.style.translate = 'translate (-50%, 0)';
        //Añadir el tooltip al cuerpo del documento
        document.body.appendChild($tooltip)
    });

    $element.addEventListener('mouseleave', $tooltip.remove.bind
        ($tooltip));
}
