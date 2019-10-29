
const db = PouchDB('mensajes');

function guardarMensaje( mensaje ) {
    mensaje._id = new Date().toISOString();

    return db.put(mensaje).then( () => {
        self.registration.sync.register('nuevo-post');

        console.log('Mensaje guardado para posterior posteo');
        const newResp = {ok: true, offline: true};
        return new Response(JSON.stringify(newResp));
    });
}

function postearMensajes() {
    const posteos = [];

    return db.alldocs({include_docs: true}).then(docs => {
        docs.rows.forEach(row => {
            const documento = row.doc;

            const fetchProm = fetch('api', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(documento)
            }).then( () => {
                return db.remove(documento)
            });

            posteos.push(fetchProm);
        });
        return Promise.all(posteos);
    });
}