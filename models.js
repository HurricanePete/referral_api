const uuid = require('uuid/v4');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
}

const User = {
    create: function(email) {
        console.log('Creating new user');
        const item = {
            id: uuid(),
            email,
            currentCode: null
        };
        this.items[item.id] = item;
        return item;
    },
    get: function() {
        console.log('Retrieving shopping list items');
        return Object.keys(this.items).map(key => this.items[key]);
    },
    delete: function(id) {
        console.log(`Deleting shopping list item ${id}`);
        delete this.items[id];
    },
    update: function(updatedItem) {
        console.log(`Deleting shopping list item ${updatedItem.id}`);
        const {id} = updatedItem;
        if (!(id in this.items)) {
            throw StorageException(
                `Can't update item ${id} because doesn't exist.`
            )
        }
        this.items[updatedItem.id] = updatedItem;
        return updatedItem;
    }
};

function createUser() {
    const storage = Object.create(User);
    storage.items = {};
    return storage;
}

module.exports = {
    User: createUser()
}
