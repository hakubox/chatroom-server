


let person = new IndexedDB('chatroom');
person.open();
await person.insert('user', { name: '张三' });
await person.selectAll('user');

export default class IndexedDB {
    constructor(dbname) {
        this.name = dbname;
        this.version = 1;
        this.open();
    }

    /**
     * @method 打开数据库
     */
    open() {
        return new Promise((resolve, reject) => {
            this.db = window.indexedDB.open(this.name, this.version);
            this.db.onsuccess = resolve;
            this.db.onerror = error;
            this.db.onupgradeneeded = upgradeneeded;
        });
    }

    /**
     * @method 创建表
     */
    createTable(tableName, config = { keyPath: 'id' }) {
        let handle;
        if (!db.objectStoreNames.contains(tableName)) {
            handle = this.db.createObjectStore(tableName, config);
        }
        return handle;
    }

    /**
     * @method 插入数据
     * @param {String} tableName 表名
     * @param {Object} obj 插入的对象
     */
    insert(tableName, obj) {
        return new Promise((resolve, reject) => {
            let handle = db.transaction([tableName], 'readwrite')
                .objectStore(tableName)
                .add(obj);
            handle.onsuccess = resolve;
            handle.onerror = reject;
        })
    }

    /**
     * @method 查询单条数据
     */
    selectOne(tableName) {
        return new Promise((resolve, reject) => {
            var transaction = db.transaction([tableName]);
            var objectStore = transaction.objectStore(tableName);
            var request = objectStore.get(1);

            request.onerror = console.error;

            request.onsuccess = function(event) {
                if (request.result) {
                    resolve(request.result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = function(err) {
                reject(err);
            };
        });
    }

    /**
     * 查询对象下所有属性值
     */
    selectAll(tableName) {
        return new Promise((resolve, reject) => {
            let objectStore = db.transaction(tableName).objectStore(tableName);
            let cursor = objectStore.openCursor();
            let data = {};

            cursor.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    data[key] = cursor.value;
                    cursor.continue();
                } else {
                    resolve(data);
                }
            };
            cursor.onerror = function (err) {
                reject(err);
            };
        });
    }

    /**
     * @method 更新记录
     * @param {String} tableName 更新表名
     * @param {Object} obj 更新的对象
     */
    update(tableName, obj) {
        return new Promise((resolve, reject) => {
            var request = db.transaction([tableName], 'readwrite')
                .objectStore(tableName)
                .put(obj);

            request.onsuccess = resolve;
            request.onerror = reject;
        });
    }

    remove() {
        return new Promise((resolve, reject) => {
            var request = db.transaction([tableName], 'readwrite')
                .objectStore(tableName)
                .delete(1);

            request.onsuccess = resolve;
            request.onerror = reject;
        });
    }

    createIndex() {
        this.db.createIndex('name', 'name', { unique: false });
    }

    success() {

    }

    error(event) {
        console.log('数据库打开报错', event);
    }

    upgradeneeded(event) {
        this.db = event.target.result;
    }
}