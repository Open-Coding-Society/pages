---
layout: page
title: Microblogging Communications Network Establishment
description: Navigate through interconnected challenges in a satellite communication network
permalink: /digital-famine/microblog/
---

To begin your mission, you'll have to repair Old Earth's communications network *Rampart-B*. The old *Rampart-A* network was a partnership between global agencies and the NSA to monitor all internet activity worldwide (monitoring at a rate of 3 terabits/sec!), but as an apocalyptic event occurred, the network was repurposed as a fallback communications network for humanity.

The system is now defunct, as humans took to the stars. We'll have the reestablish this network to maintain contact with our operatives.

<!--Vis Network Style-->
<style type="text/css">
    #comm_network {
        width: 100%;
        height: 600px;
        border: 1px solid lightgray;
    }
</style>

<!--Vis Network Container-->
<div id="comm_network"></div>

<!--Vis Network Dependency-->
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<!--Microblog Communication Network -->
<script>
    // create a network
    var container = document.getElementById('comm_network');

    // create an array with nodes
    var nodes = new vis.DataSet([
        {id: 1, label: 'Node 1', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_1', title: 'Open Node 1'},
        {id: 2, label: 'Node 2', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_2', title: 'Open Node 2'},
        {id: 3, label: 'Node 3', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_3', title: 'Open Node 3'},
        {id: 4, label: 'Node 4', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_4', title: 'Open Node 4'},
        {id: 5, label: 'Node 5', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_5', title: 'Open Node 5'}
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]);

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        height: '100%',
        width: '100%',
        nodes: {
            shape: 'circle',
            color: {
                background: 'grey',
                border: 'transparent',
                hover: {
                    background: 'lightgrey',
                    border: 'black'
                }
            },
            size: 25,
            fixed: {
                x: false,
                y: false
            },
            font: {
                color: 'white',
                size: 14,
                face: 'arial'
            }
        },
        edges: {
            color: {
                color: 'white',
                highlight: 'yellow'
            },
            width: 2,
            smooth: {
                type: 'continuous'
            }
        },
        physics: {
            enabled: false
        },
        interaction: {
            hover: true,
            zoomView: false,
            dragView: true,
            dragNodes: true
        },
        layout: {
            improvedLayout: true
        }
    };

    // initialize network
    var network = new vis.Network(container, data, options);

    // fit the network to view all nodes at default zoom
    network.fit();

    // open node URL on click in same tab
    network.on('click', function (params) {
        if (params.nodes.length) {
            var nodeId = params.nodes[0];
            var node = nodes.get(nodeId);
            if (node && node.url) {
                // navigate in same tab
                window.location.href = node.url;
            }
        }
    });
</script>
