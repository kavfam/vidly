const express = require("express");
const router = express.Router();
const cl = (...args) => console.log(...args);

router.post("/", async (req, res) => {
  res.status(401).send("Unauthorized");
});

module.exports = router;
