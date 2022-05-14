export default class ContentTemplate {
    constructor(data) {
        this.data = data;
    }

    savePosts = (data) => {
        this.data = data;
    };

    deletePost = (postId) => {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === parseInt(postId, 10)) {
                this.data.splice(i, 1);
                return;
            }
        }
    };
}
