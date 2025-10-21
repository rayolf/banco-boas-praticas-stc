const mongoose = require('mongoose');

const PracticeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  management: {
    type: String,
    required: true
  },
  practice: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Auditor'
  },
  area: {
    type: String,
    default: 'Geral'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Practice', PracticeSchema);