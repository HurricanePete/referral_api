require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {User, Code} = require('./models');

//const {PORT, DATABASE_URL} = require('./config');

//mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json());

User.create('zakrar@gmail.com');
User.create('foobar.com');
User.create('testing')

app.get('/users', (req, res) => {
    res.json(User.get());
});

app.post('/users', (req, res) => {
    const requiredFields = ['email'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }

    const userItem = User.create(req.body.email);
    res.status(201).json(userItem);
});

app.delete('/users/:id', (req, res) => {
    User.delete(req.params.id);
    console.log(`Deleted user item ${req.params.id}`);
    res.status(204).end();
});

app.put('/users/:id', (req, res) => {
    const requiredFields = ['id', 'email', 'currentCode'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id) {
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        return res.status(400).send(message);
    }
    console.log(`Updating user ${req.params.id}`);
    User.update({
        id: req.params.id,
        email: req.body.email,
        currentCode: req.body.currentCode
    })
    return res.status(204).end();
})



app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
});
