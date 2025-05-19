var hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener("click", function(){
        document.querySelector("body").classList.toggle("active");
    })

function plotBars(tag, gTitle, xArray, yArray){

    const data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation:"v",
        marker: {color:"rgba(0,0,255)"}
    }];

    const layout = {title:gTitle};
    Plotly.newPlot(tag, data, layout);
}

function plotDonut(x, y, tag, gTitle){

    const data = [{
        labels: x,
        values: y,
        marker: {'colors': [
            'rgb(255, 70, 10)',
            'rgb(237, 237, 237)',
            'rgb(35, 35, 35)'
        ]},
        hole: .6,
        type: "pie"
    }];

    const layout = {
        title: gTitle,
        height: 400,
        width: 400,
        font: {size: 15, color: "rgb(237, 237, 237)"},
        paper_bgcolor: "rgba(0,0,0,0)"
    };
    Plotly.newPlot(tag, data, layout);
}

function drawFac(){

}

function drawSeg(){
    plotDonut(labels, apFac, "seguranca", "AP FAC");
    plotDonut(labels, opaiFac, "seguranca", "OPAI FAC");
    plotDonut(labels, ipsFac, "seguranca", "IPSMA FAC");
    plotDonut(labels, apLsi, "seguranca", "AP LSI");
    plotDonut(labels, opaiLsi, "seguranca", "OPAI LSI");
    plotDonut(labels, ipsLsi, "seguranca", "IPSMA LSI");
}