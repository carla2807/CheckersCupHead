/*declaro sendData y le asigno los atributos,los inicializo en null*/
var sendData = {
    nombre: null,
    apellido: null,
    email: null,
    mensaje: null,
    
    }
    
    /*API*/
    var url = 'https://jsonplaceholder.typicode.com/posts';
    
    
    var nombre= document.getElementById('nombre');
    var apellido=document.getElementById('apellido');
    var email=document.getElementById('correo');
    var mensaje=document.getElementById('comentario');
    var sendButton=document.getElementById('contact-form-btn');
    
    sendButton.addEventListener('click', function(){
    sendData.nombre = nombre.value.toString();
    sendData.apellido=apellido.value.toString();
    sendData.email=email.value.toString();
    sendData.mensaje=mensaje.value.toString();
    
    sendDataServer(url,sendData)
    
    })
    
    function sendDataServer(url,sendData){
        fetch(url,{
            method: 'POST',
            body: JSON.stringify(sendData),
    
        })
    
        .then((res) => res.JSON ())
        .then((sendData) =>{
            console.log(sendData)
        })
        .catch((err) =>console.log(error))
        console.log(sendData);
    }
    
    