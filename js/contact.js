
var submitBtn = null;
var formElements = null;

//Funcion para abrir la herramienta de correo predeterminado

var sendEmail = function(name,message){
    window.open('mailto:cm90mdp@gmail.com?subject=' + 'Checkers - Contact: '
    + encodeURIComponent(name) +'&body=' + encodeURIComponent(message));
}

//Funcion para validar que los campos no esten vacios
var validateForm = function(){
    var alphaNum = /^[a-zA-Z0-9]*$/;
    var validEmail = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/;
    var name = '';
    var message = '';
    var isValid = true;


//Para iterar
for ( i = 0; i < formElements.length; i++) {
    if (formElements[i].id === 'name') {
        if (!alphaNum.test(formElements[i].value)) {
            formElements[i].value = '';
            formElements[i].placeholder = 'Invalid characters';
            isValid = false;
     
        }

        if (formElements[i].value.length< 3) {
            formElements[i].value = '';
            formElements[i].placeholder = 'Please enter more than 3 characters';
            isValid = false;
            
        }

        name = formElements[i].value;
    }

    if (formElements[i].id === email) {
        if (!validEmail.test(formElements[i].value)) {
            formElements[i].value = '';
            formElements[i].placeholder = 'Invalid Email format';
            isValid = false;
            
        }
        
        
    }

    if (formElements[i].id === 'message') {
        if (formElements[i].value.length < 5) {
            formElements[i].value = '';
            formElements[i].placeholder = 'Please enter more than 5 characters';
            isValid = false;
        }
        message = formElements[i].value;
        
    }
    
}
    (isValid) ? sendEmail(name,message) : styleBtn();
}


var styleBtn = function(){
    submitBtn.innerHTML = 'Unable to send Email';
    submitBtn.className +='error';
    setTimeout(errorMsg, 3000);

}

var errorMsg = function(){
    submitBtn.className = ' ';
    submitBtn.innerHTML = 'Send Message';
}

window.onload = function(){
    formElements = document.getElementsByClassName('entry');
    submitBtn = document.getElementById('submit');
    submitBtn.onclick = validateForm;
}