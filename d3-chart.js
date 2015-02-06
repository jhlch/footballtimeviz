  
// Flags controlling how this chart works.
var DO_ENLARGE_ON_HOVER = true; // Do circles get bigger when you hover on them?
var SHOW_STATIC_LABELS = true; // Do circles have team name labels on the 'main' plot?
var SHOW_FOOTBALL_FIELD_AXIS = true; // Draw a football field 'axis' at the bottom of the screen.

// Constants defining the geometry of the plot.

var TEAM_RADIUS = 12; // How big of circles to make in scatter plot.
var HOVER_RADIUS = 20; // How big circles grow when we hover over them.

// Total size of the chart. TODO: Don't forget to set this to match in footballtime.css
var CHART_WIDTH  = 640;
var CHART_HEIGHT = 500;

// Height of the football-field-like x-axis at the bottom.
var FIELD_AXIS_HEIGHT = 40;

// "Working space" size is defined by INNER_WIDTH x INNER_HEIGHT.
var MARGIN = { top: 20, right: 40, bottom: 30, left: 40 };
var INNER_WIDTH = CHART_WIDTH - MARGIN.left - MARGIN.right;
var INNER_HEIGHT = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

var ANIMATION_TIME = 100; // milliseconds

var x_axis = null;
var y_axis = null;

/**
 * Main d3 rendering method.
 */
function renderMainChart() {
  // Extract X and Y arrays from the data to normalize the chart scale to its width.
  var x_coords = [];
  var y_coords = [];

  for (var idx in data) {
    team = data[idx];
    x_coords.push(team.x);
    y_coords.push(team.y);
  }

  // Calculate size of axes
  x_axis = d3.scale.linear()
      .domain([0, d3.max(x_coords)])
      .range([MARGIN.left, INNER_WIDTH]);

  y_axis = d3.scale.linear()
      .domain([0, d3.max(y_coords)])
      .range([INNER_HEIGHT, MARGIN.bottom]);

  var chartBorder = d3.select(".chartbox")
      .attr("width", 2 + CHART_WIDTH)
      .attr("height", 2 + CHART_HEIGHT);

  // Start building the chart.

  var chart = d3.select(".chartbody");
    
  chart.attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT);

  if (SHOW_FOOTBALL_FIELD_AXIS) {
    var fieldAxisValues = [];
    for (var i = 0; i < 100; i++) {
      fieldAxisValues.push(i)
    }
    fieldAxisScale = d3.scale.linear()
        .domain([0, d3.max(fieldAxisValues)])
        .range([MARGIN.left, INNER_WIDTH]);

    var fieldAxisElemWidth = INNER_WIDTH / 100 // how wide is each piece of the field?

    // Draw blank rectangles across the main window so that we can connect them for 
    // animation purposes. They all have class 'invisFieldItem'
    chart.selectAll("g .invisFieldItem").data(fieldAxisValues).enter()
      .append("g")
        .attr("class", "invisFieldItem")
      .append("rect")
        .attr("style", "fill: white")
        .attr("transform", function(x) { 
          var pos = fieldAxisScale(x);
          return "translate(" + pos + ", 0)";
        })
        .attr("width", "" + fieldAxisElemWidth + "px")
        .attr("height", "" + INNER_HEIGHT + "px")
        .on('mouseover', function() {
          var x = this.__data__;
          var associatedClass = ".axis-" + x;
          d3.select(associatedClass)
            .transition()
              .duration(ANIMATION_TIME/2)
              .attr("height", "25")
        })
        .on('mouseout', function() {
          var x = this.__data__;
          var associatedClass = ".axis-" + x;
          d3.select(associatedClass)
            .transition()
              .duration(ANIMATION_TIME/2)
              .attr("height", "" + FIELD_AXIS_HEIGHT + "px")
        })
  }


  // We're ready to render the chart proper

  // Each team appears inside a 'circleBlock' with class 'chartelem'
  var circleBlock = chart.selectAll("g chartelem").data(data).enter()
    .append("g")
      .attr("class", "chartelem")
      .attr("transform", function(team) { 
        return "translate(" + x_axis(team.x) + ", " + y_axis(team.y) + ")";
      });

  // Each team is represented by a circle with radius TEAM_RADIUS.
  var circle = circleBlock.append("circle")
    .attr("cx", TEAM_RADIUS)
    .attr("cy", TEAM_RADIUS)
    .attr("r", TEAM_RADIUS)
    .attr("fill", function(team) { return team.color; })

  if (DO_ENLARGE_ON_HOVER) {
    circle.on('mouseover', function() {
      d3.select(this)
        .transition()
          .duration(ANIMATION_TIME)
          .attr('r', HOVER_RADIUS) // enlarge radius during mouseover.
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
          .duration(ANIMATION_TIME)
          .attr('r', TEAM_RADIUS)
    })
  }

  if (SHOW_STATIC_LABELS) {
    // The team name appears to the lower-right corner of the circle.
    var label = circleBlock.append("text")
      .attr("x", function(team) { return 2 * TEAM_RADIUS + 2; })
      .attr("y", function(team) { return 2 * TEAM_RADIUS + 6; })
      .attr("transform", "")
      .text(function(team) { return team.name; } );
  }

  // Put axis labels on the sides of our scatterplot chart.
  var xAxisGraphic = d3.svg.axis().scale(x_axis).orient("bottom").ticks(10, "");
  var yAxisGraphic = d3.svg.axis().scale(y_axis).orient("left").ticks(10, "");
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (INNER_HEIGHT) + ")")
      .call(xAxisGraphic)
      .append("text")
        .attr("transform", "")
        .attr("x", INNER_WIDTH - 35)
        .attr("y", -4)
        .text("Score");
  chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + MARGIN.left + ", 0)")
      .call(yAxisGraphic)
      .append("text")
        .attr("y", 10)
        .attr("x", -35)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .text("Variance");


  // Add 'tipsy' tooltips to each SVG circle.
  // See http://bl.ocks.org/ilyabo/1373263
  $('svg circle').tipsy({
    gravity: 'w',
    html: true,
    title: function() {
      var d = this.__data__;
      // TODO: Render the various string properties from your JSON objects into this text.
      text =  '<h3>' + d.name + '</h3>';
      text += '<hr/>';
      text += '<p class="info">Foo: ' + d.foo;
      text += '<br/>Bar: ' + d.bar;
      text += '<br/>Baz: ' + d.baz;
      text += '</p>';
      return text;
    }
  });


  if (SHOW_FOOTBALL_FIELD_AXIS) {
    // Make a redundant X-axis that looks like a football field below the main chart.
    var fieldAxisColors = [ '#44bb44', '#66dd66' ]; // Alternating shades of green for the field

    var fieldAxis = d3.select(".fieldaxis")
        .attr("width", CHART_WIDTH)
        .attr("height", FIELD_AXIS_HEIGHT)

    // Draw 1% width items across the whole "field" axis.
    fieldAxis.selectAll("g").data(fieldAxisValues).enter()
      .append("g").append("rect")
        .attr("class", function(x, idx) { return "fieldAxisElem axis-" + x; })
        .attr("style", function(x, idx) { 
          var color = fieldAxisColors[idx % 2];
          return "fill: " + color;
        })
        .attr("transform", function(x) { return "translate(" + fieldAxisScale(x) + ", 0)"; })
        .attr("width", "" + fieldAxisElemWidth + "px")
        .attr("height", "" + FIELD_AXIS_HEIGHT + "px")
  }
  return true;
}

// Once we've got everything initialized, render the chart.
renderMainChart();
