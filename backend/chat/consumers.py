import json
from datetime import datetime, timezone

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from .matchmaker import matchmaker


def now_iso():
    return datetime.now(timezone.utc).isoformat()


class ChatConsumer(AsyncWebsocketConsumer):
    partner_user_id: str | None = None
    partner_channel_group: str | None = None

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group = f"user_{self.user_id}"

        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        # Notify client we are searching
        await self.send_json({"type": "searching"})

        # Try to find a partner
        await self._try_match()

    async def disconnect(self, code):
        # Remove from queue in case not yet matched
        await matchmaker.remove_from_queue(self.user_id)

        # Notify partner if connected
        if self.partner_channel_group:
            await self.channel_layer.group_send(
                self.partner_channel_group,
                {"type": "chat_message", "data": {"type": "disconnected"}},
            )
        self.partner_user_id = None
        self.partner_channel_group = None

        await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data or "{}")
        except json.JSONDecodeError:
            return

        msg_type = data.get("type")

        if msg_type == "message":
            if self.partner_channel_group:
                await self.channel_layer.group_send(
                    self.partner_channel_group,
                    {
                        "type": "chat_message",
                        "data": {
                            "type": "message",
                            "sender": self.user_id,
                            "text": data.get("text", ""),
                            "timestamp": now_iso(),
                        },
                    },
                )

        elif msg_type == "skip":
            if self.partner_channel_group:
                # Notify partner they were skipped
                await self.channel_layer.group_send(
                    self.partner_channel_group,
                    {"type": "chat_message", "data": {"type": "disconnected"}},
                )
            self.partner_user_id = None
            self.partner_channel_group = None

            # Re-enter queue
            await self.send_json({"type": "searching"})
            await self._try_match()

    async def _try_match(self):
        result = await matchmaker.try_match(self.user_id, self.channel_name)
        if result:
            u1_id, u1_ch, u2_id, u2_ch = result
            channel_layer = get_channel_layer()

            u1_group = f"user_{u1_id}"
            u2_group = f"user_{u2_id}"

            # Notify user 1
            await channel_layer.group_send(
                u1_group,
                {
                    "type": "chat_message",
                    "data": {"type": "matched", "partner_id": u2_id},
                },
            )
            # Notify user 2
            await channel_layer.group_send(
                u2_group,
                {
                    "type": "chat_message",
                    "data": {"type": "matched", "partner_id": u1_id},
                },
            )

    async def chat_message(self, event):
        data = event["data"]

        # When we receive a "matched" event, store partner references
        if data.get("type") == "matched":
            partner_id = data.get("partner_id")
            self.partner_user_id = partner_id
            self.partner_channel_group = f"user_{partner_id}"

        await self.send_json(data)

    async def send_json(self, data: dict):
        await self.send(text_data=json.dumps(data))
