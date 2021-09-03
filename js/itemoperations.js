const itemOperations = {
    items: [],
    add(itemObject) {
        /* adds an item into the array items*/
        items.push(itemObject);
    },
    remove() {
        /* removes the item which has the "isMarked" field set to true*/
        let count = 0;
        for (let item of this.items) {
            if (item.isMarked == true) {
                this.items.splice(count, 1);
            }
            count++;
        }
    },
    search(id) {
        /* searches the item with a given argument id */
        for (let item of this.items) {
            if (item.id === id) {
                return item;
            }
        }

        console.log("Item ID not found");
    },
    markUnMark(id) {
        /* toggle the isMarked field of the item with the given argument id*/
        item = this.search(id);
        if (item != undefined) {
            item.isMarked = !item.isMarked;
        } else {
            console.log("Cannot find item -- markUnMark Function")
        }


    },
    countTotalMarked() {
        /* counts the total number of marked items */
        let count = 0;
        for (let item of this.items) {
            if (item.isMarked === true) {
                count++
            }
        }

        if (count > 0) {
            return count;
        }
        return 0;
    },

}