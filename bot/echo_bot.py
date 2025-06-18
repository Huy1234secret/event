"""Simple echo bot implementation."""

from dataclasses import dataclass

@dataclass
class EchoBot:
    """A basic bot that echoes messages."""

    name: str = "EchoBot"

    def greet(self) -> str:
        """Return a greeting message."""
        return f"Hello, I am {self.name}!"

    def respond(self, message: str) -> str:
        """Respond by echoing the received message."""
        return f"You said: {message}"
