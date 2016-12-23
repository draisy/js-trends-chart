import * as d3 from 'd3';
import { getData } from '../data/data';
import tt from './tooltip'

function bubbleChart() {
    const width = 550,
        height = 550,
        center = { // location to move bubbles to
            x: width / 2,
            y: height / 2
        },
        forceStrength = 0.35,
        colors = ['low', 'medium', 'high'],
        colorVals = ['#00796B', '#009688', '#9E9E9E'];

    let bubbles,
        canvas,
        context,
        simulation,
        fillColor,
        radiusScale,
        chart,
        nodes,
        tickGrowth = 40;
    const tooltip = tt('tooltip', 240);

    // charge is proportional to diameter of circle
    // this is for accurate collision detection between nodes of diff sizes. 
    // Charge is negative so that nodes will repel.
    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    // simulation starts automatically, stop until there are nodes
    simulation.stop();

    fillColor = d3.scaleOrdinal()
        .domain(colors)
        .range(['#00796B', '#009688', '#9E9E9E']);

    function createNodes(data) {
        const maxAmount = d3.max(data, (d) => Number(d.count));

        radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 85])
            .domain([0, maxAmount]);

        const nodes = data.map((d) => {
            return {
                radius: radiusScale(Number(d.count)),
                name: d.tagName,
                fillColor: colorVals[Math.floor(Math.random() * colorVals.length)],
                count: d.count,
                x: Math.random() * 900,
                y: Math.random() * 800
            };
        });

        nodes.sort((a, b) => b.value - a.value);
        return nodes;
    }

    chart = function (selector, data) {
        nodes = createNodes(data);

        canvas = d3.select(selector)
            .append('canvas')
            .attr('width', width)
            .attr('height', height);

        context = canvas.node().getContext('2d');
        simulation.nodes(nodes);
        groupBubbles();
    };

    function ticked() {
        let radius;
        context.clearRect(0, 0, width, height);
        nodes.forEach((d, i) => {
            if (tickGrowth > 0) {
                radius = ((d.radius / tickGrowth) / d.radius) * d.radius;
            } else {
                radius = d.radius;
            }
            context.beginPath();
            context.moveTo(d.x + radius, d.y);
            context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
            context.fillStyle = d.fillColor;
            context.fill();
            context.strokeStyle = d3.rgb(d.fillColor).darker()
            context.lineWidth = 2;
            context.stroke();
            context.closePath();
        });
        tickGrowth -= 1;
    }

    function groupBubbles() {
        // Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
        simulation.alpha(1).restart();
        console.time('test');
    }

    function showDetail(d) {
        d3.select(this).attr('stroke', 'black');
        const content = `<span class="name">Tag: </span><span class="value">${d.name}</span><br/>
            <span class="name">Count: </span><span class="value">${d.count}</span><br/>`;
        tooltip.showTooltip(content, d3.event);
    }

    function hideDetail(d) {
        d3.select(this)
            .attr('stroke', d3.rgb(fillColor(Math.floor(Math.random() * colors.length))).darker())

        tooltip.hideTooltip();
    }

    return chart;
}

const chart = bubbleChart();
getData()
    .then((data) => {
        chart('.canvas-chart', data);
    })