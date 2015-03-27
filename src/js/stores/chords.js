// chords.js
// created By Kristen Mills
// Stores the currently selected stores

var Fluxxor = require('fluxxor');

var constants = require('../constants/chords');

var Chords = Fluxxor.createStore({

  initialize: function() {
    this.chords = [];

    this.bindActions(
      constants.ADD_CHORD, this.onAddChord,
      constants.REMOVE_CHORD, this.onRemoveChord
    );
  },

  onAddChord: function(payload) {
    this.chords.push(payload.chord)
    this.emit('change');
  },

  onRemoveChord: function(payload) {
    this.chords.splice(this.chords.indexOf(payload.chord), 1);
    this.emit('change');
  },

  getState: function() {
    return this.chords;
  }
});

module.exports = Chords;
