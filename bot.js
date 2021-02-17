const express = require('express')
const bodyParser = require('body-parser')
const VKBot = require('node-vk-bot-api')
const mysql = require('mysql')


const server = express()
const bot = new VKBot({
    token : "72f8e0d9b6654a8ac278049b0dd4b99f573aa3b67d533d5a5b294ee543ed925003370fa304ffdbbd21c2d",
    confirmation : "93cc93d9"
});

var con = mysql.createConnection({
    host : "us-cdbr-east-03.cleardb.com",
    user : "b4587dcf2c387d",
    password : "8fbd3692",
    database : "heroku_5b614e065794d0c"
})

con.connect(function(err) {
    if (err) throw err;
/*
    var sql = "ALTER TABLE customers ADD Condition1 varchar(255)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(err)
        console.log(result)
    })

*/


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
    let id = ctx.message.peer_id; // айди беседы
    var HoE = 'H';
    let Description_of_Homework = ''; // условие дз
    let CheckDescription = 0; // проверка условий
    //0 - первая " - начало условия дз
    //1 - вторая " - конец условия дз
    //2 - проверка формата даты
    //3 - проверка формата времени
    let CrashTest = true
    let DateH = '' // дата сдачи
    let TimeH= '' // время сдачи
    let Message_answer = '' // ответ
    let check = false; // проверка строки на формат записи

// цикл проверки
    for (let i = 7; (i < message.length)&&(CrashTest); i++) {
        switch (CheckDescription){
            case 0:
                if (message[7] == '"'){
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
                    DateH = message.substr(i, 11);
                    let reDate = new RegExp( "\\s(\\d{2}\\.\\d{2}\\.\\d{4})", "gim" );
                    if(reDate.test(DateH)){
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
                if ((i + 1 == message.length)&&(message.substr(i, 2) == ' -')) {
                    CrashTest = false
                    check = true
                }
                else{
                    TimeH = message.substr(i, message.length - i)
                    let reTime = new RegExp("\\s(\\d{2}:\\d{2})", "gim")
                    if(reTime.test(TimeH)){
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

            var sql = "INSERT INTO customers (idgroup, HoE, Dates, timing, Condition1) VALUES ?";
            var values = [id, HoE, DateH, TimeH, Description_of_Homework]
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
            });

            con.query("SELECT * FROM customers", function (err, result, fields) {
                if (err) throw err;
                Message_answer = Message_answer + ' ня ня ' + result[0][1];
            });

    }
    else {
        Message_answer = 'Вы ошиблись'
    }
    ctx.reply(Message_answer);


//})
/*
bot.on((ctx)=>{
    // ctx.reply(ctx.message.peer_id)
})
*/

    con.end((err) => {
        if (err) throw err;
    })
})

const PORT = process.env.PORT || 80

server.use(bodyParser.json())

server.post('/', bot.webhookCallback)

server.listen(PORT, () =>{
    console.log('Server has been started')
})
