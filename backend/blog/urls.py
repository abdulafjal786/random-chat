from django.urls import path
from .views import BlogPostListView, BlogPostDetailView

urlpatterns = [
    path("posts/", BlogPostListView.as_view(), name="blog-list"),
    path("posts/<slug:slug>/", BlogPostDetailView.as_view(), name="blog-detail"),
]
