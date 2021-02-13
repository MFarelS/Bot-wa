const fs = require('fs')
const limit = JSON.parse(fs.readFileSync('./src/limit.json'))

module.exports = limitAdd = (limit) => {
	var found = false;
	Object.keys(limit).forEach((i) => {
		if(limit[i].id == limit){
			found = i
			}
		})
		if (found !== false) {
			limit[found].limit += 1;
			fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
		}
	}

module.exports = isLimit = (id) => {
	for (let i of limit){
		if(i.id === id){
			let limits = i.limit;
			if (limits >= limitCount) {
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
				let obj = {id: `${id}`, limit:1}
				limit.push(obj);
				fs.writeFileSync('./src/limit.json',JSON.stringify(limit));
				return false;
			}
		}
	