"""Command line interface for the EchoBot."""

import os

from .echo_bot import EchoBot


def load_env(path: str = ".env") -> None:
    """Load environment variables from a .env file if it exists."""
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                os.environ.setdefault(key, value)
    except FileNotFoundError:
        pass


def main() -> None:
    """Run a simple interaction loop with the EchoBot."""
    load_env()
    token = os.environ.get("BOT_TOKEN")
    bot = EchoBot(token=token)
    print(bot.greet())
    while True:
        try:
            user_input = input("Enter a message (or 'quit' to exit): ")
        except EOFError:
            print("\nGoodbye!")
            break
        if user_input.lower() == "quit":
            print("Goodbye!")
            break
        print(bot.respond(user_input))


if __name__ == "__main__":
    main()
