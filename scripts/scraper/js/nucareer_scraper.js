const request = require('request')
const fs = require('fs')
const xray = require('x-ray')();
const tabletojson = require('tabletojson');
const cliProgress = require('cli-progress');

/**
 * This is intentionally not ASYNC
 */

class NUCareerScraper {
    constructor() {
        this.postingFrom = 1901000
        this.postingTo = 1922000
        this.postings = []

        this.progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    }

    parseCookies() {
        const rawCookies = JSON.parse(fs.readFileSync('./private_cookies.json'))
        let cookies = ""

        rawCookies.forEach(element => cookies += element['name'] + "=" + element['value'] + ";");

        return cookies
    }

    requestPostingOffer(postingId) {
        return new Promise((resolve, reject) => {
            request({
                url: "https://nucareers.northeastern.edu/myAccount/co-op/jobs.htm",
                method: 'POST',
                headers: { 'Cookie': this.parseCookies() },
                form: { action: '_-_-31NI8mbvq-dP-gTmjVErKfmH19kP95a7iFGSdi4tdGTbvo3Ddm6WrIL4aMY0ms3uZxcLq4prGJPBtGm3-Y_H4nTQk_FxURbWLej6V5TIKPwS_N_sKn-QihpuXbfp5276e3EJR4212f6qIgFCJIGzfxJ0ieRxbTV7vtp5V8kZIlg', postingId: postingId }
            }, (error, response, body) => {
                if (!response || response.statusCode != 200 || error || !body)
                    return reject(error)

                xray(body, ['table@html'])((conversionError, tableHtmlList) => {
                    if (conversionError)
                        return reject(false);
            
                    const jobInfo = tableHtmlList.map((table) => tabletojson.convert('<table>' + table + '</table>')[0]);
                    if (jobInfo.length === 0)
                        return reject(false);

                    // here we switch the objects into arrays
                    let cleanedInfo = []
                    jobInfo.forEach((element) => element.forEach((info) => cleanedInfo.push({ [info["0"]]: info["1"]})))
                    cleanedInfo.push({ postingId: postingId })

                    resolve(cleanedInfo)
                });
            });
        })
    }

    async fetchPosting(postingId) {
        return new Promise((resolve, reject) => {
            this.requestPostingOffer(postingId)
            .then((postingInfo) => {
                this.postings.push(postingInfo)
                resolve(true)
            })
            .catch(() => {
                resolve(true)
            })
        })
    }

    async startFetch() {
        this.postings = []

        console.log('Starting NEUCareer scraper...')
        const total = this.postingTo - this.postingFrom
        const startTime = new Date()

        this.progressBar.start(total, 0)

        for (let i = 0; i < total; i++) {
            try {
                await this.fetchPosting(this.postingFrom + i)
            } catch(e) {}

            this.progressBar.increment()
        }

        fs.writeFileSync('results.json', JSON.stringify(this.postings))
        this.progressBar.stop()
        console.log(`\nFinished! It tooks ${Math.floor((new Date().getTime() - startTime.getTime())/1000)}s for ${this.postings.length} entries`)
    }
}

module.exports = NUCareerScraper