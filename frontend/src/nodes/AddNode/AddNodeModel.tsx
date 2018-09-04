import {AbstractNodeModel} from "../AbstractNodeModel";

export default class AddNodeModel extends AbstractNodeModel {

    constructor() {
        super("add-node", "Add Playlists", "rgb(0, 255, 100)");

        this.addInPort("Add");
        this.addOutPort("Out");
    }

}
