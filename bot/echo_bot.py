"""Simple echo bot implementation."""

from dataclasses import dataclass
from typing import Optional

@dataclass
class EchoBot:
    """A basic bot that echoes messages."""

    name: str = "EchoBot"
    token: Optional[str] = None

    def greet(self) -> str:
        """Return a greeting message."""
        greeting = f"Hello, I am {self.name}!"
        if self.token:
            greeting += " (token loaded)"
        return greeting

    def respond(self, message: str) -> str:
        """Respond by echoing the received message."""
        return f"You said: {message}"
