const express = require('express')
const bodyParser = require('body-parser')
const VKBot = require('node-vk-bot-api')

const server = express()
const bot = new VKBot({
    token : "72f8e0d9b6654a8ac278049b0dd4b99f573aa3b67d533d5a5b294ee543ed925003370fa304ffdbbd21c2d",
    confirmation : "b6773308"
});

// комманда помощь
bot.command('/help', (ctx) => {
    ctx.reply('Чтобы записать домашнее задание и сроки напишите:\n' +
        'Бот дз/экз "Условие домашнего задания/экзамена" 01.01.2077(дата) -/19:00(время сдачи или его отсутствие)\n' +
        'Например:\n' +
        'Бот дз "Поспать 5 часов" 01.01.2077 -\n' +
        'Чтобы посмотреть сроки сдач, напишите:\n' +
        'бот что скоро сдавать?\n' +
        'Если вы, что-либо задолжали, напишите:\n' +
        'Все дз.\n');
});

//Бот дз, проверка, запись дз в базу данных
bot.command('Бот дз ', (ctx) => {
    let message = ctx.message.text; // получаемый текст
    let Description_of_Homework = ''; // условие дз
    let CheckDescription = 0; // проверка условий
    //0 - первая " - начало условия дз
    //1 - вторая " - конец условия дз
    //2 - проверка формата даты
    //3 - проверка формата времени
    let CrashTest = true
    let Date = '' // дата сдачи
    let Time = '' // время сдачи
    let Message_answer = '' // ответ
    let check = false; // проверка строки на формат записи

// цикл проверки
    for (let i = 7; (i < message.length)&&(CrashTest); i++) {
        switch (CheckDescription){
            case 0:
                if (message[7] = '"'){
                    CheckDescription = 1
                }
                else{
                    CrashTest = false
                }
                break;
            case 1:
                if (message[i] != '"'){
                    Description_of_Homework += message[i];
                }
                else{
                    CheckDescription = 2
                }
                break;
            case 2:
                if (i + 10 < message.length){
                    Date = message.substr(i, 11);
                    let reDate = new RegExp( "\\s(\\d{2}\\.\\d{2}\\.\\d{4})", "gim" );
                    if(reDate.test(Date)){
                        i += 10;
                        CheckDescription = 3
                    }
                    else{
                        CrashTest = false
                    }
                }
                else{
                    CrashTest = false
                }

                break;
            case 3:
            if ((i + 2 == message.length)&&(message.substr(i, 2) == ' -')) {
                CrashTest = false
                check = true
            }
            else{
                Time = message.substr(i, message.length - i)
                let reTime = new RegExp("\\s(\\d{2}:\\d{2})", "gim")
                if(reTime.test(Time)){
                    CrashTest = false
                    check = true
                }
            else{
                    CrashTest = false
                }
            }
                break;
        }
    }

    if (check){
        Message_answer = 'Данные внесены в базу'
    }
    else {
        Message_answer = 'Вы ошиблись'
    }
    ctx.reply(Message_answer)
})

bot.on((ctx)=>{

})


const PORT = process.env.PORT || 80

server.use(bodyParser.json())

server.post('/', bot.webhookCallback)

server.listen(PORT, () =>{
    console.log('Server has been started')
})
