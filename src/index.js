import "./styles.css";
import * as d3 from "d3";

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  const w = 1410;
  const h = 600;
  const padding = 50;
  const baseTemp = json.baseTemperature;
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        json.monthlyVariance.map(d => {
          var date = new Date();
          date.setFullYear(d.year);
          return date;
        })
      ),
      d3.max(
        json.monthlyVariance.map(d => {
          var date = new Date();
          date.setFullYear(d.year);
          return date;
        })
      )
    ])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([h - padding, padding]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(26)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).ticks(12);
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
    .attr("x", d =>
      xScale(new Date().setFullYear(d.year))
    )
    .attr("y", d => h - padding - yScale(d.month - 1))
    .attr("data-month", d =>
      new Date().setMonth(d.month)
    )
    .attr("data-year", d =>
      new Date().setFullYear(d.year)
    )
    .attr("data-temp", d => baseTemp + d.variance);
  svg
    .append("g")
    .attr(
      "transform",
      "translate(0," + (h - padding) + ")"
    )
    .call(xAxis)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");
};
