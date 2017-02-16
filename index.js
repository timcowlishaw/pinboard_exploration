import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, Row, Col, Card} from 'react-materialize';
import {Chart} from 'react-google-charts';
import jQuery from 'jquery';
import MutationObserver from 'mutation-observer';

const PALLETTE = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

const QUARTER = 91 * 24 * 60 * 60 * 1000;

class EqualHeightChart extends Chart {
    componentDidMount() {
        super.componentDidMount();
        const chartDiv = $(`#${this.state.graphID}`);
        chartDiv.height(chartDiv.width());
    }
}

class ClusterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clusters: props.clusters,
            vis: props.vis
        };
    }

    selectCluster(id) {
        this.state.vis.selectCluster(id);
    }

    listItems() {
        return this.state.clusters.map((cluster, ix) => {
            const color = PALLETTE[ix];
            const top_tags = cluster["top_tags"].sort((tag) => tag[1] ).reverse();
            const title=top_tags.slice(0,3).map(([name, _]) => name).join(", ");
            return (
                <li className="cluster" key={ix}>
                    <span className="chip" style={{
                        backgroundColor: color
                    }}>&nbsp;</span>
                <a href="#" onClick={() => this.selectCluster(ix)}>
                        {title}
                    </a>
                </li>
            );
        });
    }

    render() {
        return <ul>
            <li className="cluster" key="all">
                <span className="chip" style={{
                    backgroundColor: "#ddd"
                }}>&nbsp;</span>
                <a href="#" onClick={() => this.selectCluster(null)}>
                   Everything
                </a>
            </li>
            {this.listItems()} 
        </ul>;
    }
}

class Vis extends React.Component {
    constructor(props) {
        super(props);
        const xs = props.bookmarks.map(({x}) => x);
        const ys = props.bookmarks.map(({y}) => y);

        this.state = {
            scatterMinX: Math.min(...xs),
            scatterMaxX: Math.max(...xs),
            scatterMinY: Math.min(...ys),
            scatterMaxY: Math.max(...ys),
            histColor: "#ddd",
            bookmarks: props.bookmarks,
            allBookmarks: props.bookmarks,
            clusters: props.clusters
        };
    }

    selectCluster(id) {
        var bookmarks;
        var histColor;
        if(id != undefined) {
            bookmarks = this.state.allBookmarks.filter(({cluster}) => cluster == id);
            histColor = PALLETTE[id];
        } else {
            bookmarks = this.state.allBookmarks;
            histColor = "#ddd";
        }
        this.setState({
            bookmarks: bookmarks,
            histColor: histColor
        });
    }

    rows() {
        return this.state.bookmarks.map(({x,y, cluster, description}) => {
            const color = PALLETTE[cluster];
            const style = `{ fill-color: ${color}; }`;
            return [x,y, style, description];
        });
    }

    columns() {
        return [
            {
                type: "number",
                label: "X"
            },
            {
                type: "number",
                label: "Y"
            },
            {
                type: "string",
                role: "style"
            }, {
                type: "string",
                role: "tooltip",
                label: "Title"
            }
        ];
    }

    colors() {
        return this.state.bookmarks.map(({cluster}) => PALLETTE[cluster]);
    }


    histogramTicks() {
        const years = this.state.allBookmarks.
              map(({time}) => (new Date(Date.parse(time))).getFullYear()).
              filter((v, i, a) => a.indexOf(v) === i).
              sort();
        return years.map((y) => { return { v: (new Date(y, 1)).valueOf(), f: y.toString() }; });
    }

    histogramData() {
        return this.state.bookmarks.map(({description, time}) => [description, Date.parse(time)]);
    }


    extendedString(extended) {
        if(extended) {
            return (<span className="description">&mdash; {extended}</span>);
        }
    }

    bookmarkItems() {
        console.log(this.state.bookmarks[0]);
        return this.state.bookmarks.map(({cluster, description, extended, href, time}, ix) => {
            const color = PALLETTE[cluster];
            const date = (new Date(time)).toDateString();
            return (
                    <li className="bookmark" key={"bookmark-" + ix }>
                        <span className="chip" style={{
                            backgroundColor: color
                        }}>&nbsp;</span>
                    <span className="date">{date}:</span> <a target="_blank" href={href}>{description}</a> {this.extendedString(extended)} 
                    </li>
            );
        });
    }

    render() {
        return (
            <div id={"container"}>
                <Row>
                    <Col s={8}>
                        <Card>
                            <EqualHeightChart
                                chartType="ScatterChart"
                                columns={this.columns()}
                                rows={this.rows()}
                                options={{
                                    legend: {
                                        position: 'none'
                                    },
                                    chartArea: {
                                        width: "90%",
                                        height: "90%"
                                    },
                                    hAxis: {
                                        minValue: this.state.scatterMinX,
                                        maxValue: this.state.scatterMaxX
                                    },
                                    vAxis: {
                                        minValue: this.state.scatterMinY,
                                        maxValue: this.state.scatterMaxY
                                    }
                                }}
                                graph_id="ScatterChart"
                                width="100%"
                                height="400px"
                            />
                        </Card>
                        <Card>
                            <Chart
                                chartType="Histogram"
                                graph_id="Histogram"
                                rows={this.histogramData()}
                                options={{
                                    colors : [this.state.histColor],
                                    legend : {
                                        position: 'none'
                                    },
                                    chartArea: {
                                        width: "90%",
                                        height: "75%"
                                    },
                                    hAxis : {
                                        ticks : this.histogramTicks(),
                                        slantedText:true,
                                        slantedTextAngle:90
                                    }
                                }}
                                columns={[{type: 'string'}, { type: 'number'}]}
                                width="100%"
                            />
                        </Card>
                    </Col>
                    <Col s={4}>
                        <Card>
                            <ClusterList
                                clusters={this.state.clusters}
                                vis={this}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Card>
                            <ul>
                                {this.bookmarkItems()} 
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const bookmarks = require("./data/clustered.json");
const clusters = require("./data/clusters.json");

ReactDOM.render(
        <Vis
            bookmarks={bookmarks}
            clusters={clusters}
        />, document.querySelector('.react-root')
);
