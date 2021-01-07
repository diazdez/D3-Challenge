// Referenced D3: Day3-Activity 12 
//DATA: poverty | age | income | healthcare | obesity | smokes

// @TODO: YOUR CODE HERE FOR BONUS ASSIGNMENT

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

// create a SVG that will hold the chart (scatter plot)
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group and shift the latter by left and top margins.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Initial Parameters
// var chartData = null;

var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

var xAxisLabels = ["poverty", "age", "income"];
var yAxisLabels = ["obesity", "smokes", "healthcare"];


var labelsTitle = { "poverty": "Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };



// function used for updating x-scale var upon click on axis label
function xScale(data,chosenXAxis) { 
  var xLinearScale1= d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenXAxis]) * .8, d3.max(data, d => d[chosenXAxis])*1.2])
  .range([0, width]);

  return xLinearScale1
};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data,chosenYAxis) { 
  var yLinearScale1= d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenYAxis])*.8, d3.max(data, d => d[chosenYAxis])*1.2])
  .range([height, 0]);

  return yLinearScale1
};

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
        .duration(1000)
        .call(leftAxis);

  return yAxis;
}



// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d.chosenXAxis))
  // .attr("cy", d => newYScale(d.chosenYAxis));

  return circlesGroup;
};


// function used for updating circles group with new tooltip
//==============================================================
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // X Axis
  var xlabel
  var ylabel 
  if (chosenXAxis === "poverty") {
      xlabel = "Poverty:";
  }
  else if (chosenXAxis === "income") {
      xlabel = "Median Income:"
  }
  else {
      xlabel = "Age: "
  }

  // Y Axis
  if (chosenYAxis === "healthcare") {
       ylabel = "Lacks Healthcare:";
  }
  else if (chosenYAxis === "smokes") {
       ylabel = "Smokers:"
  }
  else {
       ylabel = "Obesity:"
  };


  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .style("background", "black")
  .style("color", "white")
  .offset([80, -60])
  .html( function(d) {
               return(`${d.state}<hr>${xlabel} ${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`)
      }
  );
  circlesGroup.call(toolTip)

  // chartGroup.call(toolTip);


  // Event Listeners
  circlesGroup.on("click", function(d) {
      toolTip.show(d, this);})
      .on("mouseout", function(data){
          toolTip.hide(data)
      });

      return circlesGroup ;
};


// import data from csv file
d3.csv("assets/data/data.csv").then(function(healthData, err){
    // console.log(healthData);
    if (err) throw err;

    // Parse Data/Cast as numbers using unitary operator

    healthData.forEach(function(data){
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity
      });
      

    // x & y LinearScale function above csv import 
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create axis functions:  x (bottomAxis) & y (leftAxis)
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Append Axes to the chart
    // x-axis [aka bottomAxis] (translate allows the axes to be placed properly): 
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    // y-axis (no TRANSLATE bc by default everything will be placed at 0,0) ... 
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


    // Create Circles
    // "enter" function allows for circles to be added

    var circlesGroup = chartGroup.selectAll(".stateCircle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.chosenXAxis))
    .attr("cy", d => yLinearScale(d.chosenYAxis))
    .attr("r", "16")
    .attr("class", "stateCircle")
    .attr("opacity", ".4");

    // append text to the circles
    var textGroup = chartGroup.selectAll(".stateText")
    // textGroup.data(healthData)
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.chosenYAxis))
    .attr("y", d => yLinearScale(d.chosenYAxis))
    .attr("class", "stateText")
    .text(d => (d.abbr))
    .attr("font-size", "14px")
    .attr("font-weight", "bold")

    // Create group for x-axis labels
    //=======================================
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)

    var povertyLabel= xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel= xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

    var incomeLabel= xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median");

    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

    var smokeLabel= ylabelsGroup.append("text")
    .attr("y", 10 - (margin.left))
    .attr("x", 0 - height/2)
    .attr("value", "smokes") // value to grab for event listener
    .classed("active", true)
    .text("Smokes (%)");

    var healthcareLabel= ylabelsGroup.append("text")
    .attr("y", 50 - (margin.left))
    .attr("x", 0 - (height/2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

    var obesityLabel = ylabelsGroup.append("text")
    .attr("y", 30 -  (margin.left))
    .attr("x", 0 - (height/2))
    .attr("value", "obesity") // value to grab for event listener.
    .classed("inactive", true)
    .text("Obesity (%)");



   // Update tool tip function above csv import.
   var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

       // Event listener for X axis
       xlabelsGroup.selectAll("text")
       .on("click", function() {
           // Get value of selection.
           var value = d3.select(this).attr("value");
           
           //if select X axis
                   if (true) {
                       if (value === "poverty" || value === "age" || value === "income") {
                           // Replaces chosenXAxis with value.
                           chosenXAxis = value;
                           
                           // Update x scale for new data.
                           xLinearScale = xScale(healthData, chosenXAxis);
                           
                           // Updates x axis with transition.
                           xAxis = renderXAxes(xLinearScale, xAxis);
                           
                           // Update circles with new x values.
                           circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                           
                           // Update tool tips with new info.
                           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                           
                           // Update circles text with new values.
                           circlesGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                           
                           // Changes classes to change bold text.
                           if (chosenXAxis === "poverty") {
                               povertyLabel
                               .classed("active", true)
                               .classed("inactive", false);
                               
                               ageLabel
                               .classed("active", false)
                               .classed("inactive", true);
                               
                               incomeLabel
                               .classed("active", false)
                               .classed("inactive", true);
                           }
                           else if (chosenXAxis === "age"){
                               povertyLabel
                                   .classed("active", false)
                                   .classed("inactive", true);
                               
                               ageLabel
                                   .classed("active", true)
                                   .classed("inactive", false);
                               
                               incomeLabel
                                   .classed("active", false)
                                   .classed("inactive", true);
                           }
                           else {
                               povertyLabel
                                   .classed("active", false)
                                   .classed("inactive", true);

                               ageLabel
                                   .classed("active", false)
                                   .classed("inactive", true)

                               incomeLabel
                                   .classed("active", true)
                                   .classed("inactive", false);
                           }}

                   else {
                       chosenYAxis = value;
               
                       // Update y scale for new data.
                       yLinearScale = yScale(healthData, chosenYAxis);

                       // Updates y axis with transition.
                       yAxis = renderYAxes(yLinearScale, yAxis);

                       // Update circles with new x values.
                       circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                       // Update tool tips with new info.
                       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                       // Update circles text with new values.
                       textGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                       // Changes classes to change bold text.
                       if (chosenYAxis === "healthcare") {

                           healthcareLabel
                               .classed("active", true)
                               .classed("inactive", false);


                           smokeLabel
                               .classed("active", false)
                               .classed("inactive", true);

                           obesityLabel
                               .classed("active", false)
                               .classed("inactive", true);
                           }
                       else if (chosenYAxis === "smokes"){
                           healthcareLabel
                               .classed("active", false)
                               .classed("inactive", true);

                           smokeLabel
                               .classed("active", true)
                               .classed("inactive", false);

                           obesityLabel
                               .classed("active", false)
                               .classed("inactive", true);
                           }
                       else {
                           healthcareLabel
                               .classed("active", false)
                               .classed("inactive", true);

                           smokeLabel
                               .classed("active", false)
                               .classed("inactive", true);

                           obesityLabel
                               .classed("active", true)
                               .classed("inactive", false);
                           }
                   } 
                   }
                   
           });

    })
