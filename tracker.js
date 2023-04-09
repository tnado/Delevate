require("dotenv").config();
const Twit = require("twit");
const readline = require("readline");

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let retweeters = [];
let stream;

function pickWinner() {
  const winnerIndex = Math.floor(Math.random() * retweeters.length);
  const winner = retweeters[winnerIndex];
  console.log("The winner is:", winner);
}

function trackRetweets(tweetId) {
  T.get("statuses/show/:id", { id: tweetId }, (err, data, response) => {
    if (err) {
      console.error("Error fetching tweet:", err);
      return;
    }

    const userId = data.user.id_str;

    stream = T.stream("statuses/filter", { follow: userId });

    stream.on("tweet", (tweet) => {
      if (
        tweet.retweeted_status &&
        tweet.retweeted_status.id_str === tweetId
      ) {
        console.log(`Retweet by: ${tweet.user.screen_name}`);
        retweeters.push(tweet.user.screen_name);
      }
    });

    stream.on("error", (error) => {
      console.error("Error:", error);
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the tweet ID to track: ", (tweetId) => {
  console.log(`Tracking retweets for tweet ID: ${tweetId}`);
  trackRetweets(tweetId);

  rl.on("line", (input) => {
    if (input.trim().toLowerCase() === "stop") {
      console.log("Stopping tracking and picking a winner...");
      stream.stop();
      console.log("Retweeters:", retweeters);
      pickWinner();
      rl.close();
    }
  });
});
