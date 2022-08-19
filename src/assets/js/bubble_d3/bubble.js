import * as d3 from "d3";
import "./bubble.css"
import {transition, max} from "d3";

let svg = null;
let svg2 = null;
let xScale = null;
let yScale = null;
let radiusScale = null;
let height = null;
let width = null;
let margin = null;
let yAxisElement = null;
let xAxisElement = null;
let transitionDuration = 1000;
let xAxisGridElement = null;
let yAxisGridElement = null;
let chartWrapperDiv = null;
let svgElement = null;
let wrapperHeight = null;
let maxWidth = null;

export function init(maxWidth){
    maxWidth = maxWidth;
    margin = {top: 20, right: 32, bottom: 2, left: 150};

    chartWrapperDiv = d3.select(".plotWrapper")
        .append("div")
        .classed("chartWrapper", true)
        
    svgElement = chartWrapperDiv.append("svg")
        .classed("bubbleSvg", true)
        
    svg = svgElement.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg2 = d3.select(".plotWrapper")
        .append("div")
        .classed("xAxisWrapper", true)
        .append("svg")
        .style("transform", `translate(${margin.left}px, 0px)`)
        .style("webkit-transform", `translate(${margin.left}px, 0px)`)

    yAxisElement = svg.append("g")
        .attr('class', 'y axis')
    xAxisElement = svg2.append("g")
        .attr('class', 'x axis')
    
    xAxisGridElement = svg.append('g')
        .attr('class', 'x axis-grid')
        // .attr('transform', 'translate(0,' + height + ')')
    yAxisGridElement = svg.append('g')
        .attr('class', 'y axis-grid')
}

function getWidth(){
    let dimensions = document.querySelector(".plotWrapper").getBoundingClientRect();
    let width = dimensions.width;
    if(maxWidth) {
        width = dimensions.width < maxWidth ? dimensions.width : maxWidth;
    }
    return width;
}

export function draw(data){
    document.querySelector(".chartWrapper").scrollTop = 0;
    let chartHeight = data.length * 70;
    if(chartHeight < 200) { chartHeight = 200 }
    height = chartHeight - margin.top - margin.bottom;
    width = getWidth() - margin.left - margin.right;
    yScale = d3.scalePoint().range([height, 0]).padding(1);
    xScale = d3.scalePoint().range([0, width]).padding(1);
    chartWrapperDiv.style("height", height + margin.top + margin.bottom + "px")
    chartWrapperDiv.style("width", width + margin.left + margin.right + "px")
    svgElement.attr("height", chartHeight + "px")
    svgElement.attr("width", width + margin.left + margin.right)
    svg2.attr("height", 20)
    svg2.attr("width", width + margin.left + margin.right)
    xAxisGridElement.attr('transform', 'translate(0,' + height + ')')

    
    xScale.domain(getXDomain(data));
    yScale.domain(data.map(person => person.name));

    let yAxis = d3.axisLeft(yScale);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGrid = d3.axisBottom(xScale).tickSize(-height).tickFormat('');
    let yAxisGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('');

    yAxisElement.call(yAxis);
    xAxisElement.transition().duration(transitionDuration).call(xAxis);

    xAxisGridElement
        .transition().duration(transitionDuration)
        .call(xAxisGrid);
    yAxisGridElement
        .transition().duration(transitionDuration)
        .call(yAxisGrid);

    let flatData = flattenData(data);

    let minValue = Math.min(...flatData.map(person => person.value))
    let maxValue = Math.max(...flatData.map(person => person.value))
    
    let radius = calculateMinMaxRadius(data);
    radiusScale = d3.scaleLinear().domain([minValue, maxValue]).range([radius.min, radius.max]);

    let update = svg.selectAll(".dot").data(flatData);
    let enter = update.enter();
    let exit = update.exit();

    setAttributes(update)
        
    setAttributes(enter.append("circle"))

    exit.remove();

    drawVerticalTicks(data);
}

function getXDomain(data){
    let xDomain = data.reduce((accumulator, user) => {
        user.stats.forEach((stat => {
            if(!accumulator.includes(stat.date)) {
                accumulator.push(stat.date)
            }
        }))

        return accumulator;
    }, []);

    xDomain.sort((a,b) => {
        return new Date(a) - new Date(b);
    })

    return xDomain;
}

function flattenData(data){
    let flatData = data.reduce((accumulator, person) => {
        person.stats.forEach(stat => {
            if(stat.value) {
                accumulator.push({name: person.name, date: stat.date, value: stat.value});
            }
        })
        return accumulator;
    }, []);

    return flatData;
}

function calculateMinMaxRadius(data){
    let distanceBetweenColumns = xScale(data[0].stats[0].date);
    let distanceBetweenRows = data[1] ? yScale(data[0].name) - yScale(data[1].name) : height / 2;
    let minRadius = 7;
    let maxHorizontalRadius = distanceBetweenColumns / 2;
    let maxVerticalRadius = distanceBetweenRows / 2;
    console.log(maxHorizontalRadius, maxVerticalRadius)
    let maxRadius = maxHorizontalRadius;
    if(maxRadius > maxVerticalRadius) { maxRadius = maxVerticalRadius };

    return {min: minRadius, max: maxRadius};
}

function setAttributes(selection){
    selection
        .attr("class", "dot")
        .attr("fill", d => fillColor(d))
        .attr("r", 0)
        .attr("cx", 0)
        .attr("cy", d => yScale(d.name))
        .attr("data-date", d => d.date)
        .attr("data-name", d => d.name)
        .attr("data-value", d => d.value)
        .on("mouseover", mouseOverCircle)
        .on("mouseout", mouseOutCircle)
        .transition().duration(transitionDuration)
        .attr("cx", d => xScale(d.date))
        .attr("r", d => radiusScale(d.value))
}

function mouseOverCircle(dot){
    d3.selectAll(`[data-name="${dot.name}"]`)
        .each(drawPercentsInCircle)
    
    d3.selectAll(`[data-date="${dot.date}"]`)
        .each(drawPercentsInCircle)
}

function drawPercentsInCircle(circle){
    let circleCoordinates = this.getBoundingClientRect();
    let chartElement = document.querySelector(".chartWrapper");
    let chartCoordinates = chartElement.getBoundingClientRect();
    let offsetLeft = circleCoordinates.left - chartCoordinates.left; 
    let offsetTop = circleCoordinates.top - chartCoordinates.top + chartElement.scrollTop; 
    let percent = d3.select(this).attr("data-value");
    let textWidth = getTextDimensions(percent).width;
    let radius = d3.select(this).attr("r");

    d3.select(".chartWrapper").append("div")
        .classed("percentageWrapper", true)
        .style("top", offsetTop + "px")
        .style("left", offsetLeft + "px")
        .style("width", radius * 2 + "px")
        .style("height", radius * 2 + "px")
        .append("div")
        .text(percent)
        .classed("bubbleValueLabel", true)
}

function getTextDimensions(text) {
    let font = "normal 12px arial";
    const canvas = getTextDimensions.canvas || (getTextDimensions.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return {width: metrics.width};
}

function mouseOutCircle(dot){
    d3.selectAll(".bubbleValueLabel").remove();
}

function drawVerticalTicks(data){
    d3.selectAll(".customTick").remove();
    d3.selectAll(".y.axis .tick").each(function(tick){
        let person = data.find((person) => person.name == tick);

        let screenCoordinates = this.getBoundingClientRect();
        let chartElement = document.querySelector(".chartWrapper");
        let chartCoordinates = chartElement.getBoundingClientRect();
        let offsetLeft = screenCoordinates.right - chartCoordinates.left + 9; 
        let offsetTop = screenCoordinates.top + screenCoordinates.height / 2 - chartCoordinates.top + chartElement.scrollTop; 
        let customTick = d3.select(".chartWrapper").append("div")
            .attr("class", "customTick")
            .style("left", offsetLeft - margin.left - 50 + "px")
            .style("width", margin.left + "px")
            .style("top", offsetTop + "px")
        
        customTick.append("img")
                .attr("src", person.avatar)
                .attr("height", "26px")
                .attr("width", "26px")
        customTick.append("span")
                .text(person.name)

        let height = customTick.node().getBoundingClientRect().height;
        console.log(height);
        customTick.style("top", offsetTop - height / 2 + "px")

        customTick
            .transition().duration(transitionDuration)
            .style("left", offsetLeft - margin.left + "px")
    })
}

function fillColor(person){
    let percent = person.value;
    if(percent > 80) return "#5cb23e";
    if(percent >= 60 && percent <= 80) return "#ffeab6";
    if(percent < 60) return "#eb0000";
}