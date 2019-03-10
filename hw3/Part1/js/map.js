/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.map = d3.select('#map');
        this.mapPoints = d3.select('#points');
    }

    /**
     * Function that clears the map
     */
    clearMap() {
        this.mapPoints.selectAll('circle').remove();
        this.map.selectAll('.team').classed('team', false);
        this.map.selectAll('.host').classed('host', false);
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        var arr = worldcupData.teams_iso;

        for (var i = 0; i < arr.length; i++) {
            this.map.select("#cntr_" + arr[i]).classed('team', true);
        }

        this.map.select("#cntr_" + worldcupData['host_country_code']).classed('host', true);

        this.mapPoints
            .data([worldcupData.win_pos])
            .append('circle')
            .attr("cx",  d => this.projection(d)[0])
            .attr("cy", d =>  this.projection(d)[1])
            .attr("r", "8px")
            .classed("gold", true);

        this.mapPoints
            .data([worldcupData.ru_pos])
            .append('circle')
            .attr("cx", d => this.projection(d)[0])
            .attr("cy", d => this.projection(d)[1])
            .attr("r", "8px")
            .classed("silver", true);

    }


    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
        var path = d3.geoPath().projection(this.projection);

        this.map.selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr('id', d => 'cntr_' + d.id)
            .classed("countries", true)
            .attr("d", path);

        var graticule = d3.geoGraticule();

        this.map.append("path")
            .datum(graticule)
            .style("fill", "none")
            .style("stroke", '#777')
            .style("stroke-width", '.5px')
            .style("stroke-opacity", 0.7)
            .attr("d", path);
    }
}