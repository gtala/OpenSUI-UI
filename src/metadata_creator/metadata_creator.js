"use strict";
exports.__esModule = true;
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var metadata = {
    name: '',
    description: '',
    image_url: '',
    video_url: '',
    external_url: '',
    attributes: []
};
rl.question('Enter name: ', function (name) {
    metadata.name = name;
    rl.question('Enter description: ', function (description) {
        metadata.description = description;
        rl.question('Enter image URL: ', function (image_url) {
            metadata.image_url = image_url;
            rl.question('Enter video URL: ', function (video_url) {
                metadata.video_url = video_url;
                rl.question('Enter external URL: ', function (external_url) {
                    metadata.external_url = external_url;
                    var askForAttributes = function () {
                        rl.question('Enter attribute key (or type \'done\' to finish): ', function (key) {
                            if (key === 'done') {
                                rl.close();
                                var metadataJSON = JSON.stringify(metadata);
                                console.log(metadataJSON);
                            }
                            else {
                                rl.question('Enter attribute value: ', function (value) {
                                    var _a;
                                    metadata.attributes.push((_a = {}, _a[key] = value, _a));
                                    askForAttributes();
                                });
                            }
                        });
                    };
                    askForAttributes();
                });
            });
        });
    });
});
