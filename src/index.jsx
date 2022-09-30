import React from "react";
import ReactDOM from "react-dom/client";
import BubbleChart from "./react-bubble-chart-d3";
import team from "./team";
import "./style.scss";

class InfoBar extends React.Component {
	render() {
		return (
			<div className="info-bar">
				<div className="info-bar__title">
					<h1>React Bubble Chart D3</h1>
					<h2>
						by <a href="">Vasturiano</a>
					</h2>
				</div>
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bubbles: team,
		};
	}
	bubbleClick(label) {
		console.log("clicked: ", label);
	}
	render() {
		return (
			<div>
				<BubbleChart
					width={1000}
					height={1000}
					padding={0} // optional value, number that set the padding between bubbles
					showLegend={true} // optional value, pass false to disable the legend.
					legendPercentage={0} // number that represent the % of with that legend going to use.
					labelFont={{
						family: "Arial",
						size: 36,
						color: "#fff",
						weight: "bold",
					}}
					//Custom bubble/legend click functions such as searching using the label, redirecting to other page
					bubbleClickFunc={this.bubbleClick}
					legendClickFun={this.legendClick}
					data={team}
				/>
				<InfoBar></InfoBar>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
