import {convertSrdToBooleanList} from "./SerializationConverter";

export function convert(srdSerialized: any) {
    return convertSrdToBooleanList(srdSerialized);
}
