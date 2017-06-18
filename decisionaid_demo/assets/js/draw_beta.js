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
      data = []
      for (d in response){
        b = {y:1 - response[d], h: response[d]}
        t  = {y:0, h:1 - response[d]}
        data.push([b,t])
      }
      callback(data)

    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });

  }
  var query = getUrlVars()
  a = query["a"] == null? 5: query["a"]
  b = query["b"] == null? 5: query["b"]
  n = query["n"] == null? 1: query["n"]
  var svgw = 1024
  var svgh = 768
  var padding = 15
  var main_padding = 30
  var margin = {top: 20, right: 0, bottom: 20, left: 0}
  var w = svgw
  var h = svgh - margin.top - margin.bottom
  var bar_width =  w/3 - 2*main_padding
  var waiting_area_width = w/3
  var div = d3.select('#sequence')

  var svg = div.append('svg')
                .attr('width',svgw)
                .attr('height',svgh)
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var number_of_waiting = 10
  var waiting_bar_width = waiting_area_width / number_of_waiting - padding
  var distribution = []
  // var waiting_area = svg.append('g')
  //    .attr('width',waiting_area_width)
  //    .attr('x',0)
  var member = []
  for (var i = 0;i <number_of_waiting;i++){
    member.push(i)
  }

  g.selectAll('.waiting')
      .data(member)
      .enter()
      .append('g')
      .attr('transform',function(d,i){
        return 'translate('+ (i*(waiting_bar_width+padding)) + ')'
      })
      .classed('waiting',true)
      .selectAll('rect')
      .data(["bottom","top"])
      .enter()
      .append('rect')
      .attr('class',function(d,i){
        return d
      })
      .attr('x', 0)
      .attr('width',waiting_bar_width)
      .attr('y',function(d,i){
        return (d == "top")? h*4/5: h
      })
      .attr('height',function(d,i){
        return (d == "top")? h*1/5: 0
      })
      .attr('fill',function(d,i){
        return (i == 0)? '#996699' : '#CCCCCC'
      })
      .attr('stroke',function(d,i){
        return (i == 0)? '#996699' : '#CCCCCC'
      })

  function add_waiting(){
    new_bar = g.insert('g',":first-child")
    .attr('transform',function(d,i){
      return 'translate(0)'
    })
    .classed('waiting',true)
    .selectAll('rect')
    .data(["bottom","top"])
    .enter()
    .append('rect')
    .attr('class',function(d,i){
      return d
    })
    .attr('x', 0)
    .attr('width',waiting_bar_width)
    .attr('y',function(d,i){
      return (d == "top")? h*4/5: h
    })
    .attr('height',function(d,i){
      return (d == "top")? h*1/5: 0
    })
    .attr('fill',function(d,i){
      return (i == 0)? '#996699' : '#CCCCCC'
    })
    .attr('stroke',function(d,i){
      return (i == 0)? '#996699' : '#CCCCCC'
    })


  }


  function pick_last_waiting(){
    x = d3.selectAll('.waiting')._groups[0]
    return x[x.length - 1]
  }
  function move_line(dur){
    g.selectAll('.waiting')
        .transition(Math.random())
        .duration(dur)
        .attr('transform',function(d,i){
          current_location =  d3.select(this).attr('transform').split('(')[1].slice(0, -1)
          return 'translate(' + (parseInt(current_location) + waiting_bar_width+padding)+')'
        })

  }

  button = d3.select('button')

  function transform_x(x){
    return 'translate('+x+')'
  }
  draw_one()
  function draw_one(){
    draw_beta(a,b,1,function(data){
      data = data[0]
      // console.log(stack(data))
      var target = g.select(pick_last_waiting)
          .attr('class',function(d){
            return "current"
          })
          .transition(Math.random())
          .duration(500)
          .attr('transform','translate(' + (w/2 - bar_width/2 + main_padding) + ')')
      target.select('.bottom')
            .attr('width',bar_width)
            .transition(Math.random())
            .duration(500)
            .attr('fill-opacity',0.3)
            .attr('stroke',0)
            .attr('height',h*data[0].h)
            .attr('y',h*data[0].y)
      target.select('.top')
        .attr('width',bar_width)
            .transition(Math.random())
            .duration(500)
            .attr('height',h*data[1].h)
            .attr('y',h*data[1].y)
    })
  }

  timewait = 500
  function animation(inter){
    move_line(inter)
    add_waiting()
    d3.select('.current').select('.top')
          .transition(Math.random())
          .duration(inter)
          .attr('height',0)
    d3.select('.current').select('.bottom')
          .transition(Math.random())
          .duration(inter*2)
          .attr('height',8)

          .attr('stroke',0)
    d3.select('.current')
        .transition(Math.random())
        .duration(inter*3)
        .attr('transform',transform_x(w-bar_width))
        draw_one()

  }
  var tim = d3.interval(function(elapsed) {
    animation(timewait)
  }, timewait*2);


  var y = d3.scaleLinear()
      .domain([1,0])
      .range([0,h])
  console.log(y(0.5))
  g.append("g")
    .attr("transform", "translate(" +( w/2 + .8*bar_width) + ",0)")
    .attr("class", "axis")
    .call(d3.axisLeft(y)
        .ticks(20, "s"));

// t.stop();
})
