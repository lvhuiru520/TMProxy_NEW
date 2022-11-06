import http from "node:http";
import os from "node:os";

const getLocalHosts = () => {
    const interfaces = os.networkInterfaces();

    const results = new Set(["0.0.0.0"]);

    for (const _interface of Object.values(interfaces)) {
        if (_interface) {
            for (const config of _interface) {
                results.add(config.address);
            }
        }
    }
    return results;
};

const checkAvailablePort = (basePort: number, host: string): Promise<boolean> =>
    new Promise((resolve) => {
        const server = http.createServer().listen(basePort, host);
        server.unref();
        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(false);
            }
            server.close();
        });
        server.on("listening", () => {
            resolve(true);
            server.close();
        });
    });

const checkPortExist = async (port: number) => {
    const hosts = getLocalHosts();
    const result = await Promise.all(
        Array.from(hosts).map((host) => checkAvailablePort(port, host))
    );
    return result.some((item) => !item);
};

const looseJsonParse = (obj: any) => {
    return Function('"use strict";return (' + obj + ")")();
};

export { checkPortExist, looseJsonParse };
