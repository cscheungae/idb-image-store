// Database
const ImageDB = {
    keyPath: 'image',
    async openDB() {
        return await idb.openDB('merchant', 1, {
            upgrade: (db) => {
                db.createObjectStore(this.keyPath);
            },
        })
    },
    async get(key) {
        const db = await ImageDB.openDB()
        return await db.get(this.keyPath, key)
    },
    async set(key, val) {
        const db = await ImageDB.openDB()
        return db.put(this.keyPath, val, key)
    },
    async delete(key) {
        const db = await ImageDB.openDB()
        return db.delete(this.keyPath, key)
    },
    async keys() {
        const db = await ImageDB.openDB()
        return await db.getAllKeys(this.keyPath)
    },
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const imageUploadElement = document.getElementById('imageUpload');
    const getFileButton = document.getElementById('getFileButton');

    if (imageUploadElement) {
        imageUploadElement.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                const selectedFile = files[0];
                console.log('File selected:', selectedFile.name);

                console.log(selectedFile);
                console.log(selectedFile instanceof Blob);

                ImageDB.set(selectedFile.name, selectedFile);
            }
        });
    }

    if (getFileButton) {
        getFileButton.addEventListener('click', async () => {
            const keys = await ImageDB.keys();
            console.log('Keys:', keys);
            if (keys.length > 0) {
                const key = keys[0];
                const file = await ImageDB.get(key);
                console.log('File retrieved:', file);
            }
        });
    }
});