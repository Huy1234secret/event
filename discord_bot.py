import os
import discord


def main() -> None:
    """Run the Discord bot."""
    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN not set")

    intents = discord.Intents.default()
    client = discord.Client(intents=intents)

    @client.event
    async def on_ready():
        print(f"Logged in as {client.user} (ID: {client.user.id})")

    @client.event
    async def on_message(message: discord.Message):
        if message.author == client.user:
            return
        await message.channel.send(f"You said: {message.content}")

    client.run(token)


if __name__ == "__main__":
    main()
