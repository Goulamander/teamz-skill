/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions/blob/84b538fa99e43647d0d4717247d7b650cb9049eb/README.md


*/
import * as d3 from "d3";

export const ChartTopPer = () => {
	// Exposed variables
	var attrs = {
		id: 'ID' + Math.floor(Math.random() * 1000000), // Id for event handlings
		svgWidth: 550,
		svgHeight: 400,
		marginTop: 20,
		marginBottom: 80,
		marginRight: 5,
		marginLeft: 35,
		container: 'body',
		defaultTextFill: '#2C3E50',
		defaultFont: 'Helvetica',
		data: null,
		initialData: null,
		heatmapColors: null,
		checked: false,
		dotColors: null,
		genderColors: null,
		globalFilters: [],
		previouslySortedData: null
	};

	//InnerFunctions which will update visuals
	var updateData;

	//Main chart object
	var main = function () {
		drawPotentialHeatmap();
		drawEngagementHeatmap();
		drawDotVisualization();
		drawEmployeeTable();

		listenResizeEvent();


		//######################################### EMPLOYEE TABLE ##################################
		function drawEmployeeTable() {
			if (attrs.filterSource == 'employee_performance_details') return;

			//Drawing containers
			var container = d3.select(attrs.container[3]);

			if (container.node() == null) return;

			container.selectAll('table').remove();

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
			calc.barsLeftSpacing = 50;

			var data = getFormatedDataLocal();
			var keys = [];

			for (var k in data[0]) {
				if (k == 'gender') break;
				keys.push(k);
			}

			var employeeTable = container.patternify({ tag: 'table', selector: 'employee-table' })
				.attr('id', 'employee-performance-records');

			var employeeTableHeadRow = employeeTable
				.patternify({ tag: 'thead', selector: 'employee-table-head-row' })
				.patternify({ tag: 'tr', selector: 'employee-table-head-row' });

			var employeeTableHeads = employeeTableHeadRow
				.patternify({ tag: 'th', selector: 'employee-table-head-text', data: keys })
				.text(d => d);

			var tableBody = employeeTable
				.patternify({ tag: 'tbody', selector: 'employee-table-body' });

			var max = d3.max(attrs.initialData, d => parseFloat(d['Compa-ratio']));

			max += 0.2;

			var compaRatioScale = d3.scaleLinear()
				.domain([0, max])
				.range([10, employeeTable.node().getBoundingClientRect().width / 3]);

			data.forEach(function (d) {
				var tableRow = tableBody.append('tr')
					.style('cursor', 'pointer')
					.on('mouseenter', function () {
						var element = d3.select(this);
						if (element.attr('data-clicked')) return;
						element.classed('active', true)
					})
					.on('mouseleave', function () {
						var element = d3.select(this);
						if (element.attr('data-clicked')) return;
						element.classed('active', false)
					})
					.on('click', function (d) {
						var element = d3.select(this);
						var newValue = !element.attr('data-clicked') ? true : null;
						element.attr('data-clicked', newValue);

						element.classed('active', newValue);

						crossFilter();
						main();
					});

				for (var key in d) {
					if (key == 'gender') break;

					var td = tableRow.append('td').text(key == 'Compa_ratio' ? '' : d[key]);

					if (key == 'Compa_ratio') {
						var width = compaRatioScale(d['Compa_ratio']);
						var height = 12;
						var svg = td.append('svg').classed('inline-svg', true).attr('width', width + 45).attr('height', height);
						var background = svg.append('rect').attr('height', '100%').attr('width', width).attr('fill', attrs.genderColors[d.gender.toLowerCase()]);
						var ratio = svg.append('text').attr('x', width + 5).attr('y', height).text(parseFloat(d['Compa_ratio']).toFixed(2)).attr('font-size', '14px').attr('fill', 'gray').attr('font-family', 'Lato');
					}
				}
			});

			// Functions
			function getFormatedDataLocal() {
				var data = attrs.data.map(function (d) {
					var newObject = {};
					newObject['External Uuid'] = d.external_uuid;
					newObject['Engagement'] = d.Engagement;
					newObject['Performance'] = d.Performance || d['Performance '];
					newObject['User Department'] = d.user_department;
					newObject['Potential'] = d.Potential;
					newObject['Location'] = d.location;
					newObject['Compa_ratio'] = d['Compa-ratio'];
					newObject['gender'] = d['Gender'];

					return newObject;
				}).sort((a, b) => b.Compa_ratio - a.Compa_ratio);

				return data;
			}

			function crossFilter() {
				var clickedRecords = container.select('#employee-performance-records').selectAll('tr').filter(function (d) {
					return d3.select(this).attr('data-clicked');
				});

				if (clickedRecords.data().length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedRecords);
				reduceDataRecords(filters);

				attrs.filterSource = 'employee_performance_details';
			}

			function collectFilters(clickedRecords) {
				var filters = [];

				clickedRecords.each(function (d) {
					var uuid = d3.select(this).select('td').text();
					filters.push({ external_uuid: uuid, source: 'employee_performance_details' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'employee_performance_details')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'engagement_heatmap':
							var result = applyEngagementHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'potential_heatmap':
							var result = applyPotentialHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'dot_visualization':
							var result = applyDotVisualizationFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_performance_details':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyPotentialHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var potentialMatch = x.Potential == d.potential;
						return performanceMatch && potentialMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEngagementHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var engagementMatch = x.Engagement == d.engagement;
						return performanceMatch && engagementMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyDotVisualizationFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						return x.external_uuid == d.external_uuid;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEmployeeTableFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.external_uuid == d.external_uuid);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function intersection(list1, list2) {
				var result = [];

				list1.forEach(function (d) {
					if (list2.find(x => x.external_uuid == d.external_uuid) != undefined)
						result.push(d);
				});

				return result;
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//######################################### EMPLOYEE TABLE ##################################







		//#########################################  DOT VISUALIZATION ##################################
		function drawDotVisualization() {
			if (attrs.filterSource == 'dot_visualization') return;

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
			calc.barsLeftSpacing = 5;

			//convert data for stacked chart
			let data = formatData();

			//save current data position
			attrs.previouslySortedData = attrs.data.slice();

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

			//y axis values
			var yScaleData = yScaleDomainData();

			//x axis values
			var xScaleData = xScaleDomainData(data);

			var customDistance = 10;

			//Scales
			var scales = {}
			scales.x = d3.scaleLinear().domain(xScaleData).range([calc.chartLeftMargin + customDistance, calc.chartWidth - customDistance]);
			scales.y = d3.scaleBand().domain(yScaleData).range([calc.chartHeight, calc.chartTopMargin]);

			var linesContainer = chart
				.patternify({ tag: 'g', selector: 'lines-container' });

			var lines = linesContainer
				.patternify({ tag: 'line', selector: 'line', data: yScaleData })
				.attr('x1', d => scales.x.range()[0])
				.attr('y1', (d, i) => scales.y(i + 1))
				.attr('x2', d => scales.x.range()[1])
				.attr('y2', (d, i) => scales.y(i + 1))
				.attr('stroke', 'gray')
				.attr('stroke-width', 0.4)
				.attr('stroke-dasharray', 6);

			var lineTexts = linesContainer
				.patternify({ tag: 'text', selector: 'line-label', data: yScaleData })
				.style("text-anchor", 'end')
				.attr('font-size', '16px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.text(d => d)
				.attr('x', 30)
				.attr('y', function (d, i) {
					var y = scales.y(i + 1);
					var height = this.getBoundingClientRect().height / 5;
					return y + height;
				})
				.attr('opacity', 0);

			var dotsContainer = chart
				.patternify({ tag: 'g', selector: 'dots-container' });

			var links = dotsContainer
				.patternify({ tag: 'line', selector: 'link', data: data })
				.attr('x1', (d, i) => scales.x(i))
				.attr('y1', (d) => scales.y(d.performance))
				.attr('x2', (d, i) => scales.x(i))
				.attr('y2', (d, i) => scales.y(d.potential))
				.attr('stroke', 'gray')
				.attr('stroke-width', 0.6)
				.attr('opacity', 0);

			var potentialCircles = dotsContainer
				.patternify({ tag: 'circle', selector: 'potential-circles', data: data })
				.attr('r', calc.chartWidth / 255)
				.attr('fill', attrs.dotColors.potential)
				.attr('cx', function (d, i) {
					return scales.x(i);
				})
				.attr('cy', function (d) {
					return scales.y(d.potential);
				})
				.attr('stroke', 'gray')
				.attr('stroke-width', 1)
				.attr('cursor', 'pointer');

			var performanceCircles = dotsContainer
				.patternify({ tag: 'circle', selector: 'performance-circles', data: data })
				.attr('r', calc.chartWidth / 255)
				.attr('fill', attrs.dotColors.performance)
				.attr('cx', function (d, i) {
					return scales.x(i);
				})
				.attr('cy', function (d) {
					return scales.y(d.performance);
				})
				.attr('stroke', 'gray')
				.attr('stroke-width', 1)
				.attr('cursor', 'pointer');

			// Legends
			var legendsGroup = chart
				.patternify({ tag: 'g', selector: 'legends-group' });

			var legendData = ['Performance', 'Potential'];

			var legendCircles = legendsGroup
				.patternify({ tag: 'circle', selector: 'legend-circle', data: legendData })
				.attr('r', calc.chartWidth / 180)
				.attr("cx", function (d, i) {
					return i * 130;
				})
				.attr("cy", function (d, i) {
					return 0;
				})
				.style("fill", function (d, i) {
					return d == 'Performance' ? attrs.dotColors.performance : attrs.dotColors.potential;
				})
				.attr('opacity', 0)
				.on('click', function (d, i) {
					if (d == 'Performance') sortByPerformance();
					if (d == 'Potential') sortByPotential();
				})
				.attr('cursor', 'pointer')
				.attr('stroke', 'gray')
				.attr('stroke-width', 1);

			var legendText = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-text', data: legendData.concat(['Sort Differentials']) })
				.attr('id', (d, i) => 'legend-' + i)
				.attr('font-family', 'Lato')
				.attr('font-size', '17px')
				.attr('fill', 'gray')
				.style('text-transform', 'capitalize')
				.text(d => d)
				.attr('x', function (d, i) {
					return 12 + i * 130;
				})
				.attr('y', function (d) {
					return this.getBBox().height / 3.5;
				})
				.attr('opacity', 0);

			var checkboxContainer = legendsGroup.select('#checkbox-group');

			//add checkbox
			if (!checkboxContainer.node()) {
				var checkBox = new d3CheckBox();

				checkBox.x(2 * 130 - 15).y(-10).checked(attrs.checked);

				legendsGroup.call(checkBox);

				var checkboxContainer = legendsGroup.select('#checkbox-group').attr('opacity', 0);
			}

			legendsGroup.attr('transform', function (d) {
				var x = scales.x(0);
				var y = calc.chartHeight - 30;
				return 'translate(' + x + ',' + y + ')'
			});

			animateDotVisualization();
			addEventListeners();

			// Functions
			function animateDotVisualization() {
				var animationTime = 1000;
				animateDots(animationTime);
				animatLinks(animationTime);
				animateLegends(animationTime);
				animateLabels(animationTime);
			}

			function animateDots(time) {
				potentialCircles
					.attr('cx', 0)
					.transition().duration(time).delay(time)
					.attr('cx', function (d, i) {
						return scales.x(i);
					});

				performanceCircles
					.attr('cx', 0)
					.transition().duration(time)
					.attr('cx', function (d, i) {
						return scales.x(i);
					});
			}

			function animatLinks(time) {
				links.transition().duration(time).delay(time * 2).attr('opacity', 1);
			}

			function animateLegends(time) {
				legendCircles.filter((d, i) => i == 0).transition().duration(time).attr('opacity', 1)
				legendCircles.filter((d, i) => i == 1).transition().duration(time).delay(time).attr('opacity', 1)

				legendText.filter((d, i) => i == 0).transition().duration(time).attr('opacity', 1);
				legendText.filter((d, i) => i == 1).transition().duration(time).delay(time).attr('opacity', 1);
				legendText.filter((d, i) => i == 2).transition().duration(time).delay(time * 2).attr('opacity', 1);

				checkboxContainer.transition().duration(time).delay(time * 2).attr('opacity', 1);
			}

			function animateLabels(time) {
				lineTexts.transition().duration(time).delay(time).attr('opacity', 1);
			}

			function formatData() {
				var data = attrs.data.map(function (d, i) {
					return {
						id: d.external_uuid,
						performance: parseInt(d['Performance Rating']),
						potential: parseInt(d['Potential Rating'])
					}
				});

				var sortByDifferential = attrs.checked;

				if (sortByDifferential) {
					data.sort(function (a, b) {
						var diffA = a.performance - a.potential;
						var diffB = b.performance - b.potential;
						if (diffA == diffB) return b.performance - a.performance;
						return diffB - diffA;
					});
				}

				return data;
			}

			function sortByPerformance() {
				attrs.data.sort((a, b) => b['Performance Rating'] - a['Performance Rating']);
				dynamicSortDots();
			}

			function sortByPotential() {
				attrs.data.sort((a, b) => b['Potential Rating'] - a['Potential Rating']);
				dynamicSortDots();
			}

			function dynamicSortDots() {
				links.transition().duration(1000).attr('x1', d => scales.x(attrs.data.findIndex(x => x.external_uuid == d.id))).attr('x2', d => scales.x(attrs.data.findIndex(x => x.external_uuid == d.id)));

				performanceCircles.transition().duration(1000).attr('cx', d => scales.x(attrs.data.findIndex(x => x.external_uuid == d.id)));

				potentialCircles.transition().duration(1000).attr('cx', d => scales.x(attrs.data.findIndex(x => x.external_uuid == d.id)));
			}

			/* Reusable, pure d3 Checkbox */

			function d3CheckBox() {
				var size = 20,
					x = 0,
					y = 0,
					rx = 0,
					ry = 0,
					markStrokeWidth = 2,
					boxStrokeWidth = 1,
					clickEvent;

				function checkBox(selection) {

					var g = selection.append("g")
						.attr('id', 'checkbox-group'),
						box = g.append("rect")
							.attr("width", size)
							.attr("height", size)
							.attr("x", x)
							.attr("y", y)
							.attr("rx", rx)
							.attr("ry", ry)
							.style('fill-opacity', 0)
							.style('stroke-width', boxStrokeWidth)
							.style('stroke', 'black')
							.attr('cursor', 'pointer');

					//Data to represent the check mark
					var coordinates = [
						{ x: x + (size / 8), y: y + (size / 3) },
						{ x: x + (size / 2.2), y: (y + size) - (size / 4) },
						{ x: (x + size) - (size / 8), y: (y + (size / 10)) }
					];

					var line = d3.line()
						.x(function (d) { return d.x; })
						.y(function (d) { return d.y; });

					var mark = g.append("path")
						.attr("d", line(coordinates))
						.style('stroke-width', markStrokeWidth)
						.style('stroke', 'gray')
						.style('fill', 'none')
						.style('opacity', attrs.checked ? 1 : 0)
						.attr('cursor', 'pointer');

					g.on("click", function () {
						attrs.checked = !attrs.checked;
						mark.style("opacity", (attrs.checked) ? 1 : 0);

						if (clickEvent)
							clickEvent();

						d3.event.stopPropagation();

						if (attrs.checked) {
							attrs.previouslySortedData = attrs.data.slice();
							attrs.data.sort(function (a, b) {
								var diffA = a['Performance Rating'] - a['Potential Rating'];
								var diffB = b['Performance Rating'] - b['Potential Rating'];
								if (diffA == diffB) return b['Performance Rating'] - a['Performance Rating'];
								return diffB - diffA;
							});
						}
						else attrs.data = attrs.previouslySortedData.slice();

						dynamicSortDots();
					});

				}

				checkBox.size = function (val) {
					size = val;
					return checkBox;
				}

				checkBox.x = function (val) {
					x = val;
					return checkBox;
				}

				checkBox.y = function (val) {
					y = val;
					return checkBox;
				}

				checkBox.rx = function (val) {
					rx = val;
					return checkBox;
				}

				checkBox.ry = function (val) {
					ry = val;
					return checkBox;
				}

				checkBox.markStrokeWidth = function (val) {
					markStrokeWidth = val;
					return checkBox;
				}

				checkBox.boxStrokeWidth = function (val) {
					boxStrokeWidth = val;
					return checkBox;
				}

				checkBox.checked = function (val) {

					if (val === undefined) {
						return attrs.checked;
					} else {
						attrs.checked = val;
						return checkBox;
					}
				}

				checkBox.clickEvent = function (val) {
					clickEvent = val;
					return checkBox;
				}

				return checkBox;
			}

			function yScaleDomainData() {
				var distinctPerformanceRatings = Array.from(new Set(attrs.initialData.map(x => x['Performance Rating'])));
				var distinctPotentialRatings = Array.from(new Set(attrs.initialData.map(x => x['Potential Rating'])));
				var ratings = Array.from(new Set(distinctPerformanceRatings.concat(distinctPotentialRatings))).sort((a, b) => a - b);
				return ratings;
			}

			function xScaleDomainData() {
				return [0, attrs.initialData.length];
			}

			function addEventListeners() {
				var circles = dotsContainer.selectAll('circle');

				circles
					.on('mouseenter', function (d) {
						if (attrs.dotClickActivated) return;
						circles.filter(x => x.id == d.id).attr('opacity', 0.6);
						links.filter(x => x.id == d.id).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.dotClickActivated) return;
						circles.filter(x => x.id == d.id).attr('opacity', 1);
						links.filter(x => x.id == d.id).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.dotClickActivated = (d.clicked || circles.filter(x => x.clicked).length > 0);
						setColors(circles);
						crossFilter();
						main();
					});
			}

			function setColors(circles) {
				circles
					.attr('opacity', function (d) {
						if (!attrs.dotClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				links
					.attr('opacity', function (d) {
						if (!attrs.dotClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

			}

			function crossFilter() {
				var clickedLinksData = links.data().filter(x => x.clicked);

				if (clickedLinksData.length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedLinksData);
				reduceDataRecords(filters);

				attrs.filterSource = 'dot_visualization';
			}

			function collectFilters(clickedLinksData) {
				var filters = [];

				clickedLinksData.forEach(function (d) {
					filters.push({ external_uuid: d.id, source: 'dot_visualization' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'dot_visualization')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'engagement_heatmap':
							var result = applyEngagementHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'potential_heatmap':
							var result = applyPotentialHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'dot_visualization':
							var result = applyDotVisualizationFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_performance_details':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyPotentialHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var potentialMatch = x.Potential == d.potential;
						return performanceMatch && potentialMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEngagementHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var engagementMatch = x.Engagement == d.engagement;
						return performanceMatch && engagementMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyDotVisualizationFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						return x.external_uuid == d.external_uuid;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEmployeeTableFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.external_uuid == d.external_uuid);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function intersection(list1, list2) {
				var result = [];

				list1.forEach(function (d) {
					if (list2.find(x => x.external_uuid == d.external_uuid) != undefined)
						result.push(d);
				});

				return result;
			}

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  DOT VISUALIZATION ##################################






		//#########################################  ENGAGEMENT HEATMAP ##################################
		function drawEngagementHeatmap() {
			if (attrs.filterSource == 'engagement_heatmap') return;

			//Drawing containers
			var container = d3.select(attrs.container[1]);

			if (container.node() == null) return;
			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			var customAddition = 15;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft + customAddition;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.barsLeftSpacing = 5;

			//convert data for stacked chart
			let heatmapData = formatData();

			//convert global data for stacked chart
			let heatmapDataGlobal = formatDataGlobal();

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont)
				;

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//y axis values
			var yScaleData = yScaleDomainData();

			//x axis values
			var xScaleData = xScaleDomainData();

			var customDistance = 10;

			//Scales
			var scales = {}
			scales.x = d3.scaleBand().domain(xScaleData).range([calc.chartLeftMargin + customDistance, calc.chartWidth - customDistance]);
			scales.y = d3.scaleBand().domain(yScaleData).range([calc.chartHeight, calc.chartTopMargin]);
			scales.color = d3.scaleLinear().range([attrs.heatmapColors.lowest, attrs.heatmapColors.highest]).domain([1, d3.max(heatmapDataGlobal.map(x => x.count))]);

			//Axes
			var axes = {};
			axes.x = d3.axisBottom().scale(scales.x).tickSize(0)
			axes.y = d3.axisLeft().scale(scales.y).tickSize(0)

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${0}, ${calc.chartHeight})`);

			xAxisGroup.selectAll('.domain').remove();

			var xAxisTexts = xAxisGroup.selectAll("text")
				.style("text-anchor", 'middle')
				.attr("dy", function (d) {
					return 0;
				})
				.attr("x", 0)
				.attr("y", function (d) {
					var initial = -0.2;
					var width = calc.chartWidth
					if (width > 60) initial += width / 60;
					return 1;
				})
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.call(wrap, 10)

			xAxisTexts.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('.domain').remove();

			var yAxisTexts = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var blocksContainer = chart.patternify({ tag: 'g', selector: 'blocks-container' })

			var blocks = blocksContainer
				.patternify({ tag: 'rect', selector: 'heatmap-block', data: heatmapData })
				.attr("x", function (d) { return 0 })
				.attr("y", function (d) { return scales.y(d.engagement) })
				.attr("width", scales.x.bandwidth())
				.attr("height", scales.y.bandwidth())
				.style("fill", 'white')
				.attr('stroke', 'white')
				.attr('stroke-width', 1)
				.attr('cursor', 'pointer')
				.attr('display', d => d.count == 0 ? 'none' : null);

			//rect labels container
			var rectLabelsContainer = chart
				.patternify({ tag: 'g', selector: 'rect-labels-container' })
			// .attr('opacity', 0);

			addEventListeners(blocks);

			var blockLabelCenters = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'block-label', data: heatmapData.filter(d => d.count != 0) })
				.attr('font-family', 'Lato')
				.attr('font-size', '15px')
				.attr('fill', function (d) {
					var max = scales.color.domain()[1];
					var color = d.count > max / 2 ? '#D6DFE7' : 'gray';
					return color;
				})
				.text(d => d.count)
				.attr('transform', function (d) {
					var textWidth = this.getBoundingClientRect().width;
					var textHeight = this.getBoundingClientRect().height;
					var x = scales.x(d.performance) + scales.x.bandwidth() / 2 - textWidth / 2;
					var y = scales.y(d.engagement) + textHeight / 3 + scales.y.bandwidth() / 2;
					var translate = "translate(" + x + "," + y + ")";
					return translate;
				})
				.attr('opacity', 0);

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('font-weight', 'bold')
				.attr('fill', 'gray')
				.text('Engagement')
				.attr('transform', function (d) {
					var x = -62;
					var y = this.getBBox().height / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			//Add container g element
			var chartHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'chart-header-group' })
				.attr('transform', function (d) {
					var x = 0;
					var y = calc.chartHeight + 35;
					return 'translate(' + x + ',' + y + ')'
				});

			var chartHeader = chartHeaderGroup
				.patternify({ tag: 'text', selector: 'chart-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('font-weight', 'bold')
				.attr('fill', 'gray')
				.text('Performance')
				.attr('transform', function (d) {
					var x = 0;
					var y = 35;
					var blocksWidth = + xScaleData.length * scales.x.bandwidth();
					var x = scales.x(xScaleData[0]) + blocksWidth / 2 - this.getBBox().width / 2
					return 'translate(' + x + ',' + y + ')';
				});

			animateEngagementHeatmap();

			// Functions
			function animateEngagementHeatmap() {
				var animationTime = 1000;
				animateBlocks(animationTime);
				animateNumbers(animationTime);
				animateTickLabels(animationTime);
				bringToTop(rectLabelsContainer.node(), animationTime);
			}

			function animateBlocks(time) {
				blocks.transition().duration(time)
					.attr("x", function (d) { return scales.x(d.performance) })
					.style("fill", d => scales.color(d.count))
			}

			function animateNumbers(time) {
				blockLabelCenters.transition().duration(time).delay(time / 1.5).attr('opacity', 1);
			}

			function animateTickLabels(time) {
				xAxisTexts.transition().duration(time).attr('opacity', 1);
				yAxisTexts.transition().duration(time).attr('opacity', 1);
			}

			function formatData() {
				var engagementPriority = ["Top 10%", "Top Tier", "Middle Tier", "Lower Tier"];

				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//group by engagements
				var nestByEngagement = d3.nest()
					.key(d => d.Engagement)
					.entries(attrs.data).sort(function (a, b) {
						return (engagementPriority.indexOf(a.key) + 1) - (engagementPriority.indexOf(b.key) + 1);
					});

				//group by performances
				var nestByPerformance = d3.nest()
					.key(d => d.Performance || d['Performance '])
					.entries(attrs.data)
					.sort(function (a, b) {
						return (performancePriority.indexOf(a.key) + 1) - (performancePriority.indexOf(b.key) + 1);
					});

				var heatmapRecords = [];

				nestByEngagement.forEach(function (engagement) {
					nestByPerformance.forEach(function (performance) {
						heatmapRecords.push({
							engagement: engagement.key,
							performance: performance.key,
							count: performance.values.filter(x => x.Engagement == engagement.key).length
						});
					});
				});

				return heatmapRecords;
			}

			function formatDataGlobal() {
				var engagementPriority = ["Top 10%", "Top Tier", "Middle Tier", "Lower Tier"];

				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//group by engagements
				var nestByEngagement = d3.nest()
					.key(d => d.Engagement)
					.entries(attrs.initialData).sort(function (a, b) {
						return (engagementPriority.indexOf(a.key) + 1) - (engagementPriority.indexOf(b.key) + 1);
					});

				//group by performances
				var nestByPerformance = d3.nest()
					.key(d => d.Performance || d['Performance '])
					.entries(attrs.initialData)
					.sort(function (a, b) {
						return (performancePriority.indexOf(a.key) + 1) - (performancePriority.indexOf(b.key) + 1);
					});

				var heatmapRecords = [];

				nestByEngagement.forEach(function (engagement) {
					nestByPerformance.forEach(function (performance) {
						heatmapRecords.push({
							engagement: engagement.key,
							performance: performance.key,
							count: performance.values.filter(x => x.Engagement == engagement.key).length
						});
					});
				});

				return heatmapRecords;
			}

			function bringToTop(targetElement, time) {
				// put the element at the bottom of its parent
				setTimeout(() => {
					let parent = targetElement.parentNode;
					parent.appendChild(targetElement)
				}, time);
			}

			function yScaleDomainData() {
				var engagementPriority = ["Lower Tier", "Middle Tier", "Top Tier", "Top 10%"];

				//fetch distinct engagements
				var allEngagements = Array.from(new Set(attrs.initialData.map(x => x.Engagement))).sort(function (a, b) {
					return (engagementPriority.indexOf(a) + 1) - (engagementPriority.indexOf(b) + 1);
				});

				return allEngagements;
			}

			function xScaleDomainData() {
				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//fetch distinct performances
				var allPerformances = Array.from(new Set(attrs.initialData.map(x => x.Performance || x['Performance ']))).sort(function (a, b) {
					return (performancePriority.indexOf(a) + 1) - (performancePriority.indexOf(b) + 1);
				});

				return allPerformances;
			}

			function addEventListeners(blocks) {
				blocks
					.on('mouseenter', function (d) {
						if (attrs.engagementHeatmapClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.engagementHeatmapClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.engagementHeatmapClickActivated = (d.clicked || blocks.data().filter(x => x.clicked).length > 0);
						setColors(blocks);
						crossFilter(blocks);
						main();
					});
			}

			function setColors(blocks) {
				blocks
					.attr('opacity', function (d) {
						if (!attrs.engagementHeatmapClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				blockLabelCenters
					.attr('opacity', function (d) {
						if (!attrs.engagementHeatmapClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					})
			}

			function crossFilter(blocks) {
				var clickedBlocksData = blocks.data().filter(x => x.clicked);
				if (clickedBlocksData.length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedBlocksData);
				reduceDataRecords(filters);

				attrs.filterSource = 'engagement_heatmap';
			}

			function collectFilters(clickedBlocksData) {
				var filters = [];
				clickedBlocksData.forEach(function (d) {
					filters.push({ engagement: d.engagement, performance: d.performance, source: 'engagement_heatmap' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'engagement_heatmap')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'engagement_heatmap':
							var result = applyEngagementHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'potential_heatmap':
							var result = applyPotentialHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'dot_visualization':
							var result = applyDotVisualizationFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_performance_details':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyPotentialHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var potentialMatch = x.Potential == d.potential;
						return performanceMatch && potentialMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEngagementHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var engagementMatch = x.Engagement == d.engagement;
						return performanceMatch && engagementMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyDotVisualizationFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						return x.external_uuid == d.external_uuid;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEmployeeTableFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.external_uuid == d.external_uuid);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}


			function intersection(list1, list2) {
				var result = [];

				list1.forEach(function (d) {
					if (list2.find(x => x.external_uuid == d.external_uuid) != undefined)
						result.push(d);
				});

				return result;
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

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  ENGAGEMENT HEATMAP ##################################





		//#########################################  POTENTIAL HEATMAP ##################################
		function drawPotentialHeatmap() {
			if (attrs.filterSource == 'potential_heatmap') return;

			//Drawing containers
			var container = d3.select(attrs.container[0]);
			if (container.node() == null) return;
			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			var customAddition = 15;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft + customAddition;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.barsLeftSpacing = 5;

			//convert data for stacked chart
			let heatmapData = formatData();

			//convert global data for stacked chart
			let heatmapDataGlobal = formatDataGlobal();

			//Add svg
			var svg = container
				.patternify({ tag: 'svg', selector: 'svg-chart-container' })
				.attr('width', attrs.svgWidth)
				.attr('height', attrs.svgHeight)
				.attr('font-family', attrs.defaultFont)
				;

			//Add container g element
			var chart = svg
				.patternify({ tag: 'g', selector: 'chart' })
				.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

			//y axis values
			var yScaleData = yScaleDomainData();

			//x axis values
			var xScaleData = xScaleDomainData();

			var customDistance = 10;

			//Scales
			var scales = {}
			scales.x = d3.scaleBand().domain(xScaleData).range([calc.chartLeftMargin + customDistance, calc.chartWidth - customDistance]);
			scales.y = d3.scaleBand().domain(yScaleData).range([calc.chartHeight, calc.chartTopMargin]);
			scales.color = d3.scaleLinear().range([attrs.heatmapColors.lowest, attrs.heatmapColors.highest]).domain([1, d3.max(heatmapDataGlobal.map(x => x.count))]);

			//Axes
			var axes = {};
			axes.x = d3.axisBottom().scale(scales.x).tickSize(0)
			axes.y = d3.axisLeft().scale(scales.y).tickSize(0)

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${0}, ${calc.chartHeight})`);

			xAxisGroup.selectAll('.domain').remove();

			var xAxisTexts = xAxisGroup.selectAll("text")
				.style("text-anchor", 'middle')
				.attr("dy", function (d) {
					return 0;
				})
				.attr("x", 0)
				.attr("y", function (d) {
					var initial = -0.2;
					var width = calc.chartWidth
					if (width > 60) initial += width / 60;
					return 1;
				})
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.call(wrap, 10)

			xAxisTexts.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('.domain').remove();

			var yAxisTexts = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var blocksContainer = chart.patternify({ tag: 'g', selector: 'blocks-container' })

			var blocks = blocksContainer
				.patternify({ tag: 'rect', selector: 'heatmap-block', data: heatmapData })
				.attr("x", function (d) { return 0 })
				.attr("y", function (d) { return scales.y(d.potential) })
				.attr("width", scales.x.bandwidth())
				.attr("height", scales.y.bandwidth())
				.style("fill", 'white')
				.attr('stroke', 'white')
				.attr('stroke-width', 1)
				.attr('cursor', 'pointer')
				.attr('display', d => d.count == 0 ? 'none' : null);

			//rect labels container
			var rectLabelsContainer = chart
				.patternify({ tag: 'g', selector: 'rect-labels-container' })
			// .attr('opacity', 0);

			addEventListeners(blocks);

			var blockLabelCenters = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'block-label', data: heatmapData.filter(d => d.count != 0) })
				.attr('font-family', 'Lato')
				.attr('font-size', '15px')
				.attr('fill', function (d) {
					var max = scales.color.domain()[1];
					var color = d.count > max / 2 ? '#D6DFE7' : 'gray';
					return color;
				})
				.text(d => d.count)
				.attr('transform', function (d) {
					var textWidth = this.getBoundingClientRect().width;
					var textHeight = this.getBoundingClientRect().height;
					var x = scales.x(d.performance) + scales.x.bandwidth() / 2 - textWidth / 2;
					var y = scales.y(d.potential) + textHeight / 3 + scales.y.bandwidth() / 2;
					var translate = "translate(" + x + "," + y + ")";
					return translate;
				})
				.attr('opacity', 0);

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('font-weight', 'bold')
				.attr('fill', 'gray')
				.text('Potential')
				.attr('transform', function (d) {
					var x = -51;
					var y = this.getBBox().height / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			//Add container g element
			var chartHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'chart-header-group' })
				.attr('transform', function (d) {
					var x = 0;
					var y = calc.chartHeight + 35;
					return 'translate(' + x + ',' + y + ')'
				});

			var chartHeader = chartHeaderGroup
				.patternify({ tag: 'text', selector: 'chart-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('font-weight', 'bold')
				.attr('fill', 'gray')
				.text('Performance')
				.attr('transform', function (d) {
					var x = 0;
					var y = 35;
					var blocksWidth = + xScaleData.length * scales.x.bandwidth();
					var x = scales.x(xScaleData[0]) + blocksWidth / 2 - this.getBBox().width / 2
					return 'translate(' + x + ',' + y + ')';
				});

			animatePotentialHeatmap();

			// Functions
			function animatePotentialHeatmap() {
				var animationTime = 1000;
				animateBlocks(animationTime);
				animateNumbers(animationTime);
				animateTickLabels(animationTime);
				bringToTop(rectLabelsContainer.node(), animationTime);
			}

			function animateBlocks(time) {
				blocks.transition().duration(time)
					.attr("x", function (d) { return scales.x(d.performance) })
					.style("fill", d => scales.color(d.count))
			}

			function animateNumbers(time) {
				blockLabelCenters.transition().duration(time).delay(time / 1.5).attr('opacity', 1);
			}

			function animateTickLabels(time) {
				xAxisTexts.transition().duration(time).attr('opacity', 1);
				yAxisTexts.transition().duration(time).attr('opacity', 1);
			}

			function formatData() {
				var potentialPriority = ["Top 10%", "Top Tier", "Middle Tier", "Lower Tier"];

				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//group by potentials
				var nestByPotential = d3.nest()
					.key(d => d.Potential)
					.entries(attrs.data).sort(function (a, b) {
						return (potentialPriority.indexOf(a.key) + 1) - (potentialPriority.indexOf(b.key) + 1);
					});

				//group by performances
				var nestByPerformance = d3.nest()
					.key(d => d.Performance || d['Performance '])
					.entries(attrs.data)
					.sort(function (a, b) {
						return (performancePriority.indexOf(a.key) + 1) - (performancePriority.indexOf(b.key) + 1);
					});

				var heatmapRecords = [];

				nestByPotential.forEach(function (potential) {
					nestByPerformance.forEach(function (performance) {
						heatmapRecords.push({
							potential: potential.key,
							performance: performance.key,
							count: performance.values.filter(x => x.Potential == potential.key).length
						});
					});
				});

				return heatmapRecords;
			}

			function formatDataGlobal() {
				var potentialPriority = ["Top 10%", "Top Tier", "Middle Tier", "Lower Tier"];

				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//group by potentials
				var nestByPotential = d3.nest()
					.key(d => d.Potential)
					.entries(attrs.initialData).sort(function (a, b) {
						return (potentialPriority.indexOf(a.key) + 1) - (potentialPriority.indexOf(b.key) + 1);
					});

				//group by performances
				var nestByPerformance = d3.nest()
					.key(d => d.Performance || d['Performance '])
					.entries(attrs.initialData)
					.sort(function (a, b) {
						return (performancePriority.indexOf(a.key) + 1) - (performancePriority.indexOf(b.key) + 1);
					});

				var heatmapRecords = [];

				nestByPotential.forEach(function (potential) {
					nestByPerformance.forEach(function (performance) {
						heatmapRecords.push({
							potential: potential.key,
							performance: performance.key,
							count: performance.values.filter(x => x.Potential == potential.key).length
						});
					});
				});

				return heatmapRecords;
			}



			function bringToTop(targetElement, time) {
				// put the element at the bottom of its parent
				setTimeout(() => {
					let parent = targetElement.parentNode;
					parent.appendChild(targetElement)
				}, time);
			}

			function yScaleDomainData() {
				var potentialPriority = ["Lower Tier", "Middle Tier", "Top Tier", "Top 10%"];

				//fetch distinct potentials
				var allPotentials = Array.from(new Set(attrs.initialData.map(x => x.Potential))).sort(function (a, b) {
					return (potentialPriority.indexOf(a) + 1) - (potentialPriority.indexOf(b) + 1);
				});

				return allPotentials;
			}

			function xScaleDomainData() {
				var performancePriority = ["Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding Performance"];

				//fetch distinct performances
				var allPerformances = Array.from(new Set(attrs.initialData.map(x => x.Performance || x['Performance ']))).sort(function (a, b) {
					return (performancePriority.indexOf(a) + 1) - (performancePriority.indexOf(b) + 1);
				});

				return allPerformances;
			}

			function addEventListeners(blocks) {
				blocks
					.on('mouseenter', function (d) {
						if (attrs.potentialHeatmapClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.potentialHeatmapClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.potentialHeatmapClickActivated = (d.clicked || blocks.data().filter(x => x.clicked).length > 0);
						setColors(blocks);
						crossFilter(blocks);
						main();
					});

				d3.select('#reset-button').on('click', function (d) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					attrs.filterSource = 'button';
					main();
				});
			}

			function setColors(blocks) {
				blocks
					.attr('opacity', function (d) {
						if (!attrs.potentialHeatmapClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				blockLabelCenters
					.attr('opacity', function (d) {
						if (!attrs.potentialHeatmapClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					})
			}

			function crossFilter(blocks) {
				var clickedBlocksData = blocks.data().filter(x => x.clicked);
				if (clickedBlocksData.length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedBlocksData);
				reduceDataRecords(filters);

				attrs.filterSource = 'potential_heatmap';
			}

			function collectFilters(clickedBlocksData) {
				var filters = [];
				clickedBlocksData.forEach(function (d) {
					filters.push({ potential: d.potential, performance: d.performance, source: 'potential_heatmap' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'potential_heatmap')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'engagement_heatmap':
							var result = applyEngagementHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'potential_heatmap':
							var result = applyPotentialHeatmapFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'dot_visualization':
							var result = applyDotVisualizationFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_performance_details':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyPotentialHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var potentialMatch = x.Potential == d.potential;
						return performanceMatch && potentialMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEngagementHeatmapFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						var performanceMatch = x.Performance == d.performance || x['Performance '] == d.performance;
						var engagementMatch = x.Engagement == d.engagement;
						return performanceMatch && engagementMatch;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyDotVisualizationFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(function (x) {
						return x.external_uuid == d.external_uuid;
					});

					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyEmployeeTableFilters(filters) {
				var localRecords = [];

				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.external_uuid == d.external_uuid);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function intersection(list1, list2) {
				var result = [];

				list1.forEach(function (d) {
					if (list2.find(x => x.external_uuid == d.external_uuid) != undefined)
						result.push(d);
				});

				return result;
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

			// Smoothly handle data updating
			updateData = function () { };
		}

		//#########################################  POTENTIAL HEATMAP ##################################



		function listenResizeEvent() {
			// d3.select(window).on('resize.' + attrs.id, function () {
			// 	attrs.container.forEach(function (d) {
			// 		attrs.filterSource = '';
			// 		d3.select(d).select('svg').remove();
			// 	});

			// 	main();
			// });
		}
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