module.exports.genericString = {
  type: {
    type: String,
    default: 'String'
  },
  previousValue: String,
  newValue: {
    type: String,
    required: true
  }
}

module.exports.genericDate = {
  type: {
    type: String,
    default: 'Date'
  },
  previousValue: Date,
  newValue: {
    type: Date,
    required: true
  }
}
