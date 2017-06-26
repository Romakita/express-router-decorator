import {ENDPOINT_API_INFO, ENDPOINT_USE, ENDPOINT_USE_AFTER, ENDPOINT_USE_BEFORE} from "../constants/metadata-keys";
import Metadata from "../services/metadata";
import {InjectorService} from "../services";
import MiddlewareService from "../services/middleware";
import SendResponseMiddleware from "../middlewares/send-response";
import {getClassName} from "../utils/class";
import {$log} from "ts-log-debug";

export const METHODS = [
    "all", "checkout", "connect",
    "copy", "delete", "get",
    "head", "lock", "merge",
    "mkactivity", "mkcol", "move",
    "m-search", "notify", "options",
    "param", "patch", "post",
    "propfind", "propatch", "purge",
    "put", "report", "search",
    "subscribe", "trace", "unlock",
    "unsuscribe"
];
/**
 * Endpoint class contains metadata about a targetClass and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * Endpoint convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    class MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 * Annotation on MyClass.myMethod create a new Endpoint with his route "/",
 * the HTTP method GET and require granted connection to be accessible.
 */
export class Endpoint {

    /**
     *
     * @type {Array}
     */
    private middlewares: any[] = [];
    /**
     * HTTP method required.
     */
    private httpMethod: string;
    /**
     * Route strategy.
     */
    private route: string | RegExp;

    /**
     * Create an unique Endpoint manager for a targetClass and method.
     * @param _targetClass
     * @param _methodClassName
     */
    constructor(private _targetClass: any, private _methodClassName: string) {

        const args = Metadata.get(ENDPOINT_USE, _targetClass, _methodClassName) || [];
        this.push(args);

    }

    /**
     * Store all arguments collection via Annotation.
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                if (typeof arg === "string") {

                    if (METHODS.indexOf(arg) > -1) {
                        this.httpMethod = arg;
                    } else {
                        this.route = arg;
                    }

                    return false;
                }

                return !!arg;
            });

        this.middlewares = this.middlewares.concat(filteredArg);
    }

    /**
     * Endpoint has a HTTP method configured.
     * @returns {boolean}
     */
    public hasMethod(): boolean {
        return !!this.httpMethod;
    }

    /**
     * Return the http METHOD choosen for this endpoint.
     * @returns {string}
     */
    public getMethod(): string {
        return this.httpMethod;
    }

    /**
     *
     * @returns {string|RegExp}
     */
    public getRoute(): string | RegExp {
        return this.getMethod() ? (this.route || "/") : undefined;
    }

    /**
     * Transform endpoint to an array arguments for express router.
     * @returns {T[]}
     */
    public getMiddlewares(): any[] {

        const middlewareService = InjectorService.get<MiddlewareService>(MiddlewareService);
        const middlewaresBefore = this.getBeforeMiddlewares();
        const middlewaresAfter = this.getAfterMiddlewares();

        let middlewares: any[] = [];

        middlewares.push((request, response, next) => {
            if (request.id) {
                $log.debug(request.tagId, "Endpoint =>", JSON.stringify({
                    target: getClassName(this.targetClass),
                    methodClass: this.methodClassName,
                    httpMethod: this.httpMethod
                }));
                next();
            }
        });

        middlewares.push(this.onRequest);

        /* BEFORE */
        middlewares = middlewares
            .concat(middlewaresBefore.map(middleware => middlewareService.bindMiddleware(middleware)))
            .concat(this.middlewares.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* METHOD */
        middlewares.push(middlewareService.bindMiddleware(this._targetClass, this._methodClassName));

        /* AFTER */
        middlewares = middlewares
            .concat(middlewaresAfter.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* SEND */
        middlewares.push(middlewareService.bindMiddleware(SendResponseMiddleware));

        return middlewares.filter((item) => (!!item));
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private onRequest = (request, response, next) => {
        request.endpointCalled = false;

        if (!response.headersSent) {
            response.setHeader("X-Managed-By", "TS-Express-Decorators");
        }

        request.getEndpoint = () => this;

        request.storeData = function (data) {
            this._responseData = data;
            return this;
        };

        request.getStoredData = function (data) {
            return this._responseData;
        };

        next();
    };

    /**
     *
     */
    public get methodClassName(): string {
        return this._methodClassName;
    }

    /**
     *
     * @returns {any}
     */
    public get targetClass(): string {
        return this._targetClass;
    }

    /**
     *
     * @param target
     * @param method
     */
    static has = (target: any, method: string): boolean => Metadata.has(ENDPOINT_USE, target, method);

    /**
     * Append middlewares in the pool (before).
     * @param target
     * @param targetKey
     * @param args
     */
    static useBefore(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE_BEFORE, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_BEFORE, args.concat(middlewares), target, targetKey);
        return this;
    }

    /**
     * Add middleware and configuration for the endpoint.
     * @param target
     * @param targetKey
     * @param args
     * @returns {Endpoint}
     */
    static use(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE, args.concat(middlewares), target, targetKey);
        return this;
    }

    /**
     * Append middlewares in the pool (after).
     * @param target
     * @param targetKey
     * @param args
     */
    static useAfter(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE_AFTER, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_AFTER, args.concat(middlewares), target, targetKey);
        return this;
    }

    /**
     * Return the list of middlewares that will be applied before all middlewares.
     */
    public getBeforeMiddlewares = () => Metadata.get(ENDPOINT_USE_BEFORE, this._targetClass, this._methodClassName) || [];

    /**
     * Return the list of middlewares that will be applied after all middlewares.
     */
    public getAfterMiddlewares = () => Metadata.get(ENDPOINT_USE_AFTER, this._targetClass, this._methodClassName) || [];

    /**
     * Get value for an endpoint method.
     * @param key
     */
    public getMetadata = (key: any) => Metadata.get(typeof key === "string" ? key : getClassName(key), this.targetClass, this.methodClassName);

    public getApiInfo() {
        return Metadata.getApiInfo(this.targetClass, this.methodClassName);
    }
    /**
     * Store value for an endpoint method.
     * @param key
     * @param value
     * @param targetClass
     * @param methodClassName
     */
    static setMetadata = (key: any, value: any, targetClass: any, methodClassName: any) => Metadata.set(typeof key === "string" ? key : getClassName(key), value, targetClass, methodClassName);

    static setApiInfo(value: { [key: string]: any }, targetClass: any, methodClassName: any) {
        this.setMetadata(ENDPOINT_API_INFO, value, targetClass, methodClassName);
        return this;
    }

    static getApiInfo(targetClass: any, methodClassName: any) {
        return this.getMetadata(ENDPOINT_API_INFO, targetClass, methodClassName) || {};
    }

    /**
     * Return the stored value for an endpoint method.
     * @param key
     * @param targetClass
     * @param methodClassName
     */
    static getMetadata = (key: any, targetClass: any, methodClassName: any) => Metadata.get(typeof key === "string" ? key : getClassName(key), targetClass, methodClassName);
}