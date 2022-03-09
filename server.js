const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();


app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Подключен к базе данных!");
  })
  .catch(err => {
    console.log("Не могу подключиться к базе данных!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Добро пожаловть в бэк-энд приложения Алейникова." });
});

require("./app/routes/tutorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});