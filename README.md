# Simple Discord Bot

This repository provides a minimal Discord bot implemented in Python.

## Setup

1. Install the required packages. You can install them individually or use the
   provided `requirements.txt` file:

```bash
pip install -r requirements.txt
```

If you prefer to install them manually, run:

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
