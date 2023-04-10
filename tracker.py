import os
import random
import tweepy
import threading

from dotenv import load_dotenv
from tweepy import Listener, Stream

load_dotenv()

auth = tweepy.OAuthHandler(
    os.environ["TWITTER_CONSUMER_KEY"],
    os.environ["TWITTER_CONSUMER_SECRET"],
)
auth.set_access_token(
    os.environ["TWITTER_ACCESS_TOKEN"],
    os.environ["TWITTER_ACCESS_TOKEN_SECRET"],
)

api = tweepy.API(auth)

retweeters = []


class MyStreamListener(Listener):
    def __init__(self, tweet_id):
        self.tweet_id = tweet_id
        super(MyStreamListener, self).__init__()

    def on_status(self, status):
        if (
            hasattr(status, "retweeted_status")
            and status.retweeted_status.id_str == self.tweet_id
        ):
            print(f"Retweet by: {status.user.screen_name}")
            retweeters.append(status.user.screen_name)

    def on_error(self, status_code):
        print(f"Error: {status_code}")
        return False


def pick_winner():
    winner = random.choice(retweeters)
    print("The winner is:", winner)


def track_retweets(tweet_id):
    tweet = api.get_status(tweet_id)
    user_id = tweet.user.id_str

    stream_listener = MyStreamListener(tweet_id)
    stream = Stream(auth=api.auth, listener=stream_listener)
    stream.filter(follow=[user_id], is_async=True)

    return stream


if __name__ == "__main__":
    tweet_id = input("Enter the tweet ID to track: ")
    print(f"Tracking retweets for tweet ID: {tweet_id}")

    stream = track_retweets(tweet_id)

    while True:
        command = (
            input("Type 'stop' to stop tracking and pick a winner: ").strip().lower()
        )
        if command == "stop":
            stream.disconnect()
            print("Retweeters:", retweeters)
            pick_winner()
            break
