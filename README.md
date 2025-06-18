# Event Bot

This repository contains a simple EchoBot implemented in Python.

## Usage

Create a `.env` file with your token:

```bash
echo "BOT_TOKEN=your-token" > .env
```

Then run the echo bot from the command line:

```bash
python -m bot.main
```

### Discord mode

To run a real Discord bot you need the ``discord.py`` package installed:

```bash
pip install discord.py
```

Start the bot with:

```bash
python -m bot.discord_bot
```

You can also run a standalone script that does not rely on the `bot` package:

```bash
python index.py
```

The bot will automatically load `BOT_TOKEN` from the `.env` file if it exists.
Then enter messages. Type `quit` or press `Ctrl+D` to exit.
