// controllers
export const CONTROLLER_URL             = "tsed:controller:url";
export const CONTROLLER_DEPEDENCIES     = "tsed:controller:dependencies";
export const CONTROLLER_MOUNT_ENDPOINTS = "tsed:controller:endpoints";
export const ENDPOINT_ARGS              = "tsed:endpoint";
export const ENDPOINT_VIEW              = "tsed:endpoint:view";
export const ENDPOINT_VIEW_OPTIONS      = "tsed:endpoint:view-options";

// converters
export const CONVERTER                  = "tsed:converter";
export const JSON_METADATA              = "tsed:json:property";
export const JSON_PROPERTIES            = "tsed:json:properties";

// models
export const TABLE                      = "tsed:table";
export const COLUMN                     = "tsed:column";

// INJECTION META TO CONTROLLER METHOD
export const INJECT_PARAMS              = "tsed:inject:params";

// used to access design time types
export const DESIGN_PARAM_TYPES         = "design:paramtypes";
export const DESIGN_TYPE                = "design:type";

export const SERVICE                    = "tsed:service:type";
export const SERVICE_INSTANCE           = "tsed:service:instance";

// SYMBOLS
export const EXPRESS_NEXT_FN            = Symbol("next");
export const EXPRESS_REQUEST            = Symbol("request");
export const EXPRESS_RESPONSE           = Symbol("response");
export const GET_HEADER                 = Symbol("getHeader");
export const PARSE_COOKIES              = Symbol("parseCookies");
export const PARSE_BODY                 = Symbol("parseBody");
export const PARSE_QUERY                = Symbol("parseQuery");
export const PARSE_PARAMS               = Symbol("parseParams");
export const PARSE_SESSION              = Symbol("parseSession");