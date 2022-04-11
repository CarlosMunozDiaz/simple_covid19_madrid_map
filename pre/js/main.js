//Desarrollo de la visualización
import * as d3 from 'd3';
import * as topojson from "topojson-client";
let d3_composite = require("d3-composite-projections");

//Necesario para importar los estilos de forma automática en la etiqueta 'style' del html final
import '../css/main.scss';

///// VISUALIZACIÓN DEL GRÁFICO //////
let map1 = d3.select('#map1'), map2 = d3.select('#map2');

const width = parseInt(map1.style('width'));
const height = parseInt(map1.style('height'));

let mapLayer1 = map1.append('svg').attr('width', width).attr('height', height),
    mapLayer2 = map2.append('svg').attr('width', width).attr('height', height);
let distritos;
let projection, path;

d3.queue()
    .defer(d3.json, 'https://raw.githubusercontent.com/carlosmunozdiaz/simple_covid19_madrid_map/main/data/distritos_v2.json')
    .defer(d3.csv, 'https://raw.githubusercontent.com/carlosmunozdiaz/simple_covid19_madrid_map/main/data/covid19_anni.csv')
    .await(main);

function main(error, distritosAux, data) {
    if (error) throw error;

    distritos = topojson.feature(distritosAux, distritosAux.objects.distritos);

    ///HACEMOS EL JOIN
    distritos.features.forEach(function(item) {
        let join = data.filter(function(subItem) {
            if(subItem.municipio_distrito.substr(7) == item.properties.NOMBRE) {
                return subItem;
            }
        });
        item.data = join;
    });

    projection = d3_composite.geoConicConformalSpain().scale(2000).fitSize([width,height], distritos);
    path = d3.geoPath(projection);

    mapLayer1.selectAll(".dist1")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist1")
        .style('stroke','#262626')
        .style('stroke-width','0.6px')
        .style('opacity', '1')
        .style("fill", function(d) {
            if(parseInt(d.data[0].casos_totales) >= 2600 & parseInt(d.data[0].casos_totales) < 7480) {
                return '#ffe6b7';
            } else if (parseInt(d.data[0].casos_totales) >= 7480 & parseInt(d.data[0].casos_totales) < 12360) {
                return '#fecc7b';
            } else if (parseInt(d.data[0].casos_totales) >= 12360 & parseInt(d.data[0].casos_totales) < 17240) {
                return '#f8b05c';
            } else if (parseInt(d.data[0].casos_totales) >= 17240 & parseInt(d.data[0].casos_totales) < 22120) {
                return '#f1944d';
            } else if (parseInt(d.data[0].casos_totales) >= 22120) {
                return '#e37a42';
            }
        })
        .attr("d", path);

    mapLayer2.selectAll(".dist2")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist2")
        .style('stroke','#262626')
        .style('stroke-width','0.6px')
        .style('opacity', '1')
        .style("fill", function(d) {
            if(parseInt(d.data[1].casos_totales) >= 2600 & parseInt(d.data[1].casos_totales) < 7480) {
                return '#ffe6b7';
            } else if (parseInt(d.data[1].casos_totales) >= 7480 & parseInt(d.data[1].casos_totales) < 12360) {
                return '#fecc7b';
            } else if (parseInt(d.data[1].casos_totales) >= 12360 & parseInt(d.data[1].casos_totales) < 17240) {
                return '#f8b05c';
            } else if (parseInt(d.data[1].casos_totales) >= 17240 & parseInt(d.data[1].casos_totales) < 22120) {
                return '#f1944d';
            } else if (parseInt(d.data[1].casos_totales) >= 22120) {
                return '#e37a42';
            }
        })
        .attr("d", path);
}