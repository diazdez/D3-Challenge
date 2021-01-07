// You need to create a scatter plot between two of the data variables 
// such as Healthcare vs. Poverty (OR Smokers vs. Age).
// Using the D3 techniques, create a scatter plot that represents each state with circle elements. 
// =================================
// NOTES: 
// - selected to work on scatter plot for: Healthcare vs. Poverty
// - using "Live Server" to open html (instead of using Terminal). 
// - i referenced D3:3-05 class activity to make chart responsive (responsive code)
// that allows the website to be resized when browser window is adjusted...
// - i referenced D3:3-09 class activity for this hw assignment

//****************************************************************************************************** */
// @TODO: YOUR CODE HERE!

// svg container
var svgWidth = 800;
var svgHeight = 800;

// create a margin variable
var margin = {
  top: 50,
  right: 50,
  bottom:100,
  left: 100
};

// create width and height variable 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// need to create an SVG that will hold the chart (scatter plot)
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group and shift the latter by left and top margins.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from csv file
d3.csv("assets/data/data.csv").then(function(healthData){
    console.log(healthData);

    // Parse Data/Cast as numbers using unitary operator
    // ==============================
    healthData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });
      
    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    // .domain([8, d3.max(healthData, d => d.poverty)])
    .domain([8, d3.max(healthData.map(function(d){
      return d.poverty
    }))])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(healthData, d => d.healthcare)])
    .domain([0, d3.max(healthData.map(function(d){
      return d.healthcare
    }))])
    // Y-scale is flipped so that we can have 0 at the bottom of our axis
    .range([height, 0]);


    // Create axis functions:  x (bottomAxis) & y (leftAxis)
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Append Axes to the chart
    // ==============================
    // x-axis [aka bottomAxis] (translate allows the axes to be placed properly): 
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    // y-axis (no TRANSLATE bc by default everything will be placed at 0,0) ... 
    chartGroup.append("g")
    .call(leftAxis);


    // Create Circles
    // "enter" function allows for circles to be added
    // ==============================
    var circlesGroup = chartGroup.selectAll(".stateCircle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "16")
    .attr("class", "stateCircle")
    .attr("opacity", ".4");

    // append text to the circles
    var textGroup = chartGroup.selectAll(".stateText")
    // textGroup.data(healthData)
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText")
    .text(d => (d.abbr))
    .attr("font-size", "14px")
    .attr("font-weight", "bold")


    // Initialize tool tip (pop-up disclosing data details)
    // tooltip has a library, so .tooltip added to d3Style.css
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, -60])
    .html(function(d) {
        return (`${d.abbr}<br>Lacks Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


    // Step 8: Create event listeners to display and hide the tooltip
    // listener will require user to click the circle in order to view data-details retunred from "toolTip" 
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
  
    })
    
.catch(function(error) {
    console.log(error);
});


