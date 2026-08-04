const fs = require('fs');
let c = fs.readFileSync('a:/GD5-Prototype/dashboard.html', 'utf8');

const searchRegex = /<!-- ความก้าวหน้าของฉัน \(Today Job\) -->[\s\S]*?<div class="profile-card q-mb-md q-pa-md cursor-pointer hover-effect" onclick="window\.location\.href='user-today-job\.html'" style="transition: background 0\.3s;" onmouseover="this\.style\.background='#f0f2f5'" onmouseout="this\.style\.background='white'">/;

const replacement = `<!-- ความก้าวหน้าของฉัน (Today Job) -->
              <a href="user-today-job.html" style="text-decoration: none; color: inherit; display: block;">
                <div class="profile-card q-mb-md q-pa-md cursor-pointer" style="transition: background 0.3s;">`;

if (searchRegex.test(c)) {
    c = c.replace(searchRegex, replacement);
    // Also need to close the <a> tag after the profile-card div closes.
    // Let's find the end of this div.
    // The structure is:
    // <div class="profile-card ...">
    //   <div class="row items-center q-mb-sm">...</div>
    //   <q-linear-progress ...></q-linear-progress>
    //   <div class="row items-center q-gutter-x-sm" style="font-size: 11px;">...</div>
    // </div>
    // The closing tag for profile-card is just before `<!-- สถานะต่างๆ -->`
    const endSearch = /<\/div>\s*<!-- สถานะต่างๆ -->/;
    if (endSearch.test(c)) {
        c = c.replace(endSearch, `</div>\n              </a>\n              <!-- สถานะต่างๆ -->`);
        fs.writeFileSync('a:/GD5-Prototype/dashboard.html', c);
        console.log('Fixed link with anchor tag');
    } else {
        console.log("Could not find end of Today Job section");
    }
} else {
    console.log("Could not find the start of Today Job section. Maybe it was already changed?");
}
