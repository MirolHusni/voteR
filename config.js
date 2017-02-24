const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  port: isProduction ? process.env.PORT : 3000,
  database: isProduction ? 'mongodb://'+process.env.username+':'+process.env.password+'@ds161109.mlab.com:61109/voter' : 'mongodb://'+process.env.testuser+':'+process.env.testpass+'@ds153699.mlab.com:53699/justtest',
}
