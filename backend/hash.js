const bcrypt = require("bcryptjs");

bcrypt.hash("admin@admin.com", 10).then((hash) => {
  console.log("NEW HASH:", hash);
});
