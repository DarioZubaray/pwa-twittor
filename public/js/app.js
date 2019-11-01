
var url = window.location.href;
var swLocation = '/twittor/sw.js';

var swReg;
if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }


    window.addEventListener('load', e => {
        navigator.serviceWorker.register( swLocation ).then (reg => {
            swReg = reg;

            swReg.pushManager.getSubscription().then( verificaSubscripcion );
        });
    });
}





// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactividas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    let data = {
        mensaje: mensaje,
        user: usuario
    }

    fetch('api', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( resp => resp.json())
    .then(respJson => console.log(respJson))
    .catch(err => console.log('Error: ', err));

    crearMensajeHTML( mensaje, usuario );

});

// Obtener mensajes del servidor
function verificaSubscripcion(activadas) {
    if (activadas) {
        btnActivadas.removeClass('oculto');
        btnDesactividas.addClass('oculto');
    } else {
        btnActivadas.addClass('oculto');
        btnDesactividas.removeClass('oculto');
    }
}

function getMensajes() {
    fetch('api')
    .then(resp => {
        console.log(resp);
        return resp.json();
    })
    .then(posteos => {
        posteos.forEach(post => {
            crearMensajeHTML(post.mensaje, post.user);
        });
    });
}

getMensajes();

// Detectar cambios de conexion
function isOnline() {
    if (navigator.onLine) {
        // tenemos conexion
        $.mdtoast('Online', {interaction: true, interactionTimeout: 1000, actionText: 'OK!'})
    } else {
        // No tenemos conexion
        $.mdtoast('offline', {interaction: true, actionText: 'OK!', type: 'warning'})

    }
}

window.addEventListener('online', isOnline());
window.addEventListener('offline', isOnline());

isOnline();


// Notificaciones
function enviarNotificacion(mensaje) {
    const notificationOpt = {
        body: 'este es el cuerpo de la notificacion',
        icon: 'img/icons/icon-72x72.png'
    }
    const n = new Notification(mensaje, notificationOpt);
    n.onclick = () => {
        console.log('click');
    }
}

function notificame() {
    if (!window.Notification) {
        console.log('Este navegador no acepta notificaciones :(');
        return;
    }

    if (Notification.permission === 'granted') {
        enviarNotificacion('Hola mundo! -granted!');
    } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
        Notification.requestPermission(function(permission) {
            console.log(permission);
            if (permission === 'granted') {
                enviarNotificacion('Hola mundo - pregunta');
            }
        });
    }
}


function getPublicKey() {

    return fetch('api/key')
        .then(resp => resp.arrayBuffer())
        .then(new Uint8Array);
}

btnDesactivadas.on('click', function() {
    if (!swReg) return console.log('No hay registro del sw');

    getPublicKey().then(function(key) {
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        }).then(resp => resp.toJSON())
        .then(function(subcripcion) {

            fetch('api/subscribe')
            verificaSubscripcion(subcripcion);
        });
    });
});
