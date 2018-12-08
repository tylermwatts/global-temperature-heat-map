import "./styles.css";
import * as d3 from "d3";

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  const w = 1430;
  const h = 580;
  const padding = 60;
  const bottomMargin = 100;
  const baseTemp = json.baseTemperature;
  const legendData = {
    colors: [
      "blue",
      "deepskyblue",
      "skyblue",
      "antiquewhite",
      "bisque",
      "orange",
      "orangered",
      "red",
      "crimson"
    ],
    text: [
      "3",
      "4 - 5",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10 - 11",
      "11.5+"
    ]
  };
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(json.monthlyVariance.map(d => d.year)),
      d3.max(json.monthlyVariance.map(d => d.year))
    ])
    .range([padding, w]);
  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([h - padding - bottomMargin, padding]);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d => d.toString());
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(function(d) {
      switch (d) {
        case 0:
          return "January";
        case 1:
          return "February";
        case 2:
          return "March";
        case 3:
          return "April";
        case 4:
          return "May";
        case 5:
          return "June";
        case 6:
          return "July";
        case 7:
          return "August";
        case 8:
          return "September";
        case 9:
          return "October";
        case 10:
          return "November";
        case 11:
          return "December";
        default:
          return "";
      }
    });
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "chart");
  let tooltip = d3
    .select("#chart")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);
  svg
    .selectAll("rect")
    .data(json.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month - 1))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance)
    .style("fill", d => {
      let temp = baseTemp + d.variance;
      if (temp <= 3) {
        return "blue";
      }
      if (temp > 3 && temp <= 5) {
        return "deepskyblue";
      }
      if (temp > 5 && temp <= 7) {
        return "skyblue";
      }
      if (temp > 7 && temp <= 7.5) {
        return "antiquewhite";
      }
      if (temp > 7.5 && temp <= 8) {
        return "bisque";
      }
      if (temp > 8 && temp <= 9) {
        return "orange";
      }
      if (temp > 9 && temp <= 10) {
        return "orangered";
      }
      if (temp > 10 && temp < 11.5) {
        return "red";
      }
      if (temp > 11.5) {
        return "crimson";
      }
    })
    .on("mouseover", function(d) {
      d3.selectAll(this).style("stroke", "black");
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip
        .html(`Year: ${d.year}\nVar: ${d.variance}C`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      tooltip.attr("data-year", d.year);
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(400)
        .style("opacity", 0);
    });
  svg
    .append("g")
    .attr(
      "transform",
      "translate(0," +
        (h - padding - bottomMargin) +
        ")"
    )
    .call(xAxis)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");
  const legend = svg
    .append("g")
    .attr("transform", "translate(60,480)")
    .attr("id", "legend");
  legend
    .selectAll("rect")
    .data(legendData.colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => 50 * i)
    .attr("y", 0)
    .attr("height", 30)
    .attr("width", 50)
    .style("fill", d => d);
  legend
    .selectAll("text")
    .data(legendData.text)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 50)
    .attr("y", -5)
    .text(d => d + "C")
    .style("font-size", 12);
};
