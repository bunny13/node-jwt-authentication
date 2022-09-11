const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");

dotenv.config({ path: "./config/config.env" });
require("./conn");

app.use(express.json(), cors(), express.urlencoded({ extended: true }), cookieParser());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hey! it's working!");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is listening at ${process.env.PORT}`);
});
