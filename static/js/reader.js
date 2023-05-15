/*
    NCT Blog
    Copyright (C) 2023 Decstar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    License: https://www.gnu.org/licenses/gpl-3.0.en.html
*/

DIR_HEAD = "";

try {
	DIR_HEAD = dir;
} catch {
	DIR_HEAD = "/posts/"
}

HOME_DIR = "/";

try {
    HOME_DIR = home;
} catch {}

let splitURL = window.location.href.split("/");
modifier = splitURL[splitURL.length - 1];
modifier = modifier.replaceAll("#", ""); // should now be an array
//const PAGE_CHOICE = JSON.parse(modifier); // format [post, page]
const PAGE_CHOICE = [Number(modifier)]

document.title = `NCB Post #${PAGE_CHOICE[0]}`; // set to apt blog post title

back_to_main = () => {
    window.location.href = `${HOME_DIR}`; //#${PAGE_CHOICE[1]}
}

load_post = () => {
    let url = DIR_HEAD + "post_" + PAGE_CHOICE[0] + ".html";
	return fetch(url).then(response => {
		response.text().then( a => {
				document.getElementById("readerFrame").innerHTML = a;
			}
		)
	});
}

load_post()