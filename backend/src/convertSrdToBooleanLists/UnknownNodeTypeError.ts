export class UnknownNodeTypeError extends Error {
    constructor(message: any) {
        super();
        Error.apply(this, arguments);
    }
}