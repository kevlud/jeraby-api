export class MOVISERROR extends Error {
    public static UNSUPPORTED_TYPE: string = "Please provide a 'String', 'Uint8Array' or 'Array'.";
    public static ENTITY_NOT_FOUND: string = "Specified entity was not found.";
    message: string;
    stack: string;

    constructor(public mess: string) {
        super(mess);
        this.name = "UnexpectedInput";
        this.stack = (<any>new Error()).stack;
    }

    public static entittyNotFound(arg: string | number): string {
        return 'Specified entity "' + arg + '" was not found';
    }

}
