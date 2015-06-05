var hs = require('hyperstream')
var t = require('../../templates')
var templates = require('../../templates')

module.exports = function (req, res) {	
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  t('/layout.html').pipe(hs({
    'title': 'Transmission Arts Artist Index',
    '.head': t('/ta/head.html'),
    '.nav': t('/ta/nav.html'),
    '.listen': templates('/listen.html'),
    '.main': t('/ta/artist-index.html')
  })).pipe(res)
}
