const fetch = require('node-fetch')
const imgbb = require('imgbb-uploader')
const axios = require('axios')
const request = require('request')
const cheerio = require('cheerio')
const cfonts = require('cfonts')
const spin = require('spinnies')
const Crypto = require('crypto')
const imageToBase64 = require('image-to-base64')
const ohh = ['siregar2k99HHftel','SinchanBOT','Dim4z05']
const vkey = ohh[Math.floor(Math.random() * ohh.length)]

const imgbase64 = async (patth) => {
imageToBase64(patth)
    .then(
        (response) => {
            return Buffer.from(response, 'base64');
        }
    )
    .catch(
        (error) => {
            console.log(error);
        }
    )
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jadwalTv = async (query) => {
    hasiltv = ''
request(`https://www.jadwaltv.net/channel/${query}`, function(err, resp, body){
                          $ = cheerio.load(body);
                              hasltv = ''
                              hasiltv += hasltv
                              $('div > div > table').each(function(t, link){
                              const jadwal = $(link).text()
                              hasltv += jadwal
                              })
                          })
    switch(query) {
        case 'antv':
            return `\t\t[ ANTV ]\n${hasiltv}`
            break
        case 'gtv':
            return `\t\t[ GTV ]\n${hasiltv}`
            break
        case 'indosiar':
            return `\t\t[ INDOSIAR ]\n${hasiltv}`
            break
        case 'inewstv':
            return `\t\t[ iNewsTV ]\n${hasiltv}`
            break
        case 'kompastv':
            return `\t\t[ KompasTV ]\n${hasiltv}`
            break
        case 'mnctv':
            return `\t\t[ MNCTV ]\n${hasiltv}`
            break
        case 'metrotv':
            return `\t\t[ MetroTV ]\n${hasiltv}`
            break
        case 'nettv':
            return `\t\t[ NetTV ]\n${hasiltv}`
            break
        case 'rcti':
            return `\t\t[ RCTI ]\n${hasiltv}`
            break
        case 'sctv':
            return `\t\t[ SCTV ]\n${hasiltv}`
            break
        case 'rtv':
            return `\t\t[ RTV ]\n${hasiltv}`
            break
        case 'trans7':
            return `\t\t[ Trans7 ]\n${hasiltv}`
            break
        case 'transtv':
            return `\t\t[ TransTV ]\n${hasiltv}`
            break
        default:
            return 'Daftar channel: \n1. ANTV\n2. GTV\n3. Indosiar\n4. iNewsTV\n5. KompasTV\n6. MNCTV\n7. METROTV\n8. NETTV\n9. RCTI\n10. SCTV\n11. RTV\n12. Trans7\n13. TransTV\n14. TVONE\n15. TVRI'
            break
    }
}


const wait = async (media) => new Promise(async (resolve, reject) => {
    const attachmentData = `data:image/jpeg;base64,${media.toString('base64')}`
    const response = await fetch("https://trace.moe/api/search",{method: "POST",body: JSON.stringify({ image: attachmentData }),headers: { "Content-Type": "application/json" }});
    if (!response.ok) reject(`Gambar tidak ditemukan!`);
    const result = await response.json()
    try {
    	const { is_adult, title, title_chinese, title_romaji, title_english, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
    	let belief = () => similarity < 0.89 ? "Saya memiliki keyakinan rendah dalam hal ini : " : ""
    	let ecch = () => is_adult ? "Iya" : "Tidak"
    	resolve({video: await getBuffer(`https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`), teks: `${belief()}
➣ Judul Jepang : *${title}*
➣ Ejaan Judul : *${title_romaji}*
➣ Judul Inggris : *${title_english}*
➣ Episode : *${episode}*
➣ Season  : *${season}*
➣ Ecchi : *${ecch()}*`});
	} catch (e) {
		console.log(e)
		reject(`Saya tidak tau ini anime apa`)
	}
})

const uploadImage = async (buffData) => new Promise(async (resolve, reject) => {
            const imageData = `data:image/jpeg;base64,${buffData.toString('base64')}`
            const uploadimg = await fetch("https://telegra.ph/upload",{method: "POST",body: JSON.stringify({ image: imageData }),headers: { "Content-Type": "application/json" }});
            if (uploadimg.error) return reject(uploadimg.error);
            const upload_image = await uploadimg.json()
            try {
            	resolve({teks: `https://telegra.ph${upload_image[0].src}`})
                } catch (e) {
					reject(e)
					}
        })


const shortener = (url) => new Promise((resolve, reject) => {
    fetchText(`https://tinyurl.com/api-create.php?url=${url}`)
        .then((text) => resolve(text))
        .catch((err) => reject(err))
})

const simih = async (text) => {
	try {
		const sami = await fetch(`https://secureapp.simsimi.com/v1/simsimi/talkset?uid=297971048&av=6.9.3.4&lc=id&cc=ID&tz=Asia%2FJakarta&os=a&ak=quS%2FxiW%2Bb8ys5agzpljUdoPdLH8%3D&message_sentence=${text}&normalProb=8&isFilter=1&talkCnt=1&talkCntTotal=1&reqFilter=1&session=nSt8PSSmKRbcR7quUkfhXYpmDYgErtBefVbkkri9CrGSVjm4Cj2e2zBFjvdxSijp56WjyK6g2EWTj3KxKz65DL22&triggerKeywords=%5B%5D`, {method: 'GET'})
		const res = await sami.json()
		return res.simsimi_talk_set.answers[0].sentence
	} catch {
		return 'Simi ga tau kak'
	}
}

const h2k = (number) => {
    var SI_POSTFIXES = ["", " K", " M", " G", " T", " P", " E"]
    var tier = Math.log10(Math.abs(number)) / 3 | 0
    if(tier == 0) return number
    var postfix = SI_POSTFIXES[tier]
    var scale = Math.pow(10, tier * 3)
    var scaled = number / scale
    var formatted = scaled.toFixed(1) + ''
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2)
    return formatted + postfix
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

const randomBytes = (length) => {
    return Crypto.randomBytes(length)
}

const generateMessageID = () => {
    return randomBytes(10).toString('hex').toUpperCase()
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

const spinner = { 
  "interval": 120,
  "frames": [
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛"
  ]}

let globalSpinner;


const getGlobalSpinner = (disableSpins = false) => {
  if(!globalSpinner) globalSpinner = new spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins});
  return globalSpinner;
}

spins = getGlobalSpinner(false)

const start = (id, text) => {
	spins.add(id, {text: text})
	}
	
const info = (id, text) => {
	spins.update(id, {text: text})
}
const success = (id, text) => {
	spins.succeed(id, {text: text})

	}

const close = (id, text) => {
	spins.fail(id, {text: text})
}

const banner = cfonts.render(('ANGGA'), {
    font: '3d',
    color: 'candy',
    align: 'center',
    gradient: ["cyan","yellow"],
    lineHeight: 1
  });


module.exports = { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, start, info, success, banner, close, shortener, imgbase64, uploadImage }
