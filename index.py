BOT_NAME = 'SPY'

def greet() -> str:
    """Return a greeting from the bot."""
    return f"Hello, I am {BOT_NAME}!"


def respond(message: str) -> str:
    """Return the bot's response to a message."""
    return f"You said: {message}"


def main() -> None:
    """Run an interactive loop echoing user messages."""
    print(greet())
    while True:
        try:
            user_input = input("Enter a message (or 'quit' to exit): ")
        except EOFError:
            print("\nGoodbye!")
            break
        if user_input.strip().lower() == 'quit':
            print('Goodbye!')
            break
        print(respond(user_input))


if __name__ == '__main__':
    main()
