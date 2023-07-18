import * as readline from 'readline';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let metadata = {
    name: '',
    description: '',
    image_url: '',
    video_url: '',
    external_url: '',
    attributes: [] as any[]
};

rl.question('Enter name: ', (name) => {
    metadata.name = name;

    rl.question('Enter description: ', (description) => {
        metadata.description = description;

        rl.question('Enter image URL: ', (image_url) => {
            metadata.image_url = image_url;

            rl.question('Enter video URL: ', (video_url) => {
                metadata.video_url = video_url;

                rl.question('Enter external URL: ', (external_url) => {
                    metadata.external_url = external_url;

                    const askForAttributes = () => {
                        rl.question('Enter attribute key (or type \'done\' to finish): ', (key) => {
                            if (key === 'done') {
 
                                rl.close();

                                let metadataJSON = JSON.stringify(metadata);
                                console.log(metadataJSON);

                            } else {
                                rl.question('Enter attribute value: ', (value) => {
                                    metadata.attributes.push({[key]: value});
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
