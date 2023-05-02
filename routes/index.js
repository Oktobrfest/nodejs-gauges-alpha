let express = require('express');
let router = express.Router();
var moment = require('moment'); // require
moment().format();


// postgres connection
const { Pool } = require('pg');
const pgClient = new Pool({
  user: 'xxxx',
  host: 'xx.xx.xx.xx',
  database: 'xxx',
  password: 'xxx',
  port: #####
})
pgClient.connect()

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express' });
});

//l new page DT
router.get('/gauges', function (req, res, next) {
  res.render('test1/gauges', { title: 'Express' });
});

// api stuffs- graph/home
router.get('/history', getHistory, function (req, res, next) {
  res.json(res.chartData);
});

// moisture
router.get('/moisture', getMoisture, function (req, res, next) {
  res.json(res.moistureChartData);
});

// action logs page
router.get('/logs', getLogs, function (req, res, next) {
  res.json(res.logs);
});
let logs = [];
// logs function
function getLogs(req, res, next) {
  const fstart = req.query.start; // make isRunning an integer greater than todays date (2030 or someshit) so it filters properly else 0
  const ffinish = req.query.finish;
  const fdesc = req.query.desc;
  const fkey = req.query.key;
  var nowRunning = req.query.running;
  const excludedStringList = req.query.hidelame;
  var excludedList = excludedStringList.split(',');
  //   console.log("Excluded List (array):" + excludedList);
  console.log(excludedList);
  // filter key options
  let qkey = '';
  if (fkey == "Analog") {
    qkey = "(lkey BETWEEN 2000 AND 30000)"
  }
  else if (fkey == "Digital") {
    qkey = "(lkey BETWEEN 0 AND 999)"
  }
  else if (fkey == "Climate") {
    qkey = "(lkey BETWEEN 30000 AND 99999)"
  }
  else { qkey = "lkey > 0" };
  // start/finish query
  let qtimes = "";
  if (nowRunning === "true") {
    qtimes = 'ufinish = 0';
  }
  else {
    qtimes = '((ustart between ' + fstart + ' and ' + ffinish + ') OR (ufinish BETWEEN ' + fstart + ' AND ' + ffinish + ') OR (ustart < ' + fstart + ' AND ufinish > ' + ffinish + '))'
      ;
  };
  // hide excluded List Actions
  // default excluded actions: 153, 154, 
  let qExcluded = "";
  if (excludedList[0] !== "") {
    if (excludedList.length == 1) {
      qExcluded = "AND lkey != " + excludedList[0];
    } else if (excludedList.length > 1) {
      qExcluded = "AND (";
      for (var i = 0, len = excludedList.length; i < len; i++) {
        qExcluded = qExcluded + "(lkey != " + excludedList[i] + ")";
        var lengthTest = excludedList.length - 1;
        if (i < lengthTest) {
          qExcluded = qExcluded + " AND ";
        };
      };
      qExcluded = qExcluded + ")";
    };
  };
  // description filter
  var descKey = parseInt(fdesc);
  let qdesc = "";
  if (isNaN(descKey)) {
    qdesc = " AND descr LIKE '%" + fdesc + "%'";
    console.log('qdesc is true' + qdesc);
  }
  else {
    qdesc = " AND lkey =" + descKey;
    console.log('qdesc is false' + qdesc);
  };
  const queryText = ({
    text: 'select DISTINCT ustart, ufinish, descr, lkey from public.elogs where ' + qkey + ' and ' + qtimes + qdesc + qExcluded + " order by ustart desc limit 25;"
  });
  console.log(queryText);
  pgClient.query(queryText)
    .then(res => {
      logs = res.rows;
      pushlogs(logs);

    })
    .catch(e => {
      console.error(e.stack);
      next(e);
    })
  // send the logs to the FE
  const pushlogs = function (logs) {
    res.logs = logs;
    next();
  };
};


// home page graph function
function getHistory(req, res, next) {
  const stTime = req.query.startTime; //1601618146562;
  const endTime = req.query.endTime; //1601618503117;
  const sensorType = req.query.sensor;
  const loc = req.query.loc;
  const queryText = ({
    // rowMode: 'array',' AND sensor=' + sensorType + 
    text: 'select reading, utime from public.sensors where utime >= ' + stTime + ' AND utime <= ' + endTime + " AND sensor='" + sensorType + "' AND loc='" + loc + "' order by utime;"
  });
  pgClient.query(queryText)
    .then(res => processReadings(res.rows))
    .catch(e => {
      console.error(e.stack);
      next(e);
    });
  function processReadings(rows) {
    var labels = [];
    var data = [];
    for (var reading in rows) {
      // convert it first
      var dateString = moment.unix((rows[reading].utime / 1000)).format('llll');   //.format("MM/DD/YYYY   HH:MM:SS");
      labels.push(dateString);
      data.push(rows[reading].reading);
    }
    var result = {
      labels: labels,
      datasets: [{
        label: loc + " " + sensorType,
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1
      }]
    }
    res.chartData = result;
    next();
  }
}
var m12result = {};
var m13result = {};
var comboData = [];
// moisture chart data
// home page graph function
function getMoisture(req, res, next) {
  const mStartTime = req.query.mStartTime; //1601618146562;
  const mEndTime = req.query.mEndTime; //1601618503117;

  const snsr12queryText = ({
    // rowMode: 'array',' AND sensor=' + sensorType + 
    text: 'select reading, utime from public.sensors where utime >= ' + mStartTime + ' AND utime <= ' + mEndTime + " AND sensor='soil_moisture_12' order by utime;"
  });
  pgClient.query(snsr12queryText)
    .then(res => sqlSensor12(res.rows))
    .catch(e => {
      console.error(e.stack);
      next(e);
    });
  function sqlSensor12(rows) {
    var labels = [];
    var data = [];
    for (var reading in rows) {
      // convert it first
      var m12dateString = moment.unix((rows[reading].utime / 1000)).format('llll');   //.format("MM/DD/YYYY   HH:MM:SS");
      labels.push(m12dateString);
      data.push(rows[reading].reading);
    }
    m12result = {
      labels: labels,
      datasets: [{
        label: "Soil M snsr 12",
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1
      }]
    }
    querySqlSensor13(mStartTime, mEndTime, m12result);
    return m12result;

  }
  // start getting data for sensor 13
  const querySqlSensor13 = (mStartTime, mEndTime, m12result) => {
    const snsr13queryText = ({
      // rowMode: 'array',' AND sensor=' + sensorType + 
      text: 'select reading, utime from public.sensors where utime >= ' + mStartTime + ' AND utime <= ' + mEndTime + " AND sensor='soil_moisture_13' order by utime;"
    });
    pgClient.query(snsr13queryText)
      .then(res => FormatSqlSensor13(res.rows))
      .catch(e => {
        console.error(e.stack);
        next(e);
      });
    function FormatSqlSensor13(rows) {
      var labels = [];
      var data = [];
      for (var reading in rows) {
        // convert it first
        var m13dateString = moment.unix((rows[reading].utime / 1000)).format('llll');   //.format("MM/DD/YYYY   HH:MM:SS");
        labels.push(m13dateString);
        data.push(rows[reading].reading);
      }
      m13result = {
        labels: labels,
        datasets: [{
          label: "Soil M snsr 12",
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      }
      transmitData(m12result,m13result);
      console.log(m13result.datasets[0].data);
      return m13result;
      
    }
  }
  var transmitData = (m12result,m13result) => {
//console.log(m13result.datasets[0].data);
    
    // raw data attempt
    var m12data = m12result.datasets[0].data;
    var m12times = m12result.labels;
    var m13data = m13result.datasets[0].data;
    var m13times = m13result.labels;

    var raw = [{m12data, m12times}, {m13data, m13times}];
  res.moistureChartData = raw;
  next();
  }  
}

module.exports = router;