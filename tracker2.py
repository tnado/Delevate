import os
import random
import tweepy
from dotenv import load_dotenv

load_dotenv()

auth = tweepy.OAuthHandler(
    os.getenv("TWITTER_CONSUMER_KEY"), os.getenv("TWITTER_CONSUMER_SECRET")
)
auth.set_access_token(
    os.getenv("TWITTER_ACCESS_TOKEN"), os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
)

api = tweepy.API(auth)


class RetweetTracker(tweepy.Stream):
    def __init__(self, tweet_id):
        super().__init__(auth, self)
        self.tweet_id = tweet_id
        self.retweeters = []

    def on_status(self, status):
        if (
            hasattr(status, "retweeted_status")
            and status.retweeted_status.id == self.tweet_id
        ):
            print(f"Retweet by: {status.user.screen_name}")
            self.retweeters.append(status.user.screen_name)

    def on_error(self, status_code):
        print(f"Error: {status_code}")

    def pick_winner(self):
        winner = random.choice(self.retweeters)
        print("The winner is:", winner)


if __name__ == "__main__":
    tweet_id = int(input("Enter the tweet ID to track: "))
    print(f"Tracking retweets for tweet ID: {tweet_id}")

    tracker = RetweetTracker(tweet_id)
    tracker.filter(track=[f"retweet {tweet_id}"], is_async=True)

    while True:
        command = input(
            "Type 'stop' and press Enter to stop tracking and pick a winner: "
        )
        if command.strip().lower() == "stop":
            break

    tracker.disconnect()
    print("Retweeters:", tracker.retweeters)
    tracker.pick_winner()
