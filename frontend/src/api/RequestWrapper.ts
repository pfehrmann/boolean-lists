import * as Keycloak from "keycloak-js";

export async function authorizedFetch(input?: Request | string, init?: RequestInit): Promise<Response> {
    const keycloak: Keycloak.KeycloakInstance = (window as any).keycloak;
    await keycloak.updateToken(30);
    if(!keycloak.token) {
        throw new Error("Not authorized");
    }
    const authorization = "Bearer " + keycloak.token;
    if(init) {
        if(init.headers) {
            (init.headers as any).authorization = authorization;
        } else {
            init.headers = new Headers();
            init.headers.set("authorization", authorization);
        }
    } else {
        init = {
            headers: {
                authorization
            }
        }
    }

    return await fetch(input, init);
}
