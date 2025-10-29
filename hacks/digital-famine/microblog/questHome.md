---
layout: page
title: Microblogging Communications Network Establishment
description: Navigate through interconnected challenges in a satellite communication network
permalink: /digital-famine/microblog/
breadcrumb: true
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

    /* description card shown on node hover */
    #comm_network .node-card {
        position: absolute;
        pointer-events: none;
        display: none;
        min-width: 220px;
        max-width: 320px;
        background: rgba(20,20,20,0.95);
        color: #fff;
        border-radius: 6px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.5);
        padding: 10px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 13px;
    }
    #comm_network .node-card img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        margin-bottom: 8px;
    }
    #comm_network .node-card .tags {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    #comm_network .node-card .tag {
        background: rgba(255,255,255,0.08);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
    }
</style>

<!--Vis Network Container-->
<div id="comm_network"></div>

<!--Vis Network Dependency-->
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<!--Microblog Communication Network -->
<script>
    const defaultImgUrl = "https://upload.wikimedia.org/wikipedia/commons/9/95/Globe_eye_icon.svg"
    // create a network
    var container = document.getElementById('comm_network');

    // create an array with nodes
    var nodes = new vis.DataSet([
        {id: 1, label: 'Node 1', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_1', title: 'Open Node 1',
         image: defaultImgUrl,
         longTitle: 'Comm Relay Alpha',
         description: 'Primary uplink relay. Repairs required to restore long-range comms.',
         tags: ['relay','priority-high']},
        {id: 2, label: 'Node 2', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_2', title: 'Open Node 2',
         image: defaultImgUrl,
         longTitle: 'Tactical Beacon Beta',
         description: 'Short-range beacon used for local operative coordination.',
         tags: ['beacon','local']},
        {id: 3, label: 'Node 3', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_3', title: 'Open Node 3',
         image: defaultImgUrl,
         longTitle: 'Orbital Hub Gamma',
         description: 'Orbital hub with degraded power systems.',
         tags: ['orbital','maintenance']},
        {id: 4, label: 'Node 4', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_4', title: 'Open Node 4',
         image: defaultImgUrl,
         longTitle: 'Ground Station Delta',
         description: 'Ground station for southern hemisphere coverage.',
         tags: ['ground','coverage']},
        {id: 5, label: 'Node 5', url: '{{ base.siteurl }}/digital-famine/microblog/submodule_5', title: 'Open Node 5',
         image: defaultImgUrl,
         longTitle: 'Backup Array Epsilon',
         description: 'Cold backup array; bring spare modules to reactivate.',
         tags: ['backup','spare-parts']}
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
            enabled: true
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

    // create hover card element and append inside the container
    var card = document.createElement('div');
    card.className = 'node-card';
    container.style.position = container.style.position || 'relative';
    container.appendChild(card);

    function renderCard(node) {
        if (!node) return '';
        var imgHtml = node.image ? '<img src="'+node.image+'" alt="'+(node.longTitle||node.label)+'">' : '';
        var title = node.longTitle || node.label || '';
        var desc = node.description || '';
        var tags = (node.tags || []).map(function(t){ return '<span class="tag">'+t+'</span>'; }).join('');
        return imgHtml + '<div class="title"><strong>'+title+'</strong></div>' +
               '<div class="desc">'+desc+'</div>' +
               (tags ? '<div class="tags">'+tags+'</div>' : '');
    }

    // show card on hover
    network.on('hoverNode', function(params) {
        var nodeId = params.node;
        var node = nodes.get(nodeId);
        if (!node) return;
        card.innerHTML = renderCard(node);
        // try to get DOM event (vis may wrap it)
        var ev = params.event && (params.event.srcEvent || params.event);
        var rect = container.getBoundingClientRect();
        var clientX = (ev && ev.clientX) || (ev && ev.x) || (rect.left + rect.width/2);
        var clientY = (ev && ev.clientY) || (ev && ev.y) || (rect.top + rect.height/2);
        // position card relative to container
        card.style.left = Math.min(rect.width - 10, (clientX - rect.left) + 12) + 'px';
        card.style.top  = Math.min(rect.height - 10, (clientY - rect.top) + 12) + 'px';
        card.style.display = 'block';
    });

    // hide card when pointer leaves node
    network.on('blurNode', function() {
        card.style.display = 'none';
    });

    // keep card hidden on drag start and show again on dragEnd if needed
    network.on('dragStart', function() { card.style.display = 'none'; });
    network.on('dragEnd', function(params) {
        // if pointer is over node after drag, show again
        if (params.nodes && params.nodes.length) {
            var node = nodes.get(params.nodes[0]);
            if (node) {
                card.innerHTML = renderCard(node);
                card.style.display = 'block';
            }
        }
    });

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
