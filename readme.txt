
Running Dashboard
----------------
Prerequisites
*install Node.js
*install Mysql

1. To download any libraries that Dashboard uses using Node.js, type:

  ```bash
  npm install
  ```
2. Install and run MySQL.
    To set up databse used for Dashboard, type:
    ```bash
    npm run initsql
    ```
3. Edit `example/sql_config.json` so that your database `host`, `user` and `password` properties are correct.

4. Start the server by typing:
  ```bash
  npm run dashboard
  ```
5. Visit dashboard by going to http://localhost:8080


Key features
----------------

Calendar
  Calendar is a an weekly view of upcoming events, with hourly slots for events

  To use
    it’s simple,
     - adding an event, simply click on an time slot, and popup box will appear for you to enter name of event,
        alter start and end time and the profile for which the event is crated,
        time of the event is set automatically, an 1 hour gap starting from the time you clicked on, but if you hover over the start and finish time you can modify it.
     - deleting an event, to delete locate an 'X' on the event that you want to delete and click it, confirm that you want to delete this event and it done

     you can also change the profiles you want to see, to do this click on settings located in top right corner, in settings you can turn off or on any profiles that will be seen,
     when you log in to email using Gmail your calendars from Google account will be available to view and seen on calendar

Email
  email once logged in displays 10 most recent emails from Gmail, you can choose which labels to view emails for

  to use
    - you need to have an Gmail account, if you do when you click log in button you will be promoted with a sign in window from google, once logged in you’ll need to allow access
      for email and calendars for dashboard to have the access to see you information
      - once logged in you’ll see 10 most recent emails from inbox, unread messages will be in bold,
        if you click on an email, a larger window will appear with that email inside to close the window click on 'X' on located in top right corner of this window
      - by clicking in left top corner of Inbox you can change the category to view top 10 most emails

Clock
  An simple, accurate clock that displays current time

Weather
  Weather displays the current weather as well as an forecast for next 5 days,

  To use
    - when page is loaded, if you allowed the browser to use you current location, it will find you location and show current weather for current location
    - you can change the location by typing in an location in location input box thats located above 5 day forecast
    * Grabbing location will only work if the dashboard is run from local host, this is due to the fact that all new versions of browser require the page
      That is making the Geolocation call must be served from a secure context such as HTTPS.

News
  News displays top news of the day, it allows you to change the category that you want the news to be about

  To use
    - On first load the news will set the category to UK news, you can change this by clicking on settings icon inside news to choose a new category

Edit mode
  In edit mode you can move elements around, resize them as well as hide elements,
  To use
    - To enable edit mode press switch that is located on top left corner,
    - To hide an element double click an element and it will hide in an bottom bar
      - To show it again just press on an icon in bottom bar and it will pop back to place
    - to resize the element, move mouse to bottom right corner of an element, click and hold you mouse while you resize the elements
    - To move and element simply hover over and element and click, and hold on it and move it anywhere on the screen
  - if any two elements will overlap they will gain a red dashed border and you will not be able to use or save the dashboard  until there is no overlap
  to save the layout and be able to interact with the dashboard again press the edit switch, that will save the layout.

Cool Features
  The layout of the dashboard is saved on local storage which is loaded every time you refresh your screen and do any adjustments
  Layouts are saved under profiles so if you login using google your layout will be saved under you google account, so you can have your own design,
  That will be only seen when you log in

  Another cool feature is the integration with google, the way you can log in with google account and see your most recent emails as well your calendar and events on that calendar.


Known Bugs/issues
  - one issue in my opinion is that I use a long and complicated IDs for 'li' elements where events are put, its convenient because all required information is in one string,
    making each id unique, but creating the id and altering it is complicated and not very good, at start i used numbers as ids which turned out to be a bad idea
    and had to change it so that it starts with a letter, a better way to store information would be by using datasets and storing the required information that way
  - one of the bugs is that geolocation doesn’t always work and never works when trying to run from Virtual machine as well and google api doesn’t work when trying
    to run from virtual machine because of googles security
  - Sliding of news gets a bit problematic, news sometimes overlap each other and animation isn’t as smooth as it could be.
