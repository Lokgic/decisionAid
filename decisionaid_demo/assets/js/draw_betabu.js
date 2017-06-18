$(function(){
  // $.get( "sample/", {'a':1},function( data ) {
  //     console.log(data);
  // });
  function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function draw_beta(a,b,n,callback){
    $.ajax({
    url: "sample/",
    type: "get", //send it through get method
    data: {
      a: a,
      b: b,
      n: n

    },
    success: function(response) {
      callback(response)

    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });

  }
  var query = getUrlVars()
  a = query["a"] == null? 5: query["a"]
  b = query["b"] == null? 2: query["b"]
  n = query["n"] == null? 15: query["n"]
  draw_beta(a,b,n,function(response){
    size = response.length
    inverted = []
    for (d in response){
      inverted.push(1-response[d])
    }
    data = response.concat(inverted)
    head = 0
    tail = size - 1

    console.log(data)
    var w = 800
    var h = 600
    var padding = 20
    var bar_width = w/size - padding
    var div = d3.select('#sequence')
    var svg = div.append('svg')
                  .attr('width',w)
                  .attr('height',h)
    var bars = svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class',function(d,i){
          if (i<size){
            return "figure" + i + " figure black"
          }
          return "figure" + (i-size) + " figure white"
        })
        .attr('x',function(d,i){
          if (i<size){
            // return i*(w/data.length)
            return w - ((i+1)*(w/size))
          }
          // return (i-data.length)*(w/data.length)
          return w - ((1+i-size)*(w/size))
        })
        .attr('width',bar_width)
        .attr('y',function(d,i){
          if (i<data.length/2){
            return h - (h*d)
          }
          return 0
        })
        .attr('height',function(d,i){
          return h*d
        })
        .attr('stroke','black')
        .attr('fill',function(d,i){
          if (i<data.length/2){
            return 'black'
          }
          return 'white'
        })
        dist = div.append('svg')
            .attr('width',100)
            .attr('height',h)
        scale =  d3.scaleLinear().domain([0,1]).range([0,h])
        button = d3.select('button')
        button.on('click',function(d){
          d3.selectAll('.figure'+head)
            .each(function(d){
              if (d3.select(this).classed('black')){
                // h-scale(d)
                var dist_h = d3.select(this).attr('y')
                 dist.append('rect')
                    .attr('width',0)
                    .attr('height',5)
                    .attr('x',0)
                    .attr('y',dist_h)
                    .attr('fill-opacity',0.2)
                    .attr('fill','black')
                    .transition()
                    .duration(500)
                    .attr('width',100)
                console.log(scale(d))}
              })
            .remove()
          head += 1
          svg.selectAll('.figure')
              .transition()
              .duration(100)
              .attr('x',function(d,i){
                  return parseInt(d3.select(this).attr('x')) + bar_width + padding
              })
          tail += 1
          draw_beta(a,b,1,function(data){
            data.push(1-data[0])
            svg.selectAll('.figure'+tail)
                .data(data)
                .enter()
                .append('rect')
                .attr('class', function(d,i){
                  if (i==0){
                    return "black figure figure"+tail
                  }
                  return "white figure figure"+tail
                })
                .attr('x',0)
                .attr('width',bar_width)
                .attr('y',function(d,i){
                  if (i == 0){
                    return h - (h*d)
                  }
                  return 0
                })
                .attr('height',function(d,i){
                  // console.log(d)
                  return h*d
                })
                .attr('stroke','black')
                .attr('fill',function(d,i){
                  if (i == 0){
                    return 'black'
                  }
                  return 'white'
                })
          })

        })
  })


})
