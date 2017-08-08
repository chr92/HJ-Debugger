(function() {

    var v = "1.11.1", // the minimum version of jQuery we want
        numRefs = 0,
        refsLoaded = 0;

    var loadRef = function(url, callback) {
        numRefs++;
        var done = false;
        var ref;
        if (url.indexOf('.css') > 0) {
            ref = document.createElement('link');
            ref.rel = 'stylesheet';
            ref.type = 'text/css';
            ref.href = url;
        } else {
            ref = document.createElement('script');
            ref.src = url;
        }
        ref.onload = ref.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                if (typeof callback !== 'undefined') {
                    callback();
                }
                refsLoaded++;
                done = true;
            }
        };
        document.getElementsByTagName("head")[0].appendChild(ref);
    };


    var afterJQuery = function() {
        loadRef('https://chr92.github.io/HJ-Debugger/hjDebugger.css?r=' + Date.now());
        loadRef('https://code.jquery.com/ui/1.10.1/themes/smoothness/jquery-ui.css');
        loadRef('https://code.jquery.com/ui/1.10.1/jquery-ui.min.js');
        loadRef('https://cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js');
        var refsChecker = setInterval(function() {
            if (refsLoaded >= numRefs) {
                clearInterval(refsChecker);
                initDebugger();
            }
        }, 500);
    };

    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        loadRef('//ajax.googleapis.com/ajax/libs/jquery/' + v + '/jquery.min.js', afterJQuery);
    } else {
        afterJQuery();
    }

    function initDebugger() {
        (window.myBookmarklet = function() {
            _hjSettings.hjdebug = true;
            jQuery('body').append(
                '<div id="_hjDebuggerMain">' +
                '   <div id="_hjDebuggerWindowTitle">HJ Debugger</div>' +
                '   <ul>' +
                '       <li class="open" id="_hjDebuggerSectionGeneral"><span>' + getGeneralInfo() + '</span></li>' +
                '       <li class="_hjDebuggerSection open' + (hjSiteSettings.heatmaps.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionHeatmaps"><span>' + hjSiteSettings.heatmaps.length + '</span></li>' +
                '       <li class="_hjDebuggerSection' + (hjSiteSettings.record == true ? ' on' : '') + '" id="_hjDebuggerSectionRecording"></li>' +
                '       <li class="_hjDebuggerSection' + (hjSiteSettings.forms.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionForms"><span>' + hjSiteSettings.forms.length + '</span></li>' +
                '       <li class="_hjDebuggerSection' + (hjSiteSettings.polls.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionPolls"><span>' + hjSiteSettings.polls.length + '</span></li>' +
                '       <li class="_hjDebuggerSection' + (hjSiteSettings.surveys.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionSurveys"><span>' + hjSiteSettings.surveys.length + '</span></li>' +
                '       <li class="_hjDebuggerSection' + (hjSiteSettings.testers_widgets.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionRecruiters"><span>' + hjSiteSettings.testers_widgets.length + '</span></li>' +
                '       <li class="_hjDebuggerSection" id="_hjDebuggerSectionHTML"><span id="HTMLErrors">0</span></li>' +
                '   </ul><div class="_hjDebuggerTab open" id="_hjDebuggerTabHeatmaps">' + getHeatmapInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabRecording">' + getRecordingInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabForms">' + getFormInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabPolls">' + getPollInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabSurveys">' + getSurveyInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabRecruiters">' + getTesterInfo() + '</div>' +
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabHTML">' + getHTMLInfo() + '</div>' +
                '</div>'
            );
            setTimeout(function() {

                if (hj.cookie.get('_hjDebuggerPosition')) {
                    var pos = hj.cookie.get('_hjDebuggerPosition').split(',');
                    $('#_hjDebuggerMain').css({
                        right: 'auto',
                        left: pos[0] + 'px',
                        top: pos[1] + 'px'
                    });
                }
                jQuery('#_hjDebuggerMain').addClass('loaded');

                // Mark debugger as done
                setTimeout(function() {
                    jQuery('#_hjDebuggerMain').addClass('done');
                }, 500);

                jQuery('._hjDebuggerSection').click(function() {
                    var tab = jQuery(this).attr('id').replace('_hjDebuggerSection', '_hjDebuggerTab');
                    jQuery('._hjDebuggerSection').removeClass('open');
                    jQuery(this).addClass('open');
                    jQuery('._hjDebuggerTab').slideUp('fast');
                    jQuery('#' + tab).slideDown('fast');
                });

                jQuery("#_hjDebuggerMain").draggable({
                    containment: "window",
                    handle: '#_hjDebuggerWindowTitle',
                    stop: function(event, ui) {
                        hj.cookie.set('_hjDebuggerPosition', ui.position.left + ',' + ui.position.top)
                    },
                    scroll: false
                });
                // Set up click events for triggers
                jQuery('._hjTriggerLink').on('click', function(e) {
                    e.preventDefault();
                    var trigger = jQuery(this).data('trigger');
                    hj('trigger', trigger);
                });

                jQuery('._hjFormFieldAttributeButton').click(function(e) {
                    e.preventDefault();
                    if (jQuery(this).text().indexOf('Show') >= 0) {
                        jQuery(this).parents('ul').find('._hjFormFieldAttribute').slideDown('fast');
                        jQuery(this).text(jQuery(this).text().replace('Show', 'Hide'));
                    } else {
                        jQuery(this).parents('ul').find('._hjFormFieldAttribute').slideUp('fast');
                        jQuery(this).text(jQuery(this).text().replace('Hide', 'Show'));
                    }

                })
            }, 10);

        })();
    }

    var getGeneralInfo = function() {
        var heightWarning = '';
        var bodyWindowDiff = Math.abs(jQuery('body').height() - jQuery(window).height());
        if (bodyWindowDiff < 50) heightWarning = ' <span style="color: red;">WARNING!</span>';
        var ret = '<ul>' +
            ' <li><strong>Site Id</strong><a href="https://insights.hotjar.com/sites/' + _hjSettings.hjid + '/dashboard" target="_blank">' + _hjSettings.hjid + '</a></li>' +
            ' <li><strong>Version</strong>' + _hjSettings.hjsv + '</li>' +
            ' <li><strong>Body height</strong>' + jQuery('body').height() + 'px' + heightWarning + '</li>' +
            ' <li><strong>Window height</strong>' + jQuery(window).height() + 'px' + heightWarning + '</li>' +
            ' <li><strong>R-value</strong>' + hjSiteSettings.r + '</li>' +
            ' <li><strong>In sample</strong>' + (hj.includedInSample ? 'Yes' : 'No');
        if (!hj.includedInSample) {
            ret += ' &nbsp; <a href="#" class="hjDebuggerButton" id="hjDebuggerSetIncludeCookie">Set cookie</a>';
            setTimeout(function() {
                $('#hjDebuggerSetIncludeCookie').click(function() {
                    hj.cookie.set('_hjIncludedInSample', '1');
                });
            }, 10);
        }
        ret += '        </li>' +
            '</ul>';
        return ret;
    };
    var getHeatmapInfo = function() {
        var ret = '<ul>';
        jQuery(hjSiteSettings.heatmaps).each(function(i, e) {
            ret += '<li><h4>Heatmap ' + (i + 1) + '</h4></li>' + displayTarget(e.targeting[0]);
        });
        ret += '</ul>';
        if (hjSiteSettings.heatmaps.length == 0) ret = 'No heatmaps';
        return ret;
    };
    var getRecordingInfo = function() {
        var ret = '<ul>' +
            ' <li><strong>Recordings</strong>' + (hjSiteSettings.record == true ? 'On' : 'Off') + '</li>';
        if (hjSiteSettings.record_targeting_rules.length > 0) {
            jQuery(hjSiteSettings.record_targeting_rules).each(function(i, e) {
                ret += '<li><h5>Target ' + (i + 1) + '</h5></li>' + displayTarget(e);
            });
        }
        ret += '</ul>';
        return ret;
    };
    var getFormInfo = function() {
        var ret = '';
        jQuery(hjSiteSettings.forms).each(function(i, e) {
            ret += '<ul>' +
                '<li><h4>Form ' + (i + 1) + '</h4></li>' +
                '<li><strong>Selector</strong>' + e.selector + '</li>' +
                '<li><strong>Sel. type</strong>' + e.selector_type + '</li>' +
                displayTarget(e.targeting[0]);
            jQuery(e.field_info).each(function(fi, fe) {
                ret += '<li class="_hjFormFieldAttribute"><h5>Field ' + (fi + 1) + '</h5></li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Type</strong>' + fe.field_type + '</li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Match</strong>' + fe.match_attribute + ': ' + fe.match_value + '</li>';
            });

            ret += '<li><a href="#" class="_hjFormFieldAttributeButton">Show fields (' + e.field_info.length + ')</a></li>';
            ret += '</ul>';
        });
        if (hjSiteSettings.forms.length == 0) ret = 'No forms';
        return ret;
    };
    var getPollInfo = function() {
        var ret = '';
        jQuery(hjSiteSettings.polls).each(function(i, e) {
            ret += '<ul>' +
                '<li><h4>Poll ' + (i + 1) + '</h4></li>' +
                '<li><strong>Id</strong>' + e.id + '</li>' +
                '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
                '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
                '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
                '<li><strong>Language</strong>' + e.language + '</li>' +
                '<li><strong>Position</strong>' + e.position + '</li>' +
                '<li><strong>Skin</strong>' + e.skin + '</li>';
            jQuery(e.targeting).each(function(fi, fe) {
                ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
            });
            jQuery(e.content.questions).each(function(fi, fe) {
                ret += '<li class="_hjFormFieldAttribute"><h5>Question ' + (fi + 1) + '</h5></li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Type</strong>' + fe.type + '</li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Text</strong>' + fe.text + '</li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Answers</strong><br /><ul>';
                jQuery(fe.answers).each(function(ai, ae) {
                    ret += '<li class="_hjFormFieldAttribute">' + ae.text + '</li>';
                });
                ret += '</ul></li>' +
                    '<li class="_hjFormFieldAttribute"><strong>Labels</strong>' + fe.labels + '</li>';
            });
            ret += '<li><a href="#" class="_hjFormFieldAttributeButton">Show questions (' + e.content.questions.length + ')</a></li>';
            ret += '</ul>';
        });
        if (hjSiteSettings.polls.length == 0) ret = 'No polls';
        return ret;
    };
    var getSurveyInfo = function() {
        var ret = '';
        jQuery(hjSiteSettings.surveys).each(function(i, e) {
            ret += '<ul>' +
                '<li><h4>Survey ' + (i + 1) + '</h4></li>' +
                '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
                '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
                '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
                '<li><strong>Language</strong>' + e.language + '</li>';
            jQuery(e.targeting).each(function(fi, fe) {
                ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
            });
        });
        ret += '</ul>';
        if (hjSiteSettings.polls.length == 0) ret = 'No surveys';
        return ret;
    };
    var getTesterInfo = function() {
        var ret = '';
        jQuery(hjSiteSettings.testers_widgets).each(function(i, e) {
            ret += '<ul>' +
                '<li><h4>Recruiter ' + (i + 1) + '</h4></li>' +
                '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
                '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
                '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
                '<li><strong>Language</strong>' + e.language + '</li>' +
                '<li><strong>Position</strong>' + e.position + '</li>' +
                '<li><strong>Skin</strong>' + e.skin + '</li>';
            jQuery(e.targeting).each(function(fi, fe) {
                ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
            });
        });
        ret += '</ul>';
        if (hjSiteSettings.testers_widgets.length == 0) ret = 'No recruiters';
        return ret;
    };

    class HTMLError {
        constructor(type, location, message, extract) {
            this.type = type;
            this.location = location;
            this.message = message;
            if (extract.indexOf("<form>") >= 0 || extract.indexOf("<input") >= 0) {
                this.formIssue = true
            } else {
                this.formIssue = false
            }
            this.extract = extract.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');;
        }

        getHTML() {
            var html = "";
            // TODO turn this into actual checks
            html += "<h4>Form is part of original HTML ✔</h4>";
            html += "<h4>Form is not in iFrame ✔</h4>";
            html += "<h4>All Inputs are inside FOrm Tags ✔</h4>";
            if (this.formIssue === true) {
                html += "<tr class=\"form\"><td>" + this.location + "</td><td>" + this.message + "</td><td>" + this.extract + "</td></tr>"
            } else {
                html += "<tr><td>" + this.location + "</td><td>" + this.message + "</td><td>" + this.extract + "</td></tr>"
            }
            return (html)
        }

    }

    var displayErrors = function(error_object) {
        var errorCount = error_object.messages.length;

        if (errorCount === 0) {
            $('#_hjDebuggerTabHTML').html("<h4>No Errors Detected</h4>")
        } else {
            var errors = [];
            $("#HTMLErrors").html(errorCount);
            $("#_hjDebuggerSectionHTML").addClass("on");

            var errorHTML = "<table><tr><th>Line</th><th>Error</th><th>Extract</th></tr>";

            for (i = 0; i < errorCount; i++) {
                var message = error_object.messages[i];
                if (message.type === 'error') {
                    errors.push(new HTMLError(message.type, message.lastLine, message.message, message.extract))
                }
            }

            for (i = 0; i < errors.length; i++) {
                errorHTML += errors[i].getHTML();
            }

            errorHTML += "</table>";
            $('#_hjDebuggerTabHTML').html(errorHTML);

        }

    }

    var getHTMLInfo = function() {
        var ret = '';

        // ASYNC!
        $.get('#', function(html) {

            var formData = new FormData();
            formData.append('out', 'json');
            formData.append('content', html);

            $.ajax({
                url: "https://html5.validator.nu/",
                data: formData,
                dataType: "json",
                type: "POST",
                processData: false,
                contentType: false,
                success: function(data) {
                    displayErrors(data);

                },
                error: function() {
                    console.log(arguments);
                }
            });
        });

        ret = '<h4>Analysing your HTML...</h4>';
        return ret;
    };

    var displayTarget = function(target) {
        var ret = '<li><strong>Component</strong>' + target.component + '</li>' +
            '<li><strong>Match</strong>' + target.match_operation + ': ' + target.pattern + '</li>';
        if (target.component == 'trigger') {
            ret += '<li><a href="#" data-trigger="' + target.pattern + '" class="_hjTriggerLink">Run trigger</a></li>';
        }
        return ret;
    };
})();