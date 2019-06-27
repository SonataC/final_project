(function ($) {
    $.fn.countTo = function (options) {
        options = options || {};

        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof (settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof (settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,               // the number the element should start at
        to: 0,                 // the number the element should end at
        speed: 1000,           // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,           // the number of decimal places to show
        formatter: formatter,  // handler for formatting the value before rendering
        onUpdate: null,        // callback method for every time the element is updated
        onComplete: null       // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));

jQuery(function ($) {
    // custom formatting example
    $('.count-number').data('countToOptions', {
        formatter: function (value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
});

$(function() {
    var scrollActions = {
        progressBars: false,
        // runningNumbers: false
    };
    $(window).on('scroll', function (e) {
        var _this = $(this);
        var scrolledTop = _this.scrollTop();

        if (scrolledTop + _this.outerHeight() >= $("#progress_bars").offset().top
            && !scrollActions.progressBars
        ) {
            startProgressBarsAnimation();
            scrollActions.progressBars = true;
        }

        // if (scrolledTop + _this.outerHeight() >= $("#running_numbers").offset().top
        //     && !scrollActions.runningNumbers
        // ) {
        //     startRunningNumbersAnimation();
        //     scrollActions.runningNumbers = true;
        // }
    });

    // jQuery example
    // $('.progress-bar').each(function () {
    //     var elm = $(this);
    //
    //     setTimeout(function () {
    //         elm.animate({width:  parseFloat(elm.data('percentage')) + "%"}, 500);
    //     }, 3000);
    // });

    // Plain JS
    function startProgressBarsAnimation() {
        var elements = document.getElementsByClassName('progress-bar');
        for (var i = 0; i < elements.length; i++) {
            var elm = elements[i];
            handleText(elm, true);
            addInterval(elm);
        }
    }

    // function startRunningNumbersAnimation() {
    //     var elements = document.getElementsByClassName('running-numbers');
    //     for (var i = 0; i < elements.length; i++) {
    //         var elm = elements[i];
    //         handleText(elm, true);
    //         addInterval(elm);
    //     }
    // }

    function stop(interval) {
        clearInterval(interval);
    }

    function handleText(elm, hide) {
        var titleContainerElm = elm.getElementsByClassName("title-container")[0];
        var left = 0;
        if (hide) {
            left = "-" + titleContainerElm.offsetWidth + "px";
        }
        titleContainerElm.style.left = left;
    }

    function addInterval(elm)
    {
        var innerCloudElm = elm.getElementsByClassName('inner-cloud')[0];
        var percentage = parseFloat(elm.getAttribute('data-percentage'));
        var counter = 0;
        var interval = setInterval(function() {
            elm.style.width = percentage + "%";
            innerCloudElm.innerHTML = counter + "%";

            if (counter === parseInt(percentage)) {
                stop(interval);
                handleText(elm);
            }
            counter++;
        }, 30);
    }
});