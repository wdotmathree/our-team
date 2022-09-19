import React from "react";
import ReactDOM from "react-dom/client";
import BubbleChart from "./react-bubble-chart-d3";
import team from "./team";
import "./style.scss";

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
					height={800}
					padding={0} // optional value, number that set the padding between bubbles
					showLegend={true} // optional value, pass false to disable the legend.
					legendPercentage={0} // number that represent the % of with that legend going to use.
					legendFont={{
						family: "Arial",
						size: 12,
						color: "#000",
						weight: "bold",
					}}
					labelFont={{
						family: "Arial",
						size: 16,
						color: "#fff",
						weight: "bold",
					}}
					//Custom bubble/legend click functions such as searching using the label, redirecting to other page
					bubbleClickFunc={this.bubbleClick}
					legendClickFun={this.legendClick}
					data={[
						{ label: "CRM", value: 1 },
						{ label: "API", value: 1 },
						{ label: "Data", value: 1 },
						{ label: "Commerce", value: 1 },
						{ label: "AI", value: 3 },
						{ label: "Management", value: 5 },
						{ label: "Testing", value: 6 },
						{ label: "Mobile", value: 9 },
						{ label: "Conversion", value: 9 },
						{ label: "Misc", value: 21 },
						{ label: "Databases", value: 22 },
						{ label: "DevOps", value: 22 },
						{ label: "Javascript", value: 23 },
						{ label: "Languages / Frameworks", value: 25 },
						{ label: "Front End", value: 26 },
						{ label: "Content", value: 26 },
					]}
				/>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
