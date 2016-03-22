;(function ($) {
  var querystring = location.search.substr(1);
  var query = $.deparam(querystring);
  $('#archive-search #q2').val(query.q);
  $('#archive-search #date').val(query.date);
  $('#archive-search #date2').val(query.date2);
  $('#archive-search #types').val(query.types);
  $('#archive-search #sites').val(query.sites);
  $('#archive-search #sort').val(query.sort);

  var template, data;
  var resultsDiv = $('#results');

  function renderResults () {
    if (!template || !data) return;
    $('#summary').html('<b>' + data.total + '</b> items.');
    data.hits.forEach(function (hit) {
      hit.when = when(hit);
      hit.desc = hit.description || hit.briefDescription || hit.longDescription || '';
      hit.desc = hit.desc.replace(/<[^>]*>/g, '')
      hit.itemUrl = itemUrl(hit);
      if (hit.desc.length > 160) hit.desc = hit.desc.substr(0, 160) + '...';
      //console.log(hit);
      resultsDiv.append(Mustache.render(template, hit));
    });

    query.from = (query.from && 10 + query.from) || 10;
    if (data.total > query.from) {
      var moreButton = $('#more');
      moreButton.one('click', function (e) {
        e.preventDefault();
        $.ajax({
          url: '/api/search',
          data: $.param(query),
          success: function (d) {
            data = d;
            renderResults();
          }
        });
      });
      moreButton.show();
    } else {
      var moreButton = $('#more');
      moreButton.hide();
    }
  }

  $.get('/templates/search-result.html', function (t) {
    template = t;
    renderResults();
  });

  // stuff sites and type into q if they are present
  if (query.sites) {  	
  	query.q = query.q + ' sites:'+query.sites
  }
  if (query.types) {  	
  	query.q = query.q + ' type:'+query.types
  }
  
  //console.log($.param(query))
  
  $.ajax({
    url: '/api/search',
    //data: querystring,
    data: $.param(query),
    success: function (d) {
      data = d;
      renderResults();
    }
  });
})(jQuery);
