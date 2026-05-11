const {
    parentPort,
} = require("worker_threads");

parentPort.on("message", (data) => {
    try {
        const processedMessage = {
            ...data,

            processedAt: new Date(),
        };

        parentPort.postMessage({
            success: true,

            message: processedMessage,
        });
    } catch (error) {
        parentPort.postMessage({
            success: false,

            error: error.message,
        });
    }
});