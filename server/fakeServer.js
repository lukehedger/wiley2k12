// This is just for Now.sh
// https://github.com/zeit/now-cli/issues/377
const http = require('http')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Wiley2k12\n')
})

server.listen(process.env.PORT || 8000, () => console.log('Server running'))
