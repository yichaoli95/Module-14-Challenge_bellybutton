// Define the URL for the JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dropdown = d3.select("#selDataset");


// Load the JSON data
d3.json(url).then(function (data) {
    console.log(data)
    // Extract the necessary arrays from the loaded data
    const names = data.names;

    // Create the dropdown menu options

    names.forEach((id) => {
        dropdown
            .append("option")
            .text(id)
            .property("value", id);
    });

    displayMetadata(names[0])
    updateCharts(names[0])
});


// Function to update the bar chart
function updateCharts(sampleID) {
    d3.json(url).then(function (data) {

        let samples = data.samples;
        // Find the selected sample object
        const selectedSample = samples.find(function (sample) {
            return sample.id === sampleID;
        });

        // Get the top 10 OTUs for the selected sample
        const top10OTUs = selectedSample.otu_ids.slice(0, 10).reverse();
        const top10Values = selectedSample.sample_values.slice(0, 10).reverse();
        const top10Labels = selectedSample.otu_labels.slice(0, 10).reverse();

        // Create the bar chart using Plotly.js
        const chartdata = [
            {
                x: top10Values,
                y: top10OTUs.map(function (otu) {
                    return `OTU ${otu}`;
                }),
                text: top10Labels,
                type: "bar",
                orientation: "h"
            }
        ];

        const chartlayout = {
            hovermode: "closest",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", chartdata, chartlayout);


        // Get the data for the bubble chart
        const bubbleData = [
            {
                x: selectedSample.otu_ids,
                y: selectedSample.sample_values,
                text: selectedSample.otu_labels,
                mode: "markers",
                marker: {
                    size: selectedSample.sample_values,
                    color: selectedSample.otu_ids
                }
            }

        ];

        // Create the bubble chart using Plotly.js
        const bubblelayout = {
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", bubbleData, bubblelayout);
    })
}

// Function to display the sample metadata
function displayMetadata(sampleID) {
    d3.json(url).then(function (data) {

        // Find the selected sample object
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
        let selectedSample = resultArray[0];

        // Select the metadata display div element
        const metadataDisplay = d3.select("#sample-metadata");

        // Clear the existing metadata
        metadataDisplay.html("");

        // Iterate through each key-value pair in the metadata object
        Object.entries(selectedSample).forEach(function ([key, value]) {
            // Append a paragraph element for each key-value pair
            metadataDisplay
                .append("p")
                .text(`${key}: ${value}`);
        });
        buildGauge(selectedSample.wfreq);
    })
    
}


function optionChanged(sampleID){
    displayMetadata(sampleID)
    updateCharts(sampleID)
}