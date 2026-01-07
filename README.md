# Project: Event Scheduler
# Description:
A web-app that reminds you of your events and that can easily add to google calender using smart prompts. In addition contains a friendship checker that allow you to keep track
of when you last have seen a friend.

# Authentication System:
This website uses JWT Tokens for the access tokens, and opaque tokens for the refresh tokens. The refresh token is stored in the data-base and also in cookies, whilst 
the access token is just stored in the cookie. Everytime an api call is called - a access token is attached and verified. If it is expired the interceptor will refresh
the token and cookie using the refresh token. Everytime the refresh token is used it is rotated - meaning a new one is created for security purposes.

It also requires google authentication - with the access token being stored within a REDIS cache for quick and easy access - with. Refresh token is stored in data-base. Every google call requires an access token - and this is promptly refreshed when required. If a user attempts to access a page that is protected they will be moved to login. Also if the user attempts to access the login page - the Auth Context that wraps the app will redirect it to the home page.
 
# Features: 
- Can create events in Google Calender using prompts - Dinner with Emma tmr 1030-1130pm will populate that into my google calender.
- Reminding system: At the end of every day it will send you an email detailing the events of the next day.
- Recurring events can also be made and deleted using the search bar.
- Dashboard design contains: 
    - Calender for Today's events - that can be hovered to scroll.
    - Search Bar that let's you create events using prompts. 
    - Side Bar that is a friend checker as detailed below.
- Header Bar --> consists of Home, Friends and that's probably all I need rn.
- Being able to add friends. By adding friends everytime you create an event with their name you invite them to a google calender.
- Friendship checker - there's a side-bar that lists your friends. You can scroll through it and it tells you when you last hung out with them. If they are a user of the app 
hovering over the button gives you a list of your shared availabilities. If not it just gives your availabilities for the next week or so.  