const http = require("http");
const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/about',
    method: 'GET'
};

const req = http.request(options, res => {
    console.log(`Status ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    })
});

req.on('error', error => {
    console.log(error);
})

req.end()