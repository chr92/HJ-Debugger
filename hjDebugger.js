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
                '   <div class="_hjDebuggerTab" id="_hjDebuggerTabHTML"><div id=\"formIssues\"><h5>Form issues</h5></div><div id=\"inputIssues\"><h5>Input Issues</h5></h5></div><div id=\"iFrameIssues\"><h5>iFrame Issues<h5></div><div id=\"htmlIssues\"><h5>HTML Issues</h5></div></div>' +
                '</div>'
            );

            // Putting here because a lot of it is Async
            jQuery(document).ready(getPageAnalysis());

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
                        hj.cookie.set('_hjDebuggerPosition', ui.position.left + ',' + ui.position.top);
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

                });
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
                this.formIssue = true;
            } else {
                this.formIssue = false;
            }
            this.extract = extract.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        getHTML() {
            var html = "";
            // TODO turn this into actual checks
            if (this.formIssue === true) {
                html += "<tr class=\"form\"><td>" + this.location + "</td><td>" + this.message + "</td><td>" + this.extract + "</td></tr>";
            } else {
                html += "<tr><td>" + this.location + "</td><td>" + this.message + "</td><td>" + this.extract + "</td></tr>";
            }
            return (html);
        }

    }

    var getHTMLErrors = function() {

        jQuery.get('#', function(html) {

            var formData = new FormData();
            formData.append('out', 'json');
            formData.append('content', html);

            jQuery.ajax({
                url: "https://html5.validator.nu/",
                data: formData,
                dataType: "json",
                type: "POST",
                processData: false,
                contentType: false,
                success: function(data) {
                    var errorCount = data.messages.length;

                    if (errorCount === 0) {
                        jQuery('#htmlIssues').html("<h5>HTML Issues</h5><p>No HTML issues detected</p>");
                    } else {
                        var errors = [];
                        var errorHTML = "<h5>HTML Issues</h5><table><tr><th>Line</th><th>Error</th><th>Extract</th></tr><p>Form/Input errors are higlighted in Blue</p>";

                        for (var i = 0; i < errorCount; i++) {
                            var message = data.messages[i];
                            if (message.type === 'error') {
                                errors.push(new HTMLError(message.type, message.lastLine, message.message, message.extract));
                            }

                        }

                        var totalErrors = errors.length;

                        for (var i = 0; i < errors.length; i++) {
                            errorHTML += errors[i].getHTML();
                        }

                        errorHTML += "</table>";
                        jQuery('#htmlIssues').html(errorHTML);

                        jQuery('#HTMLErrors').text(parseInt(jQuery('#HTMLErrors').text()) + totalErrors);
                        jQuery("#_hjDebuggerSectionHTML").addClass("on");

                    }
                }
            });
        });

    };

    var analyseInputData = function() {

        var inputsOutsideForms = [];

        jQuery('input').each(function(input) {
            var parentObjects = jQuery(this).parents();
            var formFound = false;
            for (var i = 0; i < parentObjects.length; i++) {
                if (jQuery(parentObjects[i]).is('form') && formFound === false) {
                    formFound = true;
                }
            }
            if (formFound === false) {
                inputsOutsideForms.push(this);
            }
        });

        if (inputsOutsideForms.length === 0) {
            jQuery('#inputIssues').html("<h5>Input Issues</h5><p>No Hotjar Specific Input Issues Detected</p>");
        } else {
            var count = 1;
            var inputHTML = "<h5>Input Issues</h5><p>" + inputsOutsideForms.length + " inputs detected outside forms, they're higlighted with Red Borders.<br>Here are their IDs:</p>";
            jQuery(inputsOutsideForms).each(function() {
                jQuery(this).css('border', '10px solid red');
                inputHTML += "<p>" + count + ". " + jQuery(this).attr('id') + "</p>";
            });
            jQuery('#inputIssues').html(inputHTML);
            jQuery('#HTMLErrors').text(parseInt(jQuery('#HTMLErrors').text()) + inputsOutsideForms.length);
            jQuery("#_hjDebuggerSectionHTML").addClass("on");
        }

    };

    var analyseFormData = function() {

        var currentForms = [];
        var currentInputs = [];

        jQuery('form').each(function() {
            if (jQuery(this).attr('id')) {
                if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                    currentForms.push(this);
                }
            } else {
                currentForms.push(this);
            }
        });

        jQuery('input').each(function() {
            if (jQuery(this).attr('id')) {
                if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                    currentInputs.push(this);
                }
            } else {
                currentInputs.push(this);
            }
        });

        var errorCount = 0;
        var errorHTML = "<h5>Form Issues</h5><p>Issues highlighted in yellow</p>";

        function findDuplicates(arr) {
            var duplicates = [];
            for (var i = 0; i < arr.length; i++) {
                if ((arr.lastIndexOf(arr[i]) != i) &&
                    (duplicates.indexOf(arr[i]) == -1)) {
                    duplicates.push(arr[i]);
                }
            }
            return duplicates;
        }

        var elementIDs = [];

        jQuery('form > input').each(function() {
            if (jQuery(this).attr('id')) {
                if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                    elementIDs.push(jQuery(this).attr('id'));
                }
            }
        });

        var duplicateIDs = findDuplicates(elementIDs);

        if (duplicateIDs) {
            var uniqueIDs = [];
            jQuery.each(duplicateIDs, function(i, el) {
                if (jQuery.inArray(el, uniqueIDs) === -1) uniqueIDs.push(el);
            });
            for (var i = 0; i < uniqueIDs.length; i++) {
                errorHTML += "<p>The ID <b>" + uniqueIDs[i] + "</b> is used multiple times.";
                jQuery('#' + uniqueIDs[i]).css('border', '10px solid yellow');
                errorCount++;
            }
        }

        var originalForms = [];
        var originalInputs = [];
        var originalHTML = "";

        jQuery.get(document.location.href, function(data) {
            originalHTML = data;
        }).done(function() {
            jQuery("<div>", { html: originalHTML }).find('form').each(function() {
                if (jQuery(this).attr('id')) {
                    if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                        originalForms.push(this);
                    }
                } else {
                    originalForms.push(this);
                }
            });

            if (currentForms.length != originalForms.length) {

                for (var i = 0; i < currentForms.length; i++) {
                    if (jQuery.inArray(currentForms[i], originalForms) === -1) {
                        jQuery(currentForms[i]).css('border', '10px solid yellow');
                        errorHTML += "<p>Form element(s) not originally part of page. It has the contents <b>" + jQuery(currentForms[i]).text() + ".</b></p>";
                        errorCount++;
                    }
                }
            }

            jQuery.get(document.location.href, function(data) {
                originalHTML = data;
            }).done(function() {
                jQuery("<div>", { html: originalHTML }).find('input').each(function() {
                    if (jQuery(this).attr('id')) {
                        if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                            originalInputs.push(this);
                        }
                    } else {
                        originalInputs.push(this);
                    }
                });

                if (originalInputs.length != currentInputs.length) {

                    var originalInputNames = [];

                    for (var i = 0; i < originalInputs.length; i++) {
                        originalInputNames.push(jQuery(originalInputs[i]).attr('name'));
                    }

                    for (var i = 0; i < currentInputs.length; i++) {
                        if (jQuery.inArray(jQuery(currentInputs[i]).attr('name'), originalInputNames) === -1) {
                            jQuery(currentInputs[i]).css('border', '10px solid yellow');
                            errorHTML += "<p>Form element not part of original HTML. It has the contents <b>" + jQuery(currentInputs[i]).attr('name') + ".</b></p>";
                            errorCount++;
                        }
                    }
                }

                if (errorCount) {
                    jQuery('#formIssues').html(errorHTML);
                    jQuery('#HTMLErrors').text(parseInt(jQuery('#HTMLErrors').text()) + errorCount);
                    jQuery("#_hjDebuggerSectionHTML").addClass("on");

                } else {
                    jQuery('#formIssues').html("<h5>Form Issues</h5><p>No Hotjar Specific Form Issues Detected</p>");
                }

            });

        });

    };

    var analyseIframes = function() {

        var iframeDetails = [];

        if (jQuery('iframe').length) {
            jQuery('iframe').each(function() {
                if (jQuery(this).attr('id')) {
                    if (jQuery(this).attr('id').indexOf('_hj') < 0) {
                        iframeDetails.push(this);
                    }
                } else {
                    iframeDetails.push(this);
                }
            });
        }

        if (iframeDetails.length === 0) {
            jQuery('#iFrameIssues').html("<h5>iFrame Issues</h5><p>No Hotjar Specific iFrame issues Detected</p>");
        } else {
            var iFrameHTML = "<h5>iFrame Issues</h5><p>There are " + iframeDetails.length + " iFrame(s) Detected on this page. They're highlighted with Orange borders.</p>";
            jQuery(iframeDetails).each(function() {
                jQuery(this).css('border', '10px solid orange');
            });
            jQuery('#iFrameIssues').html(iFrameHTML);
            jQuery('#HTMLErrors').text(parseInt(jQuery('#HTMLErrors').text()) + iframeDetails.length);
            jQuery("#_hjDebuggerSectionHTML").addClass("on");
        }

    };

    var getPageAnalysis = function() {

        // Check for forms, run analysis

        if (jQuery('form').length) {
            analyseFormData();
        } else {
            jQuery('#formIssues').html("<h5>Form issues</h5><p>No forms detected</p>");
        }

        // Check for inputs, run analysis

        if (jQuery('input').length) {
            analyseInputData();
        } else {
            jQuery('#inputIssues').html("<h5>Input issues</h5><p>No inputs detected</p>");
        }

        // Check for iframes, run analysis 

        if (jQuery('iframe').length) {
            analyseIframes();
        } else {
            jQuery('#iFrameIssues').html("<h5>Input issues</h5><p>No iFrames detected</p>");
        }

        // Check for HTML Errors

        getHTMLErrors();

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