let db;

const request = window.indexedDB.open("offlineTransactionsDB", 1);

request.onupgradeneeded = event => {
    db = event.target.result;

    const store = db.createObjectStore("offlineTransactionsList", {keyPath: "date"});
}

request.onsuccess = () => {
    db = event.target.result;

    if(navigator.onLine){
      sendIndexedDB();
    }
}


request.onerror = function(event) {
    console.log("Error!! " + event.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(["offlineTransactionsList"], "readwrite");
  
    const store = transaction.objectStore("offlineTransactionsList");
  
    store.add(record);
}

function sendIndexedDB() {
  const transaction = db.transaction(["offlineTransactionsList"], "readwrite");
  const store = transaction.objectStore("offlineTransactionsList");
  const getAll = store.getAll();
  
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        
        const transaction = db.transaction(["offlineTransactionsList"], "readwrite");
  
        const store = transaction.objectStore("offlineTransactionsList");
  
        store.clear();

        location.href = "/";
      });
    }
  };
}

window.addEventListener("online", sendIndexedDB);
