const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nano = require('nano')('http://admin:admin123@couchdb:5984')
// const nano = require('nano')('http://admin:password@localhost:5984')
const db = nano.use('ongtest')

db.info()
    .then(() => { })
    .catch(err => {
        if (err.error == 'not_found') {
            nano.db.create('ongtest')
        }
    })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});
app.listen(3000, () => {
    console.log('App listening on port 3000');
});
app.post("/submit", (req, res) => {
    const name = req.body.name;
    db.get('person')
        .then(docs => {
            db.bulk({
                docs: [{
                    _id: docs._id,
                    _rev: docs._rev,
                    name: name
                }]
            })
                .then((r) => {
                    console.log(r);
                    res.redirect('/');
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect('/');
                })
        })
});