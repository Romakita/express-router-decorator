import * as Path from "path";
import {ExpressApplication} from "./express-application";
import * as Https from "https";
const rootDir = Path.dirname(require.main.filename);

export type Env = "production" | "development" | "test";

export class EnvTypes {
    static PROD: Env = "production";
    static DEV: Env = "development";
    static TEST: Env = "test";
}

export interface IServerMountDirectories {
    [endpoint: string]: string;
}

export interface IServerSettings {
    version?: string;
    rootDir?: string;
    endpointUrl?: string;
    env?: Env;
    port?: string | number;
    httpPort?: string | number;
    httpsPort?: string | number;
    httpsOptions?: Https.ServerOptions;
    uploadDir?: string;
    mount?: IServerMountDirectories;
    componentsScan?: string[];
    serveStatic?: IServerMountDirectories;
    acceptMimes?: string[];
    [key: string]: any;
}
/**
 * `ServerSettingsService` contains all informations about ServerLoader configuration.
 */
export class ServerSettingsService implements IServerSettings {

    /***
     *
     * @type {Map<string, any>}
     */
    protected map = new Map<string, any>();

    constructor(settings?: Map<string, any>) {

        if (settings) {
            settings.forEach((value, key) => this.map.set(key, value));
        }
    }

    resolve(value: string) {
        return value.replace("${rootDir}", this.rootDir);
    }

    get rootDir() {
        return this.map.get("rootDir");
    }

    get version() {
        return this.map.get("version");
    }

    /**
     *
     * @returns {string}
     */
    get endpoint(): string {
        return this.map.get("endpointUrl") as string;
    }

    /**
     *
     * @returns {string}
     */
    get endpointUrl(): string {
        return this.map.get("endpointUrl") as string;
    }

    /**
     *
     * @returns {Env}
     */
    get env(): Env {
        return this.map.get("env") as Env;
    }

    /**
     *
     * @param value
     */
    get httpsOptions(): Https.ServerOptions {
        return this.map.get("httpsOptions");
    }

    /**
     *
     * @returns {undefined|any}
     */
    get httpPort(): string | number {
        return this.map.get("httpPort");
    }

    /**
     *
     * @returns {undefined|any}
     */
    get httpsPort(): string | number {
        return this.map.get("httpsPort");
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpPort(): { address: string, port: number } {
        return ServerSettingsService.buildAddressAndPort(this.map.get("httpPort"));
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpsPort(): { address: string, port: number } {
        return ServerSettingsService.buildAddressAndPort(this.map.get("httpsPort"));
    }

    /**
     *
     * @returns {string}
     */
    get uploadDir(): string {
        return this.resolve(this.map.get("uploadDir"));
    }

    /**
     *
     * @returns {undefined|any}
     */
    get mount(): IServerMountDirectories {

        const obj = this.map.get("mount") || [];
        const finalObj = {};

        Object.keys(obj).forEach(k => {
            finalObj[k] = this.resolve(obj[k]);
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get componentsScan(): string[] {

        const obj: string[] = this.map.get("componentsScan") || [];
        const finalObj = [];

        Object.keys(obj).forEach(k => {
            finalObj.push(this.resolve(obj[k]));
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get serveStatic(): IServerMountDirectories {
        const obj = this.map.get("serveStatic") || {};
        const finalObj = {};

        Object.keys(obj).forEach(k => {
            finalObj[k] = this.resolve(obj[k]);
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get acceptMimes(): string[] {
        return this.map.get("acceptMimes") || ["application/json"];
    }

    /**
     *
     * @param propertyKey
     * @returns {undefined|any}
     */
    get<T>(propertyKey: string): T {
        return this.map.get(propertyKey) as T;
    }

    /**
     *
     * @returns {Function}
     */
    get authentification(): Function {
        return this.map.get("authentification") as Function;
    }

    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
        return this.map.forEach(callbackfn);
    }

    /**
     *
     * @param addressPort
     * @returns {{address: string, port: number}}
     */
    private static buildAddressAndPort(addressPort: string | number): { address: string, port: number } {
        let address = "0.0.0.0";
        let port = addressPort;

        if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
            [address, port] = addressPort.split(":");
        }

        return {address, port: +port};
    }

}

export class ServerSettingsProvider implements IServerSettings {

    protected map = new Map<string, any>();

    constructor() {

        this.rootDir = rootDir;
        this.env = EnvTypes.DEV as Env;
        this.port = 8080;
        this.httpsPort = 8000;
        this.endpointUrl = "/rest";
        this.version = "1.0.0";
        this.uploadDir = "${rootDir}/uploads";

        /* istanbul ignore next */
        this.authentification = () => (true);

        this.mount = {
            "/rest": "${rootDir}/controllers/**/*.js"
        };

        this.componentsScan = [
            "${rootDir}/middlewares/**/*.js",
            "${rootDir}/services/**/*.js",
            "${rootDir}/converters/**/*.js"
        ];

    }

    set version(v: string) {
        this.map.set("version", v);
    }

    /**
     *
     * @param value
     */
    set rootDir(value: string) {
        this.map.set("rootDir", value);
    }

    /**
     *
     * @param value
     */
    set port(value: string | number) {
        this.httpPort = value;
    }

    /**
     *
     * @param value
     */
    set httpsOptions(value: Https.ServerOptions) {
        this.map.set("httpsOptions", value);
    }

    /**
     *
     * @param value
     */
    set httpPort(value: string | number) {
        this.map.set("httpPort", value);
    }

    /**
     *
     * @param value
     */
    set httpsPort(value: string | number) {
        this.map.set("httpsPort", value);
    }


    /**
     *
     * @param value
     */
    set uploadDir(value: string) {
        this.map.set("uploadDir", value);
    }

    /**
     *
     * @param value
     */
    set endpoint(value: string) {
        this.map.set("endpointUrl", value);
    }

    /**
     *
     * @param value
     */
    set endpointUrl(value: string) {
        this.map.set("endpointUrl", value);
    }

    get endpoint(): string {
        return this.map.get("endpointUrl");
    }

    /**
     *
     * @param value
     */
    set env(value: Env) {
        this.map.set("env", value);
    }

    /**
     *
     * @param fn
     */
    set authentification(fn: Function) {
        this.map.set("authentification", fn);
    }

    /**
     *
     * @param value
     */
    set mount(value: IServerMountDirectories) {
        this.map.set("mount", value);

    }

    /**
     *
     * @param value
     */
    set componentsScan(value: string[]) {
        this.map.set("componentsScan", value);
    }

    /**
     *
     * @param value
     */
    set serveStatic(value: IServerMountDirectories) {
        this.map.set("serveStatic", value);
    }

    /**
     *
     * @param value
     */
    set acceptMimes(value: string[]) {
        this.map.set("acceptMimes", value);
    }


    /**
     *
     * @param propertyKey
     * @param value
     */
    set(propertyKey: string | IServerSettings, value?: any): ServerSettingsProvider {

        if (typeof propertyKey === "string") {
            this.map.set(propertyKey, value);
        } else {

            Object.keys(propertyKey as IServerSettings).forEach((key) => {

                const descriptor = Object.getOwnPropertyDescriptor(ServerSettingsProvider.prototype, key);

                if (descriptor && ["set", "map"].indexOf(key) === -1) {
                    this[key] = propertyKey[key];
                } else {
                    this.set(key, propertyKey[key]);
                }

            });

        }

        return this;
    }

    /**
     *
     * @returns {ServerSettingsService}
     */
    public $get = (): ServerSettingsService => {
        return new ServerSettingsService(this.map);
    };
}