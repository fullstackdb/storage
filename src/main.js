class LocalStorage {
    isActive() {
        return window.localStorage ? true : false;
    }

    setData(name, data) {
        return new Promise((resolve, reject) => {
            window.localStorage.setItem(name, JSON.stringify(data));
            resolve(`data ${name} saved`);
        });
    }

    getData(name) {
        return new Promise((resolve, reject) => {
            let data  = window.localStorage.getItem(name);
            if(data) {
                resolve(JSON.parse(data));
            } else {
                reject(`data ${name} not found`)
            }
        });
    }

    getAll(nameList) {
        return new Promise((resolve, reject) => {
            if(nameList && nameList.length) {   
                    let dataList = [];
                    nameList.map((name) => {
                        this.getData(name).then(
                            (data) => {
                                dataList.push(data);
                            }, 
                            (err) => {
                                dataList.push(null);
                        })
                    });
                    if(dataList.length === nameList.length) {
                        resolve(dataList);
                    }
            } else {
                reject(`[Storage] Cannot fetch data with ${nameList ? 'empty' : 'not valid'} keys array`);
            }
        })
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


const STORAGES = [LocalStorage];

class Storage {

    set activeStorage(storage) {
        this._activeStorage = storage;
    }
    get activeStorage() {
        return this._activeStorage || new Error(`[Storage] We have no active storage`);
    }

    constructor(storagesList) {
        this._storages = [];
        this._activeStorage = {};
        
        this._storages = storagesList || null;
        this.activeStorage = storagesList.filter((storage) => {
            return storage.isActive();
        })[0] || null;
    }

    isStorageActive(storageName) {
        if(this._storages && this._storages[storageName]) {
            return this._storages[storageName].isActive();
        } else {
            return new Error(`[Storage] We don\`t work with ${storageName} for now.`);
        }
    }

    setActiveStorage(storageName) {
        if(this._storages && this._storages[storageName]) {
            this.activeStorage = this._storages[storageName];
        } else {
            return new Error(`[Storage] We dont work with storage ${storageName} yet.
                            ${this.activeStorage ? 'Your Current Active Storage is ${this._activeStorage}': ''}`);
        }
    }

    setData(name, data) {
        if(name && data) {
            return this.activeStorage.setData(name, data);
        } else {
            return new Error(`[Storage] Cannot set data. 
                                You sent no  ${name ? 'data' : 'name' }`);
        }
    }

    getData(name) {
        if(name) {
            return this.activeStorage.getData(name);
        } else {
            return new Error(`[Storage] Cannot fetch data. You have sent no name`);
        }
    }

    getAll(nameList) {
        if(nameList) {
            return this.activeStorage.getAll(nameList);
        } else {
            return new Error(`[Storage] Cannot fetch data. You have sent no array with names`);
        }
    }

    getPartByKey(name, key) {
        if(name && key) {
            return this.activeStorage.getPartByKey(name, key);
        } else {
            return new Error(`[Storage] Cannot fetch data. 
                                You sent no  ${name ? 'key' : 'name' }`);
        }
    }

    search(name, key, searchText) {
        if(name && key && searchText) {
            return this.activeStorage.search(name, key, searchText);
        } else {
            return new Error(`[Storage] Cannot fetch data. 
                                You sent no  ${name ? (key ? 'searchText' : 'key') : 'name' }`);
        }
    }

}


export default function() {
    return new Storage(STORAGES);
};