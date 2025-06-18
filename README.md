# Simple Discord Bot

This repository provides a minimal Discord bot implemented in Python.

## Setup

1. Install the `discord.py` and `python-dotenv` packages:

```bash
pip install discord.py python-dotenv
```

2. Set the bot token in the `BOT_TOKEN` environment variable or create a `.env` file:

```bash
echo "BOT_TOKEN=your-token" > .env
```

The bot automatically loads the `.env` file from the repository directory when it runs.

## Running the Bot

Run the bot with:

```bash
python discord_bot.py
```

The bot will echo back any message it receives.
