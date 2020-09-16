// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const restful = require('node-restful'); 

// Mongoose
mongoose.connect('mongodb://localhost/robin-rest-api', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = require('./models/user');
const userDB = mongoose.Schema(userSchema);
const eventSchema = require('./models/event');
const eventDB = mongoose.Schema(eventSchema);

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User Resource
let UserResource = app.resource = restful.model('user', userDB).methods(['get', 'post', 'delete']);
UserResource.register(app, '/user');

// Event Resource
let EventResource = app.resource = restful.model('event', eventDB).methods(['get', 'post', 'delete']);
EventResource.register(app, '/event');

// User Availability Resource
app.get('/availability', async (req, res) => {
    let response = {};
    const userServ = require('./services/userService.js');
    const userService = new userServ(mongoose);

    response.results = await userService.compareAvailability(req.body.userIds, req.body.start, req.body.end, req.body.workHoursOnly);
    res.json(response);
}); 

// Start server
const server = app.listen(3000, () => console.log('Listening on port 3000...'));
setInterval(() => server.getConnections(
    (err, connections) => console.log(`${connections} connections currently open`)
), 1000);

// Monitor Connections
let connections = [];
server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

// Handle Shutdown Signals
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown); 
function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
