var request = require('request');
var options = require("../connect");
var common = require('../common');

exports.getPayments = (req, res, next) => {
  options.url = common.lnd_server_url + '/payments';
  console.log('Options URL: ' + JSON.stringify(options.url));
  request.get(options, (error, response, body) => {
    const body_str = (undefined === body) ? '' : JSON.stringify(body);
    const search_idx = (undefined === body) ? -1 : body_str.search('Not Found');
    console.log("Payment Request Decoded Received: " + body_str);
    if(undefined === body || search_idx > -1 || body.error) {
      res.status(500).json({
        message: "Payments List Failed!",
        error: (undefined === body || search_idx > -1) ? 'Error From Server!' : body.error
      });
    } else {
      body.payments.forEach(payment => {
        payment.creation_date_str =  (undefined === payment.creation_date) ? '' : common.convertTimestampToDate(payment.creation_date);
      });
      res.status(200).json(body.payments);
    }
  });
};
