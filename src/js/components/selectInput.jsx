// selectInput.jsx
// created By Jesse Jurman
// react class that renders the selectize input

var React = require('react');
var Fluxxor = require('fluxxor');

var Keyboarder = require('./keyboarder');
var Teoria = require('teoria');
var ChordGroups = require('./chordGroups');
var ScaleGroups = require('./scaleGroups');

var FluxMixin = Fluxxor.FluxMixin(React);

// Selectize Input where users enter the chords they want to see
var SelectInput = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
    return {spacer: {}};
  },

  render: function() {
    var placeholder = "Click here, and type in your chords!";
    return (
      <div>
        <select id="input-tags" ref="chordinput" multiple placeholder={placeholder}>
          <ChordGroups chordTruths={this.props.chordTruths} />
          <ScaleGroups chordTruths={this.props.chordTruths} />
        </select>
        <div id="spacer" style={this.state.spacer}></div>
      </div>
    );
  },

  popDropDown: function() {
    // grab the hieght of the dropdown
    var dropbox = document.querySelector(".selectize-dropdown-content");
    var newHeight = dropbox.getBoundingClientRect().height;

    this.setState({spacer: {marginTop:`${newHeight}px`}});
  },

  // when it mounts, add all the selectize attributes
  componentDidMount: function() {
    var self = this;
    var flux = this.getFlux();

    /* Selectize options and events */
    var select = $(this.refs.chordinput.getDOMNode()).selectize({
        items: flux.stores.Keyboards.keyboards.map( function(chord) { return chord.name } ),
        delimiter: ',',
        maxOptions: 5,
        dataAttr: 'legends',
        create: function( input ) {
          var tChord = Teoria.chord( input );
          return {
            value: tChord.name,
            text: tChord.name
          };
        },
        createFilter: function( input ) {
          var creatable;
          try {
            var tChord = Teoria.chord( input );
            creatable = (tChord != undefined);
          }
          catch (err) {
            creatable = false;
          }
          return creatable;
        },
        onItemAdd: function(value, item) {
          // get the position that we're inserting the chord
          var insertIndex = this.items.indexOf(value);

          var chordname, scalename;
          // tell flux to add a new chord
          if (value.indexOf("Scale") == -1) {
            chordname = Teoria.chord(value).name;
            flux.actions.keyboards.addChord({type: "chord", name:chordname, inversion:0}, insertIndex);
          }
          else {
            scalename = value.split(" ");
            flux.actions.keyboards.addScale({type: "scale", name:value, tonic:scalename[0], scale:scalename[1]}, insertIndex);
          }


          self.popDropDown();
        },
        onItemRemove: function(value) {
          // get the position that we're removing the chord
          var myItems = flux.stores.Keyboards.keyboards.map( function(chord) { return chord.name } );
          var removeIndex = myItems.indexOf(value);

          // tell flux to remove the chord at the index
          flux.actions.keyboards.removeChord(removeIndex);

          self.popDropDown();
        },
        onDropdownOpen: function() {
          self.popDropDown();
        },
        onDropdownClose: function() {
          self.popDropDown();
        },
        searchField: ["text"],
        render: {
          optgroup_header: function(data, escape) {
      			return '<div class="optgroup-header"><h4 class="groups">' + escape(data["value"]) + ' Chords:</h3></div>';
      		}
        }
    });
    /* end selectize stuff */

  }
});

module.exports = SelectInput;