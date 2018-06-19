/*
* author: "oujizeng",
* license: "MIT",
* github: "https://github.com/yangyuji/hammer-swipe-delete",
* name: "hammerSwipeDelete.js",
* version: "1.0.0"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if ( typeof define == 'function' && define.amd ) {
        define( function () { return factory(); } );
    } else {
        root['hammerSwipeDelete'] = factory();
    }
}(this, function () {
    'use strict'

    var _translate = function (el, attr, val) {
        var vendors = ['', 'Webkit', 'ms', 'Moz', 'O'],
            body = document.body || document.documentElement;

        [].forEach.call(vendors, function (vendor) {
            var styleAttr = vendor ? vendor + attr : attr.charAt(0).toLowerCase() + attr.substr(1);
            if (typeof body.style[styleAttr] === 'string') {
                el.style[styleAttr] = val;
            }
        });
    };

    var hammerSwipeDelete = {

        init: function(opt) {

            var moveCount = opt.moveCount || 80,            // 位移距离
                container = document.querySelectorAll(opt.container),  // 容器
                classTag = opt.container.substr(1);

            if (!container || container.length < 1) return;

            for (var i = 0; i < container.length; i++) {

                // 补充操作按钮
                for (var n = 0; n < opt.buttons.length; n++) {
                    var btn = document.createElement('div');
                    btn.textContent = opt.buttons[n].text;
                    btn.classList.add(opt.buttons[n].class);
                    btn.addEventListener('click', opt.buttons[n].click || null, false);
                    container[i].appendChild(btn);
                }

                // 开启硬件加速
                _translate(container[i], 'transform', 'translateZ(0)');

                var hammer = new Hammer(container[i]);
                hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
                hammer.on('swipe swipeleft swiperight', function(ev) {

                    var target = ev.target;

                    var el = null;
                    // 获取标记的元素
                    if (target.classList.contains(classTag)) {
                        el = target;
                    }
                    // 查找元素
                    while(target && el == null) {
                        if (target.classList.contains(classTag)) {
                            el = target;
                        } else {
                            target = target.parentNode;
                        }
                    }
                    if (!el) {
                        return;
                    }

                    // 向右滑动一屏
                    if (ev.type == 'swiperight') {
                        if (el.classList.contains('move-out-click')) {
                            _translate(el, 'transitionDuration', '200ms');
                            _translate(el, 'transform', 'translateX(0px)');
                            el.classList.remove('move-out-click');
                        }
                    }

                    // 向左滑动一屏
                    if (ev.type == 'swipeleft') {
                        console.log('swipeleft', el);
                        if (!el.classList.contains('move-out-click')) {
                            _translate(el, 'transitionDuration', '200ms');
                            _translate(el, 'transform', 'translateX(' + -moveCount + 'px)');
                            el.classList.add('move-out-click');
                        }
                    }

                    if (ev.type === 'swipe') {
                        // 关闭其他项的按钮，也可以放在滑动结束
                        for (var ii = 0; ii < container.length; ii++) {
                            if (container[ii].classList.contains('move-out-click') && container[ii] != el) {
                                // 动画慢一点，避免卡帧
                                _translate(container[ii], 'transitionDuration', '200ms');
                                _translate(container[ii], 'transform', 'translateX(0px)');
                                container[ii].classList.remove('move-out-click');
                            }
                        }
                    }
                });
            }
        }
    };

    return hammerSwipeDelete;
}));