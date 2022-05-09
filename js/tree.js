/**
 *  Based on drawtree.js from https://github.com/PoonLab/CoVizu
 * 
 *  r2d3 predefines `div`, `height` and `weight` variables
 */

console = d3.window(div.node()).console;

var svg = div.append("svg")
             .attr("width", width+"px")
             .attr("height", heigiht+"px");

var margin = {top: 0, right: 50, bottom: 20, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom,
    g = svg.append("g")
           .attr("height", plotheight+"px")
           .attr("id", "barplot-group")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// append tooltip element
var tooltip = div.append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipContainer")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("pointer-events", "none");

// set up plotting scales
var xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleLinear().range([height, 40]);

