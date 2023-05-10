const http = require('http');
const app = require('./app');


const server = http.createServer(app);

const { API_PORT } = process.env;

const port = API_PORT || process.env.PORT;

module.exports =  { server, port };


// listen to requests after connection is established successfully
server.listen(port, () => {
    const address = server.address();
    console.log("listenong for port %s %s", address.address, address.port);
});