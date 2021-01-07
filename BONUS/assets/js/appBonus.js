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
}

// function used for updating y-scale var upon click on axis label
function yScale(data,chosenYAxis) { 
    var yLinearScale1= d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis])*.8, d3.max(data, d => d[chosenYAxis])*1.2])
    .range([height, 0]);
  
    return yLinearScale1
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

  return xAxis;
}

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
// function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
//   circlesGroup.transition()
//   .duration(1000)
//   .attr("cx", d => newXScale(d.chosenXAxis))
//   // .attr("cy", d => newYScale(d.chosenYAxis));

//   return circlesGroup;
// };

// new function creating new circles x & y separately: 
// circles for x
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
// circles for y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis])+3)
  
    return circlesGroup;
}

// Updating text 
function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis])+3)
  
    return circlesGroup;
}

// function used for updating circles group with new tooltip
//==============================================================
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    
    var xlabel
    var ylabel 

  // X Axis

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
  .offset([100, -60])
  .html( function(d) {
               return(`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`)
      }
  );
  circlesGroup.call(toolTip)

  chartGroup.call(toolTip);


  // Event Listeners
  circlesGroup.on("click", function(data) {
      toolTip.show(data, this);})
      .on("mouseout", function(data, index){
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
    var circlesText = chartGroup.selectAll(".stateText")
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

    // Create group for x-axis labels (total of 3 labels)
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
   
   // ** REVISED CODE ** 
       // x axis labels event listener
       xlabelsGroup.selectAll("text")
       .on("click", function() {
         // get value of selection
         var value = d3.select(this).attr("value");
         if (value !== chosenXAxis) {
   
           // replaces chosenXAxis with value
           chosenXAxis = value;
   
           // console.log(chosenXAxis)
   
           // functions here found above csv import
           // updates x scale for new data
           xLinearScale = xScale(healthData, chosenXAxis);
   
           // updates x axis with transition
           xAxis = renderXAxes(xLinearScale, xAxis);
   
           // updates circles with new x values
           circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
 
         //   updating text within circles
           circlesText = renderXText(circlesText, xLinearScale, chosenXAxis)  
   
           // updates tooltips with new info
           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
   
           // changes classes to change bold text
           if (chosenXAxis === "age") {
             ageLabel
               .classed("active", true)
               .classed("inactive", false);
             povertyLabel
               .classed("active", false)
               .classed("inactive", true);
             incomeLabel
               .classed("active", false)
               .classed("inactive", true);
           }
           else if(chosenXAxis === 'income'){
             incomeLabel
               .classed("active", true)
               .classed("inactive", false);
             povertyLabel
               .classed("active", false)
               .classed("inactive", true);
             ageLabel
               .classed("active", false)
               .classed("inactive", true);
           }
           else {
             incomeLabel
               .classed("active", false)
               .classed("inactive", true);
             ageLabel
               .classed("active", false)
               .classed("inactive", true);
             povertyLabel
               .classed("active", true)
               .classed("inactive", false);
           }
         }
       });
 
       // y axis labels event listener
     ylabelsGroup.selectAll("text")
     .on("click", function() {
       // get value of selection
       var value = d3.select(this).attr("value");
       if (value !== chosenYAxis) {
 
         // replaces chosenYAxis with value
         chosenYAxis = value;
 
         // console.log(chosenYAxis)
 
         // functions here found above csv import
         // updates y scale for new data
         yLinearScale = yScale(healthData, chosenYAxis);
 
         // updates x axis with transition
         yAxis = renderYAxes(yLinearScale, yAxis);
 
         // updates circles with new y values
         circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
 
         // update text within circles
         circlesText = renderYText(circlesText, yLinearScale, chosenYAxis) 
 
         // updates tooltips with new info
         circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
 
         // changes classes to change bold text
         if (chosenYAxis === "obesity") {
           obesityLabel
             .classed("active", true)
             .classed("inactive", false);
           smokeLabel
             .classed("active", false)
             .classed("inactive", true);
           healthcareLabel
             .classed("active", false)
             .classed("inactive", true);
         }
         else if(chosenYAxis === 'smokes'){
           smokeLabel
             .classed("active", true)
             .classed("inactive", false);
           healthcareLabel
             .classed("active", false)
             .classed("inactive", true);
           obesityLabel
             .classed("active", false)
             .classed("inactive", true);
         }
         else {
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
       }
     });


    }).catch(function(error) {
    console.log(error);
    });
