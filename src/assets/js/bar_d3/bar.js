import * as d3 from "d3";
import "./bar.css"
import {transition, max} from "d3";

let svg = null;
let xScale = null;
let yScale = null;
let radiusScale = null;
let height = null;
let width = null;
let margin = null;
let yAxisElement = null;
let colorsScale = null;
let xAxisElement = null;
let transitionDuration = 1000;
let xAxisGridElement = null;
let yAxisGridElement = null;
let svgElement = null;
let wrapperHeight = null;
let stacks = null;
let maxWidth = null;
let tooltip = null;
let highlightedEmail = null;

export function init(maxWidth){
    maxWidth = maxWidth;
    margin = {top: 30, right: 30, bottom: 30, left: 50};

    svg = d3.select(".plotWrapper").append("svg")
        .classed("bubbleSvg", true)

    xAxisElement = svg.append("g")
        .attr("class", "axis x-axis")

    yAxisElement = svg.append("g")
        .attr("class", "axis y-axis")

    yAxisGridElement = svg.append('g')
        .attr('class', 'y axis-grid')

    stacks = svg.append("g");

    colorsScale = d3.scaleOrdinal()
        .range(["#75E2A0", "#E3E3FF", "#99B2FF", "#FFAE8D", "#FFEAAF", "#73D9D5", "#84d7fe", "#BFCD03", "#F4E5FF", "#8DD0DF", "#DEB7B7", "#D9BAE2", "#D2FCF5", "#73fd58", "#fdc7ff", "#d5ccc7", "#fdf1f7", "#e0d0fb", "#d6b2fb", "#8affd2", "#11ff13", "#dad351", "#e0b4c9", "#ff99fd", "#faff16", "#57e502", "#a6fe8e", "#bcfcd6", "#30dfc8", "#97db5c", "#fcdadf", "#43d9fd", "#fdfb73", "#e2c30e", "#e4fdde", "#bbd15f", "#98e116", "#dce994", "#fed7f3", "#ffad53", "#a3d378", "#85d4cd", "#fee3b0", "#d4d4af", "#96caff", "#bcca83", "#f9feae", "#cac2fc", "#b1fb27", "#85feea", "#bdc7ad", "#ffa4bc", "#b2e598", "#8ef8b0", "#fdc5b5", "#badfc5", "#e5e5d7", "#deba9d", "#82ea7f", "#2bf4e5", "#fee5d4", "#feeb8a", "#d6eee1", "#1bf3cd"])

    tooltip = d3.select("body").append("div")
        .attr("class", "stackedTooltip")
        .style("opacity", 0);
}

export function draw(csv, users, highlightUserEmail, speed = 1000){
    width = getWidth();
    height = getHeight();
    svg.attr("height", height + "px")
    svg.attr("width", width + "px")
    var keys = getUniqueEmails(csv);

    var x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

    xAxisElement.attr("transform", `translate(0,${height - margin.bottom})`)
    yAxisElement.attr("transform", `translate(${margin.left},0)`)

    colorsScale.domain(keys);    

    var data = csv;

    data.forEach(function(d) {
        d.total = d3.sum(keys, k => +d[k])
        return d
    })

    y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();
    let yAxisGrid = d3.axisLeft(y).tickSize(-(width - margin.right - margin.left)).ticks(10, "s").tickFormat("");

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(10, "s").tickFormat((d) => { return `$${d}K` }))

    x.domain(data.map(d => d.month));

    yAxisGridElement
        .attr("transform", `translate(${margin.left},0)`)
        .style("width", "400px")
        .transition().duration(transitionDuration)
        .call(yAxisGrid);

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))
    svg.selectAll("g.layer").remove();

    var group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)

    group.exit().remove()

    group.enter().append("g")
        .classed("layer", true)
        .attr("data-email", d => d.key)
        .attr("opacity", d => defineLayerOpacity(users, d.key, highlightUserEmail))
        .attr("fill", d => colorsScale(d.key));

    var bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => { return e.data.month });

    bars.exit().remove()

    bars.enter().append("rect")
        .attr("width", x.bandwidth())
        .on("mousemove", function(d, b, c) {
            displayTooltip(this, data, d, b, users);
        })
        .attr("y", height - margin.bottom)
        .attr("x", d => x(d.data.month))
        .on("mouseout", hideTooltip)
        .on("click", function(d, b, c){
            highlightClickedUser(this, data, d, b, users);
        })
        .transition().duration(speed)
        .attr("cursor", "pointer")
        .attr("y", d => y(d[1]))
        .attr("height", d => { return y(d[0]) - y(d[1]);})
}

function getUniqueEmails(data){
    let emails = [];

    data.forEach((person) => {
        for (const [key, value] of Object.entries(person)) {
            if(key.includes("@")) emails.push(key);
        }
    })

    return [... new Set(emails)];
}

function defineLayerOpacity(users, email, highlightUserEmail){
    if(!highlightUserEmail || !users.map((user) => user.email).includes(highlightUserEmail)) return 1;

    if(highlightUserEmail && highlightUserEmail == email) {
        return 1;
    } else {
        return 0.4;
    }
}

function hideTooltip(){
    tooltip.style("opacity", 0);
}

function displayTooltip(element, originalData, data, index, users){
    let email = element.closest(".layer").dataset.email;
    let value = originalData[index][email];
    let color = element.closest(".layer").getAttribute("fill");

    tooltip.style("opacity", 1);		
    tooltip.html(`
            <div class="item">
                <div>Close Month</div>
                <div>${data.data.month}</div>
            </div>
            <div class="item owner" style="border-left-color: ${color}">
                <div>Opportunity Owner</div>
                <div>${getUserName(users, email)}</div>
            </div>
            <div class="item">
                <div>Opportunity Amount</div>
                <div>$${value},000</div>
            </div>
    `)

    defineCoordinates(tooltip);
}

function highlightClickedUser(element, originalData, data, index, users){
    let email = element.closest(".layer").dataset.email;
    let value = originalData[index][email];
    let color = element.closest(".layer").getAttribute("fill");

    if(highlightedEmail == email) {
        highlightedEmail = null;
        draw(originalData, users, null, 0);
    } else {
        highlightedEmail = email;
        draw(originalData, users, email, 0);
    }
}

function getUserName(users, email) {
    let user = users.find((user) => user.email == email);
    let unknown = "Name unknown";
    if(user) {
        return user.name || unknown;
    }

    return unknown;
}

function defineCoordinates(element) {
    let coordinates = element.node().getBoundingClientRect();
    let height = coordinates.height;
    let width = coordinates.width;
    let mouseX = d3.event.pageX;
    let mouseY = d3.event.pageY;
    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;
    let left = mouseX + 20;
    let top = mouseY;

    if(mouseX + width > screenWidth) {
        left = mouseX - width - 20;
    }

    if(mouseY + height > screenHeight) {
        top = mouseY - height;
    }

    element
        .style("left", (left) + "px")		
        .style("top", (top) + "px");
}

function getWidth(){
    let dimensions = document.querySelector(".plotWrapper").getBoundingClientRect();
    let width = dimensions.width;
    if(maxWidth) {
        width = dimensions.width < maxWidth ? dimensions.width : maxWidth;
    }
    return width;
}

function getHeight(){
    let dimensions = document.querySelector(".plotWrapper").getBoundingClientRect();
    let height = dimensions.height;

    return 350;
}