let keycloak: Keycloak.KeycloakInstance;

export async function authorizedFetch(input?: Request | string, init?: RequestInit): Promise<Response> {
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

export function setKeycloak(keycloakInstance: Keycloak.KeycloakInstance) {
    keycloak = keycloakInstance;
}