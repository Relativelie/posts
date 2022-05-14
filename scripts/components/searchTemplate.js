export default class SearchTemplate {
    constructor(
        searchList,
        searchingItem,
    ) {
        this.searchList = searchList;
        this.searchingItem = searchingItem;
    }

    saveSearchList = (data, searchingFlag) => {
        const allItems = data;
        const newItems = [];
        const flag = searchingFlag.trim();
        if (flag.length !== 0) {
            for (let i = 0; i < allItems.length; i++) {
                if (
                    allItems[i].title.indexOf(flag) !== -1
                    || allItems[i].body.indexOf(flag) !== -1
                ) {
                    newItems.push(allItems[i]);
                }
            }
        }
        this.searchList = newItems;
        this.searchingItem = flag;
    };
}
