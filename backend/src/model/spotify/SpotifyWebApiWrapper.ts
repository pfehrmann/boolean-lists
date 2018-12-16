import * as _ from "lodash";
import * as request from "superagent";
import * as logger from "winston";

const pastResponses = new Map<string, request.Response>();

function hashRequest(req: request.Request): string {
    const headers = (req as any).header;
    if (headers.etag) {
        delete headers.etag;
    }
    const url = (req as any).url;
    const method = (req as any).method;
    const qs = JSON.stringify((req as any).qs);
    return JSON.stringify(headers) + JSON.stringify(url) + JSON.stringify(method) + qs;
}

const requestHandler =
    (superagentMethod: (url: string, callback?: (err: any, res: request.Response) => void) => request.Request) => {
    return (url: string, callback?: (err: any, res: request.Response) => void) => {

        let actualCallback;
        const getCallbackHandler = (callbackHandler: (err: any, res: request.Response) => void) => {
            return (err: any, res: request.Response) => {
                handleResponse(res);
                return callbackHandler(err, res);
            };
        };

        if (callback) {
            actualCallback = getCallbackHandler(callback);
            return superagentMethod(url, actualCallback);
        } else {
            const req = superagentMethod(url, callback);
            const reqEnd = req.end;
            (req as any).end = (handler: (err: any, res: request.Response) => void) => {
                const cachedResponse = pastResponses.get(hashRequest(req));
                if (cachedResponse) {
                    if (cachedResponse.header.etag) {
                        (req as any).header["If-None-Match"] = cachedResponse.header.etag;
                    }
                }

                reqEnd.bind(req)((err: any, res: request.Response) => {
                    if (res) {
                        if (res.status === 304) {
                            res.status = cachedResponse.status;
                            res.header = cachedResponse.header;
                            (res as any).headers = (cachedResponse as any).headers;
                            res.body = cachedResponse.body;
                            err = null;
                        } else {
                            handleResponse(res);
                        }
                    }

                    handler(err, res);
                });
            };

            return req;
        }
    };
};

const superagentGet = request.get;
const superagentPost = request.post;

(request as any).get = requestHandler(superagentGet);
(request as any).post = requestHandler(superagentPost);

function handleResponse(res: request.Response) {
    pastResponses.set(hashRequest((res as any).request), _.cloneDeep(res));
}

export function test() {
    logger.info("Setup superagent...");
}
