var aggregation = "none";
var currentYear = 1995;
var currentData = 0;
var chartDisplay = "population";
var filter = [];
var sortByDescending = false;
var sortBy = "name";
var table, thead, tbody, svg, barHolder, bars, trans;
var columns = ["name", "continent", "gdp", "life_expectancy", "population", "year"];

function initAll() {
    var startYear = document.getElementById('startYear');
    var endYear = document.getElementById('endYear');
    startYear.innerHTML = '1995'
    endYear.innerHTML = '2012'

    var yearRange = document.getElementById('yearRange');
    yearRange.value = 1995
    yearRange.min = 1995
    yearRange.max = 2012
    yearRange.step = 1
}

function initForChart() {
    initAll()
    fillData();
}

function initTable() {
    initAll()
    formTable()
}

function onChangeControls() {
    currentYear = d3.select("input[type=range]").property("value");

    var remove = false;
    var oldFilter = filter;

    filter = [];
    d3.selectAll("input[type=checkbox]").each(function (d) {
        if (d3.select(this).property("checked")) {
            filter.push(d3.select(this).attr("value"));
        }
    });

    if (oldFilter.length == filter.length) {
        filter.forEach(function callback(d, index, array) {
            if (d != oldFilter[index]) remove = true;
        });
    } else remove = true;

    var oldAggr = aggregation;
    d3.selectAll("input[name=aggregation]").each(function (d) {
        if (d3.select(this).property("checked")) {
            aggregation = d3.select(this).attr("value");
        }
    });
    if (oldAggr != aggregation) remove = true;

    var selection = d3.selectAll("input[name=sorting]"), oldSorting = sortBy;
    if (selection) {
        selection.each(function (d) {
            if (d3.select(this).property("checked")) {
                sortBy = d3.select(this).attr("value");
                if (sortBy == "name") {
                    sortByDescending = false;
                } else {
                    sortByDescending = true;
                }
            }
        });
        if (oldSorting != sortBy) remove = true;
    }

    selection = d3.selectAll("input[name=chartDisplay]");
    if (selection) {
        selection.each(function (d) {
            if (d3.select(this).property("checked")) {
                chartDisplay = d3.select(this).attr("value");
            }
        });
    }
	
    if (remove) {
        if (barHolder) {
			barHolder = 0;
            barHolder.remove();
        }
    }
    fillData();
}

function loadChart() {
    var chart = d3.select("div[id=chart]");

    if (chart) {
        var margin = {top: 5, right: 5, bottom: 50, left: 50};
        var fullWidth = 600;
        var fullHeight = 1300;
        var textWidth = 200;

        var width = fullWidth - margin.right - margin.left - textWidth;
        var height = fullHeight - margin.top - margin.bottom;

        if (!svg) {
            svg = chart.append('svg')
                .attr('width', fullWidth)
                .attr('height', fullHeight);
        }

        var barWidth = 20;
        var barScale = d3.scaleLinear()
            .domain([0, d3.max(currentData, function (d) {
                return d[chartDisplay];
            })])
            .rangeRound([0, width]);

        if (barHolder) {
			barScale = d3.scaleLinear()
                .domain([0, d3.max(currentData, function (d) {
                    return d[chartDisplay];
                })])
                .range([0, width]);
            bars.transition()
                .attr('width', function (d) {
                    return barScale(d[chartDisplay]);
                })
        } else {
			barScale = d3.scaleLinear()
                .domain([0, d3.max(currentData, function (d) {
                    return d[chartDisplay];
                })])
                .rangeRound([0, width]);
            if (!barHolder) barHolder = svg.append('g')
                .classed('bar-holder', true);
            var yPos = 0;
            barHolder.selectAll('rect.bar')
                .data(currentData)
                .enter()
                .append('rect')
                .classed('bar', true).transition()
                .attr('x', textWidth)
                .attr('width', function (d) {
                    return barScale(d[chartDisplay]);
                })
                .attr('y', function (d) {
                    yPos += barWidth + 5;
                    return (yPos - barWidth);
                })
                .attr('height', barWidth);
            yPos = 0;
            barHolder.selectAll('text')
                .data(currentData)
                .enter()
                .append('text').text(function (d) {
                return d.name;
            }).transition()
                .attr("text-anchor", "end")
                .attr("x", textWidth - 5)
                .attr('y', function (d) {
                    yPos += barWidth + 5;
                    return (yPos - barWidth * 0.3);
                });
            bars = barHolder.selectAll('rect.bar');
        }
    }
}

function formTable() {
    table = d3.select("div[id=table]").append("table");
    if (table) {
        thead = table.append("thead").attr("class", "thead");
        table.append("caption")
            .html("World Countries Ranking");

        thead.append("tr").selectAll("th")
            .data(columns)
            .enter()
            .append("th").style("cursor", "s-resize")
            .text(function (d) {
                return d;
            })
            .on("click", function (header, i) {
                sortByDescending = !sortByDescending;
                sortBy = columns[i];
                if (sortByDescending) {
                    thead.selectAll("th").style("cursor", "s-resize").text(function (d) {
                        return d;
                    });
                    this.innerHTML = columns[i] + " ▼";
                }
                else {
                    thead.selectAll("th").style("cursor", "n-resize").text(function (d) {
                        return d;
                    });
                    this.innerHTML = columns[i] + " ▲";
                }
                fillData();
            });
        fillData();
    }
}

function zebra() {
    d3.selectAll("tr").style("background-color", function (d, i) {
        return i % 2 ? "#fff" : "#ddd";
    });
}

function loadTable() {
    if (table) {
        if (tbody) tbody.remove();
        tbody = table.append("tbody");
        var rows = tbody.selectAll("tr.row")
            .data(currentData)
            .enter()
            .append("tr").attr("class", "row");

        var cells = rows.selectAll("td")
            .data(function (row) {
                return d3.range(columns.length).map(function (column, i) {
                    return row[columns[i]];
                });
            })
            .enter()
            .append("td")
            .text(function (d, i) {
                if (columns[i] == "gdp") {
                    return d3.format(",.3s")(d);
                } else if (columns[i] == "life_expectancy") {
                    return d3.format(".1f")(d);
                } else if (columns[i] == "population") {
                    return d3.format(",")(d);
                } else return d;
            })
            .on("mouseover", function (d, i) {

                d3.select(this.parentNode)
                    .style("background-color", "#269de6");

            }).on("mouseout", function () {
                zebra();
            });
        zebra();
    }
}

function fillData() {
    d3.json("./data/countries_1995_2012.json").then(function (data) {
        data.forEach(function callback(innerData, index, array) {
			innerData.population = innerData.years[currentYear - 1995].population;
            innerData.year = innerData.years[currentYear - 1995].year;
            innerData.gdp = innerData.years[currentYear - 1995].gdp;
            innerData.life_expectancy = innerData.years[currentYear - 1995].life_expectancy;
        });
        newData = data;

        if (aggregation == "by continent") {
            data = d3.nest().key(function (d) {
                return d.continent;
            }).entries(data);
            var nestedKeys = d3.keys(data);
            nestedKeys.forEach(function (d, index, array) {
				newData[index].gdp = d3.sum(data[index].values, function callback(d, index, array) {
                    return d.gdp;
                });
                newData[index].life_expectancy = d3.mean(data[index].values, function callback(d, index, array) {
                    return d.life_expectancy;
                });
                newData[index].population = d3.sum(data[index].values, function callback(d, index, array) {
                    return d.population;
                });
                newData[index].name = data[index].key;
                newData[index].continent = data[index].key;
                newData[index].year = currentYear
            });
            newData = newData.filter(function (d) {
                return (d["continent"] == d["name"]);
            });
            data = newData;
        }

        if (filter.length) {
            data = data.filter(function (d) {
                return (filter.indexOf(d.continent) != -1);
            });
        }

        if (sortBy) {
            data.sort(function (v1, v2) {
                var res = d3.descending(v1[sortBy], v2[sortBy]);
				if (res == 0) {
                    res = -d3.descending(v1["name"], v2["name"]);
                }
                if (sortByDescending != true) {
                    res -= res;
                }
                return res;
            });
        }
        currentData = data;
        loadChart();
        loadTable();
    });
}
