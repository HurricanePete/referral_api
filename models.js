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
        console.log('Retrieving user items');
        return Object.keys(this.items).map(key => this.items[key]);
    },
    delete: function(id) {
        console.log(`Deleting user item ${id}`);
        delete this.items[id];
    },
    update: function(updatedItem) {
        console.log(`Deleting user item ${updatedItem.id}`);
        const {id} = updatedItem;
        if (!(id in this.items)) {
            throw StorageException(
                `Can't update item ${id} because it doesn't exist.`
            )
        }
        this.items[updatedItem.id] = updatedItem;
        return updatedItem;
    }
};

const Code = {
    create: function(codeObject) {
        const code = {
            id: uuid(),
            userId: codeObject.userId,
            redemptions: 0,
            redemptionLimit: codeObject.limit,
            expDate: codeObject.expiration
        }
        this.items[code.id] = code;
        return code;
    },
    redeem: function(code) {
        console.log(`Redeeming code item ${updatedItem.id}`);
        const {id} = code;
        if (!(id in this.items)) {
            throw StorageException(
                `Can't redeem code ${id} because it doesn't exist.`
            )
        }
        const expiredCode = redeemCode.expiration !== null && redeemCode.expDate < Date.now()
        let redeemCode = this.items[code.id];
        if (redeemCode.expiration !== null && redeemCode.expDate < Date.now()) {
            throw StorageException(
                `Can't redeem code ${id} because it has expired.`
            )
        }
        redCode.redemptions++;
        return redeemCode
    }
}

function createUser() {
    const storage = Object.create(User);
    storage.items = {};
    return storage;
}

function createCode() {
    const storage = Object.create(Code);
    storage.items = {}
    return storage;
}

module.exports = {
    User: createUser(),
    Code: createCode()
}
