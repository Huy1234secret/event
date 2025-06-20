# Simple Discord Bot

This repository provides a minimal Discord bot implemented in Node.js.

## Setup

1. Install the required packages using npm:

```bash
npm install
```

2. Set the bot token in the `BOT_TOKEN` environment variable or create a `.env` file:

```bash
echo "BOT_TOKEN=your-token" > .env
```

The bot automatically loads the `.env` file from the repository directory when it runs.

## Running the Bot

Run the bot with:

```bash
npm start
```

Send `/send-input` in any channel to receive an embed containing the **CODE SUBMIT** button. Clicking the button opens a modal where you can enter your access code.

When you submit a code through the modal, the bot validates the value if you have the role `1385199472094740561`. The only accepted code for this role is `377`. Submitting this code removes the `1385199472094740561` role from you and grants the `1385658290490576988` role. Any other code results in a friendly error message visible only to the person who submitted it.

Members with the role `1385663190096154684` are blacklisted from using the CODE SUBMIT button.
