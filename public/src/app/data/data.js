import axios from 'axios';

export default function getData() {
    const subject = 'javascript',
        tagsData = {},
        data = [];

    return axios.get('https://api.stackexchange.com/2.2/questions', {
        params: {
            tagged: 'javascript',
            site: 'stackoverflow',
            pagesize: 100,
            sort: 'hot'
        }
    })
        .then((response) => {
            response.data.items.forEach((item) => {
                item.tags.forEach((tag) => {
                    if (!tagsData[tag]) {
                        tagsData[tag] = {};
                        tagsData[tag].count = 1;
                        tagsData[tag].tagName = tag;
                    } else {
                        tagsData[tag].count += 1;
                    }
                });
            });
            delete tagsData[subject];
            // delete html too?

            Object.keys(tagsData).forEach((tag) => {
                data.push(tagsData[tag]);
            });
            return data;
        })
        .catch((err) => {
            console.log(`Error :( ${err}`);
        });
}
