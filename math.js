let date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();
const mesAtual = `0${month}/${year}`;
console.log(mesAtual);

//Facilities

function updateFAC() {
    purgeLSI();
    purgeSPI();
    purgeWPA();
    purgeWSP();
    selectClass('icon_fac');
    var totalos = 0;
    var zus = "Ok";
    var quantZUs = 0;
    var tma = 0;
    var retrabalho = 0;
    var envelhecimento = 0;
    var preventivasCIV = 0;
    var totalprevCIV = 0;
    var preventivasELE = 0;
    var totalprevELE = 0;
    var preventivasREF = 0;
    var totalprevREF = 0;
    var atendimentoISE = 0;
    var totalisemes = 0;
    var avaliacao7s = 0;
    var satisfcli = 0;
    var acidentes = 0;
    alldata.forEach(row => {
        //TMA
        if (row[9] == 99 && (row[13] == "CIV" || row[13] == "ELE" || row[13] == "REF") &&
            row[19] != "02" && row[7].substring(3, 10) == mesAtual) {
              if(row[1].includes("¢") == false) {
                tma += Number(row[27]);
                totalos++;
              }
        }
        //Envelhecimento
        if(row[1] != undefined &&  row[24] != undefined) {
            if (row[1].includes("¢") == false && row[17] == 2 && (row[24].substring(3, 10) < mesAtual)
            && row[9] < 96 && row[19] != "02" && (row[13] != "ADM" && row[13] != "SPI")
            && row[3].includes('RS-ST01')) {
                envelhecimento++;
            }
        }
        //Retrabalho
        if(row[1] != undefined && row[7] != undefined) {
            if (row[1].includes("¬") && (row[13] == "CIV" || row[13] == "ELE" || row[13] == "REF") && row[7].substring(3, 10) == mesAtual) {
                retrabalho++;
            }
        }
        //Preventivas CIV
        if(row[13] == "CIV" && row[19] == "02" && row[4].substring(3, 10) == mesAtual
        && row[3].includes("RS-ST01")) {
            if(row[9] == 77 || row[9] == 99){
                preventivasCIV++;
                totalprevCIV++;
            } else {
                totalprevCIV++;
            }
        }
        //Preventivas ELE
        if(row[13] == "ELE" && row[19] == "02" && row[4].substring(3, 10) == mesAtual 
        && row[3].includes("RS-ST01")) {
            if(row[9] == 77 || row[9] == 99){
                preventivasELE++;
                totalprevELE++;
            } else {
                totalprevELE++;
            }
        }
        //Preventivas REF
        if(row[13] == "REF" && row[19] == "02" && row[4].substring(3, 10) == mesAtual 
        && row[3].includes("RS-ST01")) {
            if(row[9] == 77 || row[9] == 99){
                preventivasREF++;
                totalprevREF++;
            } else if (row[9] == 50){
                totalprevREF++;
            }
        }
        //1º Atendimento ZU
        if(row[17] == 1 && (row[13] == "CIV" || row[13] == "ELE" || row[13] == "REF") &&
            row[19] == "06" && row[24].substring(3, 10) == mesAtual && row[3].includes("RS-ST01"
            && row[9] != 96)) {
                horFecDec = Number(row[23].substring(11, 13))+Number(row[23].substring(14, 16))/60;
                horAbeDec = Number(row[24].substring(11, 13))+Number(row[24].substring(14, 16))/60;
                if(row[23].substring(0, 2) != row[24].substring(0, 2)) {
                    zus = "NOk";
                    quantZUs++;
                    console.log(row[0]);
                } else if(horFecDec - horAbeDec > 2) {
                    zus = "NOk";
                    quantZUs++;
                    console.log(row[0]);
                }
        }
        //Atendimento ISE
        if(row[13] == "ADM" && row[4].substring(0, 10) == `15/${mesAtual}`) {
            if(row[9] == 99) {
              atendimentoISE++;
              totalisemes++;
            } else if(row[9] == 50) {
              totalisemes++;
            }
        }
    })
    tma = Math.round((tma / totalos) * 100) / 100;
    retrabalho = retrabalho / totalos * 100;
    var percentISE = Math.round(atendimentoISE / totalisemes * 100);
    plotFac(tma, retrabalho, envelhecimento, zus, percentISE, totalisemes, acidentes, quantZUs, 
      avaliacao7s, satisfcli, preventivasCIV, preventivasELE, preventivasREF, totalprevCIV,
    totalprevELE, totalprevREF);
}

function plotFac(tma, retrabalho, envelhecimento, zus, percentISE, totalisemes, acidentes, quantZUs, 
  avaliacao7s, satisfcli, preventivasCIV, preventivasELE, preventivasREF, totalprevCIV,
totalprevELE, totalprevREF) {
    //TMA
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: tma,  // Current speed or value
          title: { text: "TMA", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 12], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
            steps: [
              { range: [0, 8], color: "rgb(237,237,237)" },
              { range: [8, 10], color: "rgb(255,70,10)" },
              { range: [10, 12], color: "rgb(17,17,17)" }
            ]
          }
        }
      ];
    
      var layout = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-tma', data, layout);

      //Retrabalho
      var data2 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: retrabalho.toFixed(2),  // Current speed or value
          title: { text: "Retrabalho", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout2 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-retrabalho', data2, layout2);

      //1º Atendimento ZU
      var zuColor;
      if(zus == "Ok") {
        zuValue = 75;
        zuColor = 'green';
      } else {
        zuValue = 25;
        zuColor = 'red';
      }
      var data3 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: quantZUs,  // Current speed or value
          title: { text: "1º Atendimento ZU", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: zuColor },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout3 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-zus', data3, layout3);

      //Preventivas CIV
      var trace1 = {
        x: ['Preventivas CIV'],
        y: [preventivasCIV],
        name: 'Realizadas',
        title: "Preventivas CIV",
        type: 'bar',
        marker: {
          color: 'green'
        },
        text: [preventivasCIV],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var trace2 = {
        x: ['Preventivas CIV'],
        y: [totalprevCIV-preventivasCIV],
        name: 'Pendentes',
        type: 'bar',
        marker: {
          color: 'red'
        },
        text: [totalprevCIV-preventivasCIV],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var data4 = [trace1, trace2];
      var layout4 = {
        title: "Preventivas CIV",
        barmode: 'stack',
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      
      Plotly.newPlot('facilities-prev-civ', data4, layout4);

      //Preventivas ELE
      var trace3 = {
        x: ['Preventivas ELE'],
        y: [preventivasELE],
        name: 'Realizadas',
        type: 'bar',
        marker: {
          color: 'green'
        },
        text: [preventivasELE],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var trace4 = {
        x: ['Preventivas ELE'],
        y: [totalprevELE-preventivasELE],
        name: 'Pendentes',
        type: 'bar',
        marker: {
          color: 'red'
        },
        text: [totalprevELE-preventivasELE],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var data5 = [trace3, trace4];
      var layout5 = {
        title: "Preventivas ELE",
        barmode: 'stack',
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      
      Plotly.newPlot('facilities-prev-ele', data5, layout5);

      //Preventivas REF
      var trace5 = {
        x: ['Preventivas REF'],
        y: [preventivasREF],
        name: 'Realizadas',
        type: 'bar',
        marker: {
          color: 'green'
        },
        text: [preventivasREF],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var trace6 = {
        x: ['Preventivas REF'],
        y: [totalprevREF-preventivasREF],
        name: 'Pendentes',
        type: 'bar',
        marker: {
          color: 'red'
        },
        text: [totalprevREF-preventivasREF],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var data6 = [trace5, trace6];
      var layout6 = {
        title: "Preventivas REF",
        barmode: 'stack',
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      
      Plotly.newPlot('facilities-prev-ref', data6, layout6);

      //Envelhecimento
      var data7 = [{
        x: ['Chamados'],  // Categories
        y: [envelhecimento],  // Values for each category
        type: 'bar',  // The bar chart (which is essentially a column chart)
        marker: {
            color: 'rgb(255,70,10)'  // Single color for all columns
        },
        text: [envelhecimento],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          },
        hoverinfo: 'x+y+text'  // Display the value when hovering
      }];
      
      var layout7 = {
        width: 480,
        height: 320,
        title: 'Envelhecimento',
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
      
      Plotly.newPlot('facilities-envelhecimento', data7, layout7);

      //Atendimento ISE
      var data8 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: percentISE,  // Current speed or value
          title: { text: "Atendimento ISE", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(255, 70, 10)" },  // Color of the speed pointer
            steps: [
              { range: [0, 90], color: "rgb(237,237,237)" },
              { range: [90, 100], color: "green" }
            ]
          }
        }
      ];
    
      var layout8 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-ise', data8, layout8);

      //Acidentes
      var data9 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: acidentes.toFixed(2),  // Current speed or value
          title: { text: "Acidentes", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(255, 70, 10)" },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout9 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-acidentes', data9, layout9);

      //Avaliação 7S
      var data10 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: avaliacao7s.toFixed(2),  // Current speed or value
          title: { text: "Avaliação 7S", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout10 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-7s', data10, layout10);

      //Satisfação CLiente
      var data11 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: satisfcli.toFixed(2),  // Current speed or value
          title: { text: "Satisfação Cliente", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout11 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('facilities-satisfacao', data11, layout11);
}

//SPCI
function updateSPI() {
  purgeFAC();
  purgeLSI();
  purgeWPA();
  purgeWSP();
  selectClass('icon_spi');
  var totalos = 0;
  var zus = "Ok";
  var quantZUs = 0;
  var tma = 0;
  var retrabalho = 0;
  var preventivasSPI = 0;
  var totalprevSPI = 0;
  var avaliacao7s = 0;
  var satisfcli = 0;
  alldata.forEach(row => {
      //TMA
      if (row[9] == 99 && row[13] == "SPI" &&
          row[19] != "02" && row[7].substring(3, 10) == mesAtual) {
              tma += Number(row[27]);
              totalos++;
      }
      //Retrabalho
      if(row[1] != undefined && row[7] != undefined) {
          if (row[1].includes("¬") && row[13] == "SPI" && row[7].substring(3, 10) == mesAtual) {
              retrabalho++;
          }
      }
      //Preventivas SPI
      if(row[13] == "SPI" && row[19] == "02" && row[4].substring(3, 10) == mesAtual
      && row[3].includes("RS-ST01")) {
          if(row[9] == 77 || row[9] == 99){
              preventivasSPI++;
              totalprevSPI++;
          } else if(row[9] == 50) {
              totalprevSPI++;
          }
      }
      //1º Atendimento ZU
      if(row[17] == 1 && row[13] == "SPI" &&
          row[19] == "06" && row[24].substring(3, 10) == mesAtual && row[3].includes("RS-ST01")
          && row[9] != 96) {
              horFecDec = Number(row[23].substring(11, 13))+Number(row[23].substring(14, 16))/60;
              horAbeDec = Number(row[24].substring(11, 13))+Number(row[24].substring(14, 16))/60;
              if(horFecDec != 0 && row[0] != 44941) {
                if(row[23].substring(0, 2) != row[24].substring(0, 2)) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
                } else if(horFecDec - horAbeDec > 2) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
                }
              }
              
      }
  })
  tma = Math.round((tma / totalos) * 100) / 100;
  retrabalho = retrabalho / totalos * 100;
  plotSpi(tma, retrabalho, zus, quantZUs, preventivasSPI, totalprevSPI,
    avaliacao7s, satisfcli);
}

function plotSpi(tma, retrabalho, zus, quantZUs, preventivasSPI, totalprevSPI,
  avaliacao7s, satisfcli) {
    //TMA
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: tma,  // Current speed or value
          title: { text: "TMA", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 12], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
            steps: [
              { range: [0, 8], color: "rgb(237,237,237)" },
              { range: [8, 10], color: "rgb(255,70,10)" },
              { range: [10, 12], color: "rgb(17,17,17)" }
            ]
          }
        }
      ];
    
      var layout = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('spci-tma', data, layout);

      //Retrabalho
      var data2 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: retrabalho.toFixed(2),  // Current speed or value
          title: { text: "Retrabalho", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout2 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('spci-retrabalho', data2, layout2);

      //1º Atendimento ZU
      var zuColor;
      if(zus == "Ok") {
        zuValue = 75;
        zuColor = 'green';
      } else {
        zuValue = 25;
        zuColor = 'red';
      }
      var data3 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: quantZUs,  // Current speed or value
          title: { text: "1º Atendimento ZU", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: zuColor },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout3 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('spci-zus', data3, layout3);

      //Preventivas SPI
      var trace1 = {
        x: ['Preventivas SPI'],
        y: [preventivasSPI],
        name: 'Realizadas',
        title: "Preventivas SPI",
        type: 'bar',
        marker: {
          color: 'green'
        },
        text: [preventivasSPI],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var trace2 = {
        x: ['Preventivas SPI'],
        y: [totalprevSPI-preventivasSPI],
        name: 'Pendentes',
        type: 'bar',
        marker: {
          color: 'red'
        },
        text: [totalprevSPI-preventivasSPI],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var data4 = [trace1, trace2];
      var layout4 = {
        title: "Preventivas SPI",
        barmode: 'stack',
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      
      Plotly.newPlot('spci-prev', data4, layout4);

      //Avaliação 7S
      var data5 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: avaliacao7s.toFixed(2),  // Current speed or value
          title: { text: "Avaliação 7S", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout5 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('spci-7s', data5, layout5);

      //Satisfação CLiente
      var data6 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: satisfcli.toFixed(2),  // Current speed or value
          title: { text: "Satisfação Cliente", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout6 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('spci-satisfacao', data6, layout6);
}

//LSI
function updateLSI() {
  purgeFAC();
  purgeSPI();
  purgeWPA();
  purgeWSP();
  selectClass('icon_lsi');
  var zus = "Ok";
  var quantZUs = 0;
  var preventivasJAR = 0;
  var totalprevJAR = 0;
  var preventivasLTE = 0;
  var totalprevLTE = 0;
  var cronogramaLCO = 97.44;
  var cronogramaLTE = 0;
  var cronogramaJAR = 0;
  var eficaciaLCO = 0;
  var eficaciaLTE = 0;
  var eficaciaJAR = 0;
  var acidentes = 0;
  var satisfcli = 0;
  alldata.forEach(row => {
      //Preventivas JAR
      if(row[13] == "JAR" && row[19] == "02" && row[4].substring(3, 10) == mesAtual) {
          if(row[9] == 77 || row[9] == 99){
              preventivasJAR++;
              totalprevJAR++;
          } else {
              totalprevJAR++;
          }
      }
      //Preventivas LTE
      if(row[13] == "LTE" && row[19] == "02" && row[4].substring(3, 10) == mesAtual) {
        if(row[9] == 77 || row[9] == 99){
            preventivasLTE++;
            totalprevLTE++;
        } else if(row[9] == 50) {
            totalprevLTE++;
        }
    }
      //1º Atendimento ZU
      if(row[17] == 1 && (row[13] == "LTE" || row[13] == "JAR") &&
          row[19] == "06" && row[24].substring(3, 10) == mesAtual && row[3].includes("RS-ST01")) {
              horFecDec = Number(row[23].substring(11, 13))+Number(row[23].substring(14, 16))/60;
              horAbeDec = Number(row[24].substring(11, 13))+Number(row[24].substring(14, 16))/60;
              if(row[23].substring(0, 2) != row[24].substring(0, 2)) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              } else if(horFecDec - horAbeDec > 2) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              }
      }
  })
  cronogramaJAR = Math.round(preventivasJAR / totalprevJAR * 100).toFixed(2);
  cronogramaLTE = Math.round(preventivasLTE / totalprevLTE * 100).toFixed(2);
  plotLsi(cronogramaLCO, cronogramaLTE, cronogramaJAR, eficaciaLCO, eficaciaLTE, eficaciaJAR,
    zus, quantZUs, acidentes, satisfcli);
}

function plotLsi(cronogramaLCO, cronogramaLTE, cronogramaJAR, eficaciaLCO, eficaciaLTE, eficaciaJAR,
  zus, quantZUs, acidentes, satisfcli) {
      //Cronograma LCO
      var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: cronogramaLCO,  // Current speed or value
          title: { text: "Cronograma LC", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 90], color: "rgb(237,237,237)" },
              { range: [90, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-cump-lc', data, layout);

      //Cronograma LTE
      var data2 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: cronogramaLTE,  // Current speed or value
          title: { text: "Cronograma LI", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 95], color: "rgb(237,237,237)" },
              { range: [95, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout2 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-cump-li', data2, layout2);

      //Cronograma JAR
      var data3 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: cronogramaJAR,  // Current speed or value
          title: { text: "Cronograma JD", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 95], color: "rgb(237,237,237)" },
              { range: [95, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout3 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-cump-jd', data3, layout3);

      //Eficácia LCO
      var data4 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: eficaciaLCO,  // Current speed or value
          title: { text: "Eficácia LC", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout4 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-efic-lc', data4, layout4);

      //Eficácia LTE
      var data5 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: eficaciaLTE,  // Current speed or value
          title: { text: "Eficácia LI", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout5 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-efic-li', data5, layout5);

      //Eficácia JAR
      var data6 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: eficaciaJAR,  // Current speed or value
          title: { text: "Eficácia JD", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout6 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-efic-jd', data6, layout6);

      //1º Atendimento ZU
      var zuColor;
      if(zus == "Ok") {
        zuValue = 75;
        zuColor = 'green';
      } else {
        zuValue = 25;
        zuColor = 'red';
      }
      var data7 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: quantZUs,  // Current speed or value
          title: { text: "1º Atendimento ZU", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: zuColor },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout7 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-zus', data7, layout7);

      //Acidentes
      var data8 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: acidentes,  // Current speed or value
          title: { text: "Acidentes", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout8 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-acidentes', data8, layout8);

      //Satisfação CLiente
      var data9 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: satisfcli.toFixed(2),  // Current speed or value
          title: { text: "Satisfação Cliente", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout9 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('lsi-satisfacao', data9, layout9);
}

//Benevides
function updateWPA() {
  purgeLSI();
  purgeSPI();
  purgeFAC();
  purgeWSP();
  selectClass('icon_wpa');
  var totalos = 0;
  var zus = "Ok";
  var quantZUs = 0;
  var tma = 0;
  var preventivas = 0;
  var totalprev = 0;
  var avaliacao7s = 0;
  var satisfcli = 0;
  alldata.forEach(row => {
      //TMA
      if (row[9] == 99 && (row[13] == "CIV" || row[13] == "ELE" || row[13] == "REF") &&
          row[19] != "02" && row[7].substring(3, 10) == mesAtual) {
            if(row[3].includes('PA-ST03')) {
              tma += Number(row[27]);
              totalos++;
            }
      }
      //Preventivas
      if(row[19] == "02" && row[4].substring(3, 10) == mesAtual) {
        if(row[3].includes('PA-ST03')) {
          if(row[9] == 77 || row[9] == 99){
            preventivas++;
            totalprev++;
          } else {
            totalprev++;
          }
        }   
      }
      //1º Atendimento ZU
      if(row[17] == 1 &&
          row[19] == "06" && row[24].substring(3, 10) == mesAtual && row[3].includes("PA-ST03")) {
              horFecDec = Number(row[23].substring(11, 13))+Number(row[23].substring(14, 16))/60;
              horAbeDec = Number(row[24].substring(11, 13))+Number(row[24].substring(14, 16))/60;
              if(row[23].substring(0, 2) != row[24].substring(0, 2)) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              } else if(horFecDec - horAbeDec > 2) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              }
      } 
  })
  tma = Math.round((tma / totalos) * 100) / 100;
  plotWpa(tma, zus, quantZUs, preventivas, totalprev, avaliacao7s, satisfcli);
}

function plotWpa(tma, zus, quantZUs, preventivas, totalprev, avaliacao7s, satisfcli) {
    //TMA
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: tma,  // Current speed or value
          title: { text: "TMA", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 12], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
            steps: [
              { range: [0, 8], color: "rgb(237,237,237)" },
              { range: [8, 10], color: "rgb(255,70,10)" },
              { range: [10, 12], color: "rgb(17,17,17)" }
            ]
          }
        }
      ];
    
      var layout = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('benevides-tma', data, layout);

      //1º Atendimento ZU
      var zuColor;
      if(zus == "Ok") {
        zuValue = 75;
        zuColor = 'green';
      } else {
        zuValue = 25;
        zuColor = 'red';
      }
      var data3 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: quantZUs,  // Current speed or value
          title: { text: "1º Atendimento ZU", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: zuColor },  // Color of the speed pointer
            steps: [
              { range: [0, 1], color: "rgb(237,237,237)" }
            ]
          }
        }
      ];
    
      var layout3 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('benevides-zus', data3, layout3);

      //Preventivas
      var trace1 = {
        x: ['Preventivas'],
        y: [preventivas],
        name: 'Realizadas',
        title: "Preventivas",
        type: 'bar',
        marker: {
          color: 'green'
        },
        text: [preventivas],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var trace2 = {
        x: ['Preventivas'],
        y: [totalprev-preventivas],
        name: 'Pendentes',
        type: 'bar',
        marker: {
          color: 'red'
        },
        text: [totalprev-preventivas],  // The text values to show on top of each bar
        textposition: 'inside',  // Position the text inside the bar
        insidetextanchor: 'middle',  // Center the text inside the bar
        textfont: {
            size: 44,
            color: 'white',  // Change text color
            family: 'Arial'
          }
      };
      
      var data4 = [trace1, trace2];
      var layout4 = {
        title: "Preventivas",
        barmode: 'stack',
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      
      Plotly.newPlot('benevides-preventivas', data4, layout4);

      //Avaliação 7S
      var data5 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: avaliacao7s,  // Current speed or value
          title: { text: "Avaliação 7S", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout5 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('benevides-7s', data5, layout5);

      //Satisfação CLiente
      var data6 = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: satisfcli,  // Current speed or value
          title: { text: "Satisfação Cliente", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
            bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
            steps: [
              { range: [0, 85], color: "rgb(237,237,237)" },
              { range: [85, 100], color: "rgb(255,70,10)" }
            ]
          }
        }
      ];
    
      var layout6 = {
        width: 480,
        height: 320,
        margin: { t: 0, b: 0 },
        font: {
            color: 'white'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
        plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
      };
    
      Plotly.newPlot('benevides-satisfacao', data6, layout6);
}

//Jundiaí
function updateWSP() {
  purgeLSI();
  purgeSPI();
  purgeFAC();
  purgeWPA();
  selectClass('icon_wsp');
  var totalos = 0;
  var zus = "Ok";
  var quantZUs = 0;
  var tma = 0;
  var preventivas = 0;
  var totalprev = 0;
  var avaliacao7s = 0;
  var satisfcli = 0;
  alldata.forEach(row => {
      //TMA
      if (row[9] == 99 && (row[13] == "CIV" || row[13] == "ELE" || row[13] == "REF") &&
          row[19] != "02" && row[7].substring(3, 10) == mesAtual) {
            if(row[3].includes('SP-ST02')) {
              tma += Number(row[27]);
              totalos++;
            }
      }
      //Preventivas
      if(row[19] == "02" && row[4].substring(3, 10) == mesAtual) {
        if(row[3].includes('SP-ST02')) {
          if(row[9] == 77 || row[9] == 99){
            preventivas++;
            totalprev++;
          } else if(row[9] == 50) {
            totalprev++;
          }
        }   
      }
      //1º Atendimento ZU
      if(row[17] == 1 &&
          row[19] == "06" && row[24].substring(3, 10) == mesAtual && row[3].includes("SP-ST02") && row[9] != 96) {
              horFecDec = Number(row[23].substring(11, 13))+Number(row[23].substring(14, 16))/60;
              horAbeDec = Number(row[24].substring(11, 13))+Number(row[24].substring(14, 16))/60;
              if(row[23].substring(0, 2) != row[24].substring(0, 2)) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              } else if(horFecDec - horAbeDec > 2) {
                  zus = "NOk";
                  quantZUs++;
                  console.log(row[0]);
              }
      } 
  })
  tma = Math.round((tma / totalos) * 100) / 100;
  plotWsp(tma, zus, quantZUs, preventivas, totalprev, avaliacao7s, satisfcli);
}

function plotWsp(tma, zus, quantZUs, preventivas, totalprev, avaliacao7s, satisfcli) {
  //TMA
  var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: tma,  // Current speed or value
        title: { text: "TMA", font: { size: 24 } },
        gauge: {
          axis: { range: [0, 12], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
          bar: { color: "rgb(0, 153, 51)" },  // Color of the speed pointer
          steps: [
            { range: [0, 8], color: "rgb(237,237,237)" },
            { range: [8, 10], color: "rgb(255,70,10)" },
            { range: [10, 12], color: "rgb(17,17,17)" }
          ]
        }
      }
    ];
  
    var layout = {
      width: 480,
      height: 320,
      margin: { t: 0, b: 0 },
      font: {
          color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
      plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
    };
  
    Plotly.newPlot('jundiai-tma', data, layout);

    //1º Atendimento ZU
    var zuColor;
    if(zus == "Ok") {
      zuValue = 75;
      zuColor = 'green';
    } else {
      zuValue = 25;
      zuColor = 'red';
    }
    var data3 = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: quantZUs,  // Current speed or value
        title: { text: "1º Atendimento ZU", font: { size: 24 } },
        gauge: {
          axis: { range: [0, 1], tickwidth: 0.3, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
          bar: { color: zuColor },  // Color of the speed pointer
          steps: [
            { range: [0, 1], color: "rgb(237,237,237)" }
          ]
        }
      }
    ];
  
    var layout3 = {
      width: 480,
      height: 320,
      margin: { t: 0, b: 0 },
      font: {
          color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
      plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
    };
  
    Plotly.newPlot('jundiai-zus', data3, layout3);

    //Preventivas
    var trace1 = {
      x: ['Preventivas'],
      y: [preventivas],
      name: 'Realizadas',
      title: "Preventivas",
      type: 'bar',
      marker: {
        color: 'green'
      },
      text: [preventivas],  // The text values to show on top of each bar
      textposition: 'inside',  // Position the text inside the bar
      insidetextanchor: 'middle',  // Center the text inside the bar
      textfont: {
          size: 44,
          color: 'white',  // Change text color
          family: 'Arial'
        }
    };
    
    var trace2 = {
      x: ['Preventivas'],
      y: [totalprev-preventivas],
      name: 'Pendentes',
      type: 'bar',
      marker: {
        color: 'red'
      },
      text: [totalprev-preventivas],  // The text values to show on top of each bar
      textposition: 'inside',  // Position the text inside the bar
      insidetextanchor: 'middle',  // Center the text inside the bar
      textfont: {
          size: 44,
          color: 'white',  // Change text color
          family: 'Arial'
        }
    };
    
    var data4 = [trace1, trace2];
    var layout4 = {
      title: "Preventivas",
      barmode: 'stack',
      width: 480,
      height: 320,
      margin: { t: 0, b: 0 },
      font: {
          color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
      plot_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('jundiai-preventivas', data4, layout4);

    //Avaliação 7S
    var data5 = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: avaliacao7s,  // Current speed or value
        title: { text: "Avaliação 7S", font: { size: 24 } },
        gauge: {
          axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
          bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
          steps: [
            { range: [0, 85], color: "rgb(237,237,237)" },
            { range: [85, 100], color: "rgb(255,70,10)" }
          ]
        }
      }
    ];
  
    var layout5 = {
      width: 480,
      height: 320,
      margin: { t: 0, b: 0 },
      font: {
          color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
      plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
    };
  
    Plotly.newPlot('jundiai-7s', data5, layout5);

    //Satisfação CLiente
    var data6 = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: satisfcli,  // Current speed or value
        title: { text: "Satisfação Cliente", font: { size: 24 } },
        gauge: {
          axis: { range: [0, 100], tickwidth: 1, tickcolor: "rgb(0, 153, 51)" },  // Speed range (0 to 100)
          bar: { color: "rgb(35,35,35)" },  // Color of the speed pointer
          steps: [
            { range: [0, 85], color: "rgb(237,237,237)" },
            { range: [85, 100], color: "rgb(255,70,10)" }
          ]
        }
      }
    ];
  
    var layout6 = {
      width: 480,
      height: 320,
      margin: { t: 0, b: 0 },
      font: {
          color: 'white'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',  // Makes the chart background transparent
      plot_bgcolor: 'rgba(0,0,0,0)'    // Makes the plot area background transparent
    };
  
    Plotly.newPlot('jundiai-satisfacao', data6, layout6);
}

//Purge Graphs
function purgeFAC() {
  Plotly.purge('facilities-tma');
  Plotly.purge('facilities-retrabalho');
  Plotly.purge('facilities-zus');
  Plotly.purge('facilities-prev-civ');
  Plotly.purge('facilities-prev-ele');
  Plotly.purge('facilities-prev-ref');
  Plotly.purge('facilities-envelhecimento');
  Plotly.purge('facilities-ise');
  Plotly.purge('facilities-acidentes');
  Plotly.purge('facilities-7s');
  Plotly.purge('facilities-satisfacao');
}

function purgeLSI() {
  Plotly.purge('lsi-cump-lc');
  Plotly.purge('lsi-cump-li');
  Plotly.purge('lsi-cump-jd');
  Plotly.purge('lsi-efic-lc');
  Plotly.purge('lsi-efic-li');
  Plotly.purge('lsi-efic-jd');
  Plotly.purge('lsi-zus');
  Plotly.purge('lsi-acidentes');
  Plotly.purge('lsi-satisfacao');
}

function purgeSPI() {
  Plotly.purge('spci-tma');
  Plotly.purge('spci-retrabalho');
  Plotly.purge('spci-zus');
  Plotly.purge('spci-prev');
  Plotly.purge('spci-7s');
  Plotly.purge('spci-satisfacao');
}

function purgeWPA() {
  Plotly.purge('benevides-tma');
  Plotly.purge('benevides-zus');
  Plotly.purge('benevides-preventivas');
  Plotly.purge('benevides-7s');
  Plotly.purge('benevides-satisfacao');
}

function purgeWSP() {
  Plotly.purge('jundiai-tma');
  Plotly.purge('jundiai-zus');
  Plotly.purge('jundiai-preventivas');
  Plotly.purge('jundiai-7s');
  Plotly.purge('jundiai-satisfacao');
}

function selectClass(string) {
  document.getElementById('icon_fac').classList.remove('active');
  document.getElementById('icon_seg').classList.remove('active');
  document.getElementById('icon_spi').classList.remove('active');
  document.getElementById('icon_lsi').classList.remove('active');
  document.getElementById('icon_wpa').classList.remove('active');
  document.getElementById('icon_wsp').classList.remove('active');
  document.getElementById('icon_sat').classList.remove('active');
  document.getElementById('icon_a7s').classList.remove('active');
  document.getElementById(string).classList.add('active');
}