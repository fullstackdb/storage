const STORAGES = [];

class LocalStorage {
    isActive() {
        return window.localStorage ? true : false;
    }

    setData(name, data) {
        return new Promise((resolve, reject) => {
            window.localStorage.setItem(name, JSON.stringify(data));
            resolve(`data added`);
        });
    }

    getData(name) {
        return new Promise((resolve, reject) => {
            let data  = window.localStorage.getItem(name);
            resolve(JSON.parse(data));
        });
    }

    getAll(nameList) {
        if(nameList && nameList.length) {
            return new Promise((resolve) => {
                let dataList = [];
                nameList.map((name) => {
                    this.getData(name).then((data) => {
                        dataList.push(data);
                    })
                });
                if(dataList.length === nameList.length) {
                    resolve(dataList);
                }
            })
        } else {
            console.error(`[Storage] Cannot fetch data with ${nameList ? 'empty' : 'not valid'} keys array`)
        }
    }

    getPartByKey(name, key) {
        return new Promise((resolve, reject) => {
                this.getData(name).then((data) => {
                    if (data[key]) {
                        resolve(data);
                    } else {
                        reject(`[Storage] Cannot fetch data. Have no ${key} in ${name}`)
                    }
                })
        });
    }

}

class Storage {
    _storages = [];
    _activeStorage = {};

    constructor(storagesList) {
        this._storages = storagesList;
        this._activeStorage = storagesList.filter((storage) => {
            return storage.isActive();
        })[0];
    }

    isStorageActive(storageName) {
        if(this._storages && this._storages[storageName]) {
            return this._storages[storageName].isActive();
        } else {
            return false;
        }
    }

    setActiveStorage(storageName) {
        if(this._storages && this._storages[storageName]) {
            this._activeStorage = this._storages[storageName];
        } else {
            console.error(`[Storage] We dont work with storage ${storageName} yet.
                            Your Current Active Storage is ${this._activeStorage}`)
        }
    }

    setData(name, data) {
        return this._activeStorage.setData(name, data);
    }

    getData(name) {
        return this._activeStorage.getData(name);
    }

    getAll(nameList) {
        return this._activeStorage.getAll(nameList);
    }

    getPartByKey(name, key) {
        return this._activeStorage.getPartByKey(name, key);
    }

    search(name, key, searchText) {
        return this._activeStorage.search(name, key, searchText);
    }

}


export default function() {
    return new Storage();
};