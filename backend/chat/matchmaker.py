import asyncio
from typing import Dict, Optional, Tuple

class Matchmaker:
    """In-memory matchmaking queue. Pairs waiting users."""

    def __init__(self):
        self._queue: list[Tuple[str, str]] = []  # [(user_id, channel_name)]
        self._lock = asyncio.Lock()

    async def add_to_queue(self, user_id: str, channel_name: str) -> Optional[Tuple[str, str]]:
        """Add user to queue, return matched partner (user_id, channel_name) or None."""
        async with self._lock:
            # Remove any existing entry for this user
            self._queue = [(uid, ch) for uid, ch in self._queue if uid != user_id]
            self._queue.append((user_id, channel_name))

            if len(self._queue) >= 2:
                # Pop two users
                user1_id, user1_ch = self._queue.pop(0)
                user2_id, user2_ch = self._queue.pop(0)

                if user1_id == user_id:
                    return (user2_id, user2_ch)
                else:
                    # Return ourselves matched with user1 — but we need to notify user1 too
                    # Store the match in a pending dict so both consumers can retrieve it
                    return (user1_id, user1_ch)
            return None

    async def remove_from_queue(self, user_id: str):
        async with self._lock:
            self._queue = [(uid, ch) for uid, ch in self._queue if uid != user_id]

    async def try_match(self, user_id: str, channel_name: str):
        """
        Attempt to match. Returns (partner_user_id, partner_channel_name, my_user_id)
        for BOTH users involved, or None if no match yet.
        """
        async with self._lock:
            self._queue = [(uid, ch) for uid, ch in self._queue if uid != user_id]
            self._queue.append((user_id, channel_name))

            if len(self._queue) >= 2:
                u1_id, u1_ch = self._queue.pop(0)
                u2_id, u2_ch = self._queue.pop(0)
                return (u1_id, u1_ch, u2_id, u2_ch)
            return None


matchmaker = Matchmaker()
