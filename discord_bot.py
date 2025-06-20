import os
from pathlib import Path

# Only members with at least one of these role IDs may interact with the button
ALLOWED_ROLE_IDS = {1385641525341454337, 1385199472094740561}

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
                member = interaction.user if isinstance(interaction.user, discord.Member) else None
                has_special_role = False
                if member is not None:
                    has_special_role = any(
                        role.id == 1385199472094740561 for role in member.roles
                    )

                code_value = str(self.code.value).strip()

                if has_special_role and code_value == "377":
                    remove_role = interaction.guild.get_role(1385199472094740561)
                    add_role = interaction.guild.get_role(1385658290490576988)
                    if remove_role and add_role:
                        await member.remove_roles(remove_role, reason="Correct code submitted")
                        await member.add_roles(add_role, reason="Correct code submitted")
                    await interaction.response.send_message(
                        "\N{WHITE HEAVY CHECK MARK} Code accepted! Your roles have been updated.",
                        ephemeral=True,
                    )
                    return

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
                # Only allow interaction if the user has one of the allowed roles
                if interaction.guild is None:
                    await interaction.response.send_message(
                        "This interaction is only available in a server.",
                        ephemeral=True,
                    )
                    return

                member = interaction.user if isinstance(interaction.user, discord.Member) else None
                if member is None or not any(
                    role.id in ALLOWED_ROLE_IDS for role in member.roles
                ):
                    await interaction.response.send_message(
                        "You do not have permission to use this button.",
                        ephemeral=True,
                    )
                    return

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
