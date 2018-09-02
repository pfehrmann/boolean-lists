export class TooManyRootsError extends Error {
    constructor(message: any) {
        super();
        Error.apply(this, arguments);
    }
}