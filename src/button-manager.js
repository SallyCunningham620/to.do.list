//button-manager.js

import "./ui.js";

//Open a specific form
export const openForm = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove("hidden-from");
        form.classList.add("open-form");
    }
};

// Close a specific form
export const closeForm = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        form.classList.add("hidden-from");
        form.classList.remove("open-form");
    }
};

export function closeFormButtons() {
    const closeButtons = document.querySelectorAll('.close-form-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the closest parent form container
            const formContainer = button.closest('.open-form');
            if (formContainer) {
                closeForm(formContainer.id);
            }
        });
    });
}