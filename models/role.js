const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {type:String},
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

module.exports = mongoose.model("Role", RoleSchema);
