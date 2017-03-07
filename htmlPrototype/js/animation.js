$(function() {

    var dcisFontSize = d3.select('#DCIS').style('font-size')
        // d3.select('#dcisPic').style('transform','translate(200px, 0px)')
    var halfScreen = window.innerHeight / 2



    function midpoint(id) {
        return $(id).offset().top + ($(id).height() / 2) - (window.innerHeight / 2)
    }



    scrollTop = 0
    newScrollTop = 0
    $(window).on('scroll', function() {
        newScrollTop = $(window).scrollTop()

    })


    function moveOut(id, endDomain, endRange, xy) {
        var scale1 = d3.scaleLinear()
            .domain([0, endDomain])
            .range([0, endRange])
            .clamp(true)



        // x = (x == null)? 0: x;
        // y = (y == null)? 0: y;
        var newValue = scale1(scrollTop)
        if (xy == "x") {
            // console.log(newValue)
            document.getElementById(id).style.transform = "translate(" + newValue + "px, 0px)"
        } else if (xy == "y") {
            document.getElementById(id).style.transform = "translate(0px," + newValue + "px)"
        }


    }


    function move(id, domain, range, xy) {
        var scale = d3.scaleLinear()
            .domain([domain.a, domain.b])
            .range([range.a, range.b])
            .clamp(true)



        // x = (x == null)? 0: x;
        // y = (y == null)? 0: y;
        var newValue = scale(scrollTop)
        if (xy == "x") {
            // console.log(newValue)
            document.getElementById(id).style.transform = "translate(" + newValue + "px, 0px)"
        } else if (xy == "y") {
            document.getElementById(id).style.transform = "translate(0px," + newValue + "px)"
        }


    }

    function minMaxScale(start, end, min, max) {
        var output = d3.scaleLinear()
            .domain([start, end])
            .range([min, max])
            .clamp(true)
        return output(scrollTop)
    }

    function circleScale(start, end, min, max) {
        console.log(start)
        console.log(end)
        var output = d3.scaleLinear()
            .domain([start, start + (end - start) / 2, end])
            .range([min, max, min])
            .clamp(true)
        return output(scrollTop)
    }







    var treeData =

        {
            "name": "",
            children: [{
                    name: "Surgery",
                    children: [{
                        name: "Mastectomy",
                        children: []
                    }, {
                        name: "BCS",
                        children: [{
                            name: "With radiation",
                            children: []
                        }, {
                            name: "Without radiation",
                            children: []
                        }]
                    }]
                },

                {
                    name: "Active Surveillance",
                    children: []
                }
            ]
        }


    // set the dimensions and margins of the diagram
    var margin = {
            top: 200,
            right: 20,
            bottom: 200,
            left: 20
        },
        width = $('#decisionTreeLeft').width() - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;
    // console.log(width)
    // console.log(height)
    var svg = d3.select('#question').append('svg').attr('width', $('#decisionTreeLeft').width()).attr('height', window.innerHeight)
    w = width
    h = height

    g = svg.append('g')

    var points = d3.range(10).map(phyllotaxis(40));

    var circle = g.selectAll("text")
        .data(points)
        .enter().append("text")
        .attr("transform", function(d) {
            return "translate(" + (d[0]) + "," + (d[1] + h / 4) + ")";
        })
        .text("?")
        .style('font-size', "70")
        .style('opacity', 0);

    function phyllotaxis(radius) {
        var theta = Math.PI * (3 - Math.sqrt(5));
        return function(i) {
            var r = radius * Math.sqrt(i),
                a = theta * i;
            return [
                width / 2 + r * Math.cos(a),
                height / 2 + r * Math.sin(a)
            ];
        };
    }








    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);




    var svg2 = d3.select('#decisionTree2').append('svg').attr('width', $('#decisionTreeLeft').width()).attr('height', window.innerHeight)
        // declares a tree layout and assigns the size
        // var treemap = d3.tree()
        //     .size([width, height]);

    // //  assigns the data to a hierarchy using parent-child relationships
    // var nodes = d3.hierarchy(treeData);
    //
    // // maps the node data to the tree layout
    // nodes = treemap(nodes);


    var g2 = svg2.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var link2 = g2.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr('class', function(d, i) {
            if (d.depth > 4 && d.depth < 7) var tag = "set1"
            else if (d.depth < 8 && d.depth > 5) var tag = "set2"
            else if (d.depth > 7) var tag = "set3"
            else var tag = "set0"
            return tag + " link depth" + d.depth
        })
        .attr("d", function(d) {
            // console.log(d)
            return "M" + d.x + "," + d.y +
                "C" + d.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + d.parent.y;
        })
        .style('stroke', function(d) {
            if (d.depth < 2) return "#9A9EAB"
            else if (d.depth == 2) return '#EC96A4'
            else if (d.depth == 3) return "#375E97"
        }).style('opacity', function(d) {
            if (d.depth < 2) return 1
            else if (d.depth == 2) return 0
            else if (d.depth == 3) return 0
        });
    //
    // // adds each node as a group
    var node2 = g2.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function(d) {
            // console.log(d)
            // if (d.depth <2) var tag = "ngroup0"
            // else if (d.depth ==2) var tag = "ngroup2"
            // else var tag = "ngroup3"
            return "depth" + d.depth + " node" +
                (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    //
    //       // adds the circle to the node

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    node2.append("circle")
        .attr("r", 20)
        .style('fill', function(d) {
            if (d.depth < 2) return "#9A9EAB"
            else if (d.depth == 2) return '#EC96A4'
            else if (d.depth == 3) return "#375E97"
        })
        .style('stroke-width', '10px')
        .style('stroke-width', '10px')
        .on("mouseover", function(d) {
          console.log(d)
          div.transition()
              .duration(200)
              .style("opacity", .9);

          div	.html(
            "<h4>" + d.data.name+"</h4><p> Additional Informational....</p>"
          )
              .style("left", (d3.event.pageX)+20 + "px")
              .style("top", (d3.event.pageY) +20 + "px")
              .style('background',"white")
              .style("color", 'black')
          })
      .on("mouseout", function(d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
      });
        //
        //       // adds the text to the node
    node2.append("text")
        .attr("dy", ".35em")
        .attr("y", function(d) {
            return 8;
        })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.name
        })
        .attr('font-size', '20')
        .attr('fill', 'black')
        .style('fill-opacity', function(d) {
            if (d.depth < 2) return 1
            else if (d.depth == 2) return 0
            else if (d.depth == 3) return 0
        })
        .attr('class', function(d) {
            return "depth" + d.depth
        })



    var treeData3 = {
        "name": "",
        "children": [{
            "name": "Mastectomy"
        }, {
            "name": "BCS w/ Rx"
        }, {
            "name": "BCS w/out Rx"
        }, {
            "name": "Active Surveillance"
        }]
    }

    var svg3 = d3.select('#barRight').append('svg').attr('width', $('#decisionTreeLeft').width()).attr('height', window.innerHeight)

    g3 = svg3.append('g').attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // declares a tree layout and assigns the size
    var treemap3 = d3.tree()
        .size([width, height / 3]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes3 = d3.hierarchy(treeData3);

    // maps the node data to the tree layout
    nodes3 = treemap3(nodes3);



    var link3 = g3.selectAll(".link")
        .data(nodes3.descendants().slice(1))
        .enter().append("path")
        .attr('class', 'link')
        .attr("d", function(d) {
            // console.log(d)
            return "M" + d.x + "," + d.y +
                "C" + d.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + d.parent.y;
        })
        .style('stroke', function(d) {
            return "#375E97"
        }).style('opacity', 1);
    //
    // // adds each node as a group
    var node3 = g3.selectAll(".node")
        .data(nodes3.descendants())
        .enter().append("g")
        .attr("class", function(d) {
            // console.log(d)
            // if (d.depth <2) var tag = "ngroup0"
            // else if (d.depth ==2) var tag = "ngroup2"
            // else var tag = "ngroup3"
            return "depth" + d.depth + " node" +
                (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    //
    //       // adds the circle to the node
    node3.append("circle")
        .attr("r", 15)
        .style('fill', function(d) {
            return "#9A9EAB"

        })





        //
        //       // adds the text to the node
    node3.append("text")
        .attr("dy", ".35em")
        .attr("y", function(d) {
            return 8;
        })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.name
        })
        .attr('font-size', '20')
        .attr('fill', 'white')


    var barData = [1, 7, 15, 20]
    var topMargin = height / 3
    var bars = svg3.selectAll("rect")
        .data(barData)
        .enter()
        .append('rect')

    var barPadding = 50
    var barWidth = width / 4 - 2 * barPadding
    var spaceWidth = width / 4
    var leftMargin = margin.left * 4
    var heightScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, height - topMargin - barPadding])
    var color = d3.scaleOrdinal(d3.schemeCategory20);


    bars.attr("x", function(d, i) {
            return leftMargin + i * spaceWidth;
        })
        .attr("y", function(d, i) {
            return height + topMargin - heightScale(d)
        })
        .attr("width", barWidth)
        .attr("height", 0)
        .attr('fill', function(d) {
            return color(d)
        })



    svg3.selectAll("text").data(barData, function(d) {
            return d
        }).enter().append("text")
        .text(function(d) {
            console.log(d)
            return d + "%";
        })
        .attr("x", function(d, i) {
            return leftMargin + i * spaceWidth + barWidth / 2;
        })
        .attr("y", function(d, i) {
            return height + topMargin - heightScale(d) - 10
        })
        .attr('fill', 'black')
        .attr("text-anchor", "middle")


    function setDimensions() {
        dimensions = d3.select('#decisionTree2').node().getBoundingClientRect()
    }
    setDimensions()

    function fixDiv() {
        if (scrollTop > midpoint('#slide5') && scrollTop < midpoint('#slide8')) {
            d3.select('#decisionTree2').style('position', 'fixed')
                .style('left', dimensions.left + 'px')
                .style('top', 0)
        } else if (scrollTop < midpoint('#slide5')) {
            var d = d3.select('#slide5Left').node().getBoundingClientRect()
            d3.select('#decisionTree2').style('position', 'absolute')
                .style('left', d.right + 'px')
                .style('top', d.top + 'px')
        } else if (scrollTop > midpoint('#slide8')) {
            var d = d3.select('#lastTree').node().getBoundingClientRect()
                // console.log(d)
            d3.select('#decisionTree2').style('position', 'fixed')
                .style('left', d.right + 'px')
                .style('top', d.top + 'px')
        }

        if (scrollTop > midpoint('#slide12') && scrollTop < midpoint('#slide15')) {
            var d = d3.select('#slide12 .slide').node().getBoundingClientRect()

            d3.select('#bar2Right').style('position', 'fixed')
                .style('left', d.right + 'px')
                .style('top', 0)
        } else if (scrollTop < midpoint('#slide12')) {
            var d = d3.select('#slide12 .slide').node().getBoundingClientRect()
            d3.select('#bar2Right').style('position', 'fixed')
                .style('left', d.right + 'px')
                .style('top', d.top + 'px')
        } else if (scrollTop > midpoint('#slide15')) {
            var d = d3.select('#slide15 .slide').node().getBoundingClientRect()
                // console.log(d)
            d3.select('#bar2Right').style('position', 'fixed')
                .style('left', d.right + 'px')
                .style('top', d.top + 'px')
        }
    }

    function barInit(bar, point) {
        if (scrollTop > point) {
            bar.transition()
                .duration(500)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr("height", function(d) {
                    // console.log(d.score)
                    return heightScale(d)
                })
        } else {
            bar.transition()
                .duration(500)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr("height", 0)
        }

    }


    var surgery = {
        mas: [0, 98, 1],
        rx: [0, 93, 7],
        norx: [0, 85, 15],
        active: [80, 15, 5]
    }

    var svg4 = d3.select('#bar2Right').append('svg').attr('width', $('#decisionTreeLeft').width()).attr('height', window.innerHeight)




    g4 = svg4.append('g').attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



    var linear = d3.scaleOrdinal()
        .domain(["No Surgery", "1 Surgery", "More than 1 Surgeries"])
        .range(["#3B596A", "#A1CD73", "#ECDB60"]);





    var color2 = d3.scaleOrdinal(d3.schemeCategory10);

    var bars2 = svg4.selectAll("rect")
        .data(surgery.mas)
        .enter()
        .append('rect')
        .attr('class', 'bar2')

    bars2.attr("x", function(d, i) {
            return leftMargin + i * spaceWidth;
        })
        .attr("y", function(d, i) {
            return height + topMargin - heightScale(d)
        })
        .attr("width", barWidth)
        .attr('fill', function(d, i) {

            if (i == 0) return '#3B596A';
            else if (i == 1) return '#A1CD73';
            else if (i == 2) return '#ECDB60'

        })
        .attr("height", function(d) {
            // console.log(d.score)
            return heightScale(d)
        })

    svg4.selectAll("text").data(surgery.mas, function(d) {
            return d
        }).enter().append("text")
        .text(function(d) {
            console.log(d)
            return d + "%";
        })
        .attr("x", function(d, i) {
            return leftMargin + i * spaceWidth + barWidth / 2;
        })
        .attr("y", function(d, i) {
            return height + topMargin - heightScale(d) - 10
        })
        .attr('fill', 'black')
        .attr("text-anchor", "middle")

    svg4.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(100,100)");

    var legendLinear = d3.legendColor()
        .shapeWidth(100)
        //  .orient('horizontal')
        .scale(linear);

    svg4.select(".legendLinear")
        .call(legendLinear);

    state = ""

    function bar2Update() {
        if (scrollTop < midpoint('#slide12') && state != "a") {
            state = "a"
            console.log("o1")

            ///
            var bars2 = svg4.selectAll(".bar2")
                .data(surgery.mas)

            bars2.transition().duration(1000).attr('class', 'bar2')
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d)
                })
                .attr("width", barWidth)
                .attr('fill', function(d, i) {

                    if (i == 0) return '#3B596A';
                    else if (i == 1) return '#A1CD73';
                    else if (i == 2) return '#ECDB60'

                })
                .attr("height", function(d) {
                    // console.log(d.score)
                    return heightScale(d)
                })


            svg4.selectAll("text").data(surgery.mas)
                .transition().duration(1000)
                .text(function(d) {
                    console.log(d)
                    return d + "%";
                })
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth + barWidth / 2;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d) - 10
                })
                .attr('fill', 'black')
                .attr("text-anchor", "middle")


        } else if (scrollTop > midpoint('#slide12') + halfScreen && state != "b" && scrollTop < midpoint('#slide13')) {
            state = "b"

            var bars2 = svg4.selectAll(".bar2")
                .data(surgery.rx)

            bars2.transition().duration(1000).attr('class', 'bar2')
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d)
                })
                .attr("width", barWidth)
                .attr('fill', function(d, i) {

                    if (i == 0) return '#3B596A';
                    else if (i == 1) return '#A1CD73';
                    else if (i == 2) return '#ECDB60'

                })
                .attr("height", function(d) {
                    // console.log(d.score)
                    return heightScale(d)
                })


            svg4.selectAll("text").data(surgery.rx)
                .transition().duration(1000)
                .text(function(d) {
                    console.log(d)
                    return d + "%";
                })
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth + barWidth / 2;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d) - 10
                })
                .attr('fill', 'black')
                .attr("text-anchor", "middle")

        }else if (scrollTop > midpoint('#slide13') + halfScreen && state != "c" && scrollTop < midpoint('#slide14')) {
            state = "c"

            var bars2 = svg4.selectAll(".bar2")
                .data(surgery.norx)

            bars2.transition().duration(1000).attr('class', 'bar2')
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d)
                })
                .attr("width", barWidth)
                .attr('fill', function(d, i) {

                    if (i == 0) return '#3B596A';
                    else if (i == 1) return '#A1CD73';
                    else if (i == 2) return '#ECDB60'

                })
                .attr("height", function(d) {
                    // console.log(d.score)
                    return heightScale(d)
                })


            svg4.selectAll("text").data(surgery.norx)
                .transition().duration(1000)
                .text(function(d) {
                    console.log(d)
                    return d + "%";
                })
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth + barWidth / 2;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d) - 10
                })
                .attr('fill', 'black')
                .attr("text-anchor", "middle")

        }else if (scrollTop > midpoint('#slide14') + halfScreen && state != "d" ) {
            state = "d"

            var bars2 = svg4.selectAll(".bar2")
                .data(surgery.active)

            bars2.transition().duration(1000).attr('class', 'bar2')
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d)
                })
                .attr("width", barWidth)
                .attr('fill', function(d, i) {

                    if (i == 0) return '#3B596A';
                    else if (i == 1) return '#A1CD73';
                    else if (i == 2) return '#ECDB60'

                })
                .attr("height", function(d) {
                    // console.log(d.score)
                    return heightScale(d)
                })


            svg4.selectAll("text").data(surgery.active)
                .transition().duration(1000)
                .text(function(d) {
                    console.log(d)
                    return d + "%";
                })
                .attr("x", function(d, i) {
                    return leftMargin + i * spaceWidth + barWidth / 2;
                })
                .attr("y", function(d, i) {
                    return height + topMargin - heightScale(d) - 10
                })
                .attr('fill', 'black')
                .attr("text-anchor", "middle")

        }
    }


    var mort={
      mas:[2,98],
      bcsRx:[10,90],
      bcs:[20,80],
      active:[30,70]

    }



    var svg5 = d3.select('#bar3Right').append('svg').attr('width', $('#decisionTreeLeft').width()).attr('height', window.innerHeight)

    var newMargin = 200


    // g5 = svg5.append('g').attr("transform",
    //     "translate( '500px','"  + margin.top + "px')");


        var bars3 = svg5.selectAll("rect")
            .data(mort.mas)
            .enter()
            .append('rect')
            .attr('class', 'bar3')

        bars3.attr("x", function(d, i) {
                return newMargin + i * spaceWidth;
            })
            .attr("y", function(d, i) {
                return height + topMargin - heightScale(d)
            })
            .attr("width", barWidth)
            .attr('fill', function(d, i) {

                if (i == 0) return '#FF6600';
                else if (i == 1) return '#0099CC';

            })
            .attr("height", function(d) {
                // console.log(d.score)
                return heightScale(d)
            })

        svg5.selectAll("text").data(mort.mas, function(d) {
                return d
            }).enter().append("text")
            .text(function(d) {
                console.log(d)
                return d + "%";
            })
            .attr("x", function(d, i) {
                return newMargin + i * spaceWidth + barWidth / 2;
            })
            .attr("y", function(d, i) {
                return height + topMargin - heightScale(d) - 10
            })
            .attr('fill', 'black')
            .attr("text-anchor", "middle")


            var linear1 = d3.scaleOrdinal()
                .domain(["Breast Cacner", "Other Causes"])
                .range(["#FF6600", "#0099CC"]);




            svg5.append("g")
                .attr("class", "legendLinear")
                .attr("transform", "translate(100,100)");

            var legendLinear2 = d3.legendColor()
                .shapeWidth(100)
                //  .orient('horizontal')
                .scale(linear1);

            svg5.select(".legendLinear")
                .call(legendLinear2);


    d3.selectAll('input').on('change',function(d){
      var bars3 = svg5.selectAll(".bar3")
          .data(mort[d3.select(d3.event.target).attr('data')])

      bars3.transition().duration(1000).attr('class', 'bar3')
          .attr("x", function(d, i) {
              return newMargin + i * spaceWidth;
          })
          .attr("y", function(d, i) {
              return height + topMargin - heightScale(d)
          })
          .attr("width", barWidth)
          .attr('fill', function(d, i) {

            if (i == 0) return '#FF6600';
            else if (i == 1) return '#0099CC';

          })
          .attr("height", function(d) {
              // console.log(d.score)
              return heightScale(d)
          })


      svg5.selectAll("text").data(mort[d3.select(d3.event.target).attr('data')])
          .transition().duration(1000)
          .text(function(d) {
              console.log(d)
              return d + "%";
          })
          .attr("x", function(d, i) {
              return newMargin + i * spaceWidth + barWidth / 2;
          })
          .attr("y", function(d, i) {
              return height + topMargin - heightScale(d) - 10
          })
          .attr('fill', 'black')
          .attr("text-anchor", "middle")

      console.log(d3.select(d3.event.target).attr('data'))})





    var render = function() {


        // Don't re-render if scroll didn't change
        if (scrollTop !== newScrollTop) {

            // console.log(newScrollTop)




            // Graphics Code Goes Here
            scrollTop = newScrollTop;
            moveOut("DCIS", midpoint('#slide1'), 2000, "x")
            moveOut("whatIs", midpoint('#slide1'), -700, "x")
            move("p2", {
                a: 0,
                b: midpoint('#slide1')
            }, {
                a: -700,
                b: 0
            }, "x")
            d3.select('#dcisPic').style('opacity', minMaxScale(0, midpoint('#slide1'), 0, 1))
                .style('transform', 'translate(' + minMaxScale(halfScreen, midpoint('#slide1'), 300, 0) + 'px, 0px)')

            d3.select('#dcis1').style('opacity', minMaxScale(midpoint('#slide1') + halfScreen, midpoint('#slide2'), 0, 1))
            d3.select('#cancer').style('opacity', minMaxScale(midpoint('#slide1') + halfScreen / 2, midpoint('#slide2'), 0, 1))
            d3.select('#neq')
                .style('opacity', minMaxScale(midpoint('#slide1') + halfScreen * 1.5, midpoint('#slide2'), 0, 1))
                .style('font-size', minMaxScale(midpoint('#slide1') + halfScreen * 1.5, midpoint('#slide2'), 20, 7) + "em")
                .style('color', 'red')

            // node.selectAll('text').style('opacity', minMaxScale(midpoint('#slide2'), midpoint('#slide3'), 0, .8))
            //     .attr('font-size', minMaxScale(midpoint('#slide2'), midpoint('#slide3'), 700, 100))

            move("p3", {
                a: midpoint('#slide2'),
                b: midpoint('#slide3')
            }, {
                a: -700,
                b: 0
            }, "x")
            d3.select('#timePic').style('opacity', minMaxScale(midpoint('#slide3'), midpoint('#slide4'), 0, 1))
                .style('transform', 'translate(' + minMaxScale(midpoint('#slide3') + halfScreen, midpoint('#slide4'), 300, 0) + 'px, 0px)')

            svg2.style('transform', 'translate(' + minMaxScale(midpoint('#slide4') + halfScreen, midpoint('#slide5') - halfScreen / 2, -400, 0) + 'px, 0px)')
                .style('opacity', minMaxScale(midpoint('#slide4'), midpoint('#slide5'), 0, 1))
            d3.selectAll('.depth2').style('opacity', minMaxScale(midpoint('#slide5'), midpoint('#slide6'), 0, 1)).style('fill-opacity', minMaxScale(midpoint('#slide5'), midpoint('#slide6'), 0, 1))

            d3.selectAll('.depth3').style('opacity', minMaxScale(midpoint('#slide6'), midpoint('#slide7'), 0, 1)).style('fill-opacity', minMaxScale(midpoint('#slide6'), midpoint('#slide7'), 0, 1))
                // console.log(scrollTop)
            fixDiv()

            circle.style('opacity', function(d, i) {
                return (i < minMaxScale(midpoint('#slide3') - halfScreen/2, midpoint('#slide4') - halfScreen, 0, 30)) ? 1 : 0;
            })

            move("p9a", {
                a: midpoint('#slide9') - 250,
                b: midpoint('#slide9') - 200
            }, {
                a: -700,
                b: 0
            }, "x")

            move("p9b", {
                a: midpoint('#slide9') - 130,
                b: midpoint('#slide9') - 30,
            }, {
                a: 700,
                b: 0
            }, "x")

            move("p9c", {
                a: midpoint('#slide9') + 80,
                b: midpoint('#slide9') + 180,
            }, {
                a: 800,
                b: 0
            }, "y")

            barInit(bars, midpoint("#slide10") - 100)
            bar2Update()

        }
        window.requestAnimationFrame(render)
    }

    window.requestAnimationFrame(render)
})
