//Variables
const form = document.querySelector("#cotizar-seguro");



//eventlisteners
eventlisteners();
function eventlisteners(){
    document.addEventListener("DOMContentLoaded", () => {
        ui.fillOptions();
    });

    form.addEventListener("submit", quoteSecure);
}



//functions

//constructors
function Secure(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
};

Secure.prototype.quoteSecure = function() {

    let quantity;
    const base = 2000;

    switch(this.brand) {
        case "1" : 
            quantity = base * 1.15;
            break;
        case "2" : 
            quantity = base * 1.05;
            break;
        case "3" : 
            quantity = base * 1.35;
            break;
        default:    
            break;
    }
    
    //less year
    let diference;
    diference = new Date().getFullYear() - this.year;

    //everytime the year is less we less 3% of the price
    quantity -= ((diference * 3) * quantity) / 100;

    /*
        if the seure is basic we increase 30%,
        if the secure is full we increase 50%.
    */

    if(this.type === "basico") {
        quantity = quantity * 1.30;
    } else {
        quantity *= 1.50;
    }

    return quantity;
}

function UI() {};


//fill the options

UI.prototype.fillOptions = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector("#year");

    for(let i = max; i > min; i--) {
        let option = document.createElement("option");
        option.textContent = i;
        option.value = i;
        selectYear.appendChild(option);
    }

}

//show alerts on screen
UI.prototype.showMessage = (message, typeofmessage) => {
    const div = document.createElement("div");

    if(typeofmessage === "error") {
        div.classList.add("error");

    } else { 
        div.classList.add("correcto");
    }

    div.textContent = message;
    div.classList.add("mensaje");

    //apprend to form
    form.insertBefore(div, document.querySelector("#resultado"));

    setTimeout(() => div.remove(), 3000);
}

UI.prototype.showResult = (total, secure) => {
    const {brand, year, selectedType} = secure;
    console.log(selectedType);
    let brandText;
    switch(brand) {
        case "1":
            brandText = "Americano";
            break;

        case "2":
            brandText = "Asiatico";
            break;
        case "3":
            brandText = "Europeo";
            break;    
        default:
            break;

    }
    const div = document.createElement("div");
    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Tipo: <span class="font-normal">${selectedType}</span></p>
        <p class="font-bold">Marca: <span class="font-normal">${brandText}</span></p>
        <p class="font-bold">Ano: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;

    const resultDiv = document.querySelector("#resultado");
    

    //show spinner and then the result
    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout( () => {
        spinner.style.display = "none";
        resultDiv.appendChild(div)
    }, 3000);
};    

//instance ui

const ui = new UI();


function quoteSecure(e) {
    e.preventDefault();
    
    //read selected brand
    const brand = document.querySelector("#marca").value;

    //read selected year
    const year = document.querySelector("#year").value;

    //read selected type
    const selectedType = document.querySelector('input[name="tipo"]:checked').value;
 
    if(brand === "" || year === "" || selectedType === "") {
        ui.showMessage("Todos los datos deben ser rellenados", "error");
        return;
    };

    ui.showMessage("Todo correcto!", "correcto");

    //Inicitiali secure

    const secure = new Secure(brand, year, selectedType);
    const total = secure.quoteSecure();

    //Clear previus querys
    const results = document.querySelector("#resultado div");
    if(results != null) {
        results.remove();
    }

    //we use the prototype to show result
    ui.showResult(total, secure);
    
};