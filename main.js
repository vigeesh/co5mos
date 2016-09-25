function changeImage() {
    "use strict";
    if (document.getElementById("intensityimg").src === "ftp://ftp.leibniz-kis.de/personal/vigeesh/simprogress/intensity.gif") {
        document.getElementById("intensityimg").src = "ftp://ftp.leibniz-kis.de/personal/vigeesh/simprogress/intensity.png";
    } else {
        document.getElementById("intensityimg").src = "ftp://ftp.leibniz-kis.de/personal/vigeesh/simprogress/intensity.gif";
    }
}

var dateoptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
};


var padding = document.getElementById("blockbottom").offsetWidth / 10;

var margin = {
        top: 0,
        right: document.getElementById("blockbottom").offsetWidth * 0.05,
        bottom: 12,
        left: document.getElementById("blockbottom").offsetWidth * 0.05
    },
    width = document.getElementById("blockbottom").offsetWidth - margin.left - margin.right,
    height = document.getElementById("blockbottom").offsetHeight - margin.top - margin.bottom;




var modtipphys = d3.select("#blocklefttop")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .html(" <b>Scheme: </b>" + "<br/>" + " <b>Reconstruction: </b>" + "<br/>" + " <b>Radiative Transfer: </b>" + "<br/>");

var modtipbc = d3.select("#blockleftbot")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .html("<b>Side: </b>" + "<br/>" + "  <b>Bottom: </b>" + "<br/>" + "  <b>Top: </b>" + "<br/>");

var modtipname = d3.select("#blocktop")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .html("<b></b><br/>")
    .style("visibility", "hidden");


var modtipmain = d3.select("#blocktop")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .style("visibility", "hidden");


var modtipcomp = d3.select("#blockrighttop")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .html("<b>Hardware:</b> " + "<br/>" + "<b>Machine:</b> " + "<br/>" + "<b>System:</b> " + "<br/>");

var modtipsched = d3.select("#blockrightbot")
    .append("text")
    .style("x", 10)
    .style("y", 10)
    .html("<b>Started:</b> " + "<br/>" + "<b>Ended:</b> " + "<br/>" + "<b>Duration:</b> " + "<br/>");



var xScale = d3.scale.linear()
    .domain([-10., 50000.]) //the minimum and maximum time of the entire simulation
    .range([padding, width - padding * 2]);

var starttime = [10, 20, 30, 40];



var clickedOnce = false;

var w = 500;
var h = 150;
var barPadding = 1;


var htitles = ['Datatype', 'Parameter', 'Value'];

//Create SVG element
var svg = d3.select("#blockbottom")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


var timeline = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("g")
    .append("rect")
    .attr("x", function (d) {
        return xScale(d.simstartime + d.parenttime);
    })
    .attr("y", function (d, i) {
        return i * (h / dataset.length);
    })
    .attr("width", function (d) {
        return xScale(d.simduration);
    })
    .attr("height", h / dataset.length - 0.2 * h / dataset.length)
    .style("cursor", "pointer")
    .style("fill", function (d) {
        return d.magnetic == 1 ? "silver" : "gray";
    })
    .on("mouseover", function (d) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("fill", "red");
        
        var start_date = new Date(d.wallstartime)
        var end_date = new Date(d.wallendtime)
        var durdays = Math.floor(d.wallduration / 86400);
        delta = d.wallduration - (durdays * 86400);
        var durhours = Math.floor(delta / 3600) % 24;
        delta = delta - (durhours * 3600);
        var durminutes = Math.floor(delta / 60) % 60;
        delta = delta - (durminutes * 60);
        var durseconds = delta % 60; // in theory the modulus is not required

        var lookup = {};
        for (var i = 0, len = d.params.length; i < len; i++) {
            lookup[d.params[i].parameter] = d.params[i].value;
        }

        modtipphys.html(" <b>Scheme: </b>" + lookup["hdscheme"] + "<br/>" + " <b>Reconstruction: </b>" + lookup["reconstruction"] + "<br/>" + " <b>Radiative Transfer: </b>" + lookup["radscheme"] + "<br/>")
            .transition()
            .duration(100)
            .style("visibility", "visible")

        modtipbc.html("<b>Side: </b>" + lookup["side_bound"] + "<br/>" + "  <b>Bottom: </b>" + lookup["bottom_bound"] + "<br/>" + "  <b>Top: </b>" + lookup["top_bound"] + "<br/>")
            .transition()
            .duration(100)
            .style("visibility", "visible")

        modtipname.html("<b>" + d.name + "</b><br/>")
            .transition()
            .duration(100)
            .style("visibility", "visible")

        modtipcomp.html("<b>Hardware:</b> " + d.hardware + "<br/>" + "<b>Machine:</b> " + d.machine + "<br/>" + "<b>System:</b> " + d.system + "<br/>")
            .transition()
            .duration(100)
            .style("visibility", "visible")


        modtipsched.html("<b>Started:</b> " + start_date.toLocaleTimeString("en-us", dateoptions) + "<br/>" + "<b>Ended:</b> " + end_date.toLocaleTimeString("en-us", dateoptions) + "<br/>" + "<b>Duration:</b> " + durdays + " d, " + durhours + " h, " + durminutes + " m " + "<br/>")
            .transition()
            .duration(100)
            .style("visibility", "visible")
    })
    .on("mouseout", function (d) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("fill", function (d) {
                return d.magnetic == 1 ? "silver" : "gray";
            });

    });

var circle = svg.selectAll("line")
    .data(dataset)
    .enter()
    .append("g")
    .append("line")
    .attr("x1", function (d) {
        return xScale(d.simstartime + d.parenttime);
    })
    .attr("y1", function (d, i) {
        return i * (h / dataset.length);
    })
    .attr("x2", function (d) {
        return xScale(d.simstartime + d.parenttime);
    })
    .attr("y2", function (d, i) {
        return (i + 1) * (h / dataset.length);
    })
    .attr("stroke-width", 1)
    .attr("stroke", "gray");

var svg2 = d3.select('#parambox')
    .on("mouseover", function (d) {
        d3.select(this).selectAll("table")
            .style("opacity", "1");
    });

var blinker = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
        return xScale(d.simendtime) + padding + 0.1 * padding;
    })
    .attr("cy", function (d, i) {
        return i * (h / dataset.length) + 0.4 * (h / dataset.length);
    })
    .attr("r", function (d) {
        return d.running == 0 ? 0 : (h / dataset.length) / 4.5;
    })

var blive = d3.select("#blinky").append("svg")
var blinker2text = blive
    .append("text")
    .attr("x", 12)
    .attr("y", 10)
    .text("Live: ").style("font-weight", "bold");

var blinker3text = blive.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
        return d.running == 0 ? 600 : 50;;
    })
    .attr("y", function (d, i) {
        return d.running == 0 ? 0 : 10;
    })
    .html(function (d, i) {

        var lookup = {};

        for (var i = 0, len = d.params.length; i < len; i++) {
            lookup[d.params[i].parameter] = d.params[i].value;
        }

        var modeltext = d.name + " - " + parseInt(lookup["teff"]) + ", "
            //+ " K, "  
            //    + "Gravity:  " 
            + parseInt(lookup["grav"]) + ", " //cm s-2"  + ", "  
            //+ "Entropy (inflow): " 
            + lookup["s_inflow"]

        return modeltext;
    });

var blinker2 = blive.append("circle")
    .attr("cx", 5)
    .attr("cy", 6)
    .attr("r", 4.5)



repeat();

function repeat() {
    blinker.style("fill", "silver")
        .transition().delay(100)
        .styleTween("fill", function () {
            return d3.interpolate("silver", "red");
        })
        .each("end", repeat);

    blinker2.style("fill", "silver")
        .transition().delay(100)
        .styleTween("fill", function () {
            return d3.interpolate("silver", "red");
        })
        .each("end", repeat);

}




function parameterbox() {
    var thead = d3.select('#area2').attr("class", "mypartab").select("thead").selectAll("th")
        .data(d)
        .enter()
        .append("th").text(function (d) { return d })
        .style("cursor", "pointer")
        .on("click", function (d) { d3.select(".mypartab").remove(); return 0;});

    // fill the table
    // create rows
    var tr = d3.select("tbody").selectAll("tr")
        .data(rhdpardata).enter().append("tr")

    // cells
    var td = tr.selectAll("td")
        .data(function (d) { return d3.values(d)})
        .enter().append("td")
        .text(function (d) { return d })
        //parbox.active = active;
    return 0;
}

function parameterboxremove() {
    d3.select("#area2").remove();
    return 0;
}




//running part

frt(datarunning.stime, datarunning.frtop, "blockrright", "frtop");

d3.selectAll("button").on("click", change);

//        var timeout = setTimeout(function() {
//        d3.select("input[value=\"San Francisco\"]").property("checked", true).each(change);
//        }, 2000);

function change() {
    d3.select("#blockrright").selectAll("svg").remove();
    var dtime = (this.value == "frtop") ? "stime" : "time";
    frt(datarunning[dtime], datarunning[this.value], "blockrright", this.value);

}


function frt(xdata, ydata, position, quanlabel) {
    var maxfrtop = Math.max.apply(null, ydata);
    var minfrtop = Math.min.apply(null, ydata);
    var maxfrtopvar = Math.max.apply(null, [maxfrtop - 1, 1 - minfrtop]);
    var padding = document.getElementById(position).offsetWidth / 20;
    var margin = {
            top: 0,
            right: document.getElementById(position).offsetWidth * 0.05,
            bottom: 1000,
            left: document.getElementById(position).offsetWidth * 0.05
        },
        width = document.getElementById(position).offsetWidth,
        height = (document.getElementById("intensityimg").offsetHeight - document.getElementById("mybuttons").offsetHeight);

    var firsttime = xdata[0];
    var lasttime = xdata[xdata.length - 1];

    var xScale = d3.scale.linear()
        .domain([0, (lasttime - firsttime) / 60.])
        .range([padding, width - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([minfrtop, maxfrtop])
        .range([height - padding, padding]);

    var line = d3.svg.line()
        .x(function (d, i) {
            return xScale((parseFloat(xdata[i]) - firsttime) / 60.);
        })
        .y(function (d, i) {
            return yScale(parseFloat(ydata[i]));
        })
        .interpolate("linear");


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.format("i"));


    var yformat = (quanlabel == "frtop") ? "i" : ".1e";
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format(yformat));

    var drag = d3.behavior.drag()
        .origin(function (d) { return d;})
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    var zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .on("zoom", zoomed);

    var graph = d3.select("#" + position)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
                         
    var x_axis = graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)

    var y_axis = graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    graph.append("path").attr("class", "myline").attr("d", line(xdata)).style("cursor", "pointer");

    graph.append("text").attr("class", "axislabel")
        .attr("text-anchor", "middle") 
        .attr("transform", "translate(" + (padding) + "," + (padding) + "),rotate(-90)")
        .text(quanlabel)
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .style("fill", "gray")
        .attr("dy", "1.0em")
        .attr("dx", "1.1em");

    graph.append("text").attr("class", "axislabel")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width - padding) + "," + (height - padding) + ")")
        .text("Time (min)")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .style("fill", "gray")
        .attr("dx", "-.1em")
        .attr("dy", "-.25em");


    function zoomed() {

        d3.select(this).select(".x.axis").call(xAxis); // for zooming axis
        d3.select(this).select(".y.axis").call(yAxis); // for zooming axis
        d3.select(this).select(".myline")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
            .style("stroke-width", 2 / d3.event.scale);
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
        d3.select(this).classed("dragging", false);
    }
}

hist(walldata.wallend, walldata.wallduration, walldata.histbins, walldata.hist, "blockrhist");


function hist(xdata, ydata, hxdata, hydata, position) {

    var mindur = Math.min.apply(null, ydata) / 60.;
    var maxdur = 250; //(Math.max.apply(null,ydata)+1000)/60.;

    var wpadding = 20;
    var hpadding = document.getElementById(position).offsetWidth / 15;

    var margin = {
            top: 0,
            right: document.getElementById(position).offsetWidth * 0.05,
            bottom: 12,
            left: document.getElementById(position).offsetWidth * 0.05
        },
        width = document.getElementById(position).offsetWidth,
        height = document.getElementById("intensityimg").offsetHeight;

    var firsttime = new Date(xdata[0]);
    //var lasttime = new Date(xdata[xdata.length - 1]);
    var lasttime = new Date();
    
    var xScale1 = d3.time.scale()
        .domain([firsttime, lasttime])
        .nice(d3.time.day)
        .range([wpadding, width / 2]);

    var yScale1 = d3.scale.linear()
        .domain([0, maxdur])
        .range([height - hpadding, hpadding]);


    var xAxis = d3.svg.axis()
        .scale(xScale1)
        .orient("bottom")
        .ticks(2)
        .tickFormat(d3.timeFormat("%b %d"))

    var yAxis = d3.svg.axis()
        .scale(yScale1)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format("i"));

    var graph1 = d3.select("#" + position)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    graph1.selectAll("path")
        .data(xdata)
        .enter()
        .append("line") // attach a line
        .attr("stroke", "lightgray") // colour the line
        .attr("stroke-width", 1)
        .attr("x1", function (d, i) {
            return xScale1( new Date(xdata[i]));
        })
        .attr("y1", function (d, i) {
            return yScale1(0);
        })
        .attr("x2", function (d, i) {
            return xScale1(new Date(xdata[i]));
        })
        .attr("y2", function (d, i) {
            return yScale1(parseFloat(ydata[i] / 60.));
        })



    graph1.selectAll("circle")
        .data(xdata)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return xScale1(new Date(xdata[i]));
        })
        .attr("cy", function (d, i) {
            return yScale1(parseFloat(ydata[i] / 60.));
        })
        .attr("r", 3.)
        .attr("fill", "crimson").attr("opacity", "0.8");

    
    graph1.selectAll("path")
        .append("line") // attach a line
        .attr("stroke", "lightblue") // colour the line
        .attr("stroke-width", 1)
        .attr("x1", function (d, i) {
            return xScale1( new Date());
        })
        .attr("y1", function (d, i) {
            return yScale1(0);
        })
        .attr("x2", function (d, i) {
            return xScale1(new Date());
        })
        .attr("y2", function (d, i) {
            return yScale1(maxdur);
        })

    

    // histogram

    var firstsize = Math.min.apply(null, hydata);
    var lastsize = Math.max.apply(null, hydata);

    var xScale2 = d3.scale.linear()
        .domain([0, lastsize + 1])
        .range([0, (width / 2)]);

    var yScale2 = d3.scale.linear()
        .domain([0, maxdur])
        .range([height - hpadding, hpadding]);

    var xAxis2 = d3.svg.axis()
        .scale(xScale2)
        .orient("top")
        .ticks(2)
        .tickFormat(d3.format("i"));

    var yAxis2 = d3.svg.axis()
        .scale(yScale2)
        .orient("right")
        .ticks(5)
        .tickFormat(d3.format("i"));

    graph1.selectAll("path")
        .data(hxdata)
        .enter()
        .append("rect")
        .attr("fill", "crimson")
        //.attr("opacity","0.8")
        .attr("y", function (d, i) {
            return yScale2(parseFloat(hxdata[i])) - 2.5;
        })
        .attr("x", function (d, i) {
            return xScale2(0) + width / 2;
        })
        .attr("width", function (d, i) {
            return xScale2(parseFloat(hydata[i]));
        })
        .attr("height", 5)




    var x_axis = graph1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - hpadding) + ")")
        .call(xAxis)

    var y_axis = graph1.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + wpadding + ",0)")
        .call(yAxis);


    var x_axis2 = graph1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (width / 2) + "," + hpadding + ")")
        .call(xAxis2)

    graph1.append("text").attr("class", "axislabel")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + "," + (height - hpadding) + ")")
        .text("Date")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .style("fill", "gray")
        .attr("dx", "1.0em")
        .attr("dy", "-.25em");


    graph1.append("text").attr("class", "axislabel")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (wpadding) + "," + (hpadding) + "), rotate(-90)")
        .text("Walltime (min)")
        .style("text-anchor", "begin")
        .style("font-weight", "bold")
        .style("fill", "gray")
        .attr("dy", "1em")
        .attr("dx", "-2em");

    //                var y_axis2=	graph1.append("g")
    //                    .attr("class", "y axis")
    //                    .attr("transform", "translate("+(width-2.0*wpadding)+ ",0)")
    //                    .call(yAxis2);//.attr("stroke","none");                     
    //                
    //         

    //                var y_axis2=	graph1.append("g")
    //                    .attr("class", "y axis2")
    //                    .attr("transform", "translate("+width/2+ ",0)")
    //                    .call(yAxis2)
    //                    .attr("opacity",0.2)
    //                    .style("font-weight","bold");//.attr("stroke","none");                     
    //                


}
