const bcrypt = require("bcrypt");
const cl = (...args) => console.log(...args);

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1234", salt);
  cl(salt);
  cl(hashed);
}

run();
