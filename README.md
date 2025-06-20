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

The bot registers a `/send_input` slash command on startup that allows you to
submit a code via a Discord modal. You can also trigger the same action by
sending `/send-input` as a regular message. The command is synced automatically
whenever the bot starts.

When you submit a code through the modal, the bot now validates the value if you
have the role `1385199472094740561`. The only accepted code for this role is
`377`. Submitting this code removes the `1385199472094740561` role from you and
grants the `1385658290490576988` role. Any other code results in a friendly
error message visible only to the person who submitted it.

Only members with roles `1385641525341454337` or `1385199472094740561` can use
the CODE SUBMIT button.
