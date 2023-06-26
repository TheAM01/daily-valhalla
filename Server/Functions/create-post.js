import fs from "fs"

function create(req, res, dir) {

    const body = req.body;
    const post = {}
    let empty = false;

    Object.values(body).forEach(v => {
        if (v.length === 0) empty = true;
    })

    if (empty) return res.redirect('/create');

    if(!isValidURL(body.thumbnail)) return res.redirect('/');

    post.title = body.title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
    post.image = body.thumbnail;
    post.time = Date().split(' ').splice(0, 5).join(' ');
    post.timeInMs = Date.now().toString();
    post.url = `/post/${body.title.toLowerCase().replaceAll(" ", "-").replaceAll(":", "-").replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
    post.content = {};
    post.credits = {
        author: {
            url: '/user/Mueed',
            name: 'Mueed'
        }
    }
    
    const tags = [];
    
    body.tags.split(',').forEach((t, i) => {
        tags[i] = t.trim()
    });
    
    post.tags = tags

    Object.keys(body).forEach(k => {
        if (k.startsWith("heading")) {
            post.content[body[k]] = body[k.replace("heading", "content")]; 
        }
    });

    const json = JSON.stringify(post)

    fs.writeFileSync(`${dir}/Public/Posts/${body.title.toLowerCase().replaceAll(" ", "-").replaceAll(":", "-")}.json`, json)

    res.redirect('/')
}

export default create

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};