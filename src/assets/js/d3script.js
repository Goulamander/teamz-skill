/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions/blob/84b538fa99e43647d0d4717247d7b650cb9049eb/README.md


*/
import * as d3 from "d3";

export const Chart = () => {
	// Exposed variables
	var attrs = {
		id: 'ID' + Math.floor(Math.random() * 1000000), // Id for event handlings
		svgWidth: 550,
		svgHeight: 400,
		marginTop: 20,
		marginBottom: 50,
		marginRight: 5,
		marginLeft: 25,
		container: 'body',
		defaultTextFill: '#2C3E50',
		defaultFont: 'Helvetica',
		data: null,
		initialData: null,
		colors: null,
		genderColors: null,
		globalFilters: []
	};

	//InnerFunctions which will update visuals
	var updateData;

	//Main chart object
	var main = function () {
		drawStackedBarChart();
		drawBubbleChart();
		drawHorizontalStackedLeft();
		drawHorizontalStackedRight();
		drawEmployeeTable();

		listenResizeEvent();



		//######################################### EMPLOYEE TABLE ##################################
		function drawEmployeeTable() {
			if (attrs.filterSource == 'employee_table') return;

			//Drawing containers
			var container = d3.select(attrs.container[4]);

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

			for (var k in data[0]) keys.push(k);

			var employeeTable = container.patternify({ tag: 'table', selector: 'employee-table' })
				.attr('id', 'employee-records-table-1');

			var employeeTableHeadRow = employeeTable
				.patternify({ tag: 'thead', selector: 'employee-table-head-row' })
				.patternify({ tag: 'tr', selector: 'employee-table-head-row' });

			var employeeTableHeads = employeeTableHeadRow
				.patternify({ tag: 'th', selector: 'employee-table-head-text', data: keys })
				.text(d => d);

			var tableBody = employeeTable
				.patternify({ tag: 'tbody', selector: 'employee-table-body' });

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

				for (var key in d) tableRow.append('td').text(d[key]);
			});


			// Functions
			function getFormatedDataLocal() {
				var data = attrs.data.map(function (d) {
					var newObject = {};
					newObject['External Uuid'] = d.external_uuid;
					newObject['Hire Date'] = d.hire_date;
					newObject['time_in_job'] = d.time_in_job;
					newObject['User Title'] = d.user_title;
					newObject['user_level'] = d.user_level;
					newObject['Gender'] = d.Gender;
					newObject['Location'] = d.location;
					newObject['User Department'] = d.user_department;

					return newObject;
				});

				return data;
			}

			function crossFilter() {
				var clickedRecords = container.select('#employee-records-table-1').selectAll('tr').filter(function (d) {
					return d3.select(this).attr('data-clicked');
				});

				if (clickedRecords.data().length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedRecords);
				reduceDataRecords(filters);

				attrs.filterSource = 'employee_table';
			}

			function collectFilters(clickedRecords) {
				var filters = [];

				clickedRecords.each(function (d) {
					var uuid = d3.select(this).select('td').text();
					filters.push({ external_uuid: uuid, source: 'employee_table' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'employee_table')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'stacked_bar_chart':
							var result = applyStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result);
							break;
						case 'bubble_chart':
							var result = applyBubbleFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'left_stacked_bar_chart':
							var result = applyLeftStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'right_stacked_bar_chart':
							var result = applyRightStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_table':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && new Date(x.hire_date).getFullYear() == d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyBubbleFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && parseInt(new Date(x.hire_date).getFullYear()) <= d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyLeftStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.user_level == d.level);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyRightStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.location == d.location);
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






		//######################################### HORIZONTAL STACKED BAR CHART RIGHT ##################################
		function drawHorizontalStackedRight() {
			if (attrs.filterSource == 'right_stacked_bar_chart') return;

			//Drawing containers
			var container = d3.select(attrs.container[3]);

			if (container.node() == null) return;
			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft + 55;
			calc.chartTopMargin = attrs.marginTop + 85;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin - 10;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.barsLeftSpacing = 50;

			var data = getFormatedDataLocal();
			var globalData = getFormatedDataGlobal();

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

			//color by gender
			var colorScaleData = ['female', 'male'];

			//Scales
			var scales = {}
			scales.x = d3.scaleLinear().domain([0, d3.max(globalData, d => d.total + 2)]).range([1, calc.chartWidth - calc.barsLeftSpacing]).nice();
			scales.y = d3.scaleBand().domain(globalData.map(d => d.key)).range([calc.chartHeight, 0]).padding(0.2);
			scales.color = d3.scaleOrdinal().domain(colorScaleData).range(attrs.genderColors)

			//Axes
			var axes = {};
			axes.x = d3.axisBottom(scales.x).tickSize(-calc.chartHeight);
			axes.y = d3.axisLeft(scales.y).tickSize(0);

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${calc.barsLeftSpacing}, ${calc.chartHeight})`);

			var xAxisTexts = xAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr("dx", '0.3em')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('.domain').remove();

			xAxisGroup.selectAll('path').attr('stroke', 'gray').attr('stroke-width', 0.3);

			xAxisGroup.selectAll('line').attr('stroke', 'gray').attr('stroke-width', 0.3);

			var yAxisTexts = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var stackLayoutData = d3.stack().keys(['male', 'female'])(data);

			var rectsContainer = chart
				.patternify({ tag: 'g', selector: 'rects-container', data: stackLayoutData })
				.attr("fill", function (d) {
					d3.select(this).attr('data-gender', d.key)
					return scales.color(d.key);
				});

			var rectData = [];

			var rects = rectsContainer.each(function (d) {
				d3.select(this)
					.patternify({ tag: 'rect', selector: 'rects', data: d })
					.attr('x', function (d) {
						var xPosition = scales.x(d[0]) + calc.barsLeftSpacing;
						d.oldX = xPosition;
						d3.select(this).attr('data-oldX', xPosition);
						d3.select(this).attr('data-location', d.data.key);
						d3.select(this).attr('data-gender', d3.select(this.parentNode).attr('data-gender'));
						return d.oldX;
					})
					.attr('y', d => scales.y(d.data.key))
					.attr('height', scales.y.bandwidth())
					.attr('width', function (d) {
						var width = (scales.x(d[1]) - scales.x(d[0]));
						d.oldWidth = width;
						d3.select(this).attr('data-oldwidth', width);
						return d.oldWidth;
					})
					.attr('data-rectdata', function (d) { rectData.push(d) })
					.attr('cursor', 'pointer');
			});

			// rect labels container
			var rectLabelsContainer = chart
				.patternify({ tag: 'g', selector: 'rect-labels-container' })
				.attr('opacity', 0);

			var rectLabelHeaders = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-headers', data: data })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('dy', 1.5)
				.attr('x', d => scales.x(d.total) + calc.barsLeftSpacing + 5)
				.text(d => d.total)
				.attr('y', function (d) {
					var customAddition = parseFloat(rectsContainer.select('rect').attr('height')) / 2 + (this.getBBox().height / 5);
					return scales.y(d.key) + customAddition;
				})
				.attr('display', d => d.total > 0 ? null : 'none')

			var rectLabelCenters = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-centers', data: rectData.filter(d => (d[1] - d[0]) != 0) })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'black')
				.text(d => d[1] - d[0])
				.attr('transform', function (d) {
					var x = scales.x(d[0]) + calc.barsLeftSpacing;
					var xCustomAddition = (scales.x(d[1]) - scales.x(d[0])) / 2 - (this.getBBox().width / 2);
					x += xCustomAddition;

					var y = scales.y(d.data.key);
					var yCustomAddition = parseFloat(rectsContainer.select('rect').attr('height')) / 2 + (this.getBBox().height / 3.5);
					y += yCustomAddition;

					var translate = "translate(" + x + "," + y + ")";
					return translate;
				})
				.attr('opacity', function (d) {
					return d.opacity;
				});

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('fill', 'gray')
				.text('location')
				.attr('transform', function (d) {
					var x = -88;
					var y = this.getBBox().width / 2 - 33;
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
				.attr('fill', 'gray')
				.text('Employee Count')
				.attr('transform', function (d) {
					var x = 0;
					var y = 0;
					var chartWidth = chart.node().getBBox().width;
					var x = chartWidth / 2 - this.getBBox().width / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			// Legends
			var legendsGroup = chart
				.patternify({ tag: 'g', selector: 'legends-group' })
				.attr('opacity', 0);

			var legendHeaderBackground = legendsGroup
				.patternify({ tag: 'rect', selector: 'legend-header-background' })
				.attr("width", 120)
				.attr("height", 35)
				.attr("x", function (d) {
					return 0;
				})
				.attr("y", function (d, i) {
					return -25;
				})
				.style("fill", function (d) {
					return '#FBFBFB';
				});

			var legendHeader = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('fill', 'gray')
				.text('Gender')
				.attr('transform', function (d) {
					var x = 10;
					var y = -2;
					return 'translate(' + x + ',' + y + ')';
				});

			var legendRects = legendsGroup.patternify({ tag: 'rect', selector: 'legend-rect', data: colorScaleData })
				.attr("width", 18)
				.attr("height", 18)
				.attr("x", function (d) {
					return 5;
				})
				.attr("y", function (d, i) {
					return (i + 1) * 25 - 10;
				})
				.style("fill", function (d) {
					return scales.color(d);
				});


			var legendText = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-text', data: colorScaleData })
				.attr('font-family', 'Lato')
				.attr('font-size', '15px')
				.attr('fill', 'gray')
				.style('text-transform', 'capitalize')
				.text(d => d)
				.attr('transform', function (d, i) {
					var x = 28;
					var y = (i + 1) * 25 + 4;
					return 'translate(' + x + ',' + y + ')';
				});

			var legendBackground = legendsGroup
				.patternify({ tag: 'rect', selector: 'legend-background' })
				.attr("width", '120px')
				.attr("height", '90px')
				.attr("x", function (d) {
					return 0;
				})
				.attr("y", function (d, i) {
					return -25;
				})
				.style("fill", function (d) {
					return 'transparent';
				})
				.style('stroke', 'black')
				.style('stroke-width', '0.3');

			legendsGroup.attr('transform', function (d) {
				var x = calc.chartWidth - 120;
				var y = -80;
				return 'translate(' + x + ',' + y + ')'
			});

			animateHorizontalStackedBarChart();
			addEventListeners(rectsContainer.selectAll('.rects'))

			// Functions
			function getFormatedDataLocal() {
				var byLocation = nestBy('location', attrs.data);

				setTotalValues(byLocation);

				return byLocation;
			}

			function getFormatedDataGlobal() {
				var byLocation = nestBy('location', attrs.initialData);

				setTotalValues(byLocation);

				return byLocation;
			}

			function nestBy(key, data) {
				var nested = d3.nest()
					.key(d => d[key])
					.entries(data)
					.sort(function (a, b) {
						return a.values.length - b.values.length;
					});

				return nested;
			}

			function setTotalValues(nested) {
				nested.forEach(function (d) {
					d.total = d.values.length;
					let nestedGender = d3.nest().key(x => x.Gender).entries(d.values);
					let recordsForMale = nestedGender.find(x => x.key == "Male");
					let recordsForFemale = nestedGender.find(x => x.key == "Female");
					d.male = recordsForMale ? recordsForMale.values.length : 0;
					d.female = recordsForFemale ? recordsForFemale.values.length : 0;
				});
			}

			function animateHorizontalStackedBarChart() {
				var animationTime = 800;
				animateBars(animationTime);
				animateNumbers(animationTime);
				animateTickLabels(animationTime);
				animateLegends(animationTime);
			}

			function animateBars(time) {
				var allRects = rectsContainer.selectAll('.rects');

				allRects
					.attr('x', function (d) {
						return calc.barsLeftSpacing;
					})
					.attr('width', 0)
					.transition().duration(time)
					.attr('width', function (d) {
						var width = d3.select(this).attr('data-oldwidth');
						return width;
					})
					.attr('x', function (d) {
						var xPosition = d3.select(this).attr('data-oldX');
						return xPosition;
					});
			}

			function animateNumbers(time) {
				rectLabelsContainer.transition().duration(time).delay(time).attr('opacity', 1);
			}

			function animateTickLabels(time) {
				xAxisTexts.transition().duration(time).attr('opacity', 1);
				yAxisTexts.transition().duration(time).attr('opacity', 1);
			}

			function animateLegends(time) {
				legendsGroup.transition().duration(time).attr('opacity', 1);
			}


			function addEventListeners(rects) {
				rects
					.on('mouseenter', function (d) {
						if (attrs.horizontalStackedClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.horizontalStackedClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.horizontalStackedClickActivated = (d.clicked || rects.data().filter(x => x.clicked).length > 0);
						setColors(rects);
						crossFilter(rects);
						main();
					});
			}

			function setColors(rects) {
				rects
					.attr('opacity', function (d) {
						if (!attrs.horizontalStackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				rectLabelCenters
					.attr('opacity', function (d) {
						if (!attrs.horizontalStackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					})
			}

			function crossFilter(rects) {
				var clickedRects = rects.filter(x => x.clicked);
				if (clickedRects.data().length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedRects);
				reduceDataRecords(filters);

				attrs.filterSource = 'right_stacked_bar_chart';
			}

			function collectFilters(clickedRects) {
				var filters = [];
				clickedRects.each(function (d) {
					filters.push({
						gender: d3.select(this).attr('data-gender'),
						location: d3.select(this).attr('data-location'),
						source: 'right_stacked_bar_chart'
					});
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'right_stacked_bar_chart')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'stacked_bar_chart':
							var result = applyStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result);
							break;
						case 'bubble_chart':
							var result = applyBubbleFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'left_stacked_bar_chart':
							var result = applyLeftStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'right_stacked_bar_chart':
							var result = applyRightStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_table':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && new Date(x.hire_date).getFullYear() == d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyBubbleFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && parseInt(new Date(x.hire_date).getFullYear()) <= d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyLeftStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.user_level == d.level);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyRightStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.location == d.location);
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

		//######################################### HORIZONTAL STACKED BAR CHART RIGHT ##################################






		//######################################### HORIZONTAL STACKED BAR CHART LEFT ##################################
		function drawHorizontalStackedLeft() {
			if (attrs.filterSource == 'left_stacked_bar_chart') return;

			//Drawing containers
			var container = d3.select(attrs.container[2]);

			if (container.node() == null) return;
			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft + 10;
			calc.chartTopMargin = attrs.marginTop + 85;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.barsLeftSpacing = 50;

			var data = getFormatedDataLocal();
			var globalData = getFormatedDataGlobal();

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

			//color by gender
			var colorScaleData = ['female', 'male'];

			//Scales
			var scales = {}
			scales.x = d3.scaleLinear().domain([0, d3.max(globalData, d => d.total + 2)]).range([1, calc.chartWidth - calc.barsLeftSpacing]).nice();
			scales.y = d3.scaleBand().domain(globalData.map(d => d.key)).range([calc.chartHeight, 0]).padding(0.2);
			scales.color = d3.scaleOrdinal().domain(colorScaleData).range(attrs.genderColors)

			//Axes
			var axes = {};
			axes.x = d3.axisBottom(scales.x).tickSize(-calc.chartHeight);
			axes.y = d3.axisLeft(scales.y).tickSize(0);

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${calc.barsLeftSpacing}, ${calc.chartHeight})`);

			var xAxisTexts = xAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr("dx", '0.3em')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('.domain').remove();

			xAxisGroup.selectAll('path').attr('stroke', 'gray').attr('stroke-width', 0.3);

			xAxisGroup.selectAll('line').attr('stroke', 'gray').attr('stroke-width', 0.3);

			var yAxisTexts = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var stackLayoutData = d3.stack().keys(['male', 'female'])(data);

			var rectsContainer = chart
				.patternify({ tag: 'g', selector: 'rects-container', data: stackLayoutData })
				.attr("fill", function (d) {
					d3.select(this).attr('data-gender', d.key)
					return scales.color(d.key);
				});

			var rectData = [];

			var rects = rectsContainer.each(function (d) {
				d3.select(this)
					.patternify({ tag: 'rect', selector: 'rects', data: d })
					.attr('x', function (d) {
						var xPosition = scales.x(d[0]) + calc.barsLeftSpacing;
						d.oldX = xPosition;
						d3.select(this).attr('data-oldX', xPosition);
						d3.select(this).attr('data-level', d.data.key);
						d3.select(this).attr('data-gender', d3.select(this.parentNode).attr('data-gender'));
						return d.oldX;
					})
					.attr('y', d => scales.y(d.data.key))
					.attr('height', scales.y.bandwidth())
					.attr('width', function (d) {
						var width = (scales.x(d[1]) - scales.x(d[0]));
						d.oldWidth = width;
						d3.select(this).attr('data-oldwidth', width);
						return d.oldWidth;
					})
					.attr('data-rectdata', function (d) { rectData.push(d) })
					.attr('cursor', 'pointer');
			});

			// rect labels container
			var rectLabelsContainer = chart
				.patternify({ tag: 'g', selector: 'rect-labels-container' })
				.attr('opacity', 0);

			var rectLabelHeaders = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-headers', data: data })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('dy', 1.5)
				.attr('x', d => scales.x(d.total) + calc.barsLeftSpacing + 5)
				.text(d => d.total)
				.attr('y', function (d) {
					var customAddition = parseFloat(rectsContainer.select('rect').attr('height')) / 2 + (this.getBBox().height / 5);
					return scales.y(d.key) + customAddition;
				})
				.attr('display', d => d.total > 0 ? null : 'none');

			var rectLabelCenters = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-centers', data: rectData.filter(d => (d[1] - d[0]) != 0) })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'black')
				.text(d => d[1] - d[0])
				.attr('transform', function (d) {
					var x = scales.x(d[0]) + calc.barsLeftSpacing;
					var xCustomAddition = (scales.x(d[1]) - scales.x(d[0])) / 2 - (this.getBBox().width / 2);
					x += xCustomAddition;

					var y = scales.y(d.data.key);
					var yCustomAddition = parseFloat(rectsContainer.select('rect').attr('height')) / 2 + (this.getBBox().height / 3.5);
					y += yCustomAddition;

					var translate = "translate(" + x + "," + y + ")";
					return translate;
				})
				.attr('opacity', function (d) {
					return d.opacity;
				});

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('fill', 'gray')
				.text('user_level')
				.attr('transform', function (d) {
					var x = -45;
					var y = this.getBBox().width / 2 - 40;
					return 'translate(' + x + ',' + y + ')';
				});

			// //Add container g element
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
				.attr('fill', 'gray')
				.text('Employee Count')
				.attr('transform', function (d) {
					var x = 0;
					var y = 0;
					var chartWidth = chart.node().getBBox().width;
					var x = chartWidth / 2 - this.getBBox().width / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			// Legends
			var legendsGroup = chart
				.patternify({ tag: 'g', selector: 'legends-group' })
				.attr('opacity', 0);

			var legendHeaderBackground = legendsGroup
				.patternify({ tag: 'rect', selector: 'legend-header-background' })
				.attr("width", 120)
				.attr("height", 35)
				.attr("x", function (d) {
					return 0;
				})
				.attr("y", function (d, i) {
					return -25;
				})
				.style("fill", function (d) {
					return '#FBFBFB';
				});

			var legendHeader = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '16px')
				.attr('fill', 'gray')
				.text('Gender')
				.attr('transform', function (d) {
					var x = 10;
					var y = -2;
					return 'translate(' + x + ',' + y + ')';
				});

			var legendRects = legendsGroup.patternify({ tag: 'rect', selector: 'legend-rect', data: colorScaleData })
				.attr("width", 18)
				.attr("height", 18)
				.attr("x", function (d) {
					return 5;
				})
				.attr("y", function (d, i) {
					return (i + 1) * 25 - 10;
				})
				.style("fill", function (d) {
					return scales.color(d);
				});


			var legendText = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-text', data: colorScaleData })
				.attr('font-family', 'Lato')
				.attr('font-size', '15px')
				.attr('fill', 'gray')
				.style('text-transform', 'capitalize')
				.text(d => d)
				.attr('transform', function (d, i) {
					var x = 28;
					var y = (i + 1) * 25 + 4;
					return 'translate(' + x + ',' + y + ')';
				});

			var legendBackground = legendsGroup
				.patternify({ tag: 'rect', selector: 'legend-background' })
				.attr("width", '120px')
				.attr("height", '90px')
				.attr("x", function (d) {
					return 0;
				})
				.attr("y", function (d, i) {
					return -25;
				})
				.style("fill", function (d) {
					return 'transparent';
				})
				.style('stroke', 'black')
				.style('stroke-width', '0.3');

			legendsGroup.attr('transform', function (d) {
				var x = calc.chartWidth - 120;
				var y = -80;
				return 'translate(' + x + ',' + y + ')'
			});

			animateHorizontalStackedBarChart();
			addEventListeners(rectsContainer.selectAll('.rects'))

			// Functions
			function getFormatedDataLocal() {
				var byLevel = nestBy('user_level', attrs.data);

				setTotalValues(byLevel);

				return byLevel;
			}

			function getFormatedDataGlobal() {
				var byLevel = nestBy('user_level', attrs.initialData);

				setTotalValues(byLevel);

				return byLevel;
			}

			function nestBy(key, data) {
				var nested = d3.nest()
					.key(d => d[key])
					.entries(data)
					.sort(function (a, b) {
						let firstLevel = parseFloat(a.key.replace('Level ', ''));
						let secondLevel = parseFloat(b.key.replace('Level ', ''));
						return firstLevel - secondLevel;
					});

				return nested;
			}

			function setTotalValues(nested) {
				nested.forEach(function (d) {
					d.total = d.values.length;
					let nestedGender = d3.nest().key(x => x.Gender).entries(d.values);
					let recordsForMale = nestedGender.find(x => x.key == "Male");
					let recordsForFemale = nestedGender.find(x => x.key == "Female");
					d.male = recordsForMale ? recordsForMale.values.length : 0;
					d.female = recordsForFemale ? recordsForFemale.values.length : 0;
				});
			}

			function animateHorizontalStackedBarChart() {
				var animationTime = 800;
				animateBars(animationTime);
				animateNumbers(animationTime);
				animateTickLabels(animationTime);
				animateLegends(animationTime);
			}

			function animateBars(time) {
				var allRects = rectsContainer.selectAll('.rects');

				allRects
					.attr('x', function (d) {
						return calc.barsLeftSpacing;
					})
					.attr('width', 0)
					.transition().duration(time)
					.attr('width', function (d) {
						var width = d3.select(this).attr('data-oldwidth');
						return width;
					})
					.attr('x', function (d) {
						var xPosition = d3.select(this).attr('data-oldX');
						return xPosition;
					});
			}

			function animateNumbers(time) {
				rectLabelsContainer.transition().duration(time).delay(time).attr('opacity', 1);
			}

			function animateTickLabels(time) {
				xAxisTexts.transition().duration(time).attr('opacity', 1);
				yAxisTexts.transition().duration(time).attr('opacity', 1);
			}

			function animateLegends(time) {
				legendsGroup.transition().duration(time).attr('opacity', 1);
			}

			function addEventListeners(rects) {
				rects
					.on('mouseenter', function (d) {
						if (attrs.horizontalStackedClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.horizontalStackedClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.horizontalStackedClickActivated = (d.clicked || rects.data().filter(x => x.clicked).length > 0);
						setColors(rects);
						crossFilter(rects);
						main();
					});
			}

			function setColors(rects) {
				rects
					.attr('opacity', function (d) {
						if (!attrs.horizontalStackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				rectLabelCenters
					.attr('opacity', function (d) {
						if (!attrs.horizontalStackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					})
			}

			function crossFilter(rects) {
				var clickedRects = rects.filter(x => x.clicked);
				if (clickedRects.data().length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedRects);
				reduceDataRecords(filters);

				attrs.filterSource = 'left_stacked_bar_chart';
			}

			function collectFilters(clickedRects) {
				var filters = [];
				clickedRects.each(function (d) {
					filters.push({ gender: d3.select(this).attr('data-gender'), level: d3.select(this).attr('data-level'), source: 'left_stacked_bar_chart' });
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'left_stacked_bar_chart')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'stacked_bar_chart':
							var result = applyStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result);
							break;
						case 'bubble_chart':
							var result = applyBubbleFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'left_stacked_bar_chart':
							var result = applyLeftStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;

						case 'right_stacked_bar_chart':
							var result = applyRightStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_table':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && new Date(x.hire_date).getFullYear() == d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyBubbleFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && parseInt(new Date(x.hire_date).getFullYear()) <= d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyLeftStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.user_level == d.level);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyRightStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.location == d.location);
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

		//######################################### HORIZONTAL STACKED BAR CHART LEFT ##################################



		//#########################################  BUBBLE CHART ##################################
		function drawBubbleChart() {
			if (attrs.filterSource == 'bubble_chart') return;

			//Drawing containers
			var container = d3.select(attrs.container[1]);
			if (container.node() == null) return;
			var containerRect = container.node().getBoundingClientRect();

			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

			//Calculated properties
			var calc = {};
			calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
			calc.chartLeftMargin = attrs.marginLeft;
			calc.chartTopMargin = attrs.marginTop;
			calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin - 10;
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
			calc.barsLeftSpacing = 25;

			//fetch distinct locations
			var allLocations = Array.from(new Set(attrs.initialData.map(x => x.location)));

			//convert data for stacked chart
			let bubbleChartData = formatBubbleData();

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

			var customDistance = 50;

			//Scales
			var scales = {}
			scales.x = d3.scalePoint().domain(allLocations).range([calc.chartLeftMargin, calc.chartWidth - customDistance - 20]);
			scales.y = d3.scaleLinear().domain([0, bubbleChartData.max + 5]).range([calc.chartHeight - 10, calc.chartTopMargin]);
			scales.size = d3.scaleLinear().domain([0, bubbleChartData.max]).range([3, 40]);

			//Axes
			var axes = {};
			axes.y = d3.axisLeft().scale(scales.y).tickSize(-calc.chartWidth).ticks(10);
			axes.x = d3.axisBottom().scale(scales.x).tickSize(0);

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${customDistance / 2 + calc.barsLeftSpacing}, ${calc.chartHeight})`);

			xAxisGroup.selectAll('.domain').remove();

			var xAxisLabels = xAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('x', function (d) {
					return customDistance / 2 + this.getBBox().width / 10;
				})
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('path').attr('stroke', 'gray').attr('stroke-width', 0.3);

			yAxisGroup.selectAll('line').attr('stroke', 'gray').attr('stroke-width', 0.3);

			var yAxisLabels = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var circlesContainer = chart
				.patternify({ tag: 'g', selector: 'circles-container' });

			var circles = circlesContainer
				.patternify({ tag: 'circle', selector: 'circles', data: bubbleChartData.data })
				.attr("r", function (d) {
					let value = d.pastData ? d.oldValue : d.value;
					if (value == 0) return 0;
					return scales.size(value);
				})
				.attr("fill", function (d) {
					if (d.pastData) return 'transparent';
					return attrs.locationColors[d.location];
				})
				.attr('stroke', 'gray')
				.attr('stroke-width', function (d) {
					return d.pastData ? 0.6 : 0;
				})
				.attr('stroke-dasharray', function (d) {
					return d.pastData ? 2 : 0;
				})
				.attr('cx', function (d) {
					return scales.x(d.location) + customDistance / 2 + calc.barsLeftSpacing;
				})
				.attr("cy", function (d) {
					return scales.y.range()[0];
				})
				.attr('opacity', 0)
				.attr('cursor', 'pointer');

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.text('Employee Count')
				.attr('transform', function (d) {
					var x = -10;
					var chartHeight = chart.node().getBBox().height;
					var y = chartHeight / 2 + this.getBBox().width / 2 - 30;
					return 'translate(' + x + ',' + y + ') rotate(270)';
				});

			//Add container g element
			var chartHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'chart-header-group' })
				.attr('transform', function (d) {
					var x = 0;
					var y = calc.chartHeight + xAxisGroup.node().getBBox().height + 25;
					return 'translate(' + x + ',' + y + ')'
				});

			var chartHeader = chartHeaderGroup
				.patternify({ tag: 'text', selector: 'chart-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '17px')
				.attr('fill', 'gray')
				.text('Location')
				.attr('transform', function (d) {
					var x = 0;
					var y = 0;
					var chartWidth = chart.node().getBBox().width;
					var x = chartWidth / 2 - this.getBBox().width / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			var legendsData = ['Now', '3 years ago'];

			//Add container g element
			var legendsGroup = chart
				.patternify({ tag: 'g', selector: 'legends-group' })
				.attr('transform', 'translate(10,0)');

			var legendCircles = legendsGroup
				.patternify({ tag: 'circle', selector: 'legend-circle', data: legendsData })
				.attr("r", 8)
				.attr("fill", function (d, i) {
					return i == 0 ? '#D8D8D8' : 'transparent';
				})
				.attr('stroke', 'gray')
				.attr('stroke-width', 0.6)
				.attr('stroke-dasharray', function (d, i) {
					return i == 0 ? 0 : 2;
				})
				.attr('cx', function (d, i) {
					return 100 * i;
				})
				.attr("cy", function (d) {
					return -5;
				})
				.attr('opacity', 0);

			var legendTexts = legendsGroup
				.patternify({ tag: 'text', selector: 'legend-text', data: legendsData })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.text(d => d)
				.attr('x', function (d, i) {
					return 20 + 100 * i;
				})
				.attr("y", function (d) {
					return 0;
				})
				.attr('opacity', 0);

			appendDefsArrow();

			var lines = circlesContainer
				.patternify({ tag: 'line', selector: 'arrow-line', data: bubbleChartData.data.filter(d => d.pastData) })
				.attr('x1', function (d) {
					return scales.x(d.location) + customDistance / 2 + calc.barsLeftSpacing;
				})
				.attr("y1", function (d) {
					return scales.y(d.oldValue);
				})
				.attr('x2', function (d) {
					return scales.x(d.location) + customDistance / 2 + calc.barsLeftSpacing;
				})
				.attr("y2", function (d) {
					return scales.y(d.value);
				})
				.attr("stroke", "#979797")
				.attr("stroke-width", 0.8)
				.attr("marker-end", "url(#arrow-head)")
				.attr('opacity', function (d) {
					d.opacity = 0;
					return d.opacity;
				});


			addEventListeners(circles);
			animateChart();

			// Functions
			function formatBubbleData() {
				var byLocation = d3.nest()
					.key(d => d.location)
					.entries(attrs.initialData)

				var formated = [];

				var maxYear = d3.max(attrs.initialData.map(x => parseInt(new Date(x.hire_date).getFullYear())));

				var maxEmployeesCount = 0;

				byLocation.forEach(function (d) {
					maxEmployeesCount = maxEmployeesCount < d.values.length ? d.values.length : maxEmployeesCount;

					var record = {};
					record.location = d.key;
					record.value = employeesSum(d.key);
					record.oldValue = pastEmployeesSum(maxYear, d.key);
					record.pastData = false;


					formated.push(record);
				});

				formated = formated.concat(formated.filter(x => x.oldValue && x.oldValue > 0).map(function (d) {
					return {
						location: d.location,
						value: d.value,
						oldValue: d.oldValue,
						pastData: true
					}
				}));

				return { data: formated, max: maxEmployeesCount };
			}

			function employeesSum(location) {
				return attrs.data.filter(x => x.location == location).length;
			}

			function pastEmployeesSum(maxYear, location) {
				let threeYearAgo = maxYear - 3;
				return attrs.data.filter(x => x.location == location && parseInt(new Date(x.hire_date).getFullYear()) <= threeYearAgo).length;
			}

			function appendDefsArrow() {
				svg
					.patternify({ tag: 'defs', selector: 'arrow-defs' })
					.patternify({ tag: 'marker', selector: 'arrow-marker' })
					.attr('id', 'arrow-head')
					.attr('markerUnits', 'strokeWidth')
					.attr('markerWidth', 8)
					.attr('markerHeight', 8)
					.attr('viewBox', '0 0 12 12')
					.attr('refX', 8)
					.attr('refY', 6.3)
					.attr('orient', 'auto')
					.patternify({ tag: 'path', selector: 'arrow-head-path' })
					.attr('d', 'M2,2 L2,11 L10,6 L2,2')
					.style('fill', '#979797');
			}

			function animateChart() {
				let animationTime = 800;

				animateOldBubbles(animationTime);
				animateNewBubbles(animationTime);
				animateLines(animationTime);
				animateLegends(animationTime);
				animateTickLabels(animationTime);
			}

			function animateOldBubbles(time) {
				//animate old bubbles
				circles.filter(x => x.pastData).attr('cy', d => scales.y(d.oldValue))
					.transition().duration(time * 2)
					.attr('opacity', 1)
			}

			function animateNewBubbles(time) {
				//animate new bubbles
				circles.filter(x => !x.pastData).attr('opacity', 1)
					.on('mouseenter', function (d) {
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						d3.select(this).attr('opacity', 1);
					})
					.transition().duration(time)
					.attr('cy', d => scales.y(d.value))
			}

			function animateLines(time) {
				setTimeout(() => {
					lines.transition().duration(time).attr('opacity', function (d) {
						d.opacity = 1;
						return d.opacity;
					});
				}, time);
			}

			function animateLegends(time) {
				// display '3 years ago' legend
				setTimeout(() => {
					legendCircles.filter((d, i) => i == 1).transition().duration(time).attr('opacity', 1);
					legendTexts.filter((d, i) => i == 1).transition().duration(time).attr('opacity', 1);
				}, time);

				legendCircles.filter((d, i) => i == 0).transition().duration(time).attr('opacity', 1);
				legendTexts.filter((d, i) => i == 0).transition().duration(time).attr('opacity', 1);
			}

			function animateTickLabels(time) {
				xAxisLabels.transition().duration(time).attr('opacity', 1)
				yAxisLabels.transition().duration(time).attr('opacity', 1)
			}

			function addEventListeners(circles) {
				circles
					.on('mouseenter', function (d) {
						if (attrs.stackedClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.stackedClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.stackedClickActivated = (d.clicked || circles.data().filter(x => x.clicked).length > 0);
						setColors(circles);
						crossFilter(circles);
						main();
					});

				d3.select('#reset-button').on('click', function (d) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					attrs.filterSource = 'button';
					main();
				});
			}

			function setColors(circles) {
				circles
					.attr('opacity', function (d) {
						if (!attrs.stackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				lines
					.attr('opacity', function (d) {
						if (!attrs.stackedClickActivated) return d.opacity;
						var oldBubbleClicked = d.clicked;
						var newBubbleClicked = circles.data().filter(x => !x.pastData && x.location == d.location && x.clicked).length > 0
						return (oldBubbleClicked && newBubbleClicked) ? d.opacity : 0.3;
					});
			}

			function crossFilter(circles) {
				var clickedCirclesData = circles.data().filter(x => x.clicked);
				if (clickedCirclesData.length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedCirclesData);

				reduceDataRecords(filters);

				attrs.filterSource = 'bubble_chart';
			}

			function collectFilters(clickedCirclesData) {
				var filters = [];

				clickedCirclesData.forEach(function (d) {
					var filter = {};
					filter.location = d.location;
					var maxYear = parseInt(d3.max(attrs.initialData.map(x => new Date(x.hire_date).getFullYear())));
					filter.year = d.pastData ? maxYear - 3 : maxYear;
					filter.source = 'bubble_chart';
					filters.push(filter);
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'bubble_chart')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'stacked_bar_chart':
							var result = applyStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result);
							break;
						case 'bubble_chart':
							var result = applyBubbleFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'left_stacked_bar_chart':
							var result = applyLeftStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;

						case 'right_stacked_bar_chart':
							var result = applyRightStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'employee_table':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && new Date(x.hire_date).getFullYear() == d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyBubbleFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && parseInt(new Date(x.hire_date).getFullYear()) <= d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyLeftStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.user_level == d.level);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyRightStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.location == d.location);
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

		//#########################################  BUBBLE CHART ##################################







		//#########################################  STACKED BAR CHART ##################################
		function drawStackedBarChart() {
			if (attrs.filterSource == 'stacked_bar_chart') return;

			setLocationColors();

			//Drawing containers
			var container = d3.select(attrs.container[0]);
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
			calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin - 15;
			calc.barsLeftSpacing = 5;

			//fetch distinct locations
			var allLocations = Array.from(new Set(attrs.initialData.map(x => x.location)));

			//convert data for stacked chart
			let stackedChartData = formatData(allLocations);

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

			//min and max hire dates
			var minMaxYear = d3.extent(attrs.initialData.map(x => parseInt(new Date(x.hire_date).getFullYear())))

			var customDistance = 50;

			//Scales
			var scales = {}
			scales.x = d3.scaleLinear().domain(minMaxYear).range([calc.chartLeftMargin, calc.chartWidth - customDistance]);
			scales.y = d3.scaleLinear().domain(yScaleData).range([calc.chartHeight - 10, calc.chartTopMargin]);
			scales.height = d3.scaleLinear().domain(yScaleData).range([calc.chartTopMargin, calc.chartHeight - 10]);

			//Axes
			var axes = {};
			axes.x = d3.axisBottom().scale(scales.x).tickSize(0).tickFormat(d3.format("d"));
			axes.y = d3.axisLeft().scale(scales.y).tickSize(-calc.chartWidth).ticks(5);

			var xAxisGroup = chart.patternify({ tag: 'g', selector: 'x-axis' })
				.classed("x-axis-group", true)
				.call(axes.x)
				.attr("transform", `translate(${customDistance / 2 + calc.barsLeftSpacing}, ${calc.chartHeight})`);

			xAxisGroup.selectAll('.domain').remove();

			var xAxisTexts = xAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr("dx", '0.3em')
				.attr("dy", function (d) {
					var initial = -0.2;
					var width = calc.chartWidth / (stackedChartData.length + 4)
					if (width > 60) initial += width / 60;
					return initial + 'em';
				})
				.attr("transform", 'rotate(' + (-90) + ')')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var yAxisGroup = chart.patternify({ tag: 'g', selector: 'y-axis' })
				.classed("y-axis-group", true)
				.call(axes.y)
				.attr("transform", `translate(${attrs.marginLeft}, 0)`);

			yAxisGroup.selectAll('path').attr('stroke', 'gray').attr('stroke-width', 0.3);

			yAxisGroup.selectAll('line').attr('stroke', 'gray').attr('stroke-width', 0.3);

			var yAxisTexts = yAxisGroup.selectAll("text")
				.style("text-anchor", 'end')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('font-family', 'Lato')
				.attr('opacity', 0);

			var stackLayout = d3.stack().keys(allLocations);

			var rects = chart
				.patternify({ tag: 'g', selector: 'bar', data: stackLayout(stackedChartData) })

			rects.each(function (d) {
				d3.select(this)
					.patternify({ tag: 'rect', selector: 'rects', data: d })
					.attr("width", calc.chartWidth / (stackedChartData.length + 4))
					.attr("height", d => 0)
					.attr("x", function (d) {
						return scales.x(parseInt(d.data.year)) + calc.barsLeftSpacing;
					})
					.attr("y", function (d) {
						return scales.y.range()[0] - parseFloat(d3.select(this).attr('height'));
					})
					.style("fill", function (x) {
						x.color = attrs.locationColors[d.key];
						x.location = d.key;
						return x.color;
					})
					.attr('opacity', function (d) {
						d.opacity = 1;
						return d.opacity;
					})
					.attr('cursor', 'pointer');
			});

			//rect labels container
			var rectLabelsContainer = chart
				.patternify({ tag: 'g', selector: 'rect-labels-container' })
				.attr('opacity', 0);

			var rectLabelHeaders = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-headers', data: stackedChartData })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.attr('dy', 1.5)
				.attr('y', d => scales.y(d.total) - 5)
				.text(d => d.total)
				.attr('display', d => d.total > 0 ? null : 'none')
				.attr('x', function (d, i) {
					var width = calc.chartWidth / (stackedChartData.length + 4);
					var x = scales.x(parseInt(d.year)) + width / 2 - this.getBBox().width / 2 + calc.barsLeftSpacing;
					return x;
				});

			var allRects = rects.selectAll('.rects');

			addEventListeners(allRects);

			var rectsData = allRects.data();

			var rectLabelCenters = rectLabelsContainer
				.patternify({ tag: 'text', selector: 'rect-label-centers', data: rectsData.filter(d => (d[1] - d[0]) != 0) })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.text(d => d[1] - d[0])
				.attr('transform', function (d) {
					var upperY = scales.y(d[1]);
					var lowerY = scales.y(d[0]);
					var textWidth = this.getBoundingClientRect().width;
					var textHeight = this.getBoundingClientRect().height;
					var y = (upperY + lowerY) / 2 + textHeight / 4;
					var width = calc.chartWidth / (stackedChartData.length + 4);
					var x = scales.x(parseInt(d.data.year)) + width / 2 - textWidth / 2 + calc.barsLeftSpacing;
					var translate = "translate(" + x + "," + y + ")";
					return translate;
				})
				.attr('opacity', function (d) {
					return d.opacity;
				});

			//Add container g element
			var yAxisHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'y-axis-header-group' })
				.attr('transform', 'translate(' + (calc.chartLeftMargin - 20) + ',' + 0 + ')');

			var yAxisHeader = yAxisHeaderGroup
				.patternify({ tag: 'text', selector: 'y-axis-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '14px')
				.attr('fill', 'gray')
				.text('Employee Count')
				.attr('transform', function (d) {
					var x = -10;
					var chartHeight = chart.node().getBBox().height;
					var y = chartHeight / 2 + this.getBBox().width / 2 - 30;
					return 'translate(' + x + ',' + y + ') rotate(270)';
				});

			//Add container g element
			var chartHeaderGroup = chart
				.patternify({ tag: 'g', selector: 'chart-header-group' })
				.attr('transform', function (d) {
					var x = 0;
					var y = calc.chartHeight + xAxisGroup.node().getBBox().height + 20;
					return 'translate(' + x + ',' + y + ')'
				});

			var chartHeader = chartHeaderGroup
				.patternify({ tag: 'text', selector: 'chart-header' })
				.attr('font-family', 'Lato')
				.attr('font-size', '17px')
				.attr('fill', 'gray')
				.text('Hire Date')
				.attr('transform', function (d) {
					var x = 0;
					var y = 0;
					var chartWidth = chart.node().getBBox().width;
					var x = chartWidth / 2 - this.getBBox().width / 2;
					return 'translate(' + x + ',' + y + ')';
				});

			animateStackedBarChart();

			// Functions
			function animateStackedBarChart() {
				var animationTime = 800;
				animateBars(animationTime);
				animateNumbers(animationTime);
				animateTickLabels(animationTime);
				bringToTop(rectLabelsContainer.node(), animationTime);
			}

			function animateBars(time) {
				allRects
					.attr('y', function (d) {
						var currentY = parseInt(d3.select(this).attr('y'));
						return currentY - this.getBBox().height;
					})
					.transition().duration(time)
					.attr('height', function (d) {
						return scales.height(d[1]) - scales.height(d[0]);
					})
					.attr('y', d => scales.y(d[1]));
			}

			function animateNumbers(time) {
				setTimeout(() => {
					rectLabelsContainer.transition().duration(time).attr('opacity', 1);
				}, time);
			}

			function animateTickLabels(time) {
				xAxisTexts.transition().duration(time).attr('opacity', 1);
				yAxisTexts.transition().duration(time).attr('opacity', 1);
			}

			function formatData(allLocations) {
				var byYear = d3.nest()
					.key(function (d) {
						let year = new Date(d.hire_date).getFullYear();
						return year;
					})
					.entries(attrs.initialData)
					.sort((a, b) => a.key - b.key);

				byYear.forEach(function (d) {
					d.values = attrs.data.filter(x => new Date(x.hire_date).getFullYear() == d.key);
				});

				var formated = [];

				byYear.forEach(function (d) {
					var record = {};
					record.year = d.key;
					record.total = d.values.length;
					allLocations.forEach(function (location) {
						record[location] = calculateHireCount(d, location);
					});

					formated.push(record);
				});

				return formated;
			}

			function bringToTop(targetElement, time) {
				// put the element at the bottom of its parent
				setTimeout(() => {
					let parent = targetElement.parentNode;
					parent.appendChild(targetElement)
				}, time);
			}

			function setLocationColors() {
				//fetch distinct locations
				var allGlobalLocations = Array.from(new Set(attrs.initialData.map(x => x.location)));
				if (!attrs.locationColors) attrs.locationColors = {};

				allGlobalLocations.forEach((location, index) => attrs.locationColors[location] = attrs.colors[index]);
			}

			function calculateHireCount(d, location) {
				var count = d.values.filter(x => x.location == location).length;
				return count;
			}

			function yScaleDomainData() {
				var byYear = d3.nest()
					.key(function (d) {
						let year = new Date(d.hire_date).getFullYear();
						return year;
					})
					.entries(attrs.initialData)
					.sort((a, b) => a.key - b.key);

				byYear.forEach(d => d.total = d.values.length);

				var max = d3.max(byYear.map(x => x.total));

				return [0, max + 1];
			}

			function addEventListeners(rects) {
				rects
					.on('mouseenter', function (d) {
						if (attrs.stackedClickActivated) return;
						d3.select(this).attr('opacity', 0.6);
					})
					.on('mouseleave', function (d) {
						if (attrs.stackedClickActivated) return;
						d3.select(this).attr('opacity', 1);
					})
					.on('click', function (d) {
						d.clicked = !d.clicked;
						attrs.stackedClickActivated = (d.clicked || rects.data().filter(x => x.clicked).length > 0);
						setColors(rects);
						crossFilter(rects);
						main();
					});
			}

			function setColors(rects) {
				rects
					.attr('opacity', function (d) {
						if (!attrs.stackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					});

				rectLabelCenters
					.attr('opacity', function (d) {
						if (!attrs.stackedClickActivated) return d.opacity;
						return d.clicked ? d.opacity : 0.3;
					})
			}

			function crossFilter(rects) {
				var clickedRectsData = rects.data().filter(x => x.clicked);
				if (clickedRectsData.length == 0) {
					attrs.data = attrs.initialData;
					attrs.globalFilters = [];
					return;
				}

				var filters = collectFilters(clickedRectsData);
				reduceDataRecords(filters);

				attrs.filterSource = 'stacked_bar_chart';
			}

			function collectFilters(clickedRectsData) {
				var filters = [];
				clickedRectsData.forEach(function (d) {
					filters.push({ year: d.data.year, location: d.location, source: 'stacked_bar_chart' })
				})

				return filters;
			}

			function reduceDataRecords(filters) {
				var records = [];

				attrs.globalFilters = attrs.globalFilters.filter(x => x.source != 'stacked_bar_chart')

				filters.forEach(d => attrs.globalFilters.push(d));

				var nested = d3.nest()
					.key(d => d.source)
					.entries(attrs.globalFilters);

				nested.forEach(function (d) {
					switch (d.key) {
						case 'stacked_bar_chart':
							var result = applyStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;

						case 'bubble_chart':
							var result = applyBubbleFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
						case 'left_stacked_bar_chart':
							var result = applyLeftStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;

						case 'right_stacked_bar_chart':
							var result = applyRightStackedBarFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;

						case 'employee_table':
							var result = applyEmployeeTableFilters(d.values);
							if (records.length == 0) records = result;
							else records = intersection(records, result)
							break;
					}
				});

				attrs.data = records;
			}

			function applyStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && new Date(x.hire_date).getFullYear() == d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyBubbleFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.location == d.location && parseInt(new Date(x.hire_date).getFullYear()) <= d.year);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyLeftStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.user_level == d.level);
					localRecords = localRecords.concat(filteredData);
				});

				return localRecords;
			}

			function applyRightStackedBarFilters(filters) {
				var localRecords = [];
				filters.forEach(function (d) {
					var filteredData = attrs.initialData.filter(x => x.Gender.toUpperCase() == d.gender.toUpperCase() && x.location == d.location);
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

		//#########################################  STACKED BAR CHART ##################################


		function listenResizeEvent() {
			d3.select(window).on('resize.' + attrs.id, function () {
				attrs.container.forEach(function (d) {
					attrs.filterSource = '';
					d3.select(d).select('svg').remove();
				});

				main();
			});
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