const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes Middlewares
const userRouter = require("./routes/userRouter");
const roleRouter = require("./routes/roleRouter");
const postRouter = require("./routes/postRouter");

app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/post", postRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost: ${PORT}`);
});
