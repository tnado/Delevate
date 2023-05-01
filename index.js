require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const readline = require('readline');

const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const twitterClient = new TwitterApi({
  appKey: consumerKey,
  appSecret: consumerSecret,
  accessToken: accessToken,
  accessSecret: accessTokenSecret,
});

const trackedRetweets = [];

async function main() {
  const tweetId = process.argv[2];

  if (!tweetId) {
    console.log('Please provide a tweet ID as the first argument.');
    return;
  }

  console.log(`Tracking retweets for tweet ID: ${tweetId}`);

  const stream = await twitterClient.v2.streamFiltered({
    expansions: 'author_id',
    rules: [{ value: `retweets_of:${tweetId}` }],
  });

  stream.autoReconnect = true;

  stream.on('data', (event) => {
    const retweetedTweet = event.data;
    if (retweetedTweet) {
      console.log(`Retweet by: ${event.includes.users[0].username}`);
      trackedRetweets.push(event.includes.users[0].username);
    }
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'stop') {
      rl.close();
      stream.close();

      const winner = trackedRetweets[Math.floor(Math.random() * trackedRetweets.length)];
      console.log(`The winner is: ${winner}`);
    }
  });
}

main().catch(console.error);
