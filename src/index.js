import "./styles.css";
import * as d3 from "d3";

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  const w = 1430;
  const h = 480;
  const padding = 60;
  const baseTemp = json.baseTemperature;
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
    .range([h - padding, padding]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d => d.toString());
  const yAxis = d3.axisLeft(yScale).tickFormat(function(d) {
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
    .attr("height", h);
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
      if (temp <= 5) {
        return "blue";
      }
      if (temp > 5 && temp <= 7) {
        return "aqua";
      }
      if (temp > 7 && temp < 8) {
        return "bisque";
      }
      if (temp >= 8 && temp <= 10) {
        return "orange";
      }
      if (temp > 10) {
        return "red";
      }
    });
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");
};
