/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        d3.select('#winner').text(d => oneWorldCup['winner']);
        d3.select('#host').text(d => oneWorldCup['host']);
        d3.select('#silver').text(d => oneWorldCup['runner_up']);

        d3.selectAll("li").remove();

        var teams = d3.select('#teams')
            .selectAll('li')
            .data(oneWorldCup['teams_names']);

        teams.enter().append('li').text(d => d);
    }
}