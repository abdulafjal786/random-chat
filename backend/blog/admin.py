from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "published", "created_at"]
    list_filter = ["published", "author"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ("title",)}
