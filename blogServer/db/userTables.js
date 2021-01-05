const mongoose = require("mongoose")

let userAccount = new mongoose.Schema({
  key: {
    type: String,
    default: ""
  },
  account: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  token: {
    type: String,
    default: ""
  },
  reset_password_verify_code: {
    type: String,
    default: ""
  },
  power: {
    type: Object,
    default: { user: true, admin: false }
  }
})

let userInfo = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
  }
})

let userInteraction = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  likes: {
    type: Array,
    default: []
  },
  collections: {
    type: Array,
    default: []
  },
  follows: {
    type: Array,
    default: []
  },
  fans: {
    type: Array,
    default: []
  },
  chats: {
    type: Array,
    default: []
  }
})

let userRegister = new mongoose.Schema({
  account: {
    type: String,
    required: true
  },
  verify_code: {
    type: String,
    required: true
  }
})

let userInfoTables = mongoose.model("userInfoTables", userInfo)
let userAccountTables = mongoose.model("userAccountTable", userAccount)
let userInteractionTables = mongoose.model("userInteractionTables", userInteraction)
let userRegisterTables = mongoose.model("userRegisterTables", userRegister)

module.exports = { userAccountTables, userInfoTables, userInteractionTables, userRegisterTables }