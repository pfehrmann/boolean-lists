export class TooManyChildrenError extends Error {
    constructor(message: any) {
        super();
        Error.apply(this, arguments);
    }
}