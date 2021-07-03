const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//import routes
require("./routes/predict.js")(app);

const PORT = process.env.PORT || 5002;

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "../client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);  
});