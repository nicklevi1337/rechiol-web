if (typeof app !== 'object') var app = {};

app.genIco = function (ico) {
  var _t = this, selector = $(ico.selector);

  if (!_t.spriteSvg) _t['spriteSvg'] = $(ico.sprite);

  selector.each(function () {
    var $t = $(this),
    el = _t.spriteSvg.find('#' + $t.data('svg')),
    attr = el[0].attributes,
    temp = '<div class="data-svg">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg"';

    for (var i = 0; i < attr.length; i++) {
      temp += ' ' + (attr[i].name === 'id' ? 'class="svg_' + attr[i].value + '"' : attr[i].name + '="' + (attr[i].value) + '"');
    }

    temp += '>\n';

    for (l = 0; l < el[0].childNodes.length; l++) {
      var a = el[0].childNodes[l];
      if (a.nodeName !== '#text') {
        temp += '<' + a.nodeName;
        for (var j = 0; j < a.attributes.length; j++) {
          temp += ' ' + a.attributes[j].name + '="' + (a.attributes[j].value) + '"';
        }
        temp += '></' + a.nodeName + '>';
      }
    }

    temp += '\n</svg>\n</div>';

    if ($t.data('position') === 'a') {
      $t.append(temp);
    } else {
      $t.prepend(temp);
    }
  })
};

app.diagram = function (a, b) {
  var _t = this;
  _s = _t.diagDat;
  if (!_s) {
    _t['diagDat'] = {};
    _s = _t.diagDat;
    _s.box = $('.' + a.box);
    _s.osY = _s.box.find('.' + a.box + '--' + a.osY);
    _s.wrap = _s.box.find('.' + a.box + '--' + a.wrap);
  }

  if (!_s.width || _s.width !== _s.wrap.innerWidth()) {
    _s.width = _s.wrap.innerWidth();
    _s.osY.height(_s.width);
    _s.box.height(_s.width);
  }

  if (_t.deviceDB[_t.device] > 598) {
    _s.box.css('margin-top', '-' + _s.width + 'px');
  } else {
    _s.box.css('margin-top', 0);
  }
};

app.cdnInit = function () {
  if (!app.cdn) {
    var link = $('#cdnUrl').attr('src');
    if (link) app.cdn = link.replace('js/common.js', '');
  }
};

app.slider = function (db) {
  var _t = this, _s;

  if (!_t.sliderDat) _t.sliderDat = {};

  function initSlider(db) {
    _s = _t.sliderDat[db.name];

    if (!_s) {
      _t.sliderDat[db.name] = {};
      _s = _t.sliderDat[db.name];
      _s.wrap = $(db.wrap);
      _s.dom = _s.wrap.html();
      _s.slider = _s.wrap.find(db.box);
      _s.option = db.option ? db.option : {xs: {}};
      if (!_s.option.xs) _s.option['xs'] = {};

      var a = [];
      for (var key in _t.deviceDB) {
        if (_t.deviceDB.hasOwnProperty(key)) {
          if (!_s.option[key]) {
            a.push(key);
          } else {
            for (var i = 0; i < a.length; i++) {
              _s.option[a[i]] = _s.option[key];
            }
            a = [];
          }
        }
      }

      _s.def = undefined;
    }

    if (_s.def !== _s.option[_t.device]) {
      _s.def = _s.option[_t.device];
      if (typeof _s.slider.destroySlider === 'function') {
        _s.slider.destroySlider();
        _s.wrap.html(_s.dom);
        _s.slider = _s.wrap.find(db.box);
      }

      if (_s.def !== 'none') _s.slider.bxSlider(_s.def);
    }
  }

  if (!db.name || typeof db.name !== 'string') {
    for (var w in db) {
      if (db.hasOwnProperty(w)) {
        initSlider(db[w]);
      }
    }
  } else {
    initSlider(db);
  }

};

app.progress = function (selector, not) {
  selector = typeof selector.attr !== 'function' ? $(selector) : selector;
  selector.each(function () {
    var $t = $(this);
    if ($t.data('val')) {
      var text = $t.find('span'),
      val = $t.data('val'),
      width = $t.find('svg:not([class])').width(),
      graf = $t.find('.circle'),
      prog, num;
      if (!graf.data('dasharray')) graf.attr('data-dasharray', graf.attr('stroke-dasharray'));
      prog = width * graf.data('dasharray') / 164;
      num = (prog - ((prog * val) / 100));
      if (!not) {
        graf.attr({'stroke-dasharray': prog, 'stroke-dashoffset': prog});
        $t.animate(
        {outline: '0px'}, {
          duration: 1000,
          easing: 'linear',
          progress: function (e, p) {
            text.text(Math.round(val * p));
            graf.attr('stroke-dashoffset', prog - ((prog * val) / 100) * p);
          }
        });
      } else if (num !== +graf.attr('stroke-dashoffset')) {
        graf.attr({'stroke-dasharray': prog, 'stroke-dashoffset': num});
      }
    }
  });
};

app.scrollTo = function (el, indentation) {
  var _t = this,
  top = 0;
  if (el !== 0) {
    el = typeof el.attr === "function" ? el : $(el);
    if (el.length) top = el.offset().top + (isNaN(indentation) ? 0 : +indentation);
  }

  if (!_t.html) _t['html'] = $('html, body');
  _t.html.animate({scrollTop: top}, 1000)
};

app.init = function () {
  var _t = this,
  setting = {
    ico: {
      selector: '[data-svg]',
      sprite: '#sprite'
    },
    diagram: {
      box: 'changes__diagram',
      osY: 'osY',
      wrap: 'wrap',
      param: 'param',
      age: 'age',
      indent: 'indent',
      interval: [30, 60],
      step: 5
    },
    slider: {
      time: {
        name: 'time',
        box: '.time__slider',
        wrap: '.time__slider--wrap',
        option: {
          xs: {
            infiniteLoop: false,
            hideControlOnEnd: true
          }
        }
      },
      reviews: {
        name: 'reviews',
        box: '.reviews__slider',
        wrap: '.reviews__slider--wrap',
        option: {
          sm1: {
            slideWidth: 600,
            minSlides: 2,
            maxSlides: 4,
            moveSlides: 1
          },
          md: 'none'
        }
      }
    },
    progress: '[data-val]',
    butToForm: '.button:not(.form__button)'
  };

  _t.deviceDB = {
    xl: 1199,
    lg: 991,
    md1: 849,
    md: 767,
    sm1: 599,
    sm: 424,
    xs: 0
  };

  function device() {
    for (var key in _t.deviceDB) {
      if (_t.deviceDB.hasOwnProperty(key) && _t.deviceDB[key] < window.innerWidth) return key;
    }
  }


  _t.device = device();
  _t.progressBox = $(setting.progress);

  _t.cdnInit();
  _t.genIco(setting.ico);
  _t.diagram(setting.diagram, 1);

  $(setting.butToForm).on('touchend click', function (e) {
    e.preventDefault();
    _t.scrollTo('.form__wrap', -20);
  });

  $(window).on('load', function () {
    _t.slider(setting.slider);
  }).on('resize', function () {
    if (_t.device !== device()) {
      _t.device = device();
      _t.slider(setting.slider);
      _t.progress(_t.progressBox, 1);
    }
    _t.diagram(setting.diagram);
  }).on('scroll', function () {
    _t.progressBox.each(function () {
      var $t = $(this);
      if (window.innerHeight / 2 - this.getBoundingClientRect().top > 0 && !$t.hasClass('init')) {
        _t.progress($t);
        $t.addClass('init');
      }
    })
  });
};

$(function () {
  app.init();
});