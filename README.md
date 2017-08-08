# HotJar Debugger

## Tasks 

### Design

Set up additional tab

- [x] Set up formatting for tab
- [x] Give tab an icon
- [x] Set up CSS for displaying list of errors

Display of errors

- [x] Parse array of errors objects
- [x] Populate errors HTML

### Error Detection

Set up JS sending HTML to W3C

- [x] Use example code in OneNote

Handle return / display of errors

- [x] Create an errors class
- [x] Create an array of errors objects

### Random

- [] Split feedback into form specific
- [] What happens if there's no forms originally, but one is injected? Test this
- [] Return count of HotJar Forms

## New code

```javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://chr92.github.io/HJ-Debugger/hjDebugger.js?r='+Date.now();})();```