var tooltip = document.createElement('div');
tooltip.id = 'tooltip';
tooltip.innerHTML = '';
document.body.appendChild(tooltip);
toolTxt = document.createElement('p');
tooltip.appendChild(toolTxt);

document.addEventListener('mousemove', function (event) {
    updateTooltipPos(event, tooltip);
}, false)

function updateTooltipPos(e, el) {
    var x = e.clientX;
    var y = e.clientY;

    elWidth = el.getBoundingClientRect().width + 20;
    elLeft = el.getBoundingClientRect().left;

    elHeight = el.getBoundingClientRect().height + 20;
    elBottom = el.getBoundingClientRect().bottom;

    clientHeight = document.documentElement.clientHeight;
    clientWidth = document.documentElement.clientWidth;

    // console.log(clientWidth - elWidth);
    // console.log(elLeft);

    if (clientWidth - x <= elWidth && clientHeight - y <= elHeight) {
        el.style.left = x - (x + elWidth - clientWidth) + 'px';
        el.style.top = y - elHeight - 20 + 'px';

    } else if (clientWidth - x >= elWidth && clientHeight - y <= elHeight) {
        el.style.left = x + 'px'
        el.style.top = y - (y + elHeight - clientHeight) + 'px';

    } else if (clientWidth - x <= elWidth && clientHeight - y >= elHeight) {
        el.style.left = x - (x + elWidth - clientWidth) + 'px';
        el.style.top = y + 'px';

    } else if (x < clientWidth - elWidth || y < clientWidth - elWidth) {
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    }

    return {
        x: x,
        y: y
    }
}