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

    let color = d3.scaleQuantile()
        .domain([120,262])
        .range(['#56f9ff', '#46d2d9', '#36adb4', '#268990', '#17666e', '#09464d', '#00282f']);

    mapLayer1.selectAll(".dist1")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist1")
        .style('stroke','#262626')
        .style('stroke-width','0.6px')
        .style('opacity', '1')
        .style("fill", function(d) {
            return color(+d.data[0].tasa_incidencia_media_anual);
        })
        .attr("d", path);

    mapLayer1.append("g")
        .selectAll("labels")
        .data(distritos.features)
        .enter()
        .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]})
        .text(function(d){ return d.data[0].id_distrito; })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 11)
        .style("fill", "white");

    mapLayer2.selectAll(".dist2")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist2")
        .style('stroke','#262626')
        .style('stroke-width','0.6px')
        .style('opacity', '1')
        .style("fill", function(d) {
            return color(+d.data[1].tasa_incidencia_media_anual);
        })
        .attr("d", path);

    mapLayer2.append("g")
        .selectAll("labels")
        .data(distritos.features)
        .enter()
        .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]})
        .text(function(d){ return d.data[1].id_distrito; })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 11)
        .style("fill", "white");
}