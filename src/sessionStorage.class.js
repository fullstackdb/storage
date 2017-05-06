export class SessionStorage {
    isActive() {
        return window.sessionStorage ? true : false;
    }

    setData(name, data) {
        return new Promise((resolve, reject) => {
            window.sessionStorage.setItem(name, JSON.stringify(data));
            resolve(`data ${name} saved`);
        });
    }

    getData(name) {
        return new Promise((resolve, reject) => {
            let data  = window.sessionStorage.getItem(name);
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
