const http = require('http')

const server = http.createServer((req, res) => {
    res.end('Reponse SERVER ! ! !')
})

server.listen(process.env.PORT || 3000)