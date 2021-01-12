/* Rating Model */

const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  safety: {
    name: {
      type: String,
      default: "Safety"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  workload: {
    name: {
      type: String,
      default: "Workload"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  location: {
    name: {
      type: String,
      default: "Location"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  facilities: {
    name: {
      type: String,
      default: "Facilities"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  opportunity: {
    name: {
      type: String,
      default: "Opportunity"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  clubs: {
    name: {
      type: String,
      default: "Clubs"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  general: {
    name: {
      type: String,
      default: "General"
    },

    rate: {
      type: Number,
      default: 0.0
    },

    rank: {
      type: Number,
      default: 0
    }
  },

  deleted: {
    type: Boolean,
    default: false
  }
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = { Rating };