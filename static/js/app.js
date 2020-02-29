var samples = [];
var metadata = []

function init() {
    var jsonFile = "/samples.json";
    d3.json(jsonFile).then(function (data) {
        for (var i = 0; i < data.names.length; i++) {
            data.names[i] = +data.names[i]
        }
        console.log(data);
        samples = data.samples
        metadata = data.metadata
        d3.select("#selDataset").selectAll()
            .data(data.names)
            .enter()
            .append("option")
            .text(d => d)
    });
}

function updateMetadata(md){
    
    metaDiv = d3.select("#sample-metadata").html("");
    metaDiv = d3.select("#sample-metadata");
    metaUL = metaDiv.append("ul")
        .attr('class','list-group')
        
    Object.entries(md[0]).forEach(function([key,value]){
        metaUL.append("li").attr('class', 'list-group-item d-flex justify-content-between align-items-center')
        .text(`${key}: ${value}`)
        })
}

function drawBar(currentSample){
    
    var otu_ids = [];
    var sample_values = [];
    var otu_labels = [];


    for (var i=9; i>=0; i--){
        otu_ids.push(`OTU ${currentSample.otu_ids[i]}`);
        sample_values.push(currentSample.sample_values[i]);
        otu_labels.push(currentSample.otu_labels[i]);
    }
    var trace1 = {
        y: otu_ids,
        x: sample_values,
        labels: otu_labels,
        orientation: 'h',
        type: "bar"
      };
      
      var data = [trace1];
      
      var layout = {
      };
      
      Plotly.newPlot("bar", data, layout);
}

function drawBubble(currentSample){
    
    var trace2 = {
        x: currentSample.otu_ids,
        y: currentSample.sample_values,
        text:currentSample.otu_labels,
        mode: 'markers',
        marker: {
          size: currentSample.sample_values,
          color: currentSample.otu_ids,
          opacity: opacity
        }
      };
      
      var data2 = [trace2];
      
      var layout2 = {
        title: 'Marker Size',
        xaxis: {title:'OTU ID'},
        showlegend: false
      };
      
      Plotly.newPlot('bubble', data2, layout2);
}
//Bonus
function drawGauge(currentMeta){
    // console.log(currentMeta)
    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: currentMeta[0].wfreq,
          text:["0-1", "1-2", "2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
          textposition: "inside",
          title: { text: "Belly Button Washer Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "#f7f2eb" },
              { range: [1, 2], color: "#f3f0e4" },
              { range: [2, 3], color: "#e8e6c8" },
              { range: [3, 4], color: "#e4e8af" },
              { range: [4, 5], color: "#d4e494" },
              { range: [5, 6], color: "#b6cc8a" },
              { range: [6, 7], color: "#86bf7f" },
              { range: [7, 8], color: "#84bb8a" },
              { range: [8, 9], color: "#7fb485" }
            ]
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
}

function optionChanged(value)
{
    var currentSample = samples.filter(d => +d.id == value);
    var currentMeta = metadata.filter(d => +d.id == value);
    
    //Update Metadata
    updateMetadata(currentMeta);

    //Draw the Bar Graph
    drawBar(currentSample[0]);

    //Draw Bubble Graph
    drawBubble(currentSample[0]);


    //Draw Gauge Graph
    drawGauge(currentMeta);
}

init();