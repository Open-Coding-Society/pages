export class LocalStorage{
    constructor(keys){
        this.keys = keys;
        console.log("browser local storage available: "+String(this.storageAvailable));
    }

    get storageAvailable(){ //checks if browser is able to use local storage
        let type = "localStorage";
        let storage;
        try {
          storage = window[type];
          const x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === "QuotaExceededError" ||
              // Firefox
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
    }

    save(key){ //save a particular key
        if(!this.storageAvailable){return}; //check if local storage is possible
        window.localStorage.setItem(key,this[key]);
    }
    
    load(key){//load a particular key
        if(!this.storageAvailable){return}; //check if local storage is possible
        this[key] = window.localStorage.getItem(key);
    }

    saveAll(){ //saves data for all keys in this.keys
        if(!this.storageAvailable){return}; //check if local storage is possible
        Object.keys(this.keys).forEach(key => {
            window.localStorage.setItem(key,this[key]);
        });
    }

    loadAll(){//loads data from all keys in this.keys
        if(!this.storageAvailable){return}; //check if local storage is possible
        Object.keys(this.keys).forEach(key => {
            this[key] = window.localStorage.getItem(key);
        });
    }
}

export default LocalStorage;