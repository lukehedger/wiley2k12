const fs = require('fs-extra')
const path = require('path')
const schedule = require('node-schedule')
const Twit = require('twit')

const config = require('./env')
const nidforspid = require('./nidforspid')
const randomArrayItem = require('./randomArrayItem')

const twit = new Twit(config)

const generateTweet = async () => {
  try {
    const rawWords = await fs.readFile(path.resolve(__dirname, './words.json'))
    const words = JSON.parse(rawWords)

    const templates = Object.keys(words)
    const template = randomArrayItem(templates)

    const status = nidforspid(words[template])

    await postTweet(status)
  } catch(e) {
    throw new Error(e)
  }
}

const postTweet = status => new Promise((resolve, reject) =>
  twit.post('statuses/update', { status }, (err, data) => {
    if (err) return reject(err)

    return resolve(data)
  })
)

const innit = () => {
  // TODO - schedule:
  // 08:15 | 12:04 | 16:57 | 21:23
  // 1 || 2 || 3 tweets at a time

  return generateTweet()
}

innit()
