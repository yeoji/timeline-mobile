/**
 * This API service utilizes the Timeline Core API
 * Created by jq on 1/10/2016.
 */

var TIMELINE_API_BASE_URL = "https://109bl48szj.execute-api.ap-southeast-2.amazonaws.com";

var moment = require('moment');

module.exports.getUploadAudioUrl = function(username) {
    return TIMELINE_API_BASE_URL + "/dev/user/" + username + "/audio";
};

module.exports.getUploadImageUrl = function(username) {
    return TIMELINE_API_BASE_URL + "/dev/user/" + username + "/images";
};

/**
 * Retrieves a user's posts via the Timeline API
 * @param username
 * @returns {Promise}
 */
module.exports.getUserPosts = function (username) {
    var url = TIMELINE_API_BASE_URL + "/dev/user/" + username + "/posts";

    return new Promise(function (resolve, reject) {
        fetch(url)
            .then((res) => {
                var data = JSON.parse(res._bodyText);
                if (data.success) {
                    var postStrs = data.posts;
                    var posts = postStrs.map(function (post) {
                        return JSON.parse(post);
                    });

                    // sort posts via timestamp (newest to oldest)
                    posts = posts.sort(function (p1, p2) {
                        if (moment(p1.Timestamp).isBefore(p2.Timestamp)) return 1;
                        else return -1;
                    });
                    resolve(posts);
                } else reject(data.message);
            })
            .catch((err) => {
                console.log("ERROR " + res.statusCode);
                reject({success: false});
            });
    });
};

/**
 * Attempts to log in a user by sending a verification code via SMS
 * @param mobileNo
 */
module.exports.postAuthLogin = function (mobileNo) {
    var url = TIMELINE_API_BASE_URL + "/dev/auth/login";

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                MobileNo: mobileNo
            }),
            method: 'POST'
        })
            .then((res) => {
                if (res.status == 200) {
                    resolve(JSON.parse(res._bodyText));
                }
            })
            .catch((err) => {
                console.log("ERROR: Could not send request to Timeline Core!");
                reject(err);
            });
    });
};

/**
 * Verifies a user's verification code
 * @param mobileNo
 * @param code
 */
module.exports.postAuthVerify = function (mobileNo, code) {
    var url = TIMELINE_API_BASE_URL + "/dev/auth/verify";

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                MobileNo: mobileNo,
                Code: code
            }),
            method: 'POST'
        })
            .then((res) => resolve(JSON.parse(res._bodyText)))
            .catch((err) => {
                console.log("ERROR: Could not send request to Timeline Core!");
                reject(err);
            });
    });
};

module.exports.postAuthRegister = function (mobileNo, username) {
    var url = TIMELINE_API_BASE_URL + "/dev/auth/register";

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                MobileNo: mobileNo,
                Username: username,
                Context: 'mobile'
            }),
            method: 'POST'
        })
            .then((res) => {
                if (res.status == 200) {
                    resolve(JSON.parse(res._bodyText));
                }
            })
            .catch((err) => {
                console.log("ERROR: Could not send request to Timeline Core!");
                reject(err);
            });
    });
};

module.exports.createUserPost = function (mobileNo, username, type, content) {
    var url = TIMELINE_API_BASE_URL + "/dev/user/" + username + "/posts";

    var data = JSON.stringify({
        MobileNo: mobileNo,
        Type: type,
        Content: content
    });

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
            method: 'POST'
        })
            .then((res) => {
                resolve(JSON.parse(res._bodyText));
            })
            .catch((err) => {
                console.log("ERROR: Could not send request to Timeline Core!");
                reject(err);
            });
    });
};