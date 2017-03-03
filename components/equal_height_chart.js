import React from 'react';
import {Chart} from 'react-google-charts';
import jQuery from 'jquery';
class EqualHeightChart extends Chart {
    componentDidMount() {
        super.componentDidMount();
        const chartDiv = jQuery(`#${this.state.graphID}`);
        chartDiv.height(chartDiv.width());
    }
}
module.exports.EqualHeightChart = EqualHeightChart;
