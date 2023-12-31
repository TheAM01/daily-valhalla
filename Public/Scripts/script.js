function buildPost(socket) {

    const urx = new URL(window.location.href);
    const post = (urx.pathname.split('/')[2]);

    socket.emit('get_post', {url: window.location.href, post: post});

    socket.on('get_post', response => {
        // console.log(response.content);
        let contentHeads = [];
        let anchors = [];

        let date = document.getElementById("date");
        let title = document.getElementById("title");
        let author = document.getElementById("author");
        let thumbnail = document.getElementById("thumbnail");
        let tags = document.getElementById("tags")

        const anchorCollectionDiv = document.getElementById("anchor_collection");
        const contentDiv = document.getElementById("content");

        date.innerHTML = response.time
        title.innerHTML = response.title;
        author.innerHTML = response.credits.author.name;
        if (response.tags) {

            const h = document.createElement("span")
            h.setAttribute("class", "emphasis");
            h.innerText = "Tags: ";

            tags.appendChild(h);

            let tagsArr = [];

            response.tags.forEach(t => {

                const tag = document.createElement("a")
                tag.setAttribute("href", `/topics/${t}`)
                tag.setAttribute("class", "post_tags")
                tag.innerText = t;
                tags.appendChild(tag);

            })

            // tags.innerHTML = "<span class=\"emphasis\">Tags: </span>" + tagsArr.join(', '); // tags bruh
        }
        author.setAttribute("href", response.credits.author.url);
        thumbnail.setAttribute("src", response.image);

        const content = response.content;
        const headings = Object.keys(content);
        
        headings.forEach((h, n) => {

            const heading = document.createElement("div");
            heading.setAttribute("class", "content_heading");
            heading.setAttribute("id", `${n+1}`);
            heading.innerHTML = h;

            const postContent = document.createElement("div");
            postContent.setAttribute("id",`post_content_${n+1}`);
            postContent.setAttribute("class", "post_content")
            postContent.innerHTML = content[h];

            const anchor = document.createElement("a");
            anchor.setAttribute("class", "heading_anchor")
            anchor.setAttribute("href", `#${n+1}`);
            anchor.innerHTML = h;

            contentHeads.push(heading);
            contentHeads.push(postContent);
            anchors.push(anchor);


        })

        contentHeads.forEach(e => {
            contentDiv.appendChild(e);
        });

        anchors.forEach(e => {
            anchorCollectionDiv.appendChild(e);
        })

    })
}


function getRelatedPosts(socket) {
    
    socket.emit("related_posts");
    socket.on("related_posts", (data) => {

        const related = document.getElementById("related");
        const headlines = document.getElementById("headlines");
        const h = [];

        data.forEach(i => {
            const anchor = document.createElement("a");
            anchor.setAttribute("class", "related_posts");
            anchor.setAttribute("href", i.url);

            const img = document.createElement("img");
            img.setAttribute("src", i.thumbnail);
            img.setAttribute("class", "related_posts_thumbnail");
            img.setAttribute("alt", "phase");

            const title = document.createElement("span");
            title.setAttribute("class", "related_posts_title");
            title.innerHTML = i.title;
            h.push(i.title)

            const author = document.createElement("span");
            author.setAttribute("class", "related_posts_author");
            author.innerHTML = i.author;

            anchor.appendChild(img);
            anchor.appendChild(title);
            anchor.appendChild(author);

            related.appendChild(anchor);

        });

        headlines.innerHTML = h.join("<span class=\"empty_wide_space\">-</span>");
    })
}

function addNewHeading() {
    
    const form = document.getElementById("content_groups");

    const am = document.getElementsByClassName("heading_content_group").length;

    const div = document.createElement("div");
    div.setAttribute("class", "heading_content_group");

    const heading = document.createElement("input");
    heading.setAttribute("type", "text");
    heading.setAttribute("id", `post_content_heading_${am + 1}`);
    heading.setAttribute("name", `heading_${am+1}`);
    heading.setAttribute("placeholder", "Heading");
    heading.setAttribute("class", "std_input input_heading");
    heading.setAttribute("required", "");


    const content = document.createElement("textarea");
    content.setAttribute("type", "text");
    content.setAttribute("id", `post_content_content_${am + 1}`);
    content.setAttribute("name", `content_${am+1}`);
    content.setAttribute("placeholder", "Content");
    content.setAttribute("class", "std_input input_content")
    content.setAttribute("required", "");

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", "remove_field");
    button.setAttribute("onclick", "removeHeading(this)");
    button.innerHTML = "x"

    div.appendChild(heading);
    div.appendChild(content);
    div.appendChild(button)

    form.appendChild(div);

}

function loadHome(socket) {

    socket.emit("load_home");
    socket.on("load_home", data => {

        const writers = document.getElementById("top_writers");

        const heading = document.createElement('div');
        heading.setAttribute("class", "box_heading");
        heading.innerHTML = "Top writers today";

        writers.appendChild(heading)

        data.forEach(u => {

            const boxContent = document.createElement("a");
            boxContent.setAttribute("class", "box_content_link");
            boxContent.setAttribute("href", `/user/${u.name}`)
            boxContent.innerHTML = `${u.name} - ${u.posts.length} posts <span class="notification_disk">`;

            writers.appendChild(boxContent);

        });
    })
}

function latestPosts(socket) {
    socket.emit("latest");

    socket.on("latest", (data) => {
        console.log(data)

        const order = Object.keys(data).sort((a, b) =>  a - b);
        const sorted = []

        order.forEach(o => {
            sorted[o] = data[o];
        });

        console.log(sorted)

        Object.values(sorted).reverse().forEach(p => {

            const parent = document.createElement("a");
            parent.setAttribute("class", "latest_post_parent");
            parent.setAttribute("href", `${p.url}`)
    
            const thumbnailParent = document.createElement("div");
            thumbnailParent.setAttribute("class", "latest_post_thumbnail_parent");
    
            const thumbnail = document.createElement("img");
            thumbnail.setAttribute("class", "latest_post_thumbnail");
            thumbnail.setAttribute("src", p.thumbnail);
    
            const details = document.createElement("div");
            details.setAttribute("class", "latest_post_details");
            
            const title = document.createElement("div");
            title.setAttribute("class", "latest_post_title");
            title.innerHTML = p.title
    
            const author = document.createElement("div");
            author.setAttribute("class", "latest_post_author");
            author.innerHTML = p.author;

            const preview = document.createElement("div");
            preview.setAttribute("class", "latest_post_preview");
            preview.innerHTML = p.headings.join('\n');
            
    
            details.appendChild(title);
            details.appendChild(author);
            details.appendChild(preview)
    
            thumbnailParent.appendChild(thumbnail);
    
            parent.appendChild(thumbnailParent);
            parent.appendChild(details);
    
            document.getElementById("latest_posts").appendChild(parent);

        })

    });
}

function getTopic(socket) {

    const urx = new URL(window.location.href);
    const topic = (urx.pathname.split('/')[2]);

    socket.emit("get_topic", topic.replaceAll("+", " ").replaceAll("%20", " "));

    socket.on("get_topic", (data) => {
    
        if (!data.length) return document.getElementById("topic_relevant_posts").innerHTML = "No posts found :(";

        data.forEach(p => {
            
            const parent = document.createElement("a");
            parent.setAttribute("class", "latest_post_parent");
            parent.setAttribute("href", `${p.url}`)
            
            const thumbnailParent = document.createElement("div");
            thumbnailParent.setAttribute("class", "latest_post_thumbnail_parent");
    
            const thumbnail = document.createElement("img");
            thumbnail.setAttribute("class", "latest_post_thumbnail");
            thumbnail.setAttribute("src", p.image);
    
            const title = document.createElement("div");
            title.setAttribute("class", "latest_post_title");
            title.innerHTML = p.title
            
            const details = document.createElement("div");
            details.setAttribute("class", "latest_post_details");
    
            const author = document.createElement("div");
            author.setAttribute("class", "latest_post_author");
            author.innerHTML = p.credits.author.name;

            const preview = document.createElement("div");
            preview.setAttribute("class", "latest_post_preview");
            preview.innerHTML = p.tags.join('\n');
            
            
            details.appendChild(title);
            details.appendChild(author);
            details.appendChild(preview)
    
            thumbnailParent.appendChild(thumbnail);
            
            parent.appendChild(thumbnailParent);
            parent.appendChild(details);
            
            document.getElementById("topic_relevant_posts").appendChild(parent);
        });
        
    });
}

function getUser(socket) {

    const urx = new URL(window.location.href);
    const user_name = (urx.pathname.split('/')[2]);
    console.log(user_name);

    socket.emit("get_user", user_name);

    socket.on("get_user", (data) => {
        
    })

}

function removeHeading(element) {
    const className = element.parentElement.className;

    const elements = document.getElementsByClassName(className);
    const remover = elements[elements.length-1]
    remover.remove()
}