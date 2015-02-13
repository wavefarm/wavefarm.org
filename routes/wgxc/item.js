var api = require('../../api')
var hs = require('hyperstream')
var t = require('../../templates')
var wgxc = require('../../lib/wgxc')

var idRe = /\/wgxc\/schedule\/(\w{6})/
var wgxcTypes = [
  'broadcast',
  'show'
]

module.exports = function (req, res) {
  var id = idRe.exec(req.url)[1]
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (wgxcTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    var datesDesc = wgxc.formatDates(item);
    
    var main = item.main;
    var show = '';
    
    if (item.type=='broadcast' && typeof(item.shows)!='undefined') {
    	show =  '<a href="/wgxc/schedule/'+item.shows[0].id+'">'+ item.shows[0].main +'</a>:&nbsp;';
    }
    
    var iconList = wgxc.getIconList(item);   
    var icons = '';
    for (i=0; i<iconList.length; i++) {
    	icons += '<img src="' + iconList[i] +'" />';
    }
    
    var detailDesc = '';
    if (typeof(item.credit)!='undefined')
    	detailDesc = item.credit;
    
 
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t('/wgxc/head.html'),
      '.nav': t('/wgxc/nav.html'),
      '.main': t('/wgxc/item.html').pipe(hs({
        '.item-main strong': show,
        '.item-main span.main': main,
        '.item-main span.icons': icons,
        //'.item-main-image': { src: imgSrc },
        '.item-dates strong': datesDesc,
        '.item-detail strong': detailDesc,
        '.description': item.description
      }))
    })).pipe(res)
  })
}
