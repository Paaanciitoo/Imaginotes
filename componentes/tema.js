//Funcionalidad botón para cambiar de tema

//Cambia el tema de Claro a Oscuro y también maneja la configuración del tema en el DOM y en el almacenamiento local
const toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

const storedTheme = localStorage.getItem('theme');
/* console.log("🚀 ~ storedTheme:", storedTheme); */

const systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
/* console.log("🚀 ~ systemThemeIsDark:", systemThemeIsDark) */

const initialTheme = storedTheme ?? (systemThemeIsDark ? 'dark' : 'light');
/* console.log("🚀 ~ initialTheme:", initialTheme) */
document.documentElement.setAttribute('data-theme', initialTheme);

//Adjuntar toggleTheme al botón de cambiar tema, el cual es un click event

window.addEventListener('DOMContentLoaded', function () {
    const $themeBtn = document.querySelector('[data-theme-btn]');
    if ($themeBtn) $themeBtn.addEventListener('click', toggleTheme);
})