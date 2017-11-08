const { ShardingManager } = require('discord.js')
const request = require('request')
const manager = new ShardingManager(`${__dirname}/play_connect_4_bots.js`, { totalShards: 3 })

manager.on('launch', shard => {
    console.log(`Successfully launched shard ${shard.id}`)
})
manager.spawn()

setInterval(function(){
    manager.fetchClientValues('guilds.size').then(results => {
        var number_serv = results.reduce((prev, val) => prev + val, 0)
        request.post({
                url: 'https://bots.discord.pw/api/bots/321278762773643265/stats',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '[key here]'
                  },
                  body: '{"server_count":'+number_serv+'}'
        }, function (error, response, body){})
        request.post({
                  url: 'https://discordbots.org/api/bots/321278762773643265/stats',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '[key here]'
                  },
                  body: '{"server_count":'+number_serv+'}'
        }, function (error, response, body){})
		request.post({
                  url: 'https://list.passthemayo.space/api/bots/321278762773643265',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '[key here]'
                  },
                  body: '{"server_count":'+number_serv+'}'
        }, function (error, response, body){})
    }).catch(console.error);
}, 30000)