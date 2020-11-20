# Workshop assessment

Hello aspiring developer! Our company is running on a tight deadline and the success of our project hangs on the line. You have been asked to come on board to help us meet our deadline by implementing one of the missing features.

Our app, DevelopersDesks™, aims to be the #1 social network for developers working from home to share their working spaces and obtain comments and tips from others. Right now the team considers the app to be 80% done, which means there is quite a bit of work still to do. Mainly, we are missing 2 key features:

- Sort desks by location
- Add comments to the posts

These features are detailed further in the document. You can pick which feature to tackle, you have 7 hours to give it your best shot!

## Sorting by users location.

Context:
Our test database holds some seed data on dummy desks with information about the `latitude` and `longitude` where they were posted from. This was added manually by our QA engineer, right now our POST desk form handles no location information whatsoever. On our apps frontend there is a button on the main view with the text `Near Me`. So far this button serves no functionality.

The Challenge:
Make use of the phone's location capabilities to:

1. Make the `Near me` button work. This will use the phones location and the data from the posts to sort the desks based on how close they are to the user.
2. Add location information to POST desk (front + backend).

Libraries you might need:

- expo-location
- expo-permissions
- geolib (to calculate distances between lat/lng pairs)

### Add comments to Desks:

Context:
We have in our DB schema a model for Comments, but nothing has been done with it so far. We would like to put this model to work by adding a commenting feature to our desk posts.

This will involve:

- Seeding some fake comments
- Setting up POST and GET routes for the comments
- Displaying them in the frontend on the DeskScreen.
- Setting up a new view linked to the DeskScreen where users are presented with a form to POST comments.
