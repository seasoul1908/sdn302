class TodoList {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    getItemTitle() {
        return this.items.map(item => item.title);
    }

    displayItemSwitchStatus() {
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title} ${item.completed ? '[x]' : '[ ]'}`);
        })
    }

    completeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items[index].complete();
        }
    }
}

export default TodoList;