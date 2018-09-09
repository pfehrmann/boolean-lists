export function getNelementsFromArray<T>(n: number, array: T[], random: boolean = true): T[] {
  let localArray = [...array];
  if (random) {
    localArray = shuffleArray(localArray);
  }
  return localArray.splice(-n);
}

export function shuffleArray<T>(array: T[]): T[] {
  const localArray = [...array];
  for (let i = localArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [localArray[i], localArray[j]] = [localArray[j], localArray[i]]; // eslint-disable-line no-param-reassign
    }
  return localArray;
}

export interface IObservable {
  addChangeListener(changeListener: IChangeListener): void;
  removeChangeListener(changeListener: IChangeListener): void;
  fireChangeEvent(event: any): void;
}

export interface IChangeListener {
  eventFired(event: any): any;
}

export function sleep(ms = 50) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function getAll<T>(spotifyApi: any,
                                spotifyFunction: (...args: any[]) => Promise<any>,
                                constructor: (item: any) => T, args: any[],
                                options: any = {offset: 0}) {
    const completeArgs = [...args];
    completeArgs.push(options);

    const result = await spotifyFunction.apply(spotifyApi, completeArgs);
    const items: T[] = result.body.items.map((item: any) => constructor(item));

    if (result.body.next) {
        await sleep();
        return items.concat(await getAll(spotifyApi, spotifyFunction, constructor, args, {
            offset: result.body.items.length + options.offset,
        }));
    }
    return items;
}
