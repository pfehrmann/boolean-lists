export function getNelementsFromArray<T>(n: number, array: T[], random: boolean = true): T[] {
  let localArray = [...array];
  if(random) {
    localArray = shuffleArray(localArray);
  }
  return localArray.splice(-n);
}

export function shuffleArray<T>(array: T[]): T[] {
  let localArray = [...array];
    for (let i = localArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [localArray[i], localArray[j]] = [localArray[j], localArray[i]]; // eslint-disable-line no-param-reassign
    }
    return localArray;
}

export interface Observable {
  addChangeListener(changeListener: ChangeListener): void;
  removeChangeListener(changeListener: ChangeListener): void;
  fireChangeEvent(event: any): void;
}

export interface ChangeListener {
  eventFired(event: any): any;
}

export function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    });
}
