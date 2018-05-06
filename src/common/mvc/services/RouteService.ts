import {nameOf} from "@tsed/core";
import {$log} from "ts-log-debug";
import {colorize} from "ts-log-debug/lib/layouts/utils/colorizeUtils";
import {Service} from "../../di/decorators/service";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {IControllerRoute} from "../interfaces";
import {ControllerService} from "./ControllerService";

/**
 * `RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.
 */
@Service()
export class RouteService {

    constructor(private controllerService: ControllerService) {

    }

    public $afterRoutesInit() {
        $log.info("Routes mounted :");
        this.printRoutes($log);
    }

    /**
     * Get all routes built by TsExpressDecorators and mounted on Express application.
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        const routes: IControllerRoute[] = [];

        this.controllerService.routes.forEach((config: { route: string, provider: ControllerProvider }) => {
            this.buildRoutes(routes, config.provider, config.route);
        });

        return routes;
    }

    /**
     *
     * @param routes
     * @param ctrl
     * @param endpointUrl
     */
    private buildRoutes = (routes: any[], ctrl: ControllerProvider, endpointUrl: string) => {

        // console.log("Build routes =>", ctrl.className, endpointUrl);

        ctrl.dependencies
            .map(ctrl => this.controllerService.get(ctrl))
            .forEach((provider: ControllerProvider) =>
                this.buildRoutes(routes, provider, `${endpointUrl}${provider.path}`)
            );

        ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {

            endpoint.pathsMethods.forEach(({path, method}) => {
                if (!!method) {

                    const className = nameOf(ctrl.provide),
                        methodClassName = endpoint.methodClassName,
                        parameters = ParamRegistry.getParams(ctrl.provide, endpoint.methodClassName);

                    routes.push({
                        method,
                        name: `${className}.${methodClassName}()`,
                        url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/"),
                        className,
                        methodClassName,
                        parameters
                    });
                }
            });
        });
    };

    /**
     * Print all route mounted in express via Annotation.
     */
    public printRoutes(logger: { info: (s: any) => void } = $log): void {

        const mapColor: { [key: string]: string } = {
            GET: "green",
            POST: "yellow",
            PUT: "blue",
            DELETE: "red",
            PATCH: "magenta",
            ALL: "cyan"
        };

        const routes = this
            .getRoutes()
            .map(route => {

                const method = route.method.toUpperCase();

                route.method = {
                    length: method.length, toString: () => {
                        return colorize(method, mapColor[method]);
                    }
                } as any;

                return route;
            });

        const str = $log.drawTable(routes, {
            padding: 1,
            header: {
                method: "Method",
                url: "Endpoint",
                name: "Class method"
            }
        });

        logger.info("\n" + str.trim());

    }

    /**
     * Return all Routes stored in ControllerProvider manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return this.getRoutes();
    }
}
