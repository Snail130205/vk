const express = require('express')
const bodyParser = require('body-parser')
const VKBot = require('node-vk-bot-api')

const server = express()
const bot = new VKBot({
    token : "72f8e0d9b6654a8ac278049b0dd4b99f573aa3b67d533d5a5b294ee543ed925003370fa304ffdbbd21c2d",
    confirmation : "32f71526"
})

bot.command('/help', (ctx) => {
    ctx.reply('Чтобы записать домашнее задание и сроки напишите:' +
        'Бот дз/экз "Условие домашнего задания/экзамена" 01.01.2077(дата) -/19:00(время сдачи или его отсутствие)' +
        'Например:' +
        'Бот дз "Поспать 5 часов" 01.01.2077 -' +
        'Чтобы посмотреть сроки сдач, напишите:' +
        'бот что скоро сдавать?' +
        'Если вы, что-либо задолжали, напишите:' +
        'Все дз.');
});

bot.on((ctx)=>{
    ctx.reply('Ням')
})


const PORT = process.env.PORT || 80

server.use(bodyParser.json())

server.post('/', bot.webhookCallback)

server.listen(PORT, () =>{
    console.log('Server has been started')
})
