import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default class BubbleChart extends Component {
	constructor(props) {
		super(props);

		this.renderChart = this.renderChart.bind(this);
		this.renderBubbles = this.renderBubbles.bind(this);
	}

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.svg = ReactDOM.findDOMNode(this);
		this.renderChart();
	}

	componentDidUpdate() {
		const { width, height } = this.props;
		if (width !== 0 && height !== 0) {
			this.svg = ReactDOM.findDOMNode(this);
			this.renderChart();
		}
	}

	render() {
		const { width, height } = this.props;
		return React.createElement("svg", { width: width, height: height });
	}

	renderChart() {
		const { graph, data, width, padding } = this.props;
		// Reset the svg element to a empty state.
		this.svg.innerHTML = "";

		const bubblesWidth = width;
		const color = d3.scaleOrdinal(d3.schemeCategory20c);

		const pack = d3
			.pack()
			.size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
			.padding(padding);

		// Process the data to have a hierarchy structure;
		const root = d3
			.hierarchy({ children: data })
			.sum(function (d) {
				return 1;
			})
			.sort(function (a, b) {
				return 0;
			})
			.each((d) => {
				if (d.data.label) {
					d.label = d.data.label;
					d.id = d.data.label.toLowerCase().replace(/ |\//g, "-");
				}
			});

		// Pass the data to the pack layout to calculate the distribution.
		const nodes = pack(root).leaves();

		// Call to the function that draw the bubbles.
		this.renderBubbles(bubblesWidth, nodes, color);
	}

	renderBubbles(width, nodes, color) {
		const { graph, bubbleClickFun, labelFont } = this.props;

		const bubbleChart = d3
			.select(this.svg)
			.append("g")
			.attr("class", "bubble-chart")
			.attr("transform", function (d) {
				return "translate(" + width * graph.offsetX + "," + width * graph.offsetY + ")";
			});

		const node = bubbleChart
			.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("click", function (d) {
				bubbleClickFun(d.label);
			});

		node.append("circle")
			.attr("id", function (d) {
				return d.id;
			})
			.attr("r", function (d) {
				return d.r - d.r * 0.04;
			})
			.style("z-index", 3);

		node.append("clipPath")
			.attr("id", function (d) {
				return "clip-" + d.id;
			})
			.append("use")
			.attr("xlink:href", function (d) {
				return "#" + d.id;
			});

		node.append("image")
			.attr("xlink:href", function (d) {
				return d.data.img;
			})
			.attr("width", function (d) {
				return Math.floor(d.r * 2 * 1.04);
			})
			.attr("height", function (d) {
				return Math.floor(d.r * 2 * 1.04);
			})
			.attr("clip-path", function (d) {
				return "url(#clip-" + d.id + ")";
			})
			.attr("x", function (d) {
				return -d.r * 1.04;
			})
			.attr("y", function (d) {
				return -d.r * 1.04;
			})
			.attr("class", "circle-image")
			.on("mouseover", function (d) {
				d3.select(this.parentNode)
					.select("circle")
					.attr("r", d.r * 1.04);
			})
			.on("mouseout", function (d) {
				if (d3.select(this).attr("class") === "circle-image selected") return;
				const r = d.r - d.r * 0.04;
				d3.select(this.parentNode).select("circle").attr("r", r);
			});

		node.append("text")
			.attr("class", "label-text")
			.style("font-size", `${labelFont.size}px`)
			.attr("clip-path", function (d) {
				return "url(#clip-" + d.id + ")";
			})
			.style("font-weight", (d) => {
				return labelFont.weight ? labelFont.weight : 600;
			})
			.style("font-family", labelFont.family)
			.style("fill", () => {
				return labelFont.color ? labelFont.color : "#000";
			})
			.style("stroke", () => {
				return labelFont.lineColor ? labelFont.lineColor : "#000";
			})
			.style("stroke-width", () => {
				return labelFont.lineWeight ? labelFont.lineWeight : 0;
			})
			.text(function (d) {
				return d.label;
			});

		// Center the texts inside the circles.
		d3.selectAll(".label-text")
			.attr("x", function (d) {
				const self = d3.select(this);
				const width = self.node().getBBox().width;
				return -(width / 2);
			})
			.style("opacity", function (d) {
				const self = d3.select(this);
				const width = self.node().getBBox().width;
				d.hideLabel = width * 1.05 > d.r * 2;
				return d.hideLabel ? 0 : 1;
			})
			.attr("y", function (d) {
				return labelFont.size / 2;
			});
		node.append("title").text(function (d) {
			return d.label;
		});
	}
}

BubbleChart.propTypes = {
	graph: PropTypes.shape({
		zoom: PropTypes.number,
		offsetX: PropTypes.number,
		offsetY: PropTypes.number,
	}),
	width: PropTypes.number,
	height: PropTypes.number,
	padding: PropTypes.number,
	showLegend: PropTypes.bool,
	legendPercentage: PropTypes.number,
	legendFont: PropTypes.shape({
		family: PropTypes.string,
		size: PropTypes.number,
		color: PropTypes.string,
		weight: PropTypes.string,
	}),
	labelFont: PropTypes.shape({
		family: PropTypes.string,
		size: PropTypes.number,
		color: PropTypes.string,
		weight: PropTypes.string,
	}),
};
BubbleChart.defaultProps = {
	graph: {
		zoom: 1.0,
	},
	width: 1000,
	height: 800,
	padding: 0,
	showLegend: true,
	legendPercentage: 20,
	legendFont: {
		family: "Arial",
		size: 12,
		color: "#000",
		weight: "bold",
	},
	labelFont: {
		family: "Arial",
		size: 11,
		color: "#fff",
		weight: "normal",
	},
};
