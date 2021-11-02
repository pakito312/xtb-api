// Exemple adapté de la mise en route d'Express : 
// http://expressjs.com/fr/starter/hello-world.html

// var ssl = require('ssl')
var mode="demo";
var userId="12711683"
var password="Stankovicandreja1"
var host = 'wss://ws.xtb.com/demo'
var port = 5124
var streamSessionId=null
var stap=null
var socket=null
var subscription_key=null
var InstrumentIds_info=null
var symbol=null
var nbretrade=null
var oldnbre=0
var islogin=false
login();
function login() {
  stap=0;
    console.log('Start Connection')
     socket = new WebSocket(host);
    // s.addEventListener('open', function (event) {
    //   console.log(event)
    //   s.send('Coucou le serveur !');
    //  });
    socket.onopen = function(e) {
      parameters = {
        "command" : "login",
        "arguments" : {
            "userId": userId,
            "password": password
        }
    }
    packet =  JSON.stringify(parameters, null, 4)
    socket.send(packet)
    };
    
    socket.onmessage = function(event) {
      if(islogin){
        etorotrade()
      }else{
        var status=JSON.parse(event.data).status;
        streamSessionId=JSON.parse(event.data).streamSessionId
        if(status){
          $('.status').html('connecté')
          islogin=true
        }else{
          $('.status').html('non connecté')
      
        }

      }
      console.log(JSON.parse(event.data))
     
    };
    
    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        $('.status').html('non connecté')
        console.log('[close] Connection died');
      }
    };
    
    socket.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    };
}


  
  function gettrade(element) {
    stap=4;
    getSymbole(element.InstrumentID)
    var isbuy=element.Direction
    var params={
      "command": "tradeTransaction",
      "arguments":{
        "tradeTransInfo":{
            'cmd': (isbuy=='buy')?0:1,
            'customComment': null, 
            'expiration': new Date().getTime() + 60000 * 60 * 24 * 365, 
            'offset': 0,
            'order': 0,
            'price': element.Invested,
            'sl': 0.0,
            'symbol': symbol,
            'tp': 0.0,
            'type': 0,
            'volume': element.Invested,
          }
      }
       
    }
    params =  JSON.stringify(params, null, 4)
    socket.send(params)
  }

  function etorotrade() {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.etoro.com/sapi/trade-data-real/live/public/portfolios?cid=5987004&client_request_id=357b4bd5-8644-452e-b8a9-152bb94c55d8",
      "method": "GET",
    };
    
    
    
    $.ajax(settings).done(function (response) {
      AggregatedPositions=response.AggregatedPositions.length
      for (let index = 0; index < AggregatedPositions; index++) {
        const element = response.AggregatedPositions[index];
        if(AggregatedPositions>oldnbre || (oldnbre!=0 && AggregatedPositions<oldnbre))
          gettrade(element);
          oldnbre=AggregatedPositions;
        }
    });
  }

  function getSymbole(InstrumentIds) {

    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.etoro.com/sapi/instrumentsinfo/instruments/"+InstrumentIds+"?client_request_id=77ae5a09-9ac5-439d-8a9f-948b3e537b49",
      "method": "GET",
    };
    
      $.ajax(settings).done(function (response) {
       
        symbol=response.internalSymbolFull
      });
    
     
  }