import {AbstractNodeFactory} from "../AbstractNodeFactory";
import MyLibraryNodeModel from "./MyLibraryNodeModel";
import MyLibraryNodeWidget from "./MyLibraryNodeWidget";

export default class MyLibraryNodeFactory extends AbstractNodeFactory<MyLibraryNodeModel> {
    constructor() {
        super("my-library-node");
    }

    public getClassType() {
        return MyLibraryNodeWidget;
    }

    public getNewInstance() {
        return new MyLibraryNodeModel();
    }
}
