require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {User, Code} = require('./models');

//const {PORT, DATABASE_URL} = require('./config');

//mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json());

const checkRequiredFields = (fields, request, response) => {
    for (let i=0; i<fields.length; i++) {
        const field = fields[i];
        if (!(field in request.body)) {
            const message = `Missing ${field} in request body`
            console.log(message);
            return response.status(400).send(message);
        }
    }
}

const userOne = User.create('zakrar@gmail.com');
const userTwo = User.create('foobar.com');
const userThree = User.create('testing');

Code.create({
    userId: userOne.id,
    expDate: Date.now() + 60000,
    limit: 2
});
Code.create({
    userId: userTwo.id,
    expDate: Date.now() + 60000,
    limit: 2
});

app.get('/users', (req, res) => {
    res.json(User.get());
});

app.post('/users', (req, res) => {
    const requiredFields = ['email'];
    checkRequiredFields(requiredFields, req, res);

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
    checkRequiredFields(requiredFields, req, res);

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

app.get('/code', (req, res) => {
    res.json(Code.get());
});

app.post('/code', (req, res) => {
    const requiredFields = ['userId', 'expDate', 'limit'];
    checkRequiredFields(requiredFields, req, res);

    const newCode = Code.create({
        userId: req.body.userId,
        limit: req.body.limit,
        expiration: req.body.expDate
    });
    return res.status(201).json();
})

app.put('/code/redeem/:id', (req, res) => {
    const requiredFields = ['code'];
    checkRequiredFields(requiredFields, req, res);

    if (req.params.id !== req.body.code) {
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        return res.status(400).send(message);
    }
    console.log(`Redeeming code ${req.params.id}`);

    Code.redeem({
        code: req.params.id
    });
    return res.status(204).end();
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
});
