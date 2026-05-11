const {
  parentPort,
} = require("worker_threads");

parentPort.on("message", async (fileData) => {
    try {
        const result = {
            ...fileData,

            processed: true,

            processedAt: new Date(),
        };

        parentPort.postMessage({
            success: true,

            data: result,
        });
    } catch (error) {
        parentPort.postMessage({
            success: false,

            error: error.message,
        });
    }
});