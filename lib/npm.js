const fetch = require('node-fetch')

const npm = (query) => new Promise(async (resolve, reject) => {
		try {
			anu = await fetch(`https://api.npms.io/v2/search?q=${query}`).then(res => res.json())
			if (anu.results.length < 1) return reject('❌ Package tidak di temukan ❌')
			pkg = anu.results[0].package
			return resolve({
				name: pkg.name,
				thumb: 'https://images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png',
				link: pkg.links.npm,
				desc: pkg.description,
				author: pkg.author ? pkg.author.name : 'None',
				version: pkg.version,
				repo: pkg.links.repository ? pkg.links.repository : 'None',
				maintainers: pkg.maintainers ? pkg.maintainers.map(x => x.username).join(', ') : 'None',
				keywords: pkg.keywords ? pkg.keywords.join(', ') : 'None'
				})
		} catch (e) {
			console.log(e)
			reject('❌ Package tidak di temukan ❌')
		}
	})
module.exports = npm;