const hostnames = [
    "gravatar.com",
    "secure.gravatar.com",
    "en.gravatar.com",
    "cn.gravatar.com",
    "s.gravatar.com",
    "0.gravatar.com",
    "1.gravatar.com",
    "2.gravatar.com",
    "3.gravatar.com",
    "4.gravatar.com",
    "5.gravatar.com",
    "6.gravatar.com",
    "7.gravatar.com",
    "8.gravatar.com",
    "9.gravatar.com",
];

function updateUrlForHost(url, hostnames) {
    for (const hostname of hostnames) {
        if (url.pathname.includes(hostname)) {
            const prefixes = [
                `/https://${hostname}/`,
                `/http://${hostname}/`,
                `/${hostname}/`,
            ];
            for (const prefix of prefixes) {
                if (url.pathname.startsWith(prefix)) {
                    url.pathname = url.pathname.substring(prefix.length - 1);
                    break;
                }
            }
            url.hostname = hostname;
            break;
        }
    }
}

export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        if (url.pathname.startsWith("/gravatar/")) {
            // Extract the hash from the path
            const hash = url.pathname.split("/")[2];
            // Construct the new URL for Gravatar
            url = new URL(`https://gravatar.com/avatar/${hash}`);
        } else if (hostnames.some((hostname) => url.pathname.includes(hostname))) {
            updateUrlForHost(url, hostnames);
        } else {
            url.hostname = "gravatar.com";

            const hostname_prefixes = [
                "/https://gravatar.com/",
                "/http://gravatar.com/",
                "/gravatar.com/",
            ];
            for (const hostname_prefix of hostname_prefixes) {
                if (url.pathname.startsWith(hostname_prefix)) {
                    url.pathname = url.pathname.substring(
                        hostname_prefix.length - 1
                    );
                    break;
                }
            }

            if (url.pathname.startsWith("/login")) {
                url.pathname = "";
                return new Response("Access Denied", { status: 403 }); // 禁止访问login
            } else if (url.pathname.startsWith("/signup")) {
                url.pathname = "";
                return new Response("Access Denied", { status: 403 }); // 禁止访问signup
            } else if (url.pathname == "/") {
                url.pathname = "";
                return new Response("Access Denied", { status: 403 }); // 禁止直接访问
            } else if (url.pathname == "") {
                url.pathname = "";
                return new Response("Access Denied", { status: 403 }); // 禁止直接访问
            }
        }
        return fetch(new Request(url, request));
    },
};