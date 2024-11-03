
export function colordropdownEventHandler(){

// Handle opening and closing of custom dropdown
const selectSelected = document.querySelector('.select-selected');
const selectItems = document.querySelector('.select-items');

selectSelected.addEventListener('click', function () {
    selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.custom-select')) {
        selectItems.style.display = 'none';
    }
});

// Set the selected value
selectItems.addEventListener('click', function (event) {
    selectSelected.textContent = event.target.textContent;
    selectSelected.style.backgroundColor = event.target.style.backgroundColor;
    selectSelected.style.borderRadius = '30px';
    selectSelected.style.border = '3px solid black';
    selectSelected.setAttribute('id', `selected-${event.target.id}`);
    selectItems.style.display = 'none';
});

}

export function getCSSVariableById(id){
return getComputedStyle(document.documentElement).getPropertyValue(id).trim();
}

export function flipFlipButton() {
    const flipButton = document.getElementById('flip-tables-svg');
    flipButton.classList.toggle('flipped');
    document.querySelector('.tables-container-body').classList.toggle('tables-body-flipped');
}



// const math = require('mathjs');

export function multiplyInverse(A, B) {
    try {
        // Calculate the inverse of A
        const A_inv = math.inv(A);

        // Multiply A^-1 with B
        const result = math.multiply(A_inv, B);

        return result;
    } catch (error) {
        console.error('Error inverting matrix A:', error);
        return null; // Return null or an appropriate error message if inversion fails
    }
}