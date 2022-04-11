//Desarrollo de la visualización
import * as d3 from 'd3';
import * as topojson from "topojson-client";

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

    console.log(data);

    ///HACEMOS EL JOIN
    // muni.features.forEach(function(item) {
    //     let join = data.filter(function(subItem) {
    //         if(subItem.Municipios.substr(0,5) == item.properties.Codigo) {
    //             return subItem;
    //         }
    //     });
    //     join = join[0];
    //     item.data = join;
    // });
    projection = d3.geoMercator().center([-3.816,40.528]).translate([width/2,height/3.5]),
    path = d3.geoPath(projection);

    console.log(distritos);

    mapLayer1.selectAll(".dist1")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist1")
        .style('stroke','blue')
        .style('opacity', '1')
        .attr("d", path);
}