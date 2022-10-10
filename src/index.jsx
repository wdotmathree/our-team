import React from "react";
import ReactDOM from "react-dom/client";
import BubbleChart from "./react-bubble-chart-d3";
import team from "./team";
import * as d3 from "d3";
import "./style.scss";

class InfoBar extends React.Component {
	render = () => {
		return (
			<div className="info-bar">
				<h1 className="info-bar_title">{this.props.name}</h1>
				<p className="info-bar_description">{this.props.desc}</p>
				<img
					className="info-bar_image"
					src={this.props.img + " fejifjaoi"}
					alt={this.props.img ? new URL(this.props.img).pathname.slice(1) : ""}
				/>
			</div>
		);
	};
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: team.defaults.name,
			desc: team.defaults.description,
			img: team.defaults.img,
		};
	}
	bubbleClick = (label) => {
		let all = d3.selectAll("g.node>image");
		all.attr("class", "circle-image");
		all.dispatch("mouseout");
		let img = d3.select("#" + label.toLowerCase().replace(/ |\//g, "-") + "~image");
		img.attr("class", "circle-image selected");
		img.dispatch("mouseover");
		this.setState({
			name: label,
			description: team.people.find((person) => person.label === label).description,
			img: team.people.find((person) => person.label === label).img,
		});
	};
	render = () => {
		return (
			<div>
				<BubbleChart
					width={window.innerWidth / 2}
					height={window.innerHeight}
					padding={10} // optional value, number that set the padding between bubbles
					labelFont={{
						family: "Arial",
						size: 24,
						color: "#fff",
						weight: "bold",
					}}
					//Custom bubble/legend click functions such as searching using the label, redirecting to other page
					bubbleClickFun={this.bubbleClick}
					data={team.people}
				/>
				<InfoBar name={this.state.name} desc={this.state.description} img={this.state.img}></InfoBar>
			</div>
		);
	};
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
