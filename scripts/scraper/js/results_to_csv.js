const fs = require('fs')
const { Parser } = require('json2csv');

class CSVParser {
    constructor() {}

    parse() {
        const startTime = new Date().getTime()
        const rawResults = JSON.parse(fs.readFileSync('results.json'))
        let fields = []
        let fixedResults = []

        rawResults[0].forEach((e) => {
            for (const key in e) fields.push(key);
        })

        rawResults.forEach((e) => {
            let toPut = {}
            e.forEach((c) => {
                for (const key in c) toPut[key] = c[key]
            })
            fixedResults.push(toPut)
        })

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(fixedResults)

        fs.writeFileSync('results.csv', csv)

        console.log(`Finished in ${Math.floor((new Date().getTime() - startTime) / 1000)}s! See results.csv`)
    }
}

module.exports = CSVParser