# Picture to Poetry Converter #
For anyone who wants to find quick and easy computer-generated inspiration for their writing/poetry.

## Overview ##
This app allows the user to upload any image and be provided with an automatically generated "stream of consciousness" poem. Each image adds a "stanza" to the poem. Experiment and see if you find any surprising results!

## How to Get Started ##
```
npm install
npm run server
npm start
```

You must also obtain a Google Vision API KEY - which will be a JSON file - by following these steps:

[https://cloud.google.com/vision/docs/before-you-begin](https://cloud.google.com/vision/docs/before-you-begin)

You will then need to add the filepath to that JSON file in an .env file. There is a .sample.env file with all required variables for guidance. Make sure not to check the key in anywhere publicly!

Finally, you'll need to create a 'photos' folder under public (it is already .gitignored) where uploaded photos will be temporarily stored.

Once set up, the app is as simple as can be: just upload an image and the rest is on us. You can freely generate new poems with your selected images, and you can also clear all images to start fresh.

This is a free and open source project primarily built with React, Express.js, Node.js, and MongoDB as well as the Google Vision API. Feel free to take the ideas applied here and run with them!

## Demo ##
![](picture-to-poetry-demo.gif)