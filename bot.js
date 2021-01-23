const express = require('express')
const server = express()

const PORT = process.env.PORT || 80



server.listen(PORT, () =>{
    console.log('Server has been started')
})
