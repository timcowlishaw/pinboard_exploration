import React from 'react';
import ReactDOM from 'react-dom';
import {Vis} from './components/vis';

const bookmarks = require("./data/clustered.json");
const clusters = require("./data/clusters.json");

ReactDOM.render(
        <Vis
            bookmarks={bookmarks}
            clusters={clusters}
        />, document.querySelector('.react-root')
);
