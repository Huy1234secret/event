"""Command line interface for the EchoBot."""

from .echo_bot import EchoBot


def main() -> None:
    """Run a simple interaction loop with the EchoBot."""
    bot = EchoBot()
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
