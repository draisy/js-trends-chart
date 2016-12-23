import * as d3 from 'd3';

export default function (tooltipId, width) {
    const tt = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', tooltipId)
        .style('pointer-events', 'none');

    if (width) {
        tt.style('width', width);
    }

    // based on d3 mouse event.
    function updatePosition(event) {
        const xOffset = 20,
            yOffset = 10,
            ttw = tt.style('width'),
            tth = tt.style('height'),
            wscrY = window.scrollY,
            wscrX = window.scrollX,
            curX = (document.all) ? event.clientX + wscrX : event.pageX,
            curY = (document.all) ? event.clientY + wscrY : event.pageY;

        let ttleft = (((curX - wscrX) + (xOffset * 2) + ttw) > window.innerWidth) ?
            curX - ttw - (xOffset * 2) : curX + xOffset,
            tttop = (((curY - wscrY) + (yOffset * 2) + tth) > window.innerHeight) ?
                curY - tth - (yOffset * 2) : curY + yOffset;

        if (ttleft < wscrX + xOffset) {
            ttleft = wscrX + xOffset;
        }
        if (tttop < wscrY + yOffset) {
            tttop = curY + yOffset;
        }

        tt.style('top', `${tttop}px`)
            .style('left', `${ttleft}px`);
    }
    function showTooltip(content, event) {
        tt.style('opacity', 1.0)
            .html(content);
        updatePosition(event);
    }

    function hideTooltip() {
        tt.style('opacity', 0.0);
    }

    hideTooltip();

    return {
        showTooltip,
        hideTooltip,
        updatePosition
    };
}
