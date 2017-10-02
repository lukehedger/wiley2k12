const fs = require('fs-extra')
const path = require('path')
const schedule = require('node-schedule')
const Twit = require('twit')
const winston = require('winston')

const config = require('./env')
const nidforspid = require('./nidforspid')
const randomArrayItem = require('./randomArrayItem')
const randomNumber = require('./randomNumber')

const twit = new Twit(config)

const isDevelopment = process.env.NODE_ENV === 'development'

const MAX_TWEETS = 4

const SCHEDULE = [
  '0 15 8 * * *',
  '0 4 12 * * *',
  '0 57 16 * * *',
  '0 23 21 * * *',
]

winston.configure({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'wiley2k12bot.log' }),
  ]
})

const generateTweet = async () => {
  try {
    const rawWords = await fs.readFile(path.resolve(__dirname, './words.json'))
    const words = JSON.parse(rawWords)

    const templates = Object.keys(words)

    let i = 0

    while (i < randomNumber(MAX_TWEETS)) {
      let template = randomArrayItem(templates)
      let status = nidforspid(words[template])

      winston.info(`🔫  ${status}`)

      if (!isDevelopment) await postTweet(status)

      i++
    }
  } catch(e) {
    winston.error(`💥  ${e}`)
  }
}

const postTweet = status => new Promise((resolve, reject) =>
  twit.post('statuses/update', { status }, (err, data) => {
    if (err) return reject(err)

    return resolve(data)
  })
)

const scheduleBot = () => {
  winston.info(`⏰  SCHEDULE : ${SCHEDULE}\n`)
  return SCHEDULE.map(time =>
    schedule.scheduleJob(time, () => generateTweet())
  )
}

const innit = () => {
  winston.info('🤖  W I L E Y 2 K 1 2 B O T\n')
  winston.info(`🛠  DEV_MODE = ${isDevelopment ? 'ON' : 'OFF'}\n`)

  return isDevelopment ? generateTweet() : scheduleBot()
}

innit()
