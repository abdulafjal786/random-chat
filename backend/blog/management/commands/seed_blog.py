from django.core.management.base import BaseCommand
from blog.models import BlogPost

POSTS = [
    {
        "title": "Welcome to RandomChat: How It Works",
        "slug": "welcome-to-randomchat",
        "author": "RandomChat Team",
        "content": """RandomChat connects you with random strangers around the world for anonymous, real-time conversations. Here's how the magic works.

When you visit our homepage and click "Start Chatting," we generate a unique anonymous ID for you — no email, no sign-up, no personal data stored. You're instantly placed in a global queue, and our server matches you with another user who is also waiting.

Once matched, you have a short window of 10–20 seconds to connect and converse before the session automatically ends and you're matched with someone new. This keeps conversations fresh and serendipitous.

Privacy is our core principle. We don't log messages, store conversation histories, or link your sessions together. Every chat is a new beginning.

If a conversation isn't going well, hit "Skip" to immediately move on to a new partner. We believe in creating a space where every interaction is a surprise — and hopefully a delightful one.""",
        "excerpt": "Learn how RandomChat's anonymous matching system works and why privacy is at the core of everything we build.",
    },
    {
        "title": "The Psychology of Talking to Strangers",
        "slug": "psychology-of-talking-to-strangers",
        "author": "Dr. Maya Chen",
        "content": """Research consistently shows that conversations with strangers can be some of the most meaningful interactions we have. Yet most of us avoid them, defaulting to our phones on the subway or staring at the floor in the elevator.

Psychologist Nicholas Epley at the University of Chicago has studied this phenomenon extensively. His findings reveal a striking paradox: we systematically underestimate how much we'll enjoy talking to strangers, and we overestimate how awkward it will feel.

In one study, commuters who were instructed to talk to a stranger on the train reported significantly higher happiness than those who sat in solitude — even though they predicted the opposite outcome before the experiment.

What makes stranger conversations uniquely valuable? Several things. First, there's no history — no accumulated grievances, no expectations, no social performance anxiety rooted in long-term relationship dynamics. Second, strangers often provide perspectives we'd never encounter in our usual social circles. Third, the impermanence itself can be liberating: you can be fully honest without fear of long-term social consequences.

RandomChat is designed to unlock these benefits. Our automatic session limits lean into the psychology — by keeping conversations short and anonymous, we remove the barriers that make us hesitant to engage authentically.""",
        "excerpt": "Science shows that conversations with strangers are more rewarding than we expect. Here's why anonymity and time limits actually help.",
    },
    {
        "title": "Building Real-Time Chat: Behind the Scenes",
        "slug": "building-realtime-chat-behind-the-scenes",
        "author": "Alex Rivera",
        "content": """RandomChat is built on a modern, open-source stack designed for low latency and high concurrency. Here's a look under the hood.

**Frontend: Next.js + TypeScript**
Our frontend is a Next.js 15 application written in TypeScript. The chat interface uses the browser's native WebSocket API, wrapped in a custom React hook called useChat. This hook manages the full lifecycle: connecting, matching, messaging, auto-reconnecting after 5 seconds, and cleaning up on unmount. State is minimal and local — no global state library needed.

**Backend: Django + Channels**
Django is our web framework of choice for its robustness and excellent ecosystem. For WebSocket support, we use Django Channels, which extends Django's synchronous HTTP handling into the asynchronous world using Python's asyncio. Each user connects to their own WebSocket consumer, which handles matching, message forwarding, and auto-disconnect timers.

**Matchmaking**
Our matchmaking system is intentionally simple: a shared in-memory queue protected by an asyncio lock. When two users are in the queue, they're paired instantly. For larger scale, this could be replaced with a Redis-backed queue to support multiple server instances.

**Auto-disconnect**
When two users match, we start an asyncio timer (10–20 seconds, randomised). When it fires, both users receive a "disconnected" event and are free to match with someone new. The randomisation prevents any perception of a fixed countdown.

The entire system runs as a single Daphne ASGI process in development — no separate WebSocket server needed.""",
        "excerpt": "A technical deep-dive into how RandomChat's real-time matching, WebSocket infrastructure, and auto-disconnect timer are built.",
    },
]

class Command(BaseCommand):
    help = "Seed the database with sample blog posts"

    def handle(self, *args, **options):
        count = 0
        for post_data in POSTS:
            _, created = BlogPost.objects.get_or_create(
                slug=post_data["slug"], defaults=post_data
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f"Created {count} blog posts."))
