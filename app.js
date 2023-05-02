#!/usr/bin/env node
// Load OPCUA module
const opcua = require("node-opcua");

let debug = require('debug')('opcua:server');
let http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Routers
var indexRouter = require('./routes/index');
// Express
var app = express();
// Middleware binds
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Path Bind
app.use('/', indexRouter);

// My Variables
let element = {};

// PLC/OPCUA Endpoint URL
const endpointUrl = "opc.tcp://xxxx.xxxx.com:4840";
const client = opcua.OPCUAClient.create({
  endpoint_must_exist: false,
  clientName: "xxxxxxxx",
  securityPolicy: "http://opcfoundation.org/UA/SecurityPolicy#Basic256",
  securityMode: 2
});
// Credentials
let UserIdentityInfo = {
  type: 1,
  password: "xxxxx",
  userName: "xxxx"
};
// Connect failure
client.on("backoff", (retry, delay) =>
  console.log("still trying to connect to ", endpointUrl, ": retry =", retry, "next attempt in ", delay / 1000, "seconds")
);
let opcua_session;
// Connect to OPCUA server and create a session (authentication required)
client.connect(endpointUrl, function (err) {
  if (err) {
    console.log("cannot connect to endpoint:", endpointUrl);
  } else {
    console.log("connected!");
    client.createSession(UserIdentityInfo, function (err, session) {
      if (err) {
        return next(err);
      }
      console.log("session created!");
      opcua_session = session;
      // Start the interval
      queryPlcSensors();
      //queryPlcLogs();
      alogs();
    });
  }
});


// postgres connection
const { Pool } = require('pg');
const { AsymmetricAlgorithmSecurityHeader } = require("node-opcua");
const { Int } = require("mssql");
const pgClient = new Pool({
  user: 'xxxx',
  host: 'xxx.xx.xx.xx',
  database: 'xxx',
  password: 'xxxxx',
  port: xxxx
})
pgClient.connect()

// first declare the plc local copy log
let plcLog1 = { started: 0, finished: "", key: "", descr: "" };
let plcLog2 = { started: 0, finished: "", key: "", descr: "" };
let plcLog3 = { started: 0, finished: "", key: "", descr: "" };
let plcLog4 = { started: 0, finished: "", key: "", descr: "" };
let plcLog5 = { started: 0, finished: "", key: "", descr: "" };
let plcLog6 = { started: 0, finished: "", key: "", descr: "" };
let sql_finish = 0;
// action logs (alogs())
function alogs() {
  setInterval(function () {
    const maxAge = 0;
    const sensorsToRead = [
      {
        id: "log1started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[1].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log1key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[1].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log1finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[1].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log1descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[1].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log2started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[2].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log2key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[2].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log2finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[2].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log2descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[2].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }
      , {
        id: "log3started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[3].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log3key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[3].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log3finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[3].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log3descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[3].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }
      , {
        id: "log4started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[4].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log4key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[4].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log4finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[4].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log4descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[4].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log5started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[5].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log5key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[5].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log5finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[5].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log5descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[5].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log6started",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[6].\"UnixStarted\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log6key",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[6].\"L\".\"Key\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log6finished",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[6].\"UnixFinished\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log6descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[6].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }, {
        id: "log6descr",
        nodeId: "ns=3;s=\"RunActions_DB\".\"L\"[6].\"Description\"",
        attributeId: opcua.AttributeIds.Value,
      }
    ];


    // query PLC and put the data into the localTestLog
    for (const nodeToRead of sensorsToRead) {
      opcua_session.read(nodeToRead, maxAge, function (err, dataValue) {
        if (!err) {
          // place values into the object
          if (nodeToRead.id == "log1started") {
            plcLog1.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log1key") {
            plcLog1.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log1finished") {
            plcLog1.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log1descr") {
            plcLog1.descr = dataValue.value.value;
          }
          else if (nodeToRead.id == "log2started") {
            plcLog2.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log2key") {
            plcLog2.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log2finished") {
            plcLog2.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log2descr") {
            plcLog2.descr = dataValue.value.value;
          }
          else if (nodeToRead.id == "log3started") {
            plcLog3.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log3key") {
            plcLog3.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log3finished") {
            plcLog3.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log3descr") {
            plcLog3.descr = dataValue.value.value;
          }
          else if (nodeToRead.id == "log4started") {
            plcLog4.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log4key") {
            plcLog4.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log4finished") {
            plcLog4.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log4descr") {
            plcLog4.descr = dataValue.value.value;
          }
          else if (nodeToRead.id == "log5started") {
            plcLog5.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log5key") {
            plcLog5.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log5finished") {
            plcLog5.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log5descr") {
            plcLog5.descr = dataValue.value.value;
          }
          else if (nodeToRead.id == "log6started") {
            plcLog6.started = dataValue.value.value;
          }
          else if (nodeToRead.id == "log6key") {
            plcLog6.key = dataValue.value.value;
          }
          else if (nodeToRead.id == "log6finished") {
            plcLog6.finished = dataValue.value.value;
          }
          else if (nodeToRead.id == "log6descr") {
            plcLog6.descr = dataValue.value.value;
          }
        };
      })
    }
    let why = 1;
    // see if testlog is in sql already - Log#1 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog1.started + " AND lkey = " + plcLog1.key + " order by ufinish desc limit 1;")
      .then(res => {
               if (res.rows[0].ufinish !== plcLog1.finished) {
                    pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog1.finished + " where ustart = " + plcLog1.started + " AND lkey = " + plcLog1.key + ";")
            .then(res => {
                         })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog1.started + ", " + plcLog1.finished + ", " + plcLog1.key + ", \'" + plcLog1.descr + "\');")
          .then(res => res)
          .catch(e => why = 1)
      }
      )
    // see if testlog is in sql already - Log#2 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog2.started + " AND lkey = " + plcLog2.key + " order by ufinish desc limit 1;")
      .then(res => {
        if (res.rows[0].ufinish !== plcLog2.finished) {         
          pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog2.finished + " where ustart = " + plcLog2.started + " AND lkey = " + plcLog2.key + ";")
            .then(res => {       
            })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog2.started + ", " + plcLog2.finished + ", " + plcLog2.key + ", \'" + plcLog2.descr + "\');")
          .then(res => res)
          .catch(e => why = 1);        
      }
      )
    // see if testlog is in sql already - Log#3 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog3.started + " AND lkey = " + plcLog3.key + " order by ufinish desc limit 1;")
      .then(res => {
               if (res.rows[0].ufinish !== plcLog3.finished) {         
          pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog3.finished + " where ustart = " + plcLog3.started + " AND lkey = " + plcLog3.key + ";")
            .then(res => {
              console.log("updating finish time succeeded!");
            })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog3.started + ", " + plcLog3.finished + ", " + plcLog3.key + ", \'" + plcLog3.descr + "\');")
          .then(res => res)
          .catch(e => console.error(e.stack));
        
      }
      )
    //     see if testlog is in sql already - Log#4 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog4.started + " AND lkey = " + plcLog4.key + " order by ufinish desc limit 1;")
      .then(res => {
        // console.log("SQL ufinish time for log 4 is: " + res.rows[0].ufinish + "  PLCs finish time is: " + plcLog4.finished + "  ; if these match- no action is taken");
        if (res.rows[0].ufinish !== plcLog4.finished) {
          //    console.log("update finish time!");
          pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog4.finished + " where ustart = " + plcLog4.started + " AND lkey = " + plcLog4.key + ";")
            .then(res => {
              //      console.log("updating finish time succeeded!");
            })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog4.started + ", " + plcLog4.finished + ", " + plcLog4.key + ", \'" + plcLog4.descr + "\');")
          .then(res => res)
          .catch(e => why = 1);
        // console.log("enter plc log into sql!")
      }
      )
    // see if testlog is in sql already - Log#5 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog5.started + " AND lkey = " + plcLog5.key + " order by ufinish desc limit 1;")
      .then(res => {
        if (res.rows[0].ufinish !== plcLog5.finished) {
         
          pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog5.finished + " where ustart = " + plcLog5.started + " AND lkey = " + plcLog5.key + ";")
            .then(res => {
              //    console.log("updating finish time succeeded!");
            })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog5.started + ", " + plcLog5.finished + ", " + plcLog5.key + ", \'" + plcLog5.descr + "\');")
          .then(res => res)
          .catch(e => why = 1);
        // console.log("enter plc log into sql!")
      }
      )
    // see if testlog is in sql already - Log#6 mirroring
    pgClient.query("SELECT ufinish FROM public.elogs WHERE ustart = " + plcLog6.started + " AND lkey = " + plcLog6.key + " order by ufinish desc limit 1;")
      .then(res => {
        if (res.rows[0].ufinish !== plcLog6.finished) {
         
          pgClient.query("UPDATE public.elogs SET ufinish = " + plcLog6.finished + " where ustart = " + plcLog6.started + " AND lkey = " + plcLog6.key + ";")
            .then(res => {
              //   console.log("updating finish time succeeded!");
            })
            .catch(e => why = 1);
        }
      })
      .catch(e => {
        pgClient.query("INSERT INTO public.elogs (ustart, ufinish, lkey, descr) VALUES (" + plcLog6.started + ", " + plcLog6.finished + ", " + plcLog6.key + ", \'" + plcLog6.descr + "\');")
          .then(res => res)
          .catch(e => why = 1);
        
      }
      )

  }, 60000);
};
/**
 * Query PLC Sensors
 */
function queryPlcSensors() {
  setInterval(function () {
    const maxAge = 0;
    const sensorsToRead = [
      {
        id: "flowerTemp",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[2].\"P\"[0].\"CCElement\"[1].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " F",
        title: "Flower Room Temp",
        maxVal: 160,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 60
          },
          {
            color: "#ffff00",
            lo: 61,
            hi: 72
          },
          {
            color: "#40ff00",
            lo: 73,
            hi: 89
          },
          {
            color: "#ffff00",
            lo: 90,
            hi: 98
          },
          {
            color: "#ff0000",
            lo: 99,
            hi: 200
          }
          ]
        },
      },
      {
        id: "VegTemp",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[1].\"P\"[0].\"CCElement\"[1].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " F",
        title: "Veg Room Temp",
        maxVal: 160,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 50
          },
          {
            color: "#ffff00",
            lo: 51,
            hi: 63
          },
          {
            color: "#40ff00",
            lo: 64,
            hi: 90
          },
          {
            color: "#ffff00",
            lo: 91,
            hi: 100
          },
          {
            color: "#ff0000",
            lo: 101,
            hi: 200
          }
          ]
        },
      }, {
        id: "cureHumidity",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[3].\"P\"[0].\"CCElement\"[3].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: "%",
        title: "Cure Room Humidity",
        maxVal: 100,
        customSectors: {
          percents: true, // lo and hi values are in %
          ranges: [{
            color: "#43bf58",
            lo: 0,
            hi: 44
          },
          {
            color: "#40ff00",
            lo: 45,
            hi: 62
          },
          {
            color: "#ff3b30",
            lo: 63,
            hi: 100
          }]
        },
      }, {
        id: "cureTemp",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[3].\"P\"[0].\"CCElement\"[1].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " F",
        title: "Cure Room Temp",
        maxVal: 160,
        customSectors: {
          percents: true, // lo and hi values are in %
          ranges: [{
            color: "#43bf58",
            lo: 0,
            hi: 44
          },
          {
            color: "#40ff00",
            lo: 60,
            hi: 69
          },
          {
            color: "#ff3b30",
            lo: 70,
            hi: 100
          }]
        },
      }, {
        id: "vegHumidity",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[1].\"P\"[0].\"CCElement\"[3].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: "%",
        title: "Veg Room Humidity",
        maxVal: 100,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 10
          },
          {
            color: "#ffff00",
            lo: 11,
            hi: 19
          },
          {
            color: "#40ff00",
            lo: 20,
            hi: 75
          },
          {
            color: "#ffff00",
            lo: 76,
            hi: 80
          },
          {
            color: "#ff0000",
            lo: 81,
            hi: 100
          }
          ]
        },
      }, {
        id: "flowerHumidity",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[2].\"P\"[0].\"CCElement\"[3].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: "%",
        title: "Flower Room Humidity",
        maxVal: 100,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 10
          },
          {
            color: "#ffff00",
            lo: 11,
            hi: 19
          },
          {
            color: "#40ff00",
            lo: 20,
            hi: 65
          },
          {
            color: "#ffff00",
            lo: 66,
            hi: 80
          },
          {
            color: "#ff0000",
            lo: 81,
            hi: 100
          }
          ]
        },
      }, {
        id: "greenhouseAmps",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[2].\"P\"[0].\"CCElement\"[5].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " amps",
        title: "Greenhouse Power",
        maxVal: 200,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 9
          },
          {
            color: "#ffff00",
            lo: 10,
            hi: 11
          },
          {
            color: "#40ff00",
            lo: 12,
            hi: 145
          },
          {
            color: "#ffff00",
            lo: 146,
            hi: 159
          },
          {
            color: "#ff0000",
            lo: 160,
            hi: 200
          }
          ]
        },
      }, {
        id: "flowerPar",
        nodeId: "ns=3;s=\"ClimateSettingsDB\".\"facility\"[2].\"P\"[0].\"CCElement\"[6].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " PAR",
        title: "Flower Room PAR",
        maxVal: 2000,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 25
          },
          {
            color: "#1a6600",
            lo: 26,
            hi: 300
          },
          {
            color: "#2db300",
            lo: 301,
            hi: 500
          },
          {
            color: "#40ff00",
            lo: 501,
            hi: 2000
          }
          ]
        },
      }, {
        id: "tank_2ppm",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[2,0].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " ppm",
        title: "Tank 2 ppm",
        maxVal: 3000,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff8000",
            lo: 0,
            hi: 400
          },
          {
            color: "#208000",
            lo: 401,
            hi: 700
          },
          {
            color: "#40ff00",
            lo: 701,
            hi: 1900
          },
          {
            color: "#ffff00",
            lo: 1901,
            hi: 2500
          },
          {
            color: "	#ff0000",
            lo: 2501,
            hi: 5000
          }
          ]
        },
      }, {
        id: "tank_2ph",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[2,2].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " ph",
        title: "Tank 2 pH",
        maxVal: 14.0,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 5.0
          },
          {
            color: "#ff8000",
            lo: 5.1,
            hi: 5.5
          },
          {
            color: "#40ff00",
            lo: 5.6,
            hi: 6.9
          },
          {
            color: "#ff8000",
            lo: 7.0,
            hi: 7.5
          },
          {
            color: "#ff0000",
            lo: 7.6,
            hi: 15
          }
          ]
        },
      }, {
        id: "tank_2gallons",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[2,4].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " gal.",
        title: "Tank 2 Water Level",
        maxVal: 725,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 80
          },
          {
            color: "#ffff00",
            lo: 81,
            hi: 84
          },
          {
            color: "#40ff00",
            lo: 85,
            hi: 695
          },
          {
            color: "#ff0000",
            lo: 696,
            hi: 800
          }
          ]
        },
      }, {
        id: "tank_1gallons",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[1,4].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " gal.",
        title: "RO Tank Water Level",
        maxVal: 5000,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 400
          },
          {
            color: "#ffff00",
            lo: 401,
            hi: 2200
          },
          {
            color: "#40ff00",
            lo: 2201,
            hi: 5100
          }
          ]
        },
      }, {
        id: "tank_1temp",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[1,6].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " F",
        title: "RO Tank Temperature",
        maxVal: 110,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 39
          },
          {
            color: "#ff8000",
            lo: 40,
            hi: 50
          },
          {
            color: "#40ff00",
            lo: 51,
            hi: 79
          },
          {
            color: "#ff8000",
            lo: 80,
            hi: 84
          },
          {
            color: "#ff0000",
            lo: 85,
            hi: 222
          }
          ]
        },
      }, {
        id: "pump2rpm",
        nodeId: "ns=3;s=\"g120Read\".\"ParaAdress\".\"Number\"[0].\"VALUE\"",
        attributeId: opcua.AttributeIds.Value,
        units: " RPMs",
        title: "Pump 2 Speed",
        maxVal: 3600,
        customSectors: {
          percents: true, // lo and hi values are in %
          ranges: [{
            color: "#80ff00",
            lo: 0,
            hi: 30
          },
          {
            color: "#00ff40",
            lo: 31,
            hi: 62
          },
          {
            color: "#80ff00",
            lo: 63,
            hi: 100
          }]
        },
      }, {
        id: "pump2kw",
        nodeId: "ns=3;s=\"g120Read\".\"ParaAdress\".\"Number\"[13].\"VALUE\"",
        attributeId: opcua.AttributeIds.Value,
        units: " kW",
        title: "Pump 2 Power",
        maxVal: 1.5,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#40ff00",
            lo: 0,
            hi: 1.3
          },
          {
            color: "#ff0000",
            lo: 1.4,
            hi: 3
          }]
        },
      }, {
        id: "pump2psi",
        nodeId: "ns=3;s=\"Select_PumpPrefsForDisplay_DB\".\"psi\"",
        attributeId: opcua.AttributeIds.Value,
        units: " psi",
        title: "Pump 2 Pressure",
        maxVal: 90,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#40ff00",
            lo: 0,
            hi: 80
          },
          {
            color: "#80ff00",
            lo: 85,
            hi: 111
          }]
        },
      }, {
        id: "soilmoisture12",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[5,2].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " %",
        title: "Soil Moisture Snsr 12",
        maxVal: 100,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 15
          },
          {
            color: "#ffff00",
            lo: 16,
            hi: 20
          },
          {
            color: "#00ff00",
            lo: 21,
            hi: 100
          }]
        },
       }, {
        id: "soilmoisture13",
        nodeId: "ns=3;s=\"A_Elements_DB\".\"aT,E\"[5,3].\"InptSensorFinalReading\"",
        attributeId: opcua.AttributeIds.Value,
        units: " %",
        title: "Soil Moisture Snsr 13",
        maxVal: 100,
        customSectors: {
          percents: false, // lo and hi values are in %
          ranges: [{
            color: "#ff0000",
            lo: 0,
            hi: 15
          },
          {
            color: "#ffff00",
            lo: 16,
            hi: 20
          },
          {
            color: "#00ff00",
            lo: 21,
            hi: 100
          }]
        },
      }

    ]

    for (const nodeToRead of sensorsToRead) {
      opcua_session.read(nodeToRead, maxAge, function (err, dataValue) {
        if (!err) {
            let ts = Date.now();
          if (nodeToRead.title == "Cure Room Humidity") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'cure', 'humidity'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Cure Room Temp") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'cure', 'temp'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Veg Room Temp") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'veg', 'temp'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Veg Room Humidity") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'veg', 'humidity'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Flower Room Temp") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'temp'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Flower Room Humidity") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'humidity'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Greenhouse Power") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'power'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Flower Room PAR") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'par'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Tank 2 ppm") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'tank_2', 'ppm'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Tank 2 pH") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'tank_2', 'ph'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Tank 2 Water Level") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'tank_2', 'water_level'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "RO Tank Water Level") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'ro_tank', 'water_level'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "RO Tank Temperature") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'ro_tank', 'temp'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Pump 2 Speed") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'pump_2', 'rpm'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Pump 2 Power") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'pump_2', 'power'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => console)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Pump 2 Pressure") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'pump_2', 'psi'," + Number(dataValue.value.value).toFixed(2) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Soil Moisture Snsr 12") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'soil_moisture_12'," + Number(dataValue.value.value).toFixed(1) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }
          else if (nodeToRead.title == "Soil Moisture Snsr 13") {
            pgClient.query("INSERT INTO public.sensors (utime, loc, sensor, reading) VALUES (" + ts + ", 'flower', 'soil_moisture_13'," + Number(dataValue.value.value).toFixed(1) + ");")
              .then(res => res)
              .catch(e => console.error(e.stack));
          }

          // Send event with message "data" and body
          io.emit(
            "data",
            {
              id: nodeToRead.id,
              value: Number(dataValue.value.value).toFixed(2),
              units: nodeToRead.units,
              title: nodeToRead.title,
              maxVal: nodeToRead.maxVal,
              customSectors: nodeToRead.customSectors,
            }
          )
        };
      });
    }
  }, 30000);
}


function clear(readLog) {
  clearTimeout(readLog)
}
// /**
/**
 * Get port from environment and store in Express.
 */
// Port to host web server
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */
let server = http.createServer(app);
// Socket.io
let io = require('socket.io')(server);
// Handle incoming Socket Connections
io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : + addr.port;
 }


