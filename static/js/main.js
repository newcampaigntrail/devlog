/*
Copyright (C) 2023- Decstar
License: https://www.gnu.org/licenses/gpl-3.0.en.html
*/

const DIR_HEAD = "/posts/"
const POST_DISPLAY = 2;

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
	start_post: 1
}

// find the number of posts there are

iterate_file = (found) => {
	if (!found) {
		e.post_count--;
		load_posts();
		return;
	}
	e.post_count++;
	fileExists(DIR_HEAD+"post_"+e.post_count+".html", iterate_file);
}

iterate_file(true)

// load the posts

load_post = (post_num) => {
	let url = DIR_HEAD + "post_" + post_num + ".html";
	return fetch(url).then(response => {
		if (!response.ok) {
			throw new Error("HTTP error " + response.status); // Rejects the promise
		}
		response.text().then( a => {
				e.post_data[post_num] = a;
				display_post(post_num);
			}
		)
	});
}

load_posts = () => {
	template_posts(POST_DISPLAY);
	let count = 0;
	for (let i = e.post_count; i >= e.start_post; i--) {
		console.log(i)
		load_post(i);
	}
}

template_posts = (count) => {
	let post_field = document.getElementById("blogPosts");
	new Array(count).fill(0).forEach(f=>post_field.innerHTML+="<hr></hr>"); // hacky solution? yes. but I think it's cool
}

display_post = (post) => {
	let data = e.post_data[post];
	let post_field = document.getElementById("blogPosts");
	let post_f_len = post_field.children.length;
	post_field.children[post_f_len - post + e.start_post - 1].innerHTML = data;
}

next_page = () => {
	let post_field = document.getElementById("blogPosts");
	post_field.innerHTML = "";
	e.start_post = e.post_count + 1;
	iterate_file(true);
}
