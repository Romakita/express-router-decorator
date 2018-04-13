import {JsonSchemesService} from "../../../../src/common/jsonschema/services/JsonSchemesService";
import {inject} from "../../../../src/testing";
import {Circular, IndirectCircular, JsonFoo2, Thingy} from "../../../helper/classes";
import {expect} from "../../../tools";

describe("JsonSchemesService", () => {
    describe("use case 1", () => {
        before(inject([JsonSchemesService], (service: JsonSchemesService) => {
            this.result = service.getSchemaDefinition(JsonFoo2);
        }));
        it("should return a schema with his definitions", () => {
            expect(this.result).to.deep.eq({
                "definitions": {
                    "JsonAgeModel": {
                        "properties": {
                            "age": {
                                "type": "number"
                            }
                        },
                        "type": "object"
                    },
                    "JsonNameModel": {
                        "properties": {
                            "name": {
                                "type": "string"
                            }
                        },
                        "type": "object"
                    }
                },
                "properties": {
                    "ageModel": {
                        "$ref": "#/definitions/JsonAgeModel"
                    },
                    "arrayOfString": {
                        "items": {
                            "type": "string"
                        },
                        "type": "array"
                    },
                    "dateStart": {
                        "type": "string"
                    },
                    "foo": {
                        "type": "object"
                    },
                    "foos": {
                        "items": {
                            "type": "object"
                        },
                        "type": "array"
                    },

                    "foos2": {
                        "items": {
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "mapOfString": {
                        "additionalProperties": {
                            "type": "string"
                        }
                    },
                    "name": {
                        "minLength": 3,
                        "type": "string"
                    },
                    "nameModel": {
                        "$ref": "#/definitions/JsonNameModel"
                    },
                    "object": {
                        "type": "object"
                    },
                    "password": {
                        "type": "string"
                    },
                    "test": {
                        "minLength": 3,
                        "type": "string"
                    },
                    "theMap": {
                        "additionalProperties": {
                            "type": "object"
                        }
                    },
                    "theSet": {
                        "additionalProperties": {
                            "type": "object"
                        }
                    },
                    "uint": {
                        "type": "number"
                    }
                },
                "required": [
                    "test",
                    "foo"
                ],
                "type": "object"
            });
        });
    });

    describe("use case 1", () => {
        before(inject([JsonSchemesService], (service: JsonSchemesService) => {
            this.result = service.getSchemaDefinition(Thingy);
        }));
        it("should return a schema with his definitions", () => {
            expect(this.result).to.deep.eq({
                "definitions": {
                    "Stuff": {
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "nested": {
                                "$ref": "#/definitions/Nested"
                            }
                        },
                        "type": "object"
                    },
                    "Nested": {
                        "properties": {
                            "count": {
                                "type": "number"
                            }
                        },
                        "type": "object"
                    }
                },
                "properties": {
                    "stuff": {
                        "$ref": "#/definitions/Stuff"
                    }
                },
                "type": "object"
            });
        });
    });

    describe("with circular reference", () => {
        before(inject([JsonSchemesService], (service: JsonSchemesService) => {
            this.result = service.getSchemaDefinition(Circular);
        }));
        it("should return a schema with his definitions", () => {
            expect(this.result).to.deep.eq({
                "definitions": {
                    "Circular": {
                        "properties": {
                            "parent": {
                                "$ref": "#/definitions/Circular"
                            }
                        },
                        "type": "object"
                    }
                },
                "properties": {
                    "parent": {
                        "$ref": "#/definitions/Circular"
                    }
                },
                "type": "object"
            });
        });
    });

    describe("with indirect circular reference", () => {
        before(inject([JsonSchemesService], (service: JsonSchemesService) => {
            this.result = service.getSchemaDefinition(IndirectCircular);
        }));
        it("should return a schema with his definitions", () => {
            expect(this.result).to.deep.eq({
                "definitions": {
                    "Dependency": {
                        "properties": {
                            "dep": {
                                "$ref": "#/definitions/IndirectCircular"
                            }
                        },
                        "type": "object"
                    },
                    "IndirectCircular": {
                        "properties": {
                            "parent": {
                                "$ref": "#/definitions/Dependency"
                            }
                        },
                        "type": "object"
                    }
                },
                "properties": {
                    "parent": {
                        "$ref": "#/definitions/Dependency"
                    }
                },
                "type": "object"
            });
        });
    });
});