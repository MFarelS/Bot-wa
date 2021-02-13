const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close, uploadImage } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const zalgo = require('./lib/zalgo')
const { isFiltered, addFilter } = require('./lib/delycmd')
const fs = require('fs')
const qrcode = require('qrcode')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const { exif } = require('./lib/exif');
const textpro = require("./lib/textpro")
const { limitAdd, isLimit } = require('./lib/limit');
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const request = require('request')
const ytdl = require("ytdl-core");
const db = require("quick.db")
const ms = require('ms')
const axios = require("axios");
const cheerio = require("cheerio");
const vapor = require('vapor-text')
const imgbbUploader = require('imgbb-uploader');
const BrainlySearch = require('./lib/brainly')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
var timeStart = Date.now() / 1000 //BY TOBZ
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const ban = JSON.parse(fs.readFileSync('./src/ban.json'))
const limit = JSON.parse(fs.readFileSync('./src/limit.json'))
prefix = '#'
blocked = []

function waktu(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " Hari,":" Hari,") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " Jam,":" Jam,") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " Menit,":" Menit,") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " Detik,":" Detik") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function starts() {
	let client = new WAConnection()
	client.logger.level = 'warn'
	//client.logger.level = 'debug'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./rahasia.json') && client.loadAuthInfo('./rahasia.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})
    fs.writeFileSync('./rahasia.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	client.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})
	client.on("CB:Call", json => {
		let call;
		calling = JSON.parse(JSON.stringify(json))
		call = calling[1].from
		setTimeout(function(){
			client.sendMessage(call, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!.\nJika ingin membuka block harap chat Owner!', MessageType.text)
			.then(() => client.blockUser(call, "add"))
			}, 100);
		})

	client.on('chat-update', async (mek) => {
		try {
       	if (!mek.hasNewMessage) return
           mek = JSON.parse(JSON.stringify(mek)).messages[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'Your-Api-Key'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const arg = body.substring(body.indexOf(' ') + 1).split("|")
			const txt = body.slice(prefix.length + command.length + 1).trim()
			const isCmd = body.startsWith(prefix)
			


			mess = {
				wait: '⌛ Sedang di Prosess ⌛',
				success: '✔️ Berhasil ✔️',
				error: {
					stick: '❌ Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
					Iv: '❌ Link tidak valid ❌',
					n404: 'Error Tidak Di Ketahui!'
				},
				only: {
					replyB: '❌ Hanya Tag Pesan Bot ❌',
					group: '❌ Perintah ini hanya bisa di gunakan dalam group! ❌',
					ownerG: '❌ Perintah ini hanya bisa di gunakan oleh owner group! ❌',
					ownerB: '❌ Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
					admin: '❌ Perintah ini hanya bisa di gunakan oleh admin group! ❌',
					Badmin: '❌ Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6289636293927@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : "Tidak Ada Nama, Kasih Nama Woy"
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isBan = ban.includes(sender)
			const isAfk = db.fetch(`afk_${sender}.jawab`)
			const isDaftar = db.fetch(`daftar_${sender}`)
			const isRespon = db.fetch(`auto_respon_${budy}.jawab`)
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			const sendImage = (gambar, teks) => {
				client.sendMessage(from, {url: gambar}, image, {quoted: mek, caption: teks})
			}
			const sendAudio = (audionya, namefile, boleh) => {
				(boleh == null || boleh == undefined || boleh == false) ? client.sendMessage(from, {url: audionya}, audio, {mimetype: 'audio/mp4', filename: namefile}) : client.sendMessage(from, {url: audionya}, audio, {mimetype: 'audio/mp4', filename: namefile, quoted: mek, ptt: boleh})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
			console.log(`Id : ${from}`)
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (isBan && isCmd) return reply(`Maaf ${pushname} Anda Telah Di Banned`)
/*if (budy && !isCmd){
let bahasa;
if (sender.startsWith('628')){
bahasa = 'id';
} else {
bahasa = 'en';
}
anu = await fetchJson(`http://api.simsimi.com/request.p?key=ae752867-ab2f-4827-ab64-88aebed49a1c&lc=${bahasa}&text=${budy}`, {method: 'get'})
client.sendMessage(from, `${anu.response}\n\n~ BOT SIMI`, text, {quoted:mek})
}*/



        function isLimit(id){
                    let found = false;
                    for (let i of limit){
                        if(i.id === id){
                            let limits = i.limit;
                            if (limits >= 30) {
                                found = true;
                                return true;
                            }else{
                                limit
                                found = true;
                                return false;
                            }
                        }
                    }
                    if (found === false){
                        let obj = {id: `${id}`, limit:1};
                        limit.push(obj);
                        fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
                        return false;
                    }  
                }

        function limitMin(id, brp) {
                    var found = false;
                    Object.keys(limit).forEach((i) => {
                        if(limit[i].id == id){
                            found = i
                        }
                    })
                    if (found !== false) {
                        limit[found].limit -= brp;
                        fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
                    } else if (found === false){
                        let obj = {id: `${id}`, limit:-0};
                        limit.push(obj);
                        fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
                     }
                }

        function limitAdd(id, brp) {
                    var found = false;
                    Object.keys(limit).forEach((i) => {
                        if(limit[i].id == id){
                            found = i
                        }
                    })
                    if (found !== false) {
                        limit[found].limit += brp;
                        fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
                    } else if (found === false){
                        let obj = {id: `${id}`, limit:1};
                        limit.push(obj);
                        fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
                     }
                }
			

			if (body.length > 40000){
				if (isGroup){
					if (!isBotGroupAdmins) return client.groupLeave(from)
					client.groupRemove(from, sender)
					} else {
						client.blockUser (sender, "add")
						}
				}
			if (isCmd && isLimit(sender)) return reply('Limit Anda Sudah Habis')

			/*if (isAfk && !isCmd){
				reply(`Selamat Kembali ${pushname} Dari ${db.fetch(`afk_${sender}`)}`)
				db.del(`afk_${sender}`)
				}
			const all_afk = JSON.parse(JSON.stringify(db.fetchAll()))
			Object.keys(all_afk).forEach((i) => {
				if (all_afk[i].ID === `auto_respon_${body}`) {
					reply(all_afk[i])
				}
			})
*/

			switch(command) {
				case 'textpro':
					const all_textpro = JSON.parse(fs.readFileSync('./media/database/theme.json'))
					let number = arg[0]
					textpro(`https://textpro.me${all_textpro[arg[0]].url}`, [arg[1]]).then((url) => {
						sendImage(url, `${all_textpro[number].name}`)
					}).catch(err => {
						console.log('1' + err)
						textpro(`https://textpro.me${all_textpro[arg[0]].url}`, [arg[1], arg[2]]).then((url) => {
							sendImage(url, `${all_textpro[number].name}`)
						}).catch(err => {
							console.log('2' + err)
							reply(`Jika Error Ketik ${prefix}textpro ${number}|Okee |Gimana?\n\nKalo Masih Error Lapor Owner`)
							})
					})
					limitAdd(sender, 1)
					break
				case 'savesound':
					if (!isQuotedAudio) return reply('Reply Audionya')
					if (txt.length < 1) return reply('Masukan Nama File')
					const sound = isQuotedAudio ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					client.downloadAndSaveMediaMessage(sound, txt)
					break
				case 'unban_all':
					if (!isOwner) return reply(mess.only.ownerB)
					if (!isGroup) return reply(mess.only.group)
					for (let mem of groupMembers) {
						if (ownerNumber.includes(mem.jid)){
							console.log('Upss Owner')
						} else {
							ban.splice(mem.jid, 1)
							fs.writeFileSync('./src/ban.json', JSON.stringify(ban))
						}
					}
					reply("Udah Selesai")
					break
				case 'ban_all':
					if (!isOwner) return reply(mess.only.ownerB)
					if (!isGroup) return reply(mess.only.group)
					for (let mem of groupMembers) {
						if (ownerNumber.includes(mem.jid)){
							console.log('Upss Owner Tidak Bisa Di Ban')
						} else {
							ban.push(mem.jid)
							fs.writeFileSync('./src/ban.json', JSON.stringify(ban))
						}
					}
					reply("wkwkwk Di Ban All")
					break
				case 'ban':
					if (!isOwner) return reply(mess.only.ownerB)
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					for (let i = 0; i < mentioned.length; i++) {
						if (ban.includes(mentioned[i])) return reply(`${mentioned[i]} Sudah Di Banned`)
						if (ownerNumber.includes(mentioned[i])){
							reply('Owner Di Ban?Hem....')
						} else {
							ban.push(mentioned[i])
							fs.writeFileSync('./src/ban.json', JSON.stringify(ban))
						}
					}
					reply('Sukses Ban Member')
					break
				case 'unban':
					if (!isOwner) return reply(mess.only.ownerB)
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					for (let i = 0; i < mentioned.length; i++) {
						if (!ban.includes(mentioned[i])) return reply(`${mentioned[i]} Belum Di Ban Silakan Ban Terlebih Dahulu!D`)
						ban.splice(mentioned[i], 1)
						fs.writeFileSync('./src/ban.json', JSON.stringify(ban))
					}
					reply('Dah Selesai')
                    break
				case 'jadibot':
					let conn = new WAConnection()
					conn.on('qr', async qr => {
						let scan = await client.sendMessage(from, await qrcode.toDataURL(qr, { scale: 8 }),  image, {quoted: mek})
						})
						conn.on('open', () => {
							reply("Sukses Menjadi Bot")
							setTimeout(() => {
								console.log(scan.key)
								// client.deleteMessage(from, {id: scan.key, remoteJid: from, fromMe: true})
							}, 10000)
						})
						fs.existsSync(`./${sender}.json`) && conn.loadAuthInfo(`./${sender}.json`)
						fs.writeFileSync(`./${sender}.json`, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
					break
				case 'addstatus':
					if (isOwner) return reply(mess.only.owner)
					client.sendMessage('status@broadcast', `${txt}.`, extendedText)
					break
				case 'pinterest':
					const options = {
						url: `http://results.dogpile.com/serp?qc=images&q=${encodeURI(txt)}`,
						method: "GET",
						headers: {
							"Accept": "text/html",
							"User-Agent": "Chrome"
						}
					}
					request(options, function(error, response, responseBody) {
						if (error) return
						$ = cheerio.load(responseBody)
						const links = $(".image a.link")
						const cari = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"))
						if (!cari.length) return reply("Tidak Di Temukan")
						const hasil = cari[Math.floor(Math.random() * cari.length)]
						sendImage(hasil, `Hasil Pencarian ${args}`)
					})
					limitAdd(sender, 1)
					break
				case 'virlok':
					var virtek = fs.readFileSync(`./media/virtek/${Math.floor(Math.random() * 26)}.txt`);
					client.sendMessage(from, {degreesLatitude: 24.328354, degreesLongitude: 54.500201, caption: virtek}, liveLocation)
					break
				case 'groupwa':
					axios.get(`http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=${txt}&searchby=name`).then((response) => {
						const $ = cheerio.load(response.data)
						var d = '', c;
						$('.wa-chat-message A').each((i, e) => {
							d += $(e).attr('href') + "\n";
						})
						c = d.split("\n");
						var url = c[Math.floor(Math.random() * c.length)];
						reply(`Hasil Pencarian ${txt}\n\n${url}`)
					})
					limitAdd(sender, 1)
					break
				case 'ratelimittest':
					if (!isOwner) return reply(mess.only.ownerB)
					let i = 1;
						const start = Date.now();
						while (i <= 20) {
        				sendMess(from, `Testing my rates, item ${i} of 20`);
        				i++;
      				}
      				reply('last one...')
							const diff = Date.now() - start;
							reply(`Each message took ${diff / 21}ms to send`);
					break
				case 'test':
					client.sendMessage(from, {templateMessage: { fourRowTemplate: { content: {namespace: 'my-namespace', localizableParams: [ ], params: ['hello!']}, buttons: [ { index: 0, quickReplyButton: { displayText: { params: ['my name jeff'] }} }, {index: 1, quickReplyButton: {displayText: { params: ['my name NOT jeff'], }}}]}}},{}, MessageType.templateMessage)
					break
				case 'bug':
					if (isGroupAdmins || isOwner) {
						client.toggleDisappearingMessages(from, 0)
						} else {
					reply(mess.only.admin)
					}
					limitAdd(sender, 10)
					break
				case 'setname':
					client.updateProfileName(txt)
					reply(`Nama Berubah Menjadi ${txt}`)
					break
				case 'leaveall':
					if (!isOwner) return reply(mess.only.owner)
					for (const [key, value] of Object.entries(client.contacts)) {
						if(/[0-9]+-[0-9]+@g.us/.test(value.jid)){   // Checks if its a group jid using regex
							try{
								await client.groupLeave(value.jid);
									} catch (err) {
										console.log(err)
										}
									}
								}
					break
				case 'deleterespon':
					if (!db.fetch(`auto_respon_${args[0]}`)) return reply(`Maaf Tidak Dapat Menghapus Respon *${args[0]}* Karena Tidak Ada Di Auto Respon Bot!!!`)
					db.delete(`auto_respon_${args[0]}`)
					reply(`Sukses Menghapus ${args[0]} dari auto respon`)
					break
				case 'addrespon':
					if (arg.length < 2) return reply(`Contoh penggunaan : ${prefix}addrespon Hai|Hai Juga`)
					if (arg[0].startsWith(prefix)) return reply("Maaf Respon Tidak Boleh Menggunakan Awalan Prefix Bot!")
					db.set(`auto_respon_${arg[0]}`, { jawab: arg[1], pengirim: sender })
					reply(`Berhasil Menambahkan Auto Respon : ${arg[0]}\nDengan Jawaban : ${arg[1]}`)
					break
				case 'pitch':
					if (!isQuotedAudio) return reply('❌ reply sound nya ❌')
					pitch = isQuotedAudio ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					if (!Number(args[0])) return reply(`Contoh Penggunaan : ${prefix}pitch 4`)
					if (args[0] > 12) return reply("Max 12")
					const pitchsave = await client.downloadAndSaveMediaMessage(pitch, `./media/mp3/${txt}.mp3`)
					exec(`ffmpeg -i ${pitchsave} -filter_complex "asetrate=48000*2^(${args[0]}/12),atempo=1/2^(${args[0]}/12)" media/mp3/hasil_pitch${txt}.mp3 -y`, (err, stderr, stdout) => {
						if (err) reply(mess.error.n404)
						sendAudio(`media/mp3/hasil_pitch${txt}.mp3`, "mancap.mp3", true)
						})
					limitAdd(sender, 1)
					break
				case 'videotomp3':
					if (!isQuotedVideo || !mek.message.videoMessage) return reply('❌ reply videonya ❌')
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					media = await client.downloadAndSaveMediaMessage(encmedia, `./media/mp3/${getRandom()}`)
					ran = getRandom('')
					exec(`ffmpeg -i ${media} ./media/mp3/${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply(mess.error.n404)
						sendAudio(`media/mp3/${ran}.ffmpeg`, "oke.mp3", true)
					})
					limitAdd(sender, 1)
					break
				case 'tahta':
					if (tahta.length > 10) return reply("Max Kata Hanya 10!")
					exec(`convert -gravity Center -size 1280x1280 xc:black -font ./media/font/fonttahtah.ttf -pointsize 200 -tile './media/png/IMG-20210122-WA0244.jpg' -annotate +25+25 "HARTA\nTAHTAH\n${txt.toUpperCase()}" -wave 10x160 -crop 1200x1200+0+0 ./media/png/harta_${txt}.jpg`, (err, stderr, stdout) => {
						if (err) return console.log(err)
						sendImage(`media/png/harta_${txt}.jpg`, `HARTA\nTAHTAH\n${tahta.toUpperCase()}`)
						setTimeout(function(){
							fs.unlinkSync(`./media/png/harta_${txt}.jpg`)
							}, 3009);
						})
						limitAdd(sender, 1)
					break
				case 'owner':
					client.sendMessage(from, {displayname: 'Owner Ku', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:~;.;Owner;;\nFN:Owner ~\nORG:Owner~\nTITLE: Aku Tidak Tau\nitem1.TEL;waid=6289636293927:+62 896-3629-3927\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-DESCRIPTION:Jika Perlu\nX-WA-BIZ-NAME: Owner ~\nEND:VCARD'}, contact)
					break
				case 'wame':
					reply(`wa.me/${sender.split('@')[0]}\nAtau\napi.whatsapp.com/send?phone=${sender.split('@')[0]}`)
					break
				case 'tagme':
					mentions(`@${sender.split('@')[0]}`, [sender], true)
					break
				case 'vapor':
					if (args.length < 1) return reply("text nya mana ?")
					reply(vapor(txt))
					break
				case 'zalgo':
					if (args.length < 1) return reply("text nya mana ?")
					reply(zalgo(txt))
					break
				case 'brainly':
					let jum = Number(arg[1]) || 2
					await BrainlySearch(arg[0],Number(jum), function(res){
						res.forEach(x=>{
							if (x.jawaban.fotoJawaban.length == 0) {
								reply(`➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* : ${x.jawaban.judulJawaban}\n`)
								} else {
									reply(`➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* 〙: ${x.jawaban.judulJawaban}\n\n➸ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`)
									}
								})
							})
						limitAdd(sender, 1)
					break
				case 'reminder':
					try{
					const reminder = Date.now() + ms(arg[1])
					const intervRemind = setInterval(async () => {
						if (Date.now() >= reminder){
							sendMess(from, arg[0])
							clearInterval(intervRemind)
							}
						})
						} catch (e){
							reply(`Contoh Penggunaan: ${prefix}{command} Pesan Saya Di Sini|3000`)
						}
					limitAdd(sender, 1)
					break
				case 'return':
					return client.sendMessage(from, JSON.stringify(eval(args.join(' ')), null, '\n'), text, { quoted: mek })
    				break
				case 'eval':
				case 'run':
					const q = args.join(' ').toString('utf8')
					console.log(`${pushname} Mencoba Executed Command ${command}`)
					if (!isOwner) return reply(mess.only.ownerB)
					if (!q) return reply('Harap masukkan code JavaScript!')
					try {
						let evaled = await eval(q)
						if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
						} catch (e) {
							reply(e)
							}
					break
				case 'stogif':
					if (!isQuotedSticker) return reply("reply stickernya")
					ran = getRandom('.webp')
					ram = getRandom('.gif')
					rad = getRandom('.mp4')
					const stogif = isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					const togif = await client.downloadAndSaveMediaMessage(stogif, `./media/temp/${ran}`)
					exec(`convert -delay 10 -dispose none ${stogif} -coalesce -loop 0 -layers optimize ./media/temp/${ram} -y;ffmpeg -stream_loop 2 -i ./media/temp/${ram} -y;ffmpeg -i ./media/temp/${ram} -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./media/temp/${rad} -y`, (err) => {
						if (err) return reply(mess.error.n404)
						client.sendMessage(from, { url: `media/temp/${rad}`}, video, { mimetype: Mimetype.gif, caption: `Dah Jadi Nih ${pushname}` })
						})
					limitAdd(sender, 1)
					break
				case 'exec':
					if (!isOwner) return reply(mess.only.ownerB)
					exec(txt, (err, stderr, stdout) => {
						if (err) return reply(err)
						reply(stdout)
						reply(stderr)
						})
					break
				case 'nyimak':
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply(mess.only.replyB)
					if (!mek.message.extendedTextMessage.contextInfo.participant === client.user.jid) return reply(mess.only.replyB)
					const nyimak = await client.messageInfo(from, mek.message.extendedTextMessage.contextInfo.stanzaId)
					members = []
					teks = ''
					teks += '\n\n'
					no = 0
					for (let nyimaknya of nyimak.read) {
						no += 1
						teks += `[${no.toString()}] @${nyimaknya.jid}\n`
						members.push(nyimaknya.jid)
					}
					mentions(teks, members, true)
					limitAdd(sender, 1)
					break
				case 'giflimit':
					const giflimit = Number(arg[1])
					if (!giflimit) return reply(`Contoh Penggunaan: ${prefix}${command} @tagmember|5`)
					let boleh;
					for (let i = 0; i < limit.length; i++) {
						if (sender === limit[i].id){
							if (limit[i].limit <= 30){
								boleh += true
								if (mek.message.extendedTextMessage.contextInfo.participant){
									limitMin(mek.message.extendedTextMessage.contextInfo.participant, giflimit)
									limitAdd(sender, giflimit)
								} else if (mek.message.extendedTextMessage.contextInfo.mentionedJid){
									mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
									limitMin(mentioned[0], giflimit)
									limitAdd(sender, giflimit)
								}
							} else {
								boleh += false
								}
						}
					}
					if (boleh) return reply('Sukses Menambah Limit')
					break
				case 'delete':
					try {
						if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply(mess.only.replyB)
						if (isGroupAdmins || isOwner && mek.message.extendedTextMessage.contextInfo.participant === client.user.jid){
							client.deleteMessage(from, {id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true})
							} else {
								reply(mess.only.admin)
								}
							} catch (e) {
								reply(mess.only.replyB)
							}
					limitAdd(sender, 2)
					break
				/*case 'afk':
					if (!isGroup) return reply(mess.only.group)
					if (isAfk) return reply(mess.error.n404)
					const afk = body.slice(5) ? body.slice(5) : "Tidak Tau"
					db.set(`afk_${sender}`, afk)
					reply(`${sender} Sedang AFK\nAlasan : ${afk}`)
					break*/
				case 'help':
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'info':
					me = client.user
					const tms = (Date.now() / 1000 + 1423) - (timeStart);
					teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${waktu(tms)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist':
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja mas')
					}
					limitAdd(sender, 1)
					break
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							limitAdd(sender, 1)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							limitAdd(sender, 1)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							rane = getRandom('.exif')
							ranpp = getRandom('.webp')
							exif(groupName, botNumber, `./media/temp/${rane}`).then(res => {
								exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw} && webpmux -set exif ${rane} ${ranw} -o ${ranpp}`, (err) => {
									fs.unlinkSync(ranp)
									fs.unlinkSync(ranw)
									if (err) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ranpp), sticker, {quoted: mek})
								})
								limitAdd(sender, 1)
							}).catch(err => {
								reply(err)
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
				case 'gtts':
					if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Textnya mana om', text, {quoted: mek})
					dtt = txt
					ranm = getRandom('.mp3')
					dtt.length > 600
					? reply('Textnya kebanyakan om')
					: gtts.save(ranm, dtt, function() {
						client.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
						fs.unlinkSync(ranm)
					})
					limitAdd(sender, 1)
					break
				case 'meme':
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					limitAdd(sender, 1)
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break/*
				case 'nsfwloli':
					if (!isNsfw) return reply('❌ *FALSE* ❌')
					loli.getNSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					})
					break*/
				case 'hilih':
					if (args.length < 1) return reply('Teksnya mana um?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${txt}`, {method: 'get'})
					reply(anu.result)
					break
				case 'yt2mp3':
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					const stream = ytdl(args[0], {filter:"audioonly", quality:"highestaudio"})
					client.sendMessage(from, stream, audio, {mimetype: 'audio/mp4', filename: `memek.mp3`, quoted: mek})
					break
				case 'ytsearch':
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbar.tech/api/ytsearch?q=${txt}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'tiktok':
					if (args.length < 1) return reply('Urlnya mana um?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana um?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Kemungkinan username tidak valid')
					}
					break
				case 'nulis':
				case 'tulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan?')
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/nulis?text=${txt}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa um?')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana um?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					anu = await fetchJson(`https://mhankbarbar.tech/api/text2image?text=${txt}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						client.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'all_limit':
					if (!isOwner) return reply(mess.only.owner)
					const all_limit = JSON.parse(fs.readFileSync('./src/limit.json'))
					all_limit.sort((a, b) => (a.limit < b.limit) ? 1 : -1)
					members_id = []
					teks = 'Top 5 Teratas Menggunakan Limit\n'
					teks += '\n\n'
					for (let i = 0; i < 5; i++) {
						teks += `*--------------------*\nLimit ~> ${all_limit[i].limit}\n@${all_limit[i].id.split('@')[0]}\n`
						members_id.push(all_limit[i].id)
					}
					mentions(teks, members_id, true)
					break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? txt : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					limitAdd(sender, 1)
					break
			case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins || !isOwner) return reply(mess.only.admin)
					members_id = []
					for (let mem of groupMembers) {
						members_id.push(mem.jid)
					}
					client.sendMessage(from, txt, extendedText, {contextInfo: {"mentionedJid": members_id}})
					limitAdd(sender, 1)
					break
            case 'tagall2':
            		if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? txt : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					limitAdd(sender, 1)
					break
              case 'tagall3':
            		if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? txt : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					client.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					limitAdd(sender, 1)
					break
				case 'clearall':
					if (!isOwner) return reply('Kamu siapa?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
				case 'bc':
					if (!isOwner) return reply('Kamu siapa?')
					if (args.length < 1) return reply('Owner Ga Boleh Gituh')
					anu = await client.chats.all()
					db.set('bc', txt);
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						no = 0
						for (let _ of anu) {
							let angka = Math.floor(Math.random() * 9000)
							if (angka < 6000){
								angka = 6000
								}
							no += 1
							setTimeout(function(){
							client.sendMessage(_.jid, buff, image, {caption: db.fetch('bc')})
							}, angka * (no + 1));
						}
						reply('Suksess broadcast')
					} else {
						no = 0
						for (let _ of anu) {
							let angka = Math.floor(Math.random() * 9000)
							if (angka < 6000){
								angka = 6000
								}
							no += 1
							setTimeout(function(){
							sendMess(_.jid, db.fetch('bc'))
							}, angka * (no + 1));
						}
						reply('Suksess broadcast')
					}
					break
			   case 'trik':
					if (!isOwner) return reply('Kamu siapa?')
					const trik = JSON.parse(fs.readFileSync('./user.json'))
					for (let i = 0; i < trik.length; i++) {
						let angka = Math.floor(Math.random() * 30000)
							if (angka < 6000){
								angka = 6000
								}
						setTimeout(function(){
							sendMess(trik[i].id, db.fetch('bc'))
							}, angka * (i + 1));
						}
					break
               case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Promote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Promote @${mentioned[0].split('@')[0]} Sebagai Admin Group!`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Demote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Demote @${mentioned[0].split('@')[0]} Menjadi Member Group!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
				case 'edotensei':
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
						setTimeout(function(){
						client.groupRemove(from, mentioned)
						}, 300);
						setTimeout(function(){
							client.groupAdd(from, [mentioned])
							}, 6000 * (0 + 1));
							limitAdd(sender, 5)
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Perintah di terima, mengeluarkan :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
                case 'linkgroup':
                    if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    	linkgc = await client.groupInviteCode(from)
                        reply(linkgc)
                    break
               case 'leave':
                	if (!isGroup) return reply(mess.only.group)
                    if (isGroupAdmins || isOwner) {
                   	client.groupLeave(from)
                       } else {
                       	reply(mess.only.admin)
                      }
                 	break
				case 'toimg':
					if (!isQuotedSticker) return reply('❌ reply stickernya um ❌')
					reply(mess.wait)
					const toimg = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(toimg)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					limitAdd(sender, 1)
					break
				case 'simi':
					if (args.length < 1) return reply('Textnya mana um?')
					anu = await simih(txt)
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('Mode simi sudah aktif')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukses mengaktifkan mode simi di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukes menonaktifkan mode simi di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Udah aktif um')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses mengaktifkan fitur welcome di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses menonaktifkan fitur welcome di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
                    break
                 case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply(`Pilih 0 Untuk Mematikan Atau Pilih 1 Untuk Menghidupkan\n\nContoh : ${prefix}nsfw 1`)
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('Udah aktif um')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('Sukses mengaktifkan fitur welcome di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('Sukses menonaktifkan fitur welcome di group ini ✔️')
					} else {
						reply(`Pilih 0 Untuk Mematikan Atau Pilih 1 Untuk Menghidupkan\n\nContoh : ${prefix}nsfw 1`)
					}
                    break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Gagal om')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Foto aja mas')
					}
					break
				default:
					if (body){
						reply(`Maaf ${pushname} command ${prefix}${command} Tidak Di Temukan di ${prefix}menu`)
						}
					/*if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						return console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}*/
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()