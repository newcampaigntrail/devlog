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

const DIR_HEAD = "/posts/"
const POST_DISPLAY = 3;

function fileExists(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				callback(true);
			} else {
				callback(false);
			}
		}
	};

	xhr.send();
}

e = {
	post_count: 0,
	post_data: {},
	page_counter: 1,
	page_max: 0,
	init: false
}

// find the number of posts there are

/*
// AUTOMATIC METHOD - WILL RESULT IN TERRIBLE LOAD TIMES

iterate_file = (found) => {
	if (!found) {
		e.post_count--;
		e.page_max = (e.post_count - (e.post_count % POST_DISPLAY)) / POST_DISPLAY + 1
		load_posts();
		return;
	}
	e.post_count++;
	fileExists(DIR_HEAD+"post_"+e.post_count+".html", iterate_file);
}

iterate_file(true)
*/

check_post_c = () => {
	fetch("/posts/post_count.txt").then(response=>response.text().then(f=>{
		f = Number(f);
		e.post_count = f;
		e.page_max = (e.post_count - (e.post_count % POST_DISPLAY)) / POST_DISPLAY + 1
		load_posts();
	}))
}

check_post_c();

// load the posts

load_post = (post_num, pos) => {
	let url = DIR_HEAD + "post_" + post_num + ".html";
	return fetch(url).then(response => {
		response.text().then( a => {
				e.post_data[post_num] = a;
				display_post(post_num, pos);
			}
		)
	});
}

url_skip = () => {
	if (e.init) {
		return;
	}
	e.init = true;
	document.getElementById("page_counter").innerHTML = `Page ${e.page_counter}/${e.page_max}`

	let splitURL = window.location.href.split("/");
	modifier = splitURL[splitURL.length - 1];
	modifierFinal = modifier.replaceAll("#", "")
	if (modifier !== modifierFinal) {
		page = Number(modifierFinal);
		skip_to(page)
		return true;
	}
	return false;
}

load_posts = () => {
	e.start_post = e.start_post ? e.start_post : e.post_count

	if (url_skip()) {
		return;
	}

	let count = 0;

	let disp_count = POST_DISPLAY - e.start_post < 0 ? POST_DISPLAY : e.start_post; 

	template_posts(disp_count);

	for (let i = e.start_post; count < POST_DISPLAY && i > 0; i--) {
		count++;
		load_post(i, count);
	}
}

template_posts = (count) => {
	let post_field = document.getElementById("blogPosts");
	new Array(count).fill(0).forEach(f=>post_field.innerHTML+="<hr></hr>"); // hacky solution? yes. but I think it's cool
}

display_post = (post, pos) => {
	let data = e.post_data[post];
	let post_field = document.getElementById("blogPosts");
	let arr = JSON.stringify([post,e.page_counter]);
	let enlarge_button = `<a onclick='window.location.href="/reader/#${arr}"'>Enlarge</a>`
	post_field.children[pos - 1].innerHTML = enlarge_button + data;
}

next_page = () => {
	if (e.page_counter === e.page_max) {
		return;
	}
	let post_field = document.getElementById("blogPosts");
	post_field.innerHTML = "";
	e.start_post = e.start_post - POST_DISPLAY
	e.page_counter++;
	document.getElementById("page_counter").innerHTML = `Page ${e.page_counter}/${e.page_max}`
	load_posts();
}

prev_page = () => {
	if (e.page_counter === 1) {
		return;
	}
	let post_field = document.getElementById("blogPosts");
	post_field.innerHTML = "";
	e.start_post = e.start_post + POST_DISPLAY
	e.page_counter--;
	document.getElementById("page_counter").innerHTML = `Page ${e.page_counter}/${e.page_max}`
	load_posts();
}

skip_to = (page) => {
	e.page_counter = page;
	page = page - 1;
	let post_field = document.getElementById("blogPosts");
	post_field.innerHTML = "";
	e.start_post = e.post_count - (POST_DISPLAY * page)
	document.getElementById("page_counter").innerHTML = `Page ${e.page_counter}/${e.page_max}`
	load_posts();
}