import "./styles.css";
import * as d3 from "d3";

const req = new XMLHttpRequest();
req.open("GET", "/src/data.json", true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  const w = 886;
  const h = 600;
  const padding = 50;
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        json.monthlyVariance.map(d =>
          new Date().setFullYear(d.year)
        )
      ),
      d3.max(
        json.monthlyVariance.map(d =>
          new Date().setFullYear(d.year)
        )
      )
    ])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([
      new Date().setMonth(0),
      new Date().setMonth(11)
    ])
    .range([h - padding, padding]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(26)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d3.timeFormat("%b"));
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
    .attr("x", (d, i) =>
      xScale(new Date().setFullYear(d.year))
    )
    .attr("y", (d, i) =>
      yScale(new Date().setMonth(d.month - 1))
    )
    .attr("height", "10px")
    .attr("width", "3px");
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
