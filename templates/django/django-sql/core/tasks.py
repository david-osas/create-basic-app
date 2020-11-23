import instaloader
from celery import shared_task
from django.contrib import messages

@shared_task
def run_script(USERNAME, PASSWORD):  
  print('USERNAME: ' + USERNAME)

  # INSTALOADER SETUP
  L = instaloader.Instaloader()
  PROFILE = USERNAME  
  L.login(USERNAME, PASSWORD) # (Login)
  # Load session previously saved with `instaloader -l USERNAME`:
  # L.load_session_from_file(USER)
  profile = instaloader.Profile.from_username(L.context, PROFILE)

  likes = set()
  print("Fetching likes of all posts of profile {}.".format(profile.username))
  for post in profile.get_posts():
      # messages.success(request, 'Post Date: ' + post.date.strftime("%H:%M:%S"))
      # messages.success(request, 'Likes: ' + likes)
      print(post)

      likes = likes | set(post.get_likes())

  print("Fetching followers of profile {}.".format(profile.username))
  followers = set(profile.get_followers())