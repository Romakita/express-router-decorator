import {nameOf, Type} from "@tsed/core";
import {BadRequest} from "ts-httpexceptions";

/**
 * @private
 */
export class UnknowPropertyError extends BadRequest {

    constructor(target: Type<any>, propertyName: string) {
        super(UnknowPropertyError.buildMessage(target, propertyName));
    }

    /**
     *
     * @returns {string}
     * @param target
     * @param propertyName
     */
    static buildMessage(target: Type<any>, propertyName: string) {
        return `Property ${propertyName} on class ${nameOf(target)} is not allowed.`;
    }
}