/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions/blob/84b538fa99e43647d0d4717247d7b650cb9049eb/README.md


*/
import * as d3 from "d3";

export const ChartVisulization = () => {
	// Exposed variables
	var attrs = {
		id: 'ID' + Math.floor(Math.random() * 1000000), // Id for event handlings
		svgWidth: 550,
		svgHeight: 400,
		marginTop: 5,
		marginBottom: 5,
		marginRight: 5,
		marginLeft: 5,
		container: 'body',
		defaultTextFill: '#2C3E50',
		defaultFont: 'Helvetica',
		data: null,
		checked: false,
		bubbleChartColors: null,
		force: { strength: 0.03, velocityDecay: 0.2 },
		disableSimulation: false,
		ranges: { promoter: [9, 10], passive: [7, 8], detractor: [1, 2, 3, 4, 5, 6] },
		increasedRadius: 50,
		currentQuarter: 1,
		hoveredBubbleId: [],
		labels: { verticalDistance: 20, fontFamily: 'Lato', fontSize: '20px', fill: '#414141', textAnchor: 'middle', spanSize: '25px', animationTime: 1000 },
		distanceFromCenter: 25,
		firstLoad: true
	};

	//InnerFunctions which will update visuals
	var updateData;

	//Main chart object
	var main = function () {

		drawFirstRow();
		drawSecondRow();
		drawThirdRow();
		drawFourthRow();

		//#########################################  By Manager ##################################
		function drawFirstRow() {

			//Drawing containers
			var container = d3.select(attrs.container[0]);
			container.select('svg').remove();

			if (container.node() == null) return;

			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.chartPositions = { first: calc.chartWidth / 7, second: calc.chartWidth / 3, third: calc.chartWidth / 1.8, fourth: 1.2 }

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont);

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//center coordinates of each bubble section
			var npsCenters = {
				promoter: { x: calc.chartWidth / 2.5},
				passive: { x: calc.chartWidth / 1.66 },
				detractor: { x: calc.chartWidth / 1.25}
			};

			//bubble animation
			var simulation = d3.forceSimulation()
				.velocityDecay(attrs.force.velocityDecay)
				.force('y', d3.forceY().strength(attrs.force.strength).y(calc.chartHeight / 2 - attrs.distanceFromCenter))
				.force('charge', d3.forceManyBody().strength(charge))
				.force('collision', d3.forceCollide().radius(d => d.radius + 2))
				.on('tick', ticked);

			simulation.stop();

			setTimeout(() => {
				createSortableBubbles();
			}, 2000);

			var nodes = createNodesTotal('manager_login');

			var bubblesContainer = chart.append('g').classed('bubbles-container', true);

			var bubbles = bubblesContainer.selectAll('.bubble')
				.data(nodes, function (d) { return d.id; });

			var bubblesE = bubbles.enter()
				.append('g')
				.classed('bubble-group', true)
				.on('mouseover', function (d) {
					expandMultipleBubbles(d);
				})
				.on('mouseout', function (d) {
					attrs.hoveredBubbleId = [];
					shrinkMultipleBubbles();
				})
				.attr('onclick', 'void(0)')
				.append('circle')
				.classed('bubble', true)
				.attr('r', 0)
				.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
				.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
				.attr('stroke-width', 1)
				.style('cursor', 'pointer');

			bubbles = bubbles.merge(bubblesE);

			bubbles.transition()
				.duration(2000)
				.attr('r', function (d) { return d.radius; });

			simulation.nodes(nodes);

			groupBubbles();
			addEventListeners();
			overrideD3Selection();

			setTimeout(() => {
				addLabels();
			}, 2000);

			// Functions
			function addLabels() {
				var labelsArray = generateLabels();

				var labelsContainer = chart.patternify({ tag: 'g', selector: 'labels-container' })
					.attr('transform', function (d) {
						var x = 0;
						var circleY = getLowestCircleY();
						var y = circleY + attrs.labels.verticalDistance;
						return 'translate(' + x + ',' + y + ')';
					});

				var labelWrapper = labelsContainer
					.patternify({ tag: 'g', selector: 'label-wrapper', data: labelsArray });

				var labels = labelWrapper
					.patternify({ tag: 'text', selector: 'label' })
					.attr('font-family', attrs.labels.fontFamily)
					.attr('font-size', attrs.labels.fontSize)
					.attr('fill', attrs.labels.fill)
					.style('text-anchor', attrs.labels.textAnchor)
					.attr('dy', '.1em')
					.text(function (d, i) {
						return d3.select(this.parentNode).data()[0];
					})
					.attr('x', 0)
					.attr('y', 0)
					.attr('opacity', 0);

				wrap(labelWrapper.filter((x, i) => i == 0).selectAll('.label'), 190);

				wrap(labelWrapper.filter((x, i) => i > 0).selectAll('.label'), 100);

				labelWrapper.selectAll('tspan').text(function (d) {
					var text = d3.select(this).text();
					if (text.includes('Promoters')) return text.replace('Promoters', ' Promoters');
					if (text.includes('Passives')) return text.replace('Passives', ' Passives');
					if (text.includes('Detractors')) return text.replace('Detractors', ' Detractors');
					return text;
				});

				labelWrapper.attr('transform', function (d, i) {
					var x = 0;

					if (i == 0) x = calc.chartPositions.first;
					if (i == 1) x = npsCenters.promoter.x;
					if (i == 2) x = npsCenters.passive.x;
					if (i == 3) x = npsCenters.detractor.x;

					return 'translate(' + x + ',' + '0)';
				});

				setTspanFontSizes(labels);

				animateLabels();
			}

			function animateLabels() {
				animateTotalLabels();
			}

			function setTspanFontSizes(labels) {
				var i = 0;

				labels.each(function (labelText) {
					if (i == 0) d3.select(this).selectAll('tspan').last().attr('font-size', attrs.labels.spanSize);
					else d3.select(this).selectAll('tspan').first().attr('font-size', attrs.labels.spanSize);
					i++;
				});
			}

			function getLowestCircleY() {
				var circles = chart.select('.bubbles-container').selectAll('circle');
				var yPositions = [];

				circles.each(function (d) {
					yPositions.push(+d3.select(this).attr('cy') + d.radius * 2);
				});

				return d3.max(yPositions);
			}

			function generateLabels() {
				var promoters = attrs.data.filter(x => promoter(+x['NPS_Q' + attrs.currentQuarter]));
				var passives = attrs.data.filter(x => passive(+x['NPS_Q' + attrs.currentQuarter]));
				var detractors = attrs.data.filter(x => detractor(+x['NPS_Q' + attrs.currentQuarter]));

				var promoterPercent = getPercentage(promoters.length, attrs.data.length);
				var passivePercent = getPercentage(passives.length, attrs.data.length);
				var detractorPercent = getPercentage(detractors.length, attrs.data.length);

				var totalLabel = 'Total ' + attrs.data.length + ' Employees E-NPS = ' + calculateNps(promoterPercent, detractorPercent);

				var promoterLabel = promoterPercent + ' ' + promoters.length + 'Promoters';

				var passiveLabel = passivePercent + ' ' + passives.length + 'Passives';

				var detractorLabel = detractorPercent + ' ' + detractors.length + 'Detractors';

				return [totalLabel, promoterLabel, passiveLabel, detractorLabel];
			}

			function calculateNps(promoterPercent, detractorPercent) {
				return (parseFloat(promoterPercent) - parseFloat(detractorPercent)).toFixed(1);
			}

			function getPercentage(value, total) {
				return (value / total * 100).toFixed(1) + '%';
			}

			function expandMultipleBubbles(d) {
				chart.selectAll(".sortable-bubble-group,.bubble-group").filter(x => x.manager == d.manager).each(function (d) {
					attrs.hoveredBubbleId.push(d.id);
					changeBubbleSize(d, this, 'increase');
				});
			}

			function shrinkMultipleBubbles() {
				chart.selectAll(".sortable-bubble-group,.bubble-group").each(function (d) {
					changeBubbleSize(d, this, 'decrease');
				});
			}

			function changeBubbleSize(d, currentNode, action) {
				var increase = action == 'increase';

				var bubble = d3.select(currentNode).select('circle');

				bringToTop(currentNode);

				bubble.transition().duration(500).attr('r', increase ? attrs.increasedRadius : d.radius);

				if (increase) {
					setTimeout(() => {
						if (attrs.hoveredBubbleId.includes(d.id)) showTextOnBubble(currentNode, d);
					}, 400);
				}
				else removeBubbleText();
			}

			function showTextOnBubble(bubbleGroupNode, data) {
				var textString = getTextString(data);

				var textGroup = d3.select(bubbleGroupNode)
					.patternify({ tag: 'g', selector: 'text-group' })
					.attr('transform', function (x) {
						var bubbleProps = bubbleGroupNode.getBBox();
						var x = bubbleProps.x;
						var y = bubbleProps.y;
						return 'translate(' + x + ',' + y + ')';
					});

				var bubbleText = textGroup.patternify({ tag: 'text' })
					.style('font-size', 13)
					.attr('font-family', 'Arial')
					.style('text-anchor', 'middle')
					.attr('dy', '.1em')
					.attr("pointer-events", "none")
					.attr('x', 0)
					.text(textString)
					.attr('cursor', 'pointer')
					.call(wrap, attrs.increasedRadius * 2);

				centerOpenedLabels(textGroup);
			}

			function centerOpenedLabels(textGroup) {
				textGroup.attr('transform', function (d) {
					let currentProps = this.getBBox();
					let parentGroupProps = d3.select(this.parentNode).select('circle').node().getBBox();
					let heightDiff = (parentGroupProps.height - currentProps.height) / 2;
					let widthDiff = (parentGroupProps.width - currentProps.width) / 2;
					let yDiff = currentProps.y - parentGroupProps.y;
					let xDiff = currentProps.x - parentGroupProps.x;
					let newY = yDiff - heightDiff;
					let newX = xDiff - widthDiff;

					return 'translate(' + -newX + ',' + -newY + ')';
				});
			}

			function removeBubbleText() {
				chart.selectAll('.text-group').remove();
			}

			function getTextString(data) {
				var count = data.records.length;
				var managerName = data.records[0].manager_login.match(/^([^@]*)@/)[1];
				var string = count + " employees " + managerName + "'s Team";
				return string;
			}

			function createSortableBubbles() {
				var sortableBubblesContainer = chart.patternify({ tag: 'g', selector: 'sortable-bubbles-container' });

				var npsNodes = getNpsNodes();

				createSortableCircles(sortableBubblesContainer, npsNodes);

				loadSortableCircles(npsNodes);

				sortableBubblesContainer.selectAll('.sortable-bubble')
					.attr('fill', function (d) {
						d.color = attrs.bubbleChartColors[d.type];

						return d.color;
					})
					.attr('stroke', function (d) { return d3.rgb(d.color).darker(); })

				splitBubbles();
			}

			function createSortableCircles(container, npsNodes) {
				var sortableBubbles = container.selectAll('.bubble')
					.data(npsNodes, function (d) { return d.id; })
					.enter()
					.append('g')
					.classed('sortable-bubble-group', true)
					.on('mouseover', function (d) {
						expandMultipleBubbles(d);
					})
					.on('mouseout', function (d) {
						shrinkMultipleBubbles();
						attrs.hoveredBubbleId = [];
					})
					.attr('onclick', 'void(0)')
					.append('circle')
					.classed('sortable-bubble', true)
					.attr('r', d => d.radius)
					.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
					.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
					.attr('stroke-width', 1)
					.style('cursor', 'pointer')
					.attr('opacity', 0)
					.attr('cx', calc.chartPositions.first)
					.attr('cy', calc.chartHeight / 2 - attrs.distanceFromCenter);

				bringToTop(bubblesContainer.node());
			}

			function loadSortableCircles(npsNodes) {
				simulation.on('tick', npsBubblesTicked);
				simulation.nodes(npsNodes);
				simulation.alpha(1).restart();
			}

			function getNpsNodes() {
				var nodes = [];

				nodes.push(createNpsNodes('manager_login', 'promoter', attrs.data.filter(x => promoter(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('manager_login', 'passive', attrs.data.filter(x => passive(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('manager_login', 'detractor', attrs.data.filter(x => detractor(+x['NPS_Q' + attrs.currentQuarter]))));

				return nodes.flat();
			}

			function createNpsNodes(group_by, type, data) {
				var nested = d3.nest().key(x => x[group_by]).entries(data).sort((a, b) => b.values.length - a.values.length);

				var nestedTotal = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var generalRadiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nestedTotal.length)])
					.domain([0, nestedTotal[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: type + '_' + i + 1,
						radius: generalRadiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						manager: d.values[0].manager_login,
						type: type,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function ticked() {
				if (attrs.disableSimulation) return;

				bubbles
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function npsBubblesTicked() {
				if (attrs.disableSimulation) return;

				chart.selectAll('.sortable-bubble')
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function groupPosition(d) {
				return npsCenters[d.type].x;
			}

			function groupBubbles() {
				hideYearTitles();

				simulation.force('x', d3.forceX().strength(attrs.force.strength).x(calc.chartPositions.first));

				simulation.alpha(1).restart();
			}

			function splitBubbles() {
				simulation.force('x', d3.forceX().strength(0.04).x(groupPosition));

				attrs.disableSimulation = true;

				simulation.alpha(1).restart();

				splitBubblesAnimated();
			}

			function splitBubblesAnimated() {
				var sortableBubbles = chart.selectAll('.sortable-bubble');

				var promoterBubbles = sortableBubbles.filter(d => d.type == 'promoter');
				var passiveBubbles = sortableBubbles.filter(d => d.type == 'passive');
				var detractorBubbles = sortableBubbles.filter(d => d.type == 'detractor');

				splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles)
			}

			function splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles) {
				var promotersCounter = 0;

				setTimeout(() => {
					promoterBubbles.attr('opacity', 1).transition().duration(1000).delay((x, i) => i * 50)
						.attr('cx', function (d) { return d.x; })
						.attr('cy', function (d) { return d.y; })
						.on('end', function (x) {
							promotersCounter++;

							if (promotersCounter == promoterBubbles.data().length) {
								splitPassives(passiveBubbles, detractorBubbles);
								animatePromoterLabels();
							}
						});
				}, 1500);

			}

			function splitPassives(passiveBubbles, detractorBubbles) {
				var passivesCounter = 0;

				passiveBubbles.attr('opacity', 1).transition().duration(1250).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
					.on('end', function (x) {
						passivesCounter++;
						if (passivesCounter == passiveBubbles.data().length) {
							splitDetractors(detractorBubbles);
							animatePassiveLabels();
						}
					});
			}

			function splitDetractors(detractorBubbles) {
				var detractorsCounter = 0;

				detractorBubbles.attr('opacity', 1).transition().duration(1500).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
					.on('end', function (x) {
						detractorsCounter++;

						if (detractorsCounter == detractorBubbles.data().length)
							animateDetractorLabels();
					});
			}

			function animateTotalLabels() {
				chart.select('.labels-container').select('text').transition().duration(attrs.labels.animationTime).attr('opacity', 1);
			}

			function animatePromoterLabels() {
				chart.select('.labels-container').selectAll('text').filter((x, i) => i == 1).transition().duration(attrs.labels.animationTime / 2).attr('opacity', 1);
			}

			function animatePassiveLabels() {
				chart.select('.labels-container').selectAll('text').filter((x, i) => i == 2).transition().duration(attrs.labels.animationTime / 2).attr('opacity', 1);
			}

			function animateDetractorLabels() {
				chart.select('.labels-container').selectAll('text').filter((x, i) => i == 3).transition().duration(attrs.labels.animationTime / 2).attr('opacity', 1);
			}

			function promoter(value) {
				return attrs.ranges.promoter.includes(value);
			}

			function passive(value) {
				return attrs.ranges.passive.includes(value);
			}

			function detractor(value) {
				return attrs.ranges.detractor.includes(value);
			}

			function hideYearTitles() {
				svg.selectAll('.year').remove();
			}

			function createNodesTotal(group_by) {
				var nested = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var radiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nested.length)])
					.domain([0, nested[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: i + 1,
						radius: radiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						manager: d.values[0].manager_login,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function getMaxRange(bubblesCount) {
				var max = 25;
				if (bubblesCount > 20) max = 12;
				if (bubblesCount > 18) max = 15;
				if (bubblesCount > 16) max = 17;
				if (bubblesCount > 14) max = 20;
				if (bubblesCount > 12) max = 22;
				if (bubblesCount > 10) max = 24;
				return max;
			}

			function charge(d) {
				return -Math.pow(d.radius, 2.0) * attrs.force.strength;
			}

			function bringToTop(targetElement) {
				// put the element at the bottom of its parent
				let parent = targetElement.parentNode;
				parent.appendChild(targetElement);
			}

			function overrideD3Selection() {
				d3.selection.prototype.first = function () {
					return d3.select(
						this.nodes()[0]
					);
				};
				d3.selection.prototype.last = function () {
					return d3.select(
						this.nodes()[this.size() - 1]
					);
				};
			}

			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.4, // ems
						y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
						}
					}
				});
			}

			function addEventListeners() {
				if (navigator.userAgent.match(/iPad/i) != null) {
					svg.on('click', function () {
						shrinkMultipleBubbles();
					});
				}
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  By Manager ##################################


		//#########################################  By Site ##################################
		function drawSecondRow() {

			//Drawing containers
			var container = d3.select(attrs.container[1]);
			container.select('svg').remove();

			if (container.node() == null) return;

			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.chartPositions = { first: calc.chartWidth / 7, second: calc.chartWidth / 3, third: calc.chartWidth / 1.8, fourth: 1.2 }

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont);

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//center coordinates of each bubble section
			var npsCenters = {
				promoter: { x: calc.chartWidth / 2.5},
				passive: { x: calc.chartWidth / 1.66 },
				detractor: { x: calc.chartWidth / 1.25}
			};

			//bubble animation
			var simulation = d3.forceSimulation()
				.velocityDecay(attrs.force.velocityDecay)
				.force('y', d3.forceY().strength(attrs.force.strength).y(calc.chartHeight / 2))
				.force('charge', d3.forceManyBody().strength(charge))
				.force('collision', d3.forceCollide().radius(d => d.radius + 2))
				.on('tick', ticked);

			simulation.stop();

			setTimeout(() => {
				createSortableBubbles();
			}, 2000);

			var nodes = createNodesTotal('location');

			var bubblesContainer = chart.append('g').classed('bubbles-container', true);

			var bubbles = bubblesContainer.selectAll('.bubble')
				.data(nodes, function (d) { return d.id; });

			var bubblesE = bubbles.enter()
				.append('g')
				.classed('bubble-group', true)
				.on('mouseover', function (d) {
					expandMultipleBubbles(d);
				})
				.on('mouseout', function (d) {
					attrs.hoveredBubbleId = [];
					shrinkMultipleBubbles();
				})
				.attr('onclick', 'void(0)')
				.append('circle')
				.classed('bubble', true)
				.attr('r', 0)
				.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
				.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
				.attr('stroke-width', 1)
				.style('cursor', 'pointer');

			bubbles = bubbles.merge(bubblesE);

			bubbles.transition()
				.duration(2000)
				.attr('r', function (d) { return d.radius; });

			simulation.nodes(nodes);

			groupBubbles();
			addEventListeners();
			overrideD3Selection();

			// Functions

			function expandMultipleBubbles(d) {
				chart.selectAll(".sortable-bubble-group, .bubble-group").filter(x => x.location == d.location).each(function (d) {
					attrs.hoveredBubbleId.push(d.id);
					changeBubbleSize(d, this, 'increase');
				});
			}

			function shrinkMultipleBubbles() {
				chart.selectAll(".sortable-bubble-group,.bubble-group").each(function (d) {
					changeBubbleSize(d, this, 'decrease');
				});
			}

			function changeBubbleSize(d, currentNode, action) {
				var increase = action == 'increase';

				var bubble = d3.select(currentNode).select('circle');

				bringToTop(currentNode);

				bubble.transition().duration(500).attr('r', increase ? attrs.increasedRadius : d.radius);

				if (increase) {
					setTimeout(() => {
						if (attrs.hoveredBubbleId.includes(d.id)) showTextOnBubble(currentNode, d);
					}, 400);
				}
				else removeBubbleText();
			}

			function showTextOnBubble(bubbleGroupNode, data) {
				var textString = getTextString(data);

				var textGroup = d3.select(bubbleGroupNode)
					.patternify({ tag: 'g', selector: 'text-group' })
					.attr('transform', function (x) {
						var bubbleProps = bubbleGroupNode.getBBox();
						var x = bubbleProps.x;
						var y = bubbleProps.y;
						return 'translate(' + x + ',' + y + ')';
					});

				var bubbleText = textGroup.patternify({ tag: 'text' })
					.style('font-size', 13)
					.attr('font-family', 'Arial')
					.style('text-anchor', 'middle')
					.attr('dy', '.1em')
					.attr("pointer-events", "none")
					.attr('x', 0)
					.text(textString)
					.attr('cursor', 'pointer')
					.call(wrap, attrs.increasedRadius * 2);

				centerOpenedLabels(textGroup);
			}

			function centerOpenedLabels(textGroup) {
				textGroup.attr('transform', function (d) {
					let currentProps = this.getBBox();
					let parentGroupProps = d3.select(this.parentNode).select('circle').node().getBBox();
					let heightDiff = (parentGroupProps.height - currentProps.height) / 2;
					let widthDiff = (parentGroupProps.width - currentProps.width) / 2;
					let yDiff = currentProps.y - parentGroupProps.y;
					let xDiff = currentProps.x - parentGroupProps.x;
					let newY = yDiff - heightDiff;
					let newX = xDiff - widthDiff;

					return 'translate(' + -newX + ',' + -newY + ')';
				});
			}

			function removeBubbleText() {
				chart.selectAll('.text-group').remove();
			}

			function getTextString(data) {
				var count = data.records.length;
				var locationName = data.records[0].location;
				var string = count + " employees " + locationName;
				return string;
			}

			function createSortableBubbles() {
				var sortableBubblesContainer = chart.patternify({ tag: 'g', selector: 'sortable-bubbles-container' });

				var npsNodes = getNpsNodes();

				createSortableCircles(sortableBubblesContainer, npsNodes);

				loadSortableCircles(npsNodes);

				sortableBubblesContainer.selectAll('.sortable-bubble')
					.attr('fill', function (d) {
						d.color = attrs.bubbleChartColors[d.type];

						return d.color;
					})
					.attr('stroke', function (d) { return d3.rgb(d.color).darker(); })

				splitBubbles();
			}

			function createSortableCircles(container, npsNodes) {
				var sortableBubbles = container.selectAll('.bubble')
					.data(npsNodes, function (d) { return d.id; })
					.enter()
					.append('g')
					.classed('sortable-bubble-group', true)
					.on('mouseover', function (d) {
						expandMultipleBubbles(d);
					})
					.on('mouseout', function (d) {
						shrinkMultipleBubbles();
						attrs.hoveredBubbleId = [];
					})
					.attr('onclick', 'void(0)')
					.append('circle')
					.classed('sortable-bubble', true)
					.attr('r', d => d.radius)
					.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
					.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
					.attr('stroke-width', 1)
					.style('cursor', 'pointer')
					.attr('opacity', 0)
					.attr('cx', calc.chartPositions.first)
					.attr('cy', calc.chartHeight / 2);

				bringToTop(bubblesContainer.node());
			}

			function loadSortableCircles(npsNodes) {
				simulation.on('tick', npsBubblesTicked);
				simulation.nodes(npsNodes);
				simulation.alpha(1).restart();
			}

			function getNpsNodes() {
				var nodes = [];

				nodes.push(createNpsNodes('location', 'promoter', attrs.data.filter(x => promoter(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('location', 'passive', attrs.data.filter(x => passive(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('location', 'detractor', attrs.data.filter(x => detractor(+x['NPS_Q' + attrs.currentQuarter]))));

				return nodes.flat();
			}

			function createNpsNodes(group_by, type, data) {
				var nested = d3.nest().key(x => x[group_by]).entries(data).sort((a, b) => b.values.length - a.values.length);

				var nestedTotal = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var generalRadiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nestedTotal.length)])
					.domain([0, nestedTotal[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: type + '_' + i + 1,
						radius: generalRadiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						location: d.values[0].location,
						type: type,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function ticked() {
				if (attrs.disableSimulation) return;

				bubbles
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function npsBubblesTicked() {
				if (attrs.disableSimulation) return;

				chart.selectAll('.sortable-bubble')
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function groupPosition(d) {
				return npsCenters[d.type].x;
			}

			function groupBubbles() {
				hideYearTitles();

				simulation.force('x', d3.forceX().strength(attrs.force.strength).x(calc.chartPositions.first));

				simulation.alpha(1).restart();
			}

			function splitBubbles() {
				simulation.force('x', d3.forceX().strength(0.04).x(groupPosition));

				attrs.disableSimulation = true;

				simulation.alpha(1).restart();

				splitBubblesAnimated();
			}

			function splitBubblesAnimated() {
				var sortableBubbles = chart.selectAll('.sortable-bubble');

				var promoterBubbles = sortableBubbles.filter(d => d.type == 'promoter');
				var passiveBubbles = sortableBubbles.filter(d => d.type == 'passive');
				var detractorBubbles = sortableBubbles.filter(d => d.type == 'detractor');

				splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles)
			}

			function splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles) {
				var promotersCounter = 0;

				setTimeout(() => {
					promoterBubbles.attr('opacity', 1).transition().duration(1000).delay((x, i) => i * 50)
						.attr('cx', function (d) { return d.x; })
						.attr('cy', function (d) { return d.y; })
						.on('end', function (x) {
							promotersCounter++;

							if (promotersCounter == promoterBubbles.data().length) {
								splitPassives(passiveBubbles, detractorBubbles);
							}
						});
				}, 1500);

			}

			function splitPassives(passiveBubbles, detractorBubbles) {
				var passivesCounter = 0;

				passiveBubbles.attr('opacity', 1).transition().duration(1250).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
					.on('end', function (x) {
						passivesCounter++;
						if (passivesCounter == passiveBubbles.data().length) {
							splitDetractors(detractorBubbles);
						}
					});
			}

			function splitDetractors(detractorBubbles) {
				detractorBubbles.attr('opacity', 1).transition().duration(1500).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
			}

			function promoter(value) {
				return attrs.ranges.promoter.includes(value);
			}

			function passive(value) {
				return attrs.ranges.passive.includes(value);
			}

			function detractor(value) {
				return attrs.ranges.detractor.includes(value);
			}

			function hideYearTitles() {
				svg.selectAll('.year').remove();
			}

			function createNodesTotal(group_by) {
				var nested = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var radiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nested.length)])
					.domain([0, nested[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: i + 1,
						radius: radiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						location: d.values[0].location,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function getMaxRange(bubblesCount) {
				var max = 25;
				if (bubblesCount > 20) max = 12;
				if (bubblesCount > 18) max = 15;
				if (bubblesCount > 16) max = 17;
				if (bubblesCount > 14) max = 20;
				if (bubblesCount > 12) max = 22;
				if (bubblesCount > 10) max = 24;
				return max;
			}

			function charge(d) {
				return -Math.pow(d.radius, 2.0) * attrs.force.strength;
			}

			function bringToTop(targetElement) {
				// put the element at the bottom of its parent
				let parent = targetElement.parentNode;
				parent.appendChild(targetElement);
			}

			function overrideD3Selection() {
				d3.selection.prototype.first = function () {
					return d3.select(
						this.nodes()[0]
					);
				};
				d3.selection.prototype.last = function () {
					return d3.select(
						this.nodes()[this.size() - 1]
					);
				};
			}

			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.4, // ems
						y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
						}
					}
				});
			}

			function addEventListeners() {
				if (navigator.userAgent.match(/iPad/i) != null) {
					svg.on('click', function () {
						shrinkMultipleBubbles();
					});
				}
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  By Site ##################################



		//#########################################  By Department ##################################
		function drawThirdRow() {

			//Drawing containers
			var container = d3.select(attrs.container[2]);
			container.select('svg').remove();

			if (container.node() == null) return;

			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.chartPositions = { first: calc.chartWidth / 7, second: calc.chartWidth / 3, third: calc.chartWidth / 1.8, fourth: 1.2 }

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont);

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//center coordinates of each bubble section
			var npsCenters = {
				promoter: { x: calc.chartWidth / 2.5},
				passive: { x: calc.chartWidth / 1.66 },
				detractor: { x: calc.chartWidth / 1.25}
			};

			//bubble animation
			var simulation = d3.forceSimulation()
				.velocityDecay(attrs.force.velocityDecay)
				.force('y', d3.forceY().strength(attrs.force.strength).y(calc.chartHeight / 2))
				.force('charge', d3.forceManyBody().strength(charge))
				.force('collision', d3.forceCollide().radius(d => d.radius + 2))
				.on('tick', ticked);

			simulation.stop();

			setTimeout(() => {
				createSortableBubbles();
			}, 2000);

			var nodes = createNodesTotal('user_department');

			var bubblesContainer = chart.append('g').classed('bubbles-container', true);

			var bubbles = bubblesContainer.selectAll('.bubble')
				.data(nodes, function (d) { return d.id; });

			var bubblesE = bubbles.enter()
				.append('g')
				.classed('bubble-group', true)
				.on('mouseover', function (d) {
					expandMultipleBubbles(d);
				})
				.on('mouseout', function (d) {
					attrs.hoveredBubbleId = [];
					shrinkMultipleBubbles();
				})
				.attr('onclick', 'void(0)')
				.append('circle')
				.classed('bubble', true)
				.attr('r', 0)
				.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
				.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
				.attr('stroke-width', 1)
				.style('cursor', 'pointer');

			bubbles = bubbles.merge(bubblesE);

			bubbles.transition()
				.duration(2000)
				.attr('r', function (d) { return d.radius; });

			simulation.nodes(nodes);

			groupBubbles();
			addEventListeners();
			overrideD3Selection();

			// Functions

			function expandMultipleBubbles(d) {
				chart.selectAll(".sortable-bubble-group, .bubble-group").filter(x => x.user_department == d.user_department).each(function (d) {
					attrs.hoveredBubbleId.push(d.id);
					changeBubbleSize(d, this, 'increase');
				});
			}

			function shrinkMultipleBubbles() {
				chart.selectAll(".sortable-bubble-group,.bubble-group").each(function (d) {
					changeBubbleSize(d, this, 'decrease');
				});
			}

			function changeBubbleSize(d, currentNode, action) {
				var increase = action == 'increase';

				var bubble = d3.select(currentNode).select('circle');

				bringToTop(currentNode);

				bubble.transition().duration(500).attr('r', increase ? attrs.increasedRadius : d.radius);

				if (increase) {
					setTimeout(() => {
						if (attrs.hoveredBubbleId.includes(d.id)) showTextOnBubble(currentNode, d);
					}, 400);
				}
				else removeBubbleText();
			}

			function showTextOnBubble(bubbleGroupNode, data) {
				var textString = getTextString(data);

				var textGroup = d3.select(bubbleGroupNode)
					.patternify({ tag: 'g', selector: 'text-group' })
					.attr('transform', function (x) {
						var bubbleProps = bubbleGroupNode.getBBox();
						var x = bubbleProps.x;
						var y = bubbleProps.y;
						return 'translate(' + x + ',' + y + ')';
					});

				var bubbleText = textGroup.patternify({ tag: 'text' })
					.style('font-size', 13)
					.attr('font-family', 'Arial')
					.style('text-anchor', 'middle')
					.attr('dy', '.1em')
					.attr("pointer-events", "none")
					.attr('x', 0)
					.text(textString)
					.attr('cursor', 'pointer')
					.call(wrap, attrs.increasedRadius * 2);

				centerOpenedLabels(textGroup);
			}

			function centerOpenedLabels(textGroup) {
				textGroup.attr('transform', function (d) {
					let currentProps = this.getBBox();
					let parentGroupProps = d3.select(this.parentNode).select('circle').node().getBBox();
					let heightDiff = (parentGroupProps.height - currentProps.height) / 2;
					let widthDiff = (parentGroupProps.width - currentProps.width) / 2;
					let yDiff = currentProps.y - parentGroupProps.y;
					let xDiff = currentProps.x - parentGroupProps.x;
					let newY = yDiff - heightDiff;
					let newX = xDiff - widthDiff;

					return 'translate(' + -newX + ',' + -newY + ')';
				});
			}

			function removeBubbleText() {
				chart.selectAll('.text-group').remove();
			}

			function getTextString(data) {
				var count = data.records.length;
				var departmentName = data.records[0].user_department;
				var string = count + " employees " + departmentName;
				return string;
			}

			function createSortableBubbles() {
				var sortableBubblesContainer = chart.patternify({ tag: 'g', selector: 'sortable-bubbles-container' });

				var npsNodes = getNpsNodes();

				createSortableCircles(sortableBubblesContainer, npsNodes);

				loadSortableCircles(npsNodes);

				sortableBubblesContainer.selectAll('.sortable-bubble')
					.attr('fill', function (d) {
						d.color = attrs.bubbleChartColors[d.type];

						return d.color;
					})
					.attr('stroke', function (d) { return d3.rgb(d.color).darker(); })

				splitBubbles();
			}

			function createSortableCircles(container, npsNodes) {
				var sortableBubbles = container.selectAll('.bubble')
					.data(npsNodes, function (d) { return d.id; })
					.enter()
					.append('g')
					.classed('sortable-bubble-group', true)
					.on('mouseover', function (d) {
						expandMultipleBubbles(d);
					})
					.on('mouseout', function (d) {
						shrinkMultipleBubbles();
						attrs.hoveredBubbleId = [];
					})
					.attr('onclick', 'void(0)')
					.append('circle')
					.classed('sortable-bubble', true)
					.attr('r', d => d.radius)
					.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
					.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
					.attr('stroke-width', 1)
					.style('cursor', 'pointer')
					.attr('opacity', 0)
					.attr('cx', calc.chartPositions.first)
					.attr('cy', calc.chartHeight / 2);

				bringToTop(bubblesContainer.node());
			}

			function loadSortableCircles(npsNodes) {
				simulation.on('tick', npsBubblesTicked);
				simulation.nodes(npsNodes);
				simulation.alpha(1).restart();
			}

			function getNpsNodes() {
				var nodes = [];

				nodes.push(createNpsNodes('user_department', 'promoter', attrs.data.filter(x => promoter(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('user_department', 'passive', attrs.data.filter(x => passive(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('user_department', 'detractor', attrs.data.filter(x => detractor(+x['NPS_Q' + attrs.currentQuarter]))));

				return nodes.flat();
			}

			function createNpsNodes(group_by, type, data) {
				var nested = d3.nest().key(x => x[group_by]).entries(data).sort((a, b) => b.values.length - a.values.length);

				var nestedTotal = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var generalRadiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nestedTotal.length)])
					.domain([0, nestedTotal[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: type + '_' + i + 1,
						radius: generalRadiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						user_department: d.values[0].user_department,
						type: type,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function ticked() {
				if (attrs.disableSimulation) return;

				bubbles
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function npsBubblesTicked() {
				if (attrs.disableSimulation) return;

				chart.selectAll('.sortable-bubble')
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function groupPosition(d) {
				return npsCenters[d.type].x;
			}

			function groupBubbles() {
				hideYearTitles();

				simulation.force('x', d3.forceX().strength(attrs.force.strength).x(calc.chartPositions.first));

				simulation.alpha(1).restart();
			}

			function splitBubbles() {
				simulation.force('x', d3.forceX().strength(0.04).x(groupPosition));

				attrs.disableSimulation = true;

				simulation.alpha(1).restart();

				splitBubblesAnimated();
			}

			function splitBubblesAnimated() {
				var sortableBubbles = chart.selectAll('.sortable-bubble');

				var promoterBubbles = sortableBubbles.filter(d => d.type == 'promoter');
				var passiveBubbles = sortableBubbles.filter(d => d.type == 'passive');
				var detractorBubbles = sortableBubbles.filter(d => d.type == 'detractor');

				splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles)
			}

			function splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles) {
				var promotersCounter = 0;

				setTimeout(() => {
					promoterBubbles.attr('opacity', 1).transition().duration(1000).delay((x, i) => i * 50)
						.attr('cx', function (d) { return d.x; })
						.attr('cy', function (d) { return d.y; })
						.on('end', function (x) {
							promotersCounter++;

							if (promotersCounter == promoterBubbles.data().length) {
								splitPassives(passiveBubbles, detractorBubbles);
							}
						});
				}, 1500);

			}

			function splitPassives(passiveBubbles, detractorBubbles) {
				var passivesCounter = 0;

				passiveBubbles.attr('opacity', 1).transition().duration(1250).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
					.on('end', function (x) {
						passivesCounter++;
						if (passivesCounter == passiveBubbles.data().length) {
							splitDetractors(detractorBubbles);
						}
					});
			}

			function splitDetractors(detractorBubbles) {
				detractorBubbles.attr('opacity', 1).transition().duration(1500).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function promoter(value) {
				return attrs.ranges.promoter.includes(value);
			}

			function passive(value) {
				return attrs.ranges.passive.includes(value);
			}

			function detractor(value) {
				return attrs.ranges.detractor.includes(value);
			}

			function hideYearTitles() {
				svg.selectAll('.year').remove();
			}

			function createNodesTotal(group_by) {
				var nested = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var radiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nested.length)])
					.domain([0, nested[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: i + 1,
						radius: radiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						user_department: d.values[0].user_department,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function getMaxRange(bubblesCount) {
				var max = 25;
				if (bubblesCount > 20) max = 12;
				if (bubblesCount > 18) max = 15;
				if (bubblesCount > 16) max = 17;
				if (bubblesCount > 14) max = 20;
				if (bubblesCount > 12) max = 22;
				if (bubblesCount > 10) max = 24;
				return max;
			}

			function charge(d) {
				return -Math.pow(d.radius, 2.0) * attrs.force.strength;
			}

			function bringToTop(targetElement) {
				// put the element at the bottom of its parent
				let parent = targetElement.parentNode;
				parent.appendChild(targetElement);
			}

			function overrideD3Selection() {
				d3.selection.prototype.first = function () {
					return d3.select(
						this.nodes()[0]
					);
				};
				d3.selection.prototype.last = function () {
					return d3.select(
						this.nodes()[this.size() - 1]
					);
				};
			}

			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.4, // ems
						y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
						}
					}
				});
			}

			function addEventListeners() {
				if (navigator.userAgent.match(/iPad/i) != null) {
					svg.on('click', function () {
						shrinkMultipleBubbles();
					});
				}
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  By Department ##################################






		//#########################################  By Gender ##################################
		function drawFourthRow() {

			//Drawing containers
			var container = d3.select(attrs.container[3]);
			container.select('svg').remove();

			if (container.node() == null) return;

			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.chartPositions = { first: calc.chartWidth / 7, second: calc.chartWidth / 3, third: calc.chartWidth / 1.8, fourth: 1.2 }

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont);

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//center coordinates of each bubble section
			var npsCenters = {
				promoter: { x: calc.chartWidth / 2.5},
				passive: { x: calc.chartWidth / 1.66 },
				detractor: { x: calc.chartWidth / 1.25}
			};

			//bubble animation
			var simulation = d3.forceSimulation()
				.velocityDecay(attrs.force.velocityDecay)
				.force('y', d3.forceY().strength(attrs.force.strength).y(calc.chartHeight / 2))
				.force('charge', d3.forceManyBody().strength(charge))
				.force('collision', d3.forceCollide().radius(d => d.radius + 2))
				.on('tick', ticked);

			simulation.stop();

			setTimeout(() => {
				createSortableBubbles();
			}, 2000);

			var nodes = createNodesTotal('Gender');

			var bubblesContainer = chart.append('g').classed('bubbles-container', true);

			var bubbles = bubblesContainer.selectAll('.bubble')
				.data(nodes, function (d) { return d.id; });

			var bubblesE = bubbles.enter()
				.append('g')
				.classed('bubble-group', true)
				.on('mouseover', function (d) {
					expandMultipleBubbles(d);
				})
				.on('mouseout', function (d) {
					attrs.hoveredBubbleId = [];
					shrinkMultipleBubbles();
				})
				.attr('onclick', 'void(0)')
				.append('circle')
				.classed('bubble', true)
				.attr('r', 0)
				.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
				.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
				.attr('stroke-width', 1)
				.style('cursor', 'pointer');

			bubbles = bubbles.merge(bubblesE);

			bubbles.transition()
				.duration(2000)
				.attr('r', function (d) { return d.radius; });

			simulation.nodes(nodes);

			groupBubbles();
			addEventListeners();
			overrideD3Selection();

			// Functions

			function expandMultipleBubbles(d) {
				chart.selectAll(".sortable-bubble-group, .bubble-group").filter(x => x.Gender == d.Gender).each(function (d) {
					attrs.hoveredBubbleId.push(d.id);
					changeBubbleSize(d, this, 'increase');
				});
			}

			function shrinkMultipleBubbles() {
				chart.selectAll(".sortable-bubble-group,.bubble-group").each(function (d) {
					changeBubbleSize(d, this, 'decrease');
				});
			}

			function changeBubbleSize(d, currentNode, action) {
				var increase = action == 'increase';

				var bubble = d3.select(currentNode).select('circle');

				bringToTop(currentNode);

				bubble.transition().duration(500).attr('r', increase ? attrs.increasedRadius : d.radius);

				if (increase) {
					setTimeout(() => {
						if (attrs.hoveredBubbleId.includes(d.id)) showTextOnBubble(currentNode, d);
					}, 400);
				}
				else removeBubbleText();
			}

			function showTextOnBubble(bubbleGroupNode, data) {
				var textString = getTextString(data);

				var textGroup = d3.select(bubbleGroupNode)
					.patternify({ tag: 'g', selector: 'text-group' })
					.attr('transform', function (x) {
						var bubbleProps = bubbleGroupNode.getBBox();
						var x = bubbleProps.x;
						var y = bubbleProps.y;
						return 'translate(' + x + ',' + y + ')';
					});

				var bubbleText = textGroup.patternify({ tag: 'text' })
					.style('font-size', 13)
					.attr('font-family', 'Arial')
					.style('text-anchor', 'middle')
					.attr('dy', '.1em')
					.attr("pointer-events", "none")
					.attr('x', 0)
					.text(textString)
					.attr('cursor', 'pointer')
					.call(wrap, attrs.increasedRadius * 2);

				centerOpenedLabels(textGroup);
			}

			function centerOpenedLabels(textGroup) {
				textGroup.attr('transform', function (d) {
					let currentProps = this.getBBox();
					let parentGroupProps = d3.select(this.parentNode).select('circle').node().getBBox();
					let heightDiff = (parentGroupProps.height - currentProps.height) / 2;
					let widthDiff = (parentGroupProps.width - currentProps.width) / 2;
					let yDiff = currentProps.y - parentGroupProps.y;
					let xDiff = currentProps.x - parentGroupProps.x;
					let newY = yDiff - heightDiff;
					let newX = xDiff - widthDiff;

					return 'translate(' + -newX + ',' + -newY + ')';
				});
			}

			function removeBubbleText() {
				chart.selectAll('.text-group').remove();
			}

			function getTextString(data) {
				var count = data.records.length;
				var genderName = data.records[0].Gender;
				var string = count + " employees " + genderName;
				return string;
			}

			function createSortableBubbles() {
				var sortableBubblesContainer = chart.patternify({ tag: 'g', selector: 'sortable-bubbles-container' });

				var npsNodes = getNpsNodes();

				createSortableCircles(sortableBubblesContainer, npsNodes);

				loadSortableCircles(npsNodes);

				sortableBubblesContainer.selectAll('.sortable-bubble')
					.attr('fill', function (d) {
						d.color = attrs.bubbleChartColors[d.type];

						return d.color;
					})
					.attr('stroke', function (d) { return d3.rgb(d.color).darker(); })

				splitBubbles();
			}

			function createSortableCircles(container, npsNodes) {
				var sortableBubbles = container.selectAll('.bubble')
					.data(npsNodes, function (d) { return d.id; })
					.enter()
					.append('g')
					.classed('sortable-bubble-group', true)
					.on('mouseover', function (d) {
						expandMultipleBubbles(d);
					})
					.on('mouseout', function (d) {
						shrinkMultipleBubbles();
						attrs.hoveredBubbleId = [];
					})
					.attr('onclick', 'void(0)')
					.append('circle')
					.classed('sortable-bubble', true)
					.attr('r', d => d.radius)
					.attr('fill', function (d) { return attrs.bubbleChartColors.total; })
					.attr('stroke', function (d) { return d3.rgb(attrs.bubbleChartColors.total).darker(); })
					.attr('stroke-width', 1)
					.style('cursor', 'pointer')
					.attr('opacity', 0)
					.attr('cx', calc.chartPositions.first)
					.attr('cy', calc.chartHeight / 2);

				bringToTop(bubblesContainer.node());
			}

			function loadSortableCircles(npsNodes) {
				simulation.on('tick', npsBubblesTicked);
				simulation.nodes(npsNodes);
				simulation.alpha(1).restart();
			}

			function getNpsNodes() {
				var nodes = [];

				nodes.push(createNpsNodes('Gender', 'promoter', attrs.data.filter(x => promoter(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('Gender', 'passive', attrs.data.filter(x => passive(+x['NPS_Q' + attrs.currentQuarter]))));
				nodes.push(createNpsNodes('Gender', 'detractor', attrs.data.filter(x => detractor(+x['NPS_Q' + attrs.currentQuarter]))));

				return nodes.flat();
			}

			function createNpsNodes(group_by, type, data) {
				var nested = d3.nest().key(x => x[group_by]).entries(data).sort((a, b) => b.values.length - a.values.length);

				var nestedTotal = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var generalRadiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nestedTotal.length)])
					.domain([0, nestedTotal[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: type + '_' + i + 1,
						radius: generalRadiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						Gender: d.values[0].Gender,
						type: type,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function ticked() {
				if (attrs.disableSimulation) return;

				bubbles
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function npsBubblesTicked() {
				if (attrs.disableSimulation) return;

				chart.selectAll('.sortable-bubble')
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function groupPosition(d) {
				return npsCenters[d.type].x;
			}

			function groupBubbles() {
				hideYearTitles();

				simulation.force('x', d3.forceX().strength(attrs.force.strength).x(calc.chartPositions.first));

				simulation.alpha(1).restart();
			}

			function splitBubbles() {
				simulation.force('x', d3.forceX().strength(0.04).x(groupPosition));

				attrs.disableSimulation = true;

				simulation.alpha(1).restart();

				splitBubblesAnimated();
			}

			function splitBubblesAnimated() {
				var sortableBubbles = chart.selectAll('.sortable-bubble');

				var promoterBubbles = sortableBubbles.filter(d => d.type == 'promoter');
				var passiveBubbles = sortableBubbles.filter(d => d.type == 'passive');
				var detractorBubbles = sortableBubbles.filter(d => d.type == 'detractor');

				splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles)
			}

			function splitPromoters(promoterBubbles, passiveBubbles, detractorBubbles) {
				var promotersCounter = 0;

				setTimeout(() => {
					promoterBubbles.attr('opacity', 1).transition().duration(1000).delay((x, i) => i * 50)
						.attr('cx', function (d) { return d.x; })
						.attr('cy', function (d) { return d.y; })
						.on('end', function (x) {
							promotersCounter++;

							if (promotersCounter == promoterBubbles.data().length) {
								splitPassives(passiveBubbles, detractorBubbles);
							}
						});
				}, 1500);

			}

			function splitPassives(passiveBubbles, detractorBubbles) {
				var passivesCounter = 0;

				passiveBubbles.attr('opacity', 1).transition().duration(1250).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; })
					.on('end', function (x) {
						passivesCounter++;
						if (passivesCounter == passiveBubbles.data().length) {
							splitDetractors(detractorBubbles);
						}
					});
			}

			function splitDetractors(detractorBubbles) {
				detractorBubbles.attr('opacity', 1).transition().duration(1500).delay((x, i) => i * 50)
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			}

			function promoter(value) {
				return attrs.ranges.promoter.includes(value);
			}

			function passive(value) {
				return attrs.ranges.passive.includes(value);
			}

			function detractor(value) {
				return attrs.ranges.detractor.includes(value);
			}

			function hideYearTitles() {
				svg.selectAll('.year').remove();
			}

			function createNodesTotal(group_by) {
				var nested = d3.nest().key(x => x[group_by]).entries(attrs.data).sort((a, b) => b.values.length - a.values.length);

				var radiusScale = d3.scalePow()
					.exponent(0.5)
					.range([1, getMaxRange(nested.length)])
					.domain([0, nested[0].values.length]);

				var nodes = nested.map(function (d, i) {
					return {
						id: i + 1,
						radius: radiusScale(d.values.length),
						value: d.values.length,
						records: d.values,
						Gender: d.values[0].Gender,
						x: Math.random() * 900,
						y: Math.random() * 800
					};
				});

				nodes.sort(function (a, b) { return b.value - a.value; });

				return nodes;
			}

			function getMaxRange(bubblesCount) {
				var max = 25;
				if (bubblesCount > 20) max = 12;
				if (bubblesCount > 18) max = 15;
				if (bubblesCount > 16) max = 17;
				if (bubblesCount > 14) max = 20;
				if (bubblesCount > 12) max = 22;
				if (bubblesCount > 10) max = 24;
				return max;
			}

			function charge(d) {
				return -Math.pow(d.radius, 2.0) * attrs.force.strength;
			}

			function bringToTop(targetElement) {
				// put the element at the bottom of its parent
				let parent = targetElement.parentNode;
				parent.appendChild(targetElement);
			}

			function overrideD3Selection() {
				d3.selection.prototype.first = function () {
					return d3.select(
						this.nodes()[0]
					);
				};
				d3.selection.prototype.last = function () {
					return d3.select(
						this.nodes()[this.size() - 1]
					);
				};
			}

			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.4, // ems
						y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
						}
					}
				});
			}

			function addEventListeners() {
				if (navigator.userAgent.match(/iPad/i) != null) {
					svg.on('click', function () {
						shrinkMultipleBubbles();
					});
				}
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  By Gender ##################################




	};

	//#########################################  UTIL FUNCS ##################################

	//----------- PROTOTYPE FUNCTIONS  ----------------------
	d3.selection.prototype.patternify = function (params) {
		var container = this;
		var selector = params.selector;
		var elementTag = params.tag;
		var data = params.data || [selector];

		// Pattern in action
		var selection = container.selectAll('.' + selector).data(data, (d, i) => {
			if (typeof d === 'object') {
				if (d.id) {
					return d.id;
				}
			}
			return i;
		});
		selection.exit().remove();
		selection = selection.enter().append(elementTag).merge(selection);
		selection.attr('class', selector);
		return selection;
	};

	//Dynamic keys functions
	Object.keys(attrs).forEach((key) => {
		// Attach variables to main function
		return (main[key] = function (_) {
			var string = `attrs['${key}'] = _`;
			if (!arguments.length) {
				return eval(` attrs['${key}'];`);
			}
			eval(string);
			return main;
		});
	});

	//Set attrs as property
	main.attrs = attrs;

	//Exposed update functions
	main.data = function (value) {
		if (!arguments.length) return attrs.data;
		attrs.data = value;
		if (typeof updateData === 'function') {
			updateData();
		}
		return main;
	};

	// Run  visual
	main.render = function () {
		main();
		return main;
	};

	return main;
}