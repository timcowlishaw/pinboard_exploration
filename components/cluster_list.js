import React from 'react';
import {PALLETTE} from "../constants";

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

module.exports.ClusterList = ClusterList;
