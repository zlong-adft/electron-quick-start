const { Worker, workerData, parentPort } = require('worker_threads');
const PouchDB = require('pouchdb');
const db = new PouchDB(workerData + '/myDB');
// const remoteDB = new PouchDB('http://admin:password@localhost:5984/ongtest');
const remoteDB = new PouchDB('http://admin:admin123@localhost:5982/ongtest');

PouchDB.sync(db, remoteDB, {
    live: true,
    retry: true
})

db.changes({
    since: 'now',
    live: 'true'
})
.on('change', function (change) {
    console.log('changes', change);
})

parentPort.on('message', (msg) => {
    if (msg[0] == 'newDoc') {
        db.bulkDocs([
            {
                _id: 'person',
                name: msg[1]
            }
        ])
            .then((d) => { console.log(d); })
            .catch((err) => { console.log(err); })
    }
    else if (msg[0] = 'editDoc') {
        db.get('person')
            .then(docs => {
                db.bulkDocs([
                    {
                    _id: docs._id,
                    _rev: docs._rev,
                    name: msg[1]
                }
            ])
                    .then(d => {
                        console.log(d);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
    }
})
