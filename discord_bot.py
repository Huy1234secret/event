import os
from pathlib import Path

import discord
from discord import app_commands, ui

try:
    from dotenv import load_dotenv
except ModuleNotFoundError as exc:
    raise ModuleNotFoundError(
        "Missing optional dependency 'python-dotenv'. Install it with 'pip install python-dotenv'."
    ) from exc


def main() -> None:
    """Run the Discord bot."""
    load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN not set")

    intents = discord.Intents.default()
    intents.message_content = True
    client = discord.Client(intents=intents)
    tree = app_commands.CommandTree(client)

    @client.event
    async def on_ready():
        print(f"Logged in as {client.user} (ID: {client.user.id})")
        await tree.sync()

    def build_embed_view():
        embed = discord.Embed(
            title="Enter Access Code",
            description=(
                "To continue, click **CODE SUBMIT** below and enter the code "
                "we provided."
            ),
            color=discord.Color.blue(),
        )
        embed.set_footer(text="Let's keep moving!")

        class CodeModal(ui.Modal):
            """Modal to collect a code from the user."""

            def __init__(self) -> None:
                super().__init__(title="Submit Code")

            code = ui.TextInput(label="Input Code", placeholder="Your code")

            async def on_submit(self, interaction: discord.Interaction) -> None:
                await interaction.response.send_message(
                    "\N{CROSS MARK} Wrong code. Please check and try again!",
                    ephemeral=True,
                )

        class CodeView(ui.View):
            """View containing the code submission button."""

            def __init__(self) -> None:
                # Disable the default timeout so the button remains active
                # for as long as the bot is running.
                super().__init__(timeout=None)

            @ui.button(label="CODE SUBMIT", style=discord.ButtonStyle.primary)
            async def submit(
                self, interaction: discord.Interaction, button: ui.Button
            ) -> None:
                await interaction.response.send_modal(CodeModal())

        return embed, CodeView()

    @client.event
    async def on_message(message: discord.Message):
        if message.author == client.user:
            return
        if message.content.strip() == "/send-input":
            embed, view = build_embed_view()
            await message.channel.send(embed=embed, view=view)
            return

    @tree.command(name="send_input", description="Display modal to submit a code")
    async def send_input_command(interaction: discord.Interaction) -> None:
        embed, view = build_embed_view()
        await interaction.response.send_message(embed=embed, view=view, ephemeral=False)

    client.run(token)


if __name__ == "__main__":
    main()
