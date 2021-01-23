const express = require('express')
const bodyParser = require('body-parser')
const VKBot = require('node-vk-bot-api')

const server = express()
const bot = new VKBot({
    token : "72f8e0d9b6654a8ac278049b0dd4b99f573aa3b67d533d5a5b294ee543ed925003370fa304ffdbbd21c2d",
    confirmation : "1827676c"
})
bot.on((ctx)=>{
    ctx.reply('Ням')
})
bot.command('/%help', (ctx)=>{
    ctx.reply('Чтобы записать сроки дз/экзов используйте данную форму: %дз/%экз "Домашнее задание 1 по Математике" 10.12.2100(срок сдачи). Пример: дз " Доделать этого бота " 06.02.2021')
})

const PORT = process.env.PORT || 80

server.use(bodyParser.json())

server.post('/', bot.webhookCallback)

server.listen(PORT, () =>{
    console.log('Server has been started')
})
