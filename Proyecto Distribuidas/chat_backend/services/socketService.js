const path = require("path");

const {
    Worker,
} = require("worker_threads");

const processMessageWorker = (
    messageData
) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.resolve(
                __dirname,
                "../workers/messageWorker.js"
            )
        );

        worker.postMessage(messageData);

        worker.on("message", (result) => {
            resolve(result);
        });

        worker.on("error", (error) => {
            reject(error);
        });

        worker.on("exit", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `Worker stopped with exit code ${code}`
                    )
                );
            }
        });
    });
};

const processUploadWorker = (
  uploadData
) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.resolve(
        __dirname,
        "../workers/uploadWorker.js"
      )
    );

    worker.postMessage(uploadData);

    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", (error) => {
      reject(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Worker stopped with exit code ${code}`
          )
        );
      }
    });
  });
};

module.exports = {
    processMessageWorker,
    processUploadWorker,
};