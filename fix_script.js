const fs = require('fs');
let innerFile = 'a:/GD5-Prototype/user-today-job-inner.html';
let c = fs.readFileSync(innerFile, 'utf8');

// Find the template script tag
const match = c.match(/<script type="__bundler\/template">(.*?)<\/script>/s);
if (match) {
    let str = match[1];
    // Find where the JSON string ends.
    // Right now, JSON.stringify added `</script>` multiple times inside the JSON string literal,
    // which prematurely closed the `<script type="__bundler/template">`.
    // The issue is that `<script type="__bundler/template">` is closed prematurely, so `match[1]` 
    // will ONLY contain the string up to the FIRST `</script>`!
    // That's why the regex failed.
    
    // So the entire file content after the FIRST `</script>` is messed up.
    // We should just restore from `GD5 Daily Job Dashboard.html` and re-apply our changes.
    console.log("File is corrupted, need to restore from original");
}
