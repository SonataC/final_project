//on scroll animations
$(function () {
    var scrollActions = {
        progressBars: false,
        runningNumbers: false
    };
    $(window).on('scroll', function (e) {
        var _this = $(this);
        var scrolledTop = _this.scrollTop();

        if (scrolledTop + _this.outerHeight() >= $("#progress_bars").offset().top
            && !scrollActions.progressBars
        ) {
            startProgressBars();
            scrollActions.progressBars = true;
        }

        if (scrolledTop + _this.outerHeight() >= $("#running_numbers").offset().top
            && !scrollActions.runningNumbers
        ) {
            startRunningNumbers();
            scrollActions.runningNumbers = true;
        }
    });

    function startProgressBars() {
        var elements = document.getElementsByClassName('progress-bar');
        for (var i = 0; i < elements.length; i++) {
            var elm = elements[i];
            handleText(elm, true);
            addInterval(elm);
        }
    }

    function stop(interval) {
        clearInterval(interval);
    }

    function handleText(elm, hide) {
        var titleContainerElm = elm.getElementsByClassName("title")[0];
        var left = 0;
        if (hide) {
            left = "-" + titleContainerElm.offsetWidth + "px";
        }
        titleContainerElm.style.left = left;
    }

    function addInterval(elm) {
        var innerCloudElm = elm.getElementsByClassName('inside-box')[0];
        var percentage = parseFloat(elm.getAttribute('data-percentage'));
        var counter = 0;
        var interval = setInterval(function () {
            elm.style.width = percentage + "%";
            innerCloudElm.innerHTML = counter + "%";

            if (counter === parseInt(percentage)) {
                stop(interval);
                handleText(elm);
            }
            counter++;
        }, 30);
    }

    function startRunningNumbers() {

        var arr = document.getElementsByClassName('running-number');

        var increment = 0;
        for (var i = 0; i < arr.length; i++) {
            var elm = arr[i];
            slideDown(elm, increment);

            // Run the numbers
            runTheNumbers(elm.getElementsByClassName("count")[0]);

            increment += 500;
        }
    }

    function runTheNumbers(elm) {
        var counter = 0;
        var interval = setInterval(function () {
            elm.innerHTML = counter;

            if (counter === parseInt(elm.getAttribute('data-max'))) {
                stop(interval);
            }
            counter++;
        }, .35);
    }

    function slideDown(elm, increment) {
        setTimeout(function () {
            elm.classList.remove("invisible");
        }, increment);

    }
});

//ajax and json PRICING PLANS
startAjax();

function startAjax() {
    ajax('json/data.json', preparePlans);
}

function ajax(url, callBack) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function preparePlans(response) {
    var html = '';
    var plans = response.plans;

    for (let i in plans) {
        if (plans.hasOwnProperty(i)) {
            let active = '';
            if (plans[i].active) {
                active = 'active';
            }
            html +=
                '<div class="col-md-4 py-5 py-md-0">' +
                '<table class="plan-table text-center table-bordered rounded">' +
                '<thead>' +
                '<tr>' +
                '<th class="plan-header text-center position-relative ' + active + '">' +
                '<div class="hexagon-container">' +
                '<div class="hexagon mx-auto">' +
                '<div class="hexagon-content">' +
                '<h6 class="text-center price">' + plans[i].price + '</h6>' +
                '<p class="periodicity text-center text-uppercase">' + plans[i].periodicity + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<p class="plan-name text-uppercase">' + plans[i].name + '</p>' +
                '</th>' +
                '</tr>' +
                '</thead>' + //end of table header
                '<tbody>';
            for (let j in plans[i].benefits) {
                if (plans[i].benefits.hasOwnProperty(j)) {
                    let indicator = '<i class="fas fa-times px-2 text-danger"></i>';
                    if (plans[i].benefits[j]) {
                        indicator = '<i class="fas fa-check px-2 text-success"></i>';
                    }
                    html += '<tr><td class="text-capitalize">' +
                        indicator + j + '</td></tr>'
                }
            }
            html += '</tbody><tfoot><td class="py-3"><button class="btn btn-plan"> <i class="fas fa-cart-plus fa-xs text-secondary px-2">' +
                '</i>Order now</button></td></tfoot></table></div>'
        }
    }
    document.getElementById('plans_section').innerHTML = html;
}

//video
$(function () {
    $(".video").click(function () {
        var theModal = $(this).data("target"),
            videoSRC = $(this).attr("data-video"),
            videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
        $(theModal + ' iframe').attr('src', videoSRCauto);
        $(theModal + ' button.close').click(function () {
            $(theModal + ' iframe').attr('src', videoSRC);

        });
    });
});
