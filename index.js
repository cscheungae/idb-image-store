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
        return await db.put(this.keyPath, val, key)
    },
    async delete(key) {
        const db = await ImageDB.openDB()
        return await db.delete(this.keyPath, key)
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
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (imageUploadElement) {
        imageUploadElement.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                const selectedFile = files[0];
                console.log('File selected:', selectedFile.name);

                console.log('Selected file object:', selectedFile);
                console.log('Is selectedFile a Blob?', selectedFile instanceof Blob);

                ImageDB.set(selectedFile.name, selectedFile)
                    .then(() => {
                        console.log(`File "${selectedFile.name}" saved to DB.`);
                        alert(`Image "${selectedFile.name}" saved!`);
                    })
                    .catch(err => {
                        console.error(`Error saving file "${selectedFile.name}":`, err);
                        alert(`Error saving image. Check console.`);
                    });
            }
        });
    }

    if (getFileButton) {
        getFileButton.addEventListener('click', async () => {
            const keys = await ImageDB.keys();
            console.log('Keys:', keys);
            if (keys.length > 0) {
                const key = keys[keys.length - 1];
                const file = await ImageDB.get(key);
                console.log('File retrieved:', file);
                if (file) {
                    if (imagePreviewContainer) {
                        // Clear previous image
                        imagePreviewContainer.innerHTML = '';

                        if (file.type && file.type.startsWith('image/')) {
                            const imgElement = document.createElement('img');
                            const objectURL = URL.createObjectURL(file);
                            imgElement.src = objectURL;
                            imgElement.alt = file.name;
                            imgElement.style.maxWidth = '100%'; // Fit image within container
                            imgElement.style.maxHeight = '400px';
                            imgElement.onload = () => {
                                // Optional: Revoke object URL after image is loaded to free up resources
                                // URL.revokeObjectURL(objectURL);
                                // However, if you need to access the URL again, don't revoke it here.
                            };
                            imagePreviewContainer.appendChild(imgElement);
                        } else {
                            imagePreviewContainer.textContent = `Retrieved file "${file.name}" is not a displayable image. MIME type: ${file.type || 'unknown'}`;
                        }
                    }
                } else {
                    console.log(`File with key "${key}" not found.`);
                    if (imagePreviewContainer) {
                        imagePreviewContainer.textContent = `File with key "${key}" not found.`;
                    }
                }
            } else {
                console.log('No keys found in the database.');
                if (imagePreviewContainer) {
                    imagePreviewContainer.textContent = 'No images found in the database.';
                }
            }
        });
    }
});