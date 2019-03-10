    /**
     * Loads in the table information from fifa-matches.json 
     */
d3.json('data/fifa-matches.json',function(error,data){
    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree.csv", function (error, csvData) {
        csvData.forEach(function (d, i) {
             d.id = i; });

        let tree = new Tree();
        tree.createTree(csvData);

        let table = new Table(data,tree);
        table.createTable();
        table.updateTable();
    });
});