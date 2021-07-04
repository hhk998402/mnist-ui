# MNIST TensorFlowJS UI Sample Web App (React, NodeJS)
As presented to MSRIT Engineering UG students as part of partial course delivery by industry professionals in their ML course.
Session taken by Hemant H Kumar and Karthik VR on 2nd and 3rd July 2021.

## Pre-Requisites
1. Make sure you have NodeJS>=10.19.0 and NPM>=6.14.4 installed on your system.

## How to run the app?
1. Clone the repo to your local system
2. Run `npm install` in the root folder
3. Then run `cd client && npm install`
4. Now you are all set to run this code. The repo contains a very simple model trained on MNIST data. If you wish to add your own model, please add it to the `server/ml-models` and reference the same in `server/routes/predict.js`.
5. Run both frontend and backend by running `npm start:local` in the root folder.
