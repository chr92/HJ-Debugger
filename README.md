# Hotjar Debugger

![Screenshot of Debugger](https://cl.ly/051s45121l0x/Image%202017-08-09%20at%207.02.25%20PM.png)

To use the debugger, copy and paste this script into your JavaScript console, or the address bar of your browser.

```javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://chr92.github.io/HJ-Debugger/hjDebugger.js?r='+Date.now();})();```

This debugger has 4 key features, it can detect:

- HTML form issues that prevent Hotjar Tracking
- Input issues
- The presence of iFrames on a page
- General HTML Issues

You can test the features on this purposely broken website: https://chr92.github.io/hj-testsites/

## HTML Form Issues

There are a number of reasons an HTML form might not be picked up by Hotjar, or perform in an unexpected way. This tool checks a number of them:

1. Are there multiple elements with the same ID in forms?
2. Have forms been added to the HTML source by a script?
3. Have inputs been added to forms by a script?

If any of the above issues are found, they are highlighted in _yellow_.

## Input Issues

If there are any `<inputs>` sitting outside `<forms>` they will be highlighted with _red_ borders.

## iFrames

If there are _ANY_ iFrames on the page, they will be highlighted in _orange_. This can be handy for spotting when forms are inside iFrames.

## HTML Issues

The debugger passes the entire page through HTML validation. If there are any HTML errors they will be identified. 

It also highlights issues likely to affect forms in _blue_. These are issues arising from forms and inputs.
