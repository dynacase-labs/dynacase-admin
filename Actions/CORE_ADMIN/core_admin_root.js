(function ($, window, document) {
    "use strict";
    var emptyIframeUrl = 'about:blank';

    var unselectApplication = function unselectApplication($app) {
        $app.removeClass("selected");
    };

    var unloadApplication = function unloadApplication($app) {
        var appName, applicationIframe, appurl;
        appName = $app.data('appname');
        appurl = $app.data('appurl');
        applicationIframe = getApplicationIFrame(appName, appurl);
        applicationIframe.attr('src', emptyIframeUrl);
    };

    var resizeIframe = function resizeIframe() {
        var iframeHeight, $content;
        $content = $("#content");
        iframeHeight = $(window).height()
            - $content.offset().top
            - parseInt($content.css("padding-top"), 10)
            - parseInt($content.css("padding-bottom"), 10);
        $("iframe", $('#content')).height(iframeHeight - 5);
    };

    var getApplicationIFrame = function getApplicationIFrame(appName, appUrl) {
        var iframeId, applicationIframe;
        iframeId = 'app-iframe-' + appName;
        applicationIframe = $('#' + iframeId);
        if (!applicationIframe.length) {
            applicationIframe = $('<iframe id="' + iframeId + '" src="' + appUrl + '"></iframe>')
                .on(
                    "load",
                    (function (appName) {
                        return function unloadIframe() {
                            var $this = $(this), doc, $app;
                            doc = this.contentDocument || this.contentWindow.document;
                            if (doc
                                    && doc.location
                                    && doc.location.href
                                    && doc.location.href === emptyIframeUrl) {
                                $this.empty().remove();
                                $app = $('.app[data-appname=' + appName + ']', $('#sidebar'))
                                    .removeClass('loaded');
                                unselectApplication($app);
                            }
                        };
                    }(appName))
                )
                .hide()
                .appendTo('#content');
        }
        return applicationIframe;
    };

    var selectApplication = function selectApplication($app) {
        $app.addClass("selected")
            .siblings()
            .removeClass("selected");
    };

    var loadApplication = function loadApplication($app) {
        var appName, applicationIframe, appurl;
        appName = $app.data('appname');
        appurl = $app.data('appurl');
        applicationIframe = getApplicationIFrame(appName, appurl);
        applicationIframe.siblings()
            .hide();
        applicationIframe.show();
        window.setTimeout(resizeIframe, 1);
        $app.addClass("loaded");
        return true;
    };

    $(document).ready(function () {
        $("#sidebar").on(
            'click',
            '.app',
            function appSelected(event) {
                var $this = $(this);
                if (loadApplication($this)) {
                    selectApplication($this);
                }
            }
        ).on(
            'click',
            '.btn-close',
            function appClosed(event) {
                var $app = $(this).closest('.app');
                unloadApplication($app)
            }
        );
        $(window).on(
            'resize',
            resizeIframe
        );
    });
}($, window, document));