const express = require('express')
const bodyParser = require('body-parser')
const VKBot = require('node-vk-bot-api')

const server = express()
const bot = new VKBot({
    token : "72f8e0d9b6654a8ac278049b0dd4b99f573aa3b67d533d5a5b294ee543ed925003370fa304ffdbbd21c2d",
    confirmation : "1827676c"
})
bot.command((ctx)=>{
    var message = ctx.message.text;
    if (message = 'Толик'){
        ctx.reply('старается')
    }
    else{
        ctx.reply('Пудж')
    }
})

const PORT = process.env.PORT || 80

server.use(bodyParser.json())

server.post('/', bot.webhookCallback)

server.listen(PORT, () =>{
    console.log('Server has been started')
})
