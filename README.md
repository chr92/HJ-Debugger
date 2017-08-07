# HotJar Debugger

## Tasks 

### Design

Set up additional tab

[x] Set up formatting for tab
[] Give tab an icon
[] Set up CSS for displaying list of errors

Display of errors

[x] Parse array of errors objects
[x] Populate errors HTML

### Error Detection

Set up JS sending HTML to W3C

[x] Use example code in OneNote

Handle return / display of errors

[x] Create an errors class
[x] Create an array of errors objects

### Random

[] Should the table generating code be refactored?

## New code

```javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://rawgit.com/chr92/HotJar-Debugger/master/hjDebugger.js?r='+Date.now();})();```