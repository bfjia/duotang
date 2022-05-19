/**
 *  Based on drawtree.js from https://github.com/PoonLab/CoVizu
 * 
 *  r2d3 predefines `data`, `div`, `height` and `weight` variables
 *  data is an Object with two entries, `nodes` and `edges`
 *  `edges` is an Array with entries:
 *   {parent: 9429, child: 9430, length: 0.0095, isTip: false, x0: 0, …}
 *  `nodes` is an Array with entries:
 *   {label: 'hCoV-19/Canada/...', n.tips: 0, x: 0.2423, y: 1}
 */

console = d3.window(div.node()).console;
//console.log(data);

var ldiv = div.append("div")
              .style("width", "100px")
              .style("height", height+"px")
              .style("float", "left")
              .style("display", "inline-block"),
    rdiv = div.append("div")
              .style("width", (width-100)+"px")
              .style("height", height+"px")
              .style("display", "inline-block")
              .style("overflow-x", "hidden")
              .style("overflow-y", "scroll");

var lsvg = ldiv.append("svg")
              .attr("id", "left-tree-svg")
              .attr("width", "100px")
              .attr("height", height+"px");

var treeheight = 4800,  // px
    svg = rdiv.append("svg")
              .attr("id", "main-tree-svg")
              .attr("width", (width-100)+"px")
              .attr("height", treeheight+"px");

// add margins
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    gwidth = width - 100 - margin.left - margin.right,
    gheight = treeheight - margin.top - margin.bottom,
    lgheight = height - margin.top - margin.bottom;
    
var g = svg.append("g")
           .attr("height", gheight+"px")
           .attr("id", "treeplot-group")
           .attr("transform", "translate(" + margin.left + "," + 
                 margin.top + ")");

var lg = lsvg.append("g")
             .attr("height", lgheight+"px")
             .attr("id", "scroll-tree")
             .attr("transform", "translate(" + margin.left + ',' + 
                   margin.top + ")");


// create scrolling rect in left panel
var scrollbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
scrollbox.setAttribute("width", "100px");
scrollbox.setAttribute("height", (height/treeheight * lgheight)+"px");
scrollbox.setAttribute("fill", "#00000055")
lsvg.node().append(scrollbox);

// bind event handler to rdiv scroll-tree
rdiv.on("scroll", function(e) {
    scrollbox.setAttribute("y", this.scrollTop/treeheight * height);
});

// append tooltip element
var tooltip = div.append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltipContainer")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("pointer-events", "none");

// set up plotting scales
var xmax = d3.max(data.edges, e => e.x1),
    ntips = data.nodes.filter(x => x['n.tips'] == 0).length,
    xScale = d3.scaleLinear().domain([0, xmax]).range([0, gwidth-100]),
    yScale = d3.scaleLinear().domain([0, ntips]).range([gheight, 40]),
    xlScale = d3.scaleLinear().domain([0, xmax]).range([0, 100]),
    ylScale = d3.scaleLinear().domain([0, ntips]).range([lgheight, 0]);

// draw tree in main panel
var treeplot = g.selectAll("lines")
                .data(data.edges)
                .enter().append("line")
                .attr("class", "lines")
                .attr("x1", function(d) { return xScale(d.x0); })
                .attr("x2", function(d) { return xScale(d.x1); })
                .attr("y1", function(d) { return yScale(d.y0); })
                .attr("y2", function(d) { return yScale(d.y1); })
                .attr("stroke-width", 1.0)
                .attr("stroke", function(d) { return d.colour; });

// draw tree in side panel
var sideplot = lg.selectAll("lines")
                 .data(data.edges)
                 .enter().append("line")
                 .attr("class", "lines")
                 .attr("x1", function(d) { return xlScale(d.x0); })
                 .attr("x2", function(d) { return xlScale(d.x1); })
                 .attr("y1", function(d) { return ylScale(d.y0); })
                 .attr("y2", function(d) { return ylScale(d.y1); })
                 .attr("stroke-width", 1.0)
                 .attr("stroke", function(d) { return d.colour; });




