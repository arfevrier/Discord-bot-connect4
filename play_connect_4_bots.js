const discord = require('discord.js')
const bot = new discord.Client({maxCachedMessages: 0})
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'discord_connect4'
});
bot.login('[discord key here]')

// Start
bot.on('ready', function (){
    console.log("ConnectFour connected")
    setInterval(function(){
        bot.shard.fetchClientValues('guilds.size').then(results => {
            var number_serv = results.reduce((prev, val) => prev + val, 0)
            var debug_mode = 0
            if(debug_mode === 1){
                bot.user.setGame('Maintenance :(', 'https://www.twitch.tv/c4bot').catch(console.error)
            } else if(number_serv >= 2){
                bot.user.setGame(number_serv+' servers | !c4 help', 'https://www.twitch.tv/c4bot').catch(console.error)
            } else {
                bot.user.setGame(number_serv+' server | !c4 help', 'https://www.twitch.tv/c4bot').catch(console.error)
            }
        }).catch(console.error);
    }, 30000)
    setInterval(function(){
        var local_time = Math.round(new Date().getTime()/1000)
        for (var index in db) {
            if((local_time - db[index]['timestamp']) >= 86400){
                db[index]['message'].clearReactions()
                delete db[index]
            }
        }
    }, 900000)
})

var db = {}
function colo_update(num, tbl, id){
    for (i = 5; i >= 0; i=i-1) {
        if(tbl[i][num] == ':black_circle:'){
            if(db[id]['tour_de'] == ':large_blue_circle:'){
                tbl[i][num] = db[id]['tour_de']
                db[id]['tour_de'] = ':red_circle:'
                return tbl
            } else {
                tbl[i][num] = db[id]['tour_de']
                db[id]['tour_de'] = ':large_blue_circle:'
                return tbl
            }
        }
    }
    return tbl
}
function detect_win(id){
    var b = 0
    for (i = 0; i <= 5; i++) {
        for (a = 0; a <= 6; a++) {
            if(a-3 >=0){
               if((db[id]['tbl'][i][a] != ':black_circle:') && (db[id]['tbl'][i][a] == db[id]['tbl'][i][a-1]) && (db[id]['tbl'][i][a-1] == db[id]['tbl'][i][a-2]) && (db[id]['tbl'][i][a-2] == db[id]['tbl'][i][a-3])){
                    db[id]['winner'] = db[id]['tbl'][i][a]
                    db[id]['tbl'][i][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i][a-1] = ':large_orange_diamond:'
                    db[id]['tbl'][i][a-2] = ':large_orange_diamond:'
                    db[id]['tbl'][i][a-3] = ':large_orange_diamond:'
                    return true
                }
            }
            if(i-3 >=0){
                if((db[id]['tbl'][i][a] != ':black_circle:') && (db[id]['tbl'][i][a] == db[id]['tbl'][i-1][a]) && (db[id]['tbl'][i-1][a] == db[id]['tbl'][i-2][a]) && (db[id]['tbl'][i-2][a] == db[id]['tbl'][i-3][a])){
                    db[id]['winner'] = db[id]['tbl'][i][a]
                    db[id]['tbl'][i][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i-1][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i-2][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i-3][a] = ':large_orange_diamond:'
                    return true
                }
            }
            if(i-3 >=0 && a-3 >=0){
                if((db[id]['tbl'][i][a] != ':black_circle:') && (db[id]['tbl'][i][a] == db[id]['tbl'][i-1][a-1]) && (db[id]['tbl'][i-1][a-1] == db[id]['tbl'][i-2][a-2]) && (db[id]['tbl'][i-2][a-2] == db[id]['tbl'][i-3][a-3])){
                    db[id]['winner'] = db[id]['tbl'][i][a]
                    db[id]['tbl'][i][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i-1][a-1] = ':large_orange_diamond:'
                    db[id]['tbl'][i-2][a-2] = ':large_orange_diamond:'
                    db[id]['tbl'][i-3][a-3] = ':large_orange_diamond:'
                    return true
                }
            }
            if(i-3 >=0 && a+3 >=0){
                if((db[id]['tbl'][i][a] != ':black_circle:') && (db[id]['tbl'][i][a] == db[id]['tbl'][i-1][a+1]) && (db[id]['tbl'][i-1][a+1] == db[id]['tbl'][i-2][a+2]) && (db[id]['tbl'][i-2][a+2] == db[id]['tbl'][i-3][a+3])){
                    db[id]['winner'] = db[id]['tbl'][i][a]
                    db[id]['tbl'][i][a] = ':large_orange_diamond:'
                    db[id]['tbl'][i-1][a+1] = ':large_orange_diamond:'
                    db[id]['tbl'][i-2][a+2] = ':large_orange_diamond:'
                    db[id]['tbl'][i-3][a+3] = ':large_orange_diamond:'
                    return true
                }
            }
            if(db[id]['tbl'][i][a] == ':black_circle:'){
                b++
            }
        }
    }
    if(b === 0){
        db[id]['winner'] = 'nobody'
        return true
    } else {
        return false
    }
}
function execute_win(message){
    message.clearReactions().then(Message => {
        message.react('🎉').catch()
        message.react('🎊').catch()
        message.react('👏').catch()
    }).catch()
    if(db[message.id]['winner'] == ':large_blue_circle:'){
        db[message.id]['winner'] = db[message.id]['user'][0]
    } else if(db[message.id]['winner'] == 'nobody'){
        db[message.id]['winner'] = 'Oh! :dizzy_face: Nobody'
    } else {
        db[message.id]['winner'] = db[message.id]['user'][1]
    }
    message.edit(text_message_construct(message.id, 'win')).catch()
    delete db[message.id]
}
function text_message_construct(id, type='contruct'){
    var footer_local
    if(type == 'contruct'){
        var mods = 'Initialisation...'
    } else if(type == 'win'){
        var mods = '@'+db[id]['winner'].username+' won! 📢'
        var footer_local = {
              icon_url: 'https://images.discordapp.net/avatars/218369745664081920/e59d72cbbd17d244a73fdbace5a7ce4f.png',
              text: 'Connect4 by Arnicel#1083'
            }
    } else {
        if(db[id]['tour_de'] == ':large_blue_circle:'){
            var mods = 'It\'s the turn of @'+db[id]['user'][0].username+' ('+db[id]['tour_de']+')'
        } else {
            var mods = 'It\'s the turn of @'+db[id]['user'][1].username+' ('+db[id]['tour_de']+')'
        }
    }
    var final = {embed: {
            color: 4484275,
            author: {
              name: 'Party #'+db[id]['party_number'],
              icon_url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'
            },
            
                title: mods,
                description: '\n╔═════════════════════════════╗\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][0][0]+'▐▌'+db[id]['tbl'][0][1]+'▐▌'+db[id]['tbl'][0][2]+'▐▌'+db[id]['tbl'][0][3]+'▐▌'+db[id]['tbl'][0][4]+'▐▌'+db[id]['tbl'][0][5]+'▐▌'+db[id]['tbl'][0][6]+'║\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][1][0]+'▐▌'+db[id]['tbl'][1][1]+'▐▌'+db[id]['tbl'][1][2]+'▐▌'+db[id]['tbl'][1][3]+'▐▌'+db[id]['tbl'][1][4]+'▐▌'+db[id]['tbl'][1][5]+'▐▌'+db[id]['tbl'][1][6]+'║\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][2][0]+'▐▌'+db[id]['tbl'][2][1]+'▐▌'+db[id]['tbl'][2][2]+'▐▌'+db[id]['tbl'][2][3]+'▐▌'+db[id]['tbl'][2][4]+'▐▌'+db[id]['tbl'][2][5]+'▐▌'+db[id]['tbl'][2][6]+'║\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][3][0]+'▐▌'+db[id]['tbl'][3][1]+'▐▌'+db[id]['tbl'][3][2]+'▐▌'+db[id]['tbl'][3][3]+'▐▌'+db[id]['tbl'][3][4]+'▐▌'+db[id]['tbl'][3][5]+'▐▌'+db[id]['tbl'][3][6]+'║\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][4][0]+'▐▌'+db[id]['tbl'][4][1]+'▐▌'+db[id]['tbl'][4][2]+'▐▌'+db[id]['tbl'][4][3]+'▐▌'+db[id]['tbl'][4][4]+'▐▌'+db[id]['tbl'][4][5]+'▐▌'+db[id]['tbl'][4][6]+'║\n║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■║\n║'+db[id]['tbl'][5][0]+'▐▌'+db[id]['tbl'][5][1]+'▐▌'+db[id]['tbl'][5][2]+'▐▌'+db[id]['tbl'][5][3]+'▐▌'+db[id]['tbl'][5][4]+'▐▌'+db[id]['tbl'][5][5]+'▐▌'+db[id]['tbl'][5][6]+'║\n║ ▬▬▬▬▬▬▬▬▬▬ ▬▬▬▬▬▬▬▬▬▬ ║\n╚═════════════════════════════╝'
            ,
            footer: footer_local,
            thumbnail: {
              url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'
            }
          }
        }
    return final
}
function create_tbl(){
    var foo = new Array(6)
    for(var i=0;i<foo.length;i++){
        foo[i] = new Array(7).fill(':black_circle:');
    }
    return foo
}

// ----------------------------------------| Against BOT
function detect_win_bot(tbl){
    for (var i = 0; i <= 5; i++) {
        for (var a = 0; a <= 6; a++) {
            if(a-3 >=0){
               if((tbl[i][a] != ':black_circle:') && (tbl[i][a] == tbl[i][a-1]) && (tbl[i][a-1] == tbl[i][a-2]) && (tbl[i][a-2] == tbl[i][a-3])){
                    return true
                }
            }
            if(i-3 >=0){
                if((tbl[i][a] != ':black_circle:') && (tbl[i][a] == tbl[i-1][a]) && (tbl[i-1][a] == tbl[i-2][a]) && (tbl[i-2][a] == tbl[i-3][a])){
                    return true
                }
            }
            if(i-3 >=0 && a-3 >=0){
                if((tbl[i][a] != ':black_circle:') && (tbl[i][a] == tbl[i-1][a-1]) && (tbl[i-1][a-1] == tbl[i-2][a-2]) && (tbl[i-2][a-2] == tbl[i-3][a-3])){
                    return true
                }
            }
            if(i-3 >=0 && a+3 >=0){
                if((tbl[i][a] != ':black_circle:') && (tbl[i][a] == tbl[i-1][a+1]) && (tbl[i-1][a+1] == tbl[i-2][a+2]) && (tbl[i-2][a+2] == tbl[i-3][a+3])){
                    return true
                }
            }
        }
    }
    return false
}
function entrer_possible(tbl, num){
    for (c = 5; c >= 0; c=c-1) {
        if(tbl[c][num] == ':black_circle:'){
            return c
        }
    }
    return false
}
function bot_play(id){
    if(db[id]['number_turn'] === 0){
        db[id]['number_turn']++
        db[id]['tbl'][5][3] = db[id]['tour_de']
        db[id]['tour_de'] = ':large_blue_circle:'
    } else {
        var score = new Array()
        var tableau = JSON.parse(JSON.stringify(db[id]['tbl']))
        for (var i = 0; i <= 6; i++) {
            var entrer_possible_var = entrer_possible(tableau, i)
            if(entrer_possible_var !== false){
                score[i] = 5000
                if(entrer_possible_var-1 >= 0 && tableau[entrer_possible_var-1][i] == ':red_circle:'){score[i]++}
                if(entrer_possible_var-1 >= 0 && i-1 >= 0 && tableau[entrer_possible_var-1][i-1] == ':red_circle:'){score[i]++}
                if(entrer_possible_var-1 >= 0 && i+1 <= 6 && tableau[entrer_possible_var-1][i+1] == ':red_circle:'){score[i]++}
                if(entrer_possible_var+1 <= 5 && tableau[entrer_possible_var+1][i] == ':red_circle:'){score[i]++}
                if(entrer_possible_var+1 <= 5 && i-1 >= 0 && tableau[entrer_possible_var+1][i-1] == ':red_circle:'){score[i]++}
                if(entrer_possible_var+1 <= 5 && i+1 <= 6 && tableau[entrer_possible_var+1][i+1] == ':red_circle:'){score[i]++}
                if(i-1 >= 0 && tableau[entrer_possible_var][i-1] == ':red_circle:'){score[i]++}
                if(i+1 <= 6 && tableau[entrer_possible_var][i+1] == ':red_circle:'){score[i]++}
                
                var tableau_save = JSON.parse(JSON.stringify(tableau))
                tableau_save[entrer_possible_var][i] = ':red_circle:'
                if(detect_win_bot(tableau_save)){score[i] = score[i]+10000}
                
                for (var c = 0; c <= 6; c++) {
                    var tableau_save_2 = JSON.parse(JSON.stringify(tableau_save))
                    var entrer_possible_var_2 = entrer_possible(tableau_save_2, c)
                    if(entrer_possible_var_2 !== false){
                        tableau_save_2[entrer_possible_var_2][c] = ':large_blue_circle:'
                        if(detect_win_bot(tableau_save_2)){score[i] = score[i]-50}
                    }
                    for (var d = 0; d <= 6; d++) {
                        var tableau_save_3 = JSON.parse(JSON.stringify(tableau_save_2))
                        var entrer_possible_var_3 = entrer_possible(tableau_save_3, d)
                        if(entrer_possible_var_3 !== false){
                            tableau_save_3[entrer_possible_var_3][d] = ':red_circle:'
                            if(detect_win_bot(tableau_save_3)){score[i] = score[i]+25}
                        }
                        for (var e = 0; e <= 6; e++) {
                            var tableau_save_4 = JSON.parse(JSON.stringify(tableau_save_3))
                            var entrer_possible_var_4 = entrer_possible(tableau_save_4, d)
                            if(entrer_possible_var_4 !== false){
                                tableau_save_4[entrer_possible_var_4][e] = ':large_blue_circle:'
                                if(detect_win_bot(tableau_save_4)){score[i] = score[i]-10}
                            }
                        }
                    }
                }                
            } else {
                score[i] = 0
            }
        }
        var most_score = 0
        for (i = 1; i <= 6; i++) {
            if(score[i] > score[most_score]){
                most_score = i
            }
        }
        db[id]['tbl'][entrer_possible(tableau, most_score)][most_score] = db[id]['tour_de']
        db[id]['tour_de'] = ':large_blue_circle:'
    }
}
// ----------------------------------------|

bot.on('message', message => {
    if(message.content.split(' ')[0] == '!c4'){
    if(message.channel.type == 'text'){ var message_guild_id = message.guild.id } else { var message_guild_id = 0 }
    connection.query('SELECT count(guild_id) FROM `channel_whitelist` WHERE `guild_id` = '+message_guild_id, function(err, rows) {
        if (err) throw err
    connection.query('SELECT count(channel_id) FROM `channel_whitelist` WHERE `channel_id` = '+message.channel.id, function(err2, rows2) {
        if (err2) throw err2
    if(rows[0]['count(guild_id)'] == 0 || rows2[0]['count(channel_id)'] == 1){
    connection.query('SELECT count(channel_id) FROM `channel_blacklisted` WHERE `channel_id` = '+message.channel.id, function(err, rows) {
        if (err) throw err
    if(rows[0]['count(channel_id)'] == 0){
    if(message.content.search('!c4 play') >= 0 && message.mentions.users.size === 1 && message.channel.type == 'text' && message.author.id !== bot.user.id){
      connection.query('INSERT INTO `number_party_started` (`date`, `number`) VALUES (CURRENT_DATE(), 1) ON DUPLICATE KEY UPDATE `number`=`number`+1', function(err) {if (err) throw err})
      var author_0 = message.author
      var author_1 = message.mentions.users.first()
      if(message.mentions.users.first().id === bot.user.id){
        var tour_de = ':red_circle:'
      } else {
        var tour_de = ':large_blue_circle:'
      }
      message.channel.send({embed: {color: 4484275,author: {name: 'Initialisation...',icon_url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'},thumbnail: {url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'}}})
        .then(function(message){
          connection.query('SELECT SUM(number) FROM number_party_started', function(err, rows) {if (err) throw err
            db[message.id] = new Array()
            db[message.id]['tbl'] = create_tbl()
            db[message.id]['tour_de'] = tour_de
            db[message.id]['user'] = new Array()
            db[message.id]['number_turn'] = 0
            db[message.id]['message'] = message
            db[message.id]['party_number'] = rows[0]['SUM(number)']
            db[message.id]['timestamp'] = Math.round(new Date().getTime()/1000)
            db[message.id]['user'][0] = author_0
            db[message.id]['user'][1] = author_1
            message.react('1⃣').then(MessageReaction => {
                message.react('2⃣').then(MessageReaction => {
                    message.react('3⃣').then(MessageReaction => {
                        message.react('4⃣').then(MessageReaction => {
                            message.react('5⃣').then(MessageReaction => {
                                message.react('6⃣').then(MessageReaction => {
                                    message.react('7⃣').then(MessageReaction => {
                                        message.edit(text_message_construct(message.id, 'go'))
                                            .then(message => {
                                                if(db[message.id]['tour_de'] == ':red_circle:'){
                                                    bot_play(message.id, message)
                                                    message.edit(text_message_construct(message.id, 'go')).catch()
                                                }
                                            })
                                            .catch()
                                    }).catch()
                                }).catch()
                            }).catch()
                        }).catch()
                    }).catch()
                }).catch()
            }).catch()
        })
        }).catch()
        .catch()
    }
    if(message.content.search('!c4 party leave') >= 0 && message.author.id !== bot.user.id){
        for (var index in db) {
            if(message.author.id == db[index]['user'][0].id){
                db[index]['winner'] = ':red_circle:'
                execute_win(db[index]['message'])
            } else if(message.author.id == db[index]['user'][1].id){
                db[index]['winner'] = ':large_blue_circle:'
                execute_win(db[index]['message'])
            }
        }
        message.delete().catch()
    }
    if(message.content.search('!c4 help') >= 0 && message.author.id !== bot.user.id){
        connection.query('SELECT SUM(number) FROM number_party_started', function(err, rows) {
            if (err) throw err
            var text_message = {embed: {
                            color: 4484275,
                            author: {
                              name: 'Help',
                              icon_url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'
                            },
                            title: 'Connect4 BOT was created to play the classic Connect Four game!',
                            fields:[{
                                name:'•',
                                value:'__**Commands:**__'
                            },{
                                name:'Start a Connect Four game:',
                                value:'```!c4 play @<player 2 name>```'
                            },{
                                name:'Start a Connect Four game against the bot:',
                                value:'```!c4 play @Connect4```',
                                inline: true
                            },{
                                name:'Abandon and quit the game (you lose):',
                                value:'```!c4 party leave```'
                            },{
                                name:'Help command:',
                                value:'```!c4 help```'
                            },{
                                name:'•',
                                value:'__**Commands (Server owner):**__'
                            },{
                                name:'Get the channel ID:',
                                value:'```!c4 channel_info```'
                            },{
                                name:'Authorize specifics channels to use the bot, all other channel are automaticly ignored:',
                                value:'```!c4 channel_authorized add <Channel ID>\n!c4 channel_authorized delete <Channel ID>\n!c4 channel_authorized list```'
                            },{
                                name:'Blacklist specifics channels to use the bot:',
                                value:'```!c4 channel_blacklisted add [Channel ID]\n!c4 channel_blacklisted delete [Channel ID]\n!c4 channel_blacklisted list```'
                            },{
                                name:'•',
                                value:'__**Informations:**__'
                            },{
                                name:'Number of parties started:',
                                value:rows[0]['SUM(number)']+' !'
                            },{
                                name:'The official server, if you have any questions or requestes to make for the bot:',
                                value:'https://discord.gg/UP8dSWb'
                            }],
                            footer: {
                              icon_url: 'https://images.discordapp.net/avatars/218369745664081920/e59d72cbbd17d244a73fdbace5a7ce4f.png',
                              text: 'Connect4 by Arnicel#1083'
                            },
                            thumbnail: {
                              url: 'https://image.prntscr.com/image/ENUbrzE0SNChVz_MGitH2w.png'
                            }
                          }
                        }
            message.reply('help is on the way :mailbox:')
            message.author.send(text_message).catch(function(){
                message.channel.send(text_message).catch()
            })
        })
        
    }
    } else { message.delete().catch() }
    })   
    } else { message.delete().catch() }
    })
    })
        
    if(message.content.search('!c4 channel_info') >= 0 &&
       message.channel.type == 'text' &&
       message.author.id === message.guild.ownerID
        ){
            message.reply('❗️\n*Channel ID: '+message.channel.id+'*')
      }
        
    //----------- Channel Autorized
    if(message.content.search('!c4 channel_authorized add') >= 0 &&
       message.channel.type == 'text' &&
       message.author.id === message.guild.ownerID &&
       message.guild.channels.has(message.content.split(' ')[3])
        ){
            var channel_id = message.content.split(' ')[3]
            var guild_id = message.guild.id
            connection.query('INSERT INTO `channel_whitelist` (`channel_id`, `guild_id`) VALUES ('+channel_id+', '+guild_id+') ON DUPLICATE KEY UPDATE `channel_id`=`channel_id`', function(err, rows) {
                if (err) throw err
                message.reply('❗️ *Channel '+channel_id+' added*')
            })
      }
    else if(message.content.search('!c4 channel_authorized delete') >= 0 &&
       message.channel.type == 'text' &&
       message.author.id === message.guild.ownerID
        ){
            var channel_id = encodeURI(message.content.split(' ')[3])
            var guild_id = message.guild.id
            connection.query('DELETE FROM `channel_whitelist` WHERE `channel_id`="'+channel_id+'" AND `guild_id`='+guild_id, function(err, rows) {
                if (err) throw err
                message.reply('❗️ *Channel '+channel_id+' deleted*')
            })
      }
    else if(message.content.search('!c4 channel_authorized list') >= 0 &&
       message.channel.type == 'text' &&
       message.author.id === message.guild.ownerID
        ){
            var guild_id = message.guild.id
            connection.query('SELECT `channel_id` FROM `channel_whitelist` WHERE `guild_id` = '+guild_id, function(err, rows) {
                if (err) throw err
                var final_message = ''
                for (var i = 0; i < rows.length; ++i) {
                    if(message.guild.channels.has(rows[i].channel_id)){
                       var local_channel_name = message.guild.channels.get(rows[i].channel_id).name
                    } else {
                       var local_channel_name = '*Undefined*'
                    }
                    final_message = final_message+'**-** '+local_channel_name+' ('+rows[i].channel_id+')\n'
                }
                message.reply('❗️ *List of authorized channels:*\n'+final_message)
            })
      }
    //----------- Channel Blacklisted
    if(message.content.search('!c4 channel_blacklisted add') >= 0 &&
       message.channel.type == 'text' &&
       message.author.id === message.guild.ownerID &&
       message.guild.channels.has(message.content.split(' ')[3])
        ){
            var channel_id = message.content.split(' ')[3]
            var guild_id = message.guild.id
            connection.query('INSERT INTO `channel_blacklisted` (`channel_id`, `guild_id`) VALUES ('+channel_id+', '+guild_id+') ON DUPLICATE KEY UPDATE `channel_id`=`channel_id`', function(err, rows) {
                if (err) throw err
                message.reply('❗️ *Channel '+channel_id+' added*')
            })
      }
    else if(message.content.search('!c4 channel_blacklisted delete') >= 0 &&
        message.channel.type == 'text' &&
        message.author.id === message.guild.ownerID
        ){
            var channel_id = encodeURI(message.content.split(' ')[3])
            var guild_id = message.guild.id
            connection.query('DELETE FROM `channel_blacklisted` WHERE `channel_id`="'+channel_id+'" AND `guild_id`='+guild_id, function(err, rows) {
                if (err) throw err
                message.reply('❗️ *Channel '+channel_id+' deleted*')
            })
      }
    else if(message.content.search('!c4 channel_blacklisted list') >= 0 &&
        message.channel.type == 'text' &&
        message.author.id === message.guild.ownerID
        ){
            var guild_id = message.guild.id
            connection.query('SELECT `channel_id` FROM `channel_blacklisted` WHERE `guild_id` = '+guild_id, function(err, rows) {
                if (err) throw err
                var final_message = ''
                for (var i = 0; i < rows.length; ++i) {
                    if(message.guild.channels.has(rows[i].channel_id)){
                       var local_channel_name = message.guild.channels.get(rows[i].channel_id).name
                    } else {
                       var local_channel_name = '*Undefined*'
                    }
                    final_message = final_message+'**-** '+local_channel_name+' ('+rows[i].channel_id+')\n'
                }
                message.reply('❗️ *List of blacklisted channels:*\n'+final_message)
            })
      }
    }
})

bot.on('messageReactionAdd', (messageReaction, user) => {
    if(db[messageReaction.message.id] && user.id !== bot.user.id){
        messageReaction.remove(user).catch()
        if((db[messageReaction.message.id]['user'][0].id == user.id && db[messageReaction.message.id]['tour_de'] == ':large_blue_circle:') || (db[messageReaction.message.id]['user'][1].id == user.id && db[messageReaction.message.id]['tour_de'] == ':red_circle:')){
        if(messageReaction.emoji.name == '1⃣'){
            var tbl = colo_update(0, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '2⃣'){
            var tbl = colo_update(1, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '3⃣'){
            var tbl = colo_update(2, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '4⃣'){
            var tbl = colo_update(3, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '5⃣'){
            var tbl = colo_update(4, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '6⃣'){
            var tbl = colo_update(5, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        } else if(messageReaction.emoji.name == '7⃣'){
            var tbl = colo_update(6, db[messageReaction.message.id]['tbl'], messageReaction.message.id)
            if(detect_win(messageReaction.message.id)){
                execute_win(messageReaction.message)
            } else {
                messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                if(db[messageReaction.message.id]['user'][1].id === bot.user.id){
                    bot_play(messageReaction.message.id)
                    messageReaction.message.edit(text_message_construct(messageReaction.message.id, 'go')).catch()
                    if(detect_win(messageReaction.message.id)){
                        execute_win(messageReaction.message)
                    }
                }
            }
        }
        }
    }
})