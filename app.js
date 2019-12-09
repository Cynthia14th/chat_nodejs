// 'use strict';
// Importation des librairies (modules)

const express = require('express');
const app = express();

var name = '';
// Définir le template engine
app.set('view engine', 'ejs');

//Définir un middleware permettant d'avoir dossier static où 
// On aura toutes les ressources html ,css, js qu'on mettra en public
app.use(express.static('public'));

// Route test

app.get('/', (req, res) => {

    // res.send('Hello !');
    res.render('chat');
});

server = app.listen(3000);
// Partie socket

// J'importe socket.io que j'instancie sur le serveur !
const io = require('socket.io')(server);
const mysql = require('mysql');

// Create connexion

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "734738",
    database: "superchat"
});

connection.connect(function(err) {
    //show error, if any
    if (err) throw err;
    console.log('Connecterrrrrr !!');

});


// mtd on() permettant d'ecouter un evenement 
// En premier temps on ecoute la connection ce qui signifie 
// qu'a chaque fois un user se connecte au serveur, 
//alors il realise un certain nombre d'action 
// l'evenement pour ecouter la connection est déjà defini dans la librairie, il s'agit de connect ou connection
io.on('connect', (socket) => {

    // On verifie avec un console log
    console.log('New user connected');

    // On ecoute sur l'event change_username avec la mtd on() toujours 
    // A chaque fois qu'un event change_username sera envoyé ce sera ce morceau de code qui sera lancé

    socket.on('change_username', (data) => {
        socket.username = data.username;
        // On test et si on entre le prénom "Mario" , Mario doit s'afficher sur la console ce qui signifie que ça fonctionne et qu'il aura bien été updater dans la partie serveur
    });

    //Ecouter les new message
    // recup message et envoyer message à 'ensemble des personnes connecté
    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', { message: data.message, username: socket.username });
        var data_message = data.message;
        var data_username = socket.username;

        var sql = `INSERT INTO users (username, messages) VALUES ('` + data_username + `', '` + data_message + `' )`;
        connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log("SAVE I DID IT !!");
        });
        console.log('uname = ' + socket.username);
        console.log('data message : ' + data.message + 'username : ' + socket.username);

    });



    // Ecouter l'event typing...

    socket.on('typing', (data) => {

        socket.broadcast.emit('typing', { username: socket.username });
    });

});