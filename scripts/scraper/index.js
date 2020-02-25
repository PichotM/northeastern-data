const readline = require("readline");
const { spawn } = require('child_process');

const CSVParser = require('./js/results_to_csv')
const NUCareerScraper = require('./js/nucareer_scraper')

console.log("Welcome in NEUScraper 1.0")
console.log("--------------------------")
console.log("\x1b[37mRefresh cookies: \x1b[33mcookies")
console.log("\x1b[37mGenerate json data: \x1b[33mscraper")
console.log("\x1b[37mGenerate csv data from json: \x1b[33mcsv")
console.log("\x1b[37m--------------------------")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    "cookies": function() {
        console.log("I believe I started the python script, wait an interact with the UI.")
        spawn('python', ['get_cookies.py'])
        askAction()
    },
    "scraper": async function() {
        const scraper = new NUCareerScraper()
        await scraper.startFetch()
        askAction()
    },
    "csv": function() {
        const csvParser = new CSVParser()
        csvParser.parse()
        askAction()
    },
}

function askAction() {
    rl.question("\x1b[32mCommand: \x1b[37m", function(command) {
        if (!commands[command]) {
            console.log("\x1b[31mSorry, what do you mean?\x1b[34m")
            return askAction()
        }

        commands[command]()
    });
}

rl.on("close", function() {
    console.log("\nBYE BYE !!!\x1b[37m");
    process.exit(0);
});

askAction()