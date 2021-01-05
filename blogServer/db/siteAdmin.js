const mongoose = require("mongoose")

let siteAdmin = mongoose.Schema({
  type: {
    type: Array,
    default: ["front", "back"]
  }
})

let siteAdminTable = mongoose.model("siteAdminTable", siteAdmin)

module.exports = { siteAdminTable }