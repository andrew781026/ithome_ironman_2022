const request = require('request');

// 請自行使用自己的 cookie，小心不要放在公開的地方…
var cookie = process.env.COOKIE;
var postId = process.env.POST_ID;
var token = process.env.TOKEN;

var postContent = {
    subject: '預先準備好的標題',
    description: `預先準備好的內容`,
    tags: ['14th鐵人賽'],
};

createPost(articleId => {
    publishPost(articleId, postContent,  () => {
        console.log('完成發文');
    })
})

function createPost(callback) {
    var options = {
        url: `https://ithelp.ithome.com.tw/2022ironman/create/${postId}`,
        followRedirect: false,
        headers: {
            'cookie': cookie
        }
    };

    request(options, (err, res, body) => {
        var articleId = body.match(/articles\/(.+)\/draft/)[1];
        callback(articleId);
    })
}

function publishPost(articleId, postContent, callback) {
    var options = {
        url: `https://ithelp.ithome.com.tw/articles/${articleId}/publish`,
        method: 'POST',
        headers: {
            'Cookie': cookie,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            '_token': token,
            'group': 'tech',
            '_method': 'PUT',
            'subject': postContent.subject,
            'description': postContent.description,
            'tags': postContent.tags,
        },
    };

    request(options, (err, res, body) => {
        callback()
    })
}
