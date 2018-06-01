import * as express from "express";
import * as http from 'http';
import * as path from "path";
import { port } from "_debugger";

/**
 * Web-server component. Serves the chart interative chart.
 */
export interface IWebServer {

    /**
     * The data that defines the chart.
     * Passed to the browser-based chart via REST API.
     */
    chartDef: any;

    /**
     * Get the URL to access the web-sever.
     */
    getUrl (): string;

    /**
     * Start the web-server.
     */
    /*async*/ start (): Promise<void>;

    /**
     * Stop the web-server.
     */
    /*async*/ stop (): Promise<void>;
}

/**
 * Web-server component. Serves the chart interative chart.
 */
export class WebServer implements IWebServer {

    /**
     * The port number for the web server.
     */
    portNo: number;

    /**
     * The Express server instance that implements the web-server.
     */
    server: any | null = null;

    /**
     * The data that defines the chart.
     * Passed to the browser-based chart via REST API.
     */
    chartDef: any = {};

    constructor (portNo: number) {
        this.portNo = portNo;
    }

    /**
     * Get the URL to access the web-sever.
     */
    getUrl (): string {
        return "http://127.0.0.1:" + this.portNo;
    }

    /**
     * Start the web-server.
     */
    start (): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express();
            this.server = http.createServer(app);
    
            const staticFilesPath = path.join(__dirname, "template");
            const staticFilesMiddleWare = express.static(staticFilesPath);
            app.use("/", staticFilesMiddleWare);
    
            app.get("/chart-data", (request, response) => {
                response.json({
                    chartDef: this.chartDef,
                });
            });
            
            this.server.listen(this.portNo, (err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    /**
     * Stop the web-server.
     */
    /*async*/ stop (): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close((err: any) => {
                this.server = null;

                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
        
        this.server = null;
    }
}

if (require.main === module) {
    // For command line testing.
    new WebServer(3000)
        .start()
        .then(() => {
            console.log("Server started;")
        })
        .catch(err => {
            console.error("Error starting web server.");
            console.error(err && err.stack || err);
        })
}