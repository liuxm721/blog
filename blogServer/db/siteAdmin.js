const mongoose = require("mongoose")

let siteAdmin = mongoose.Schema({
  type: {
    type: Array,
    default: []
  }
})

let siteAdminTable = mongoose.model("siteAdminTable", siteAdmin)

module.exports = { siteAdminTable }