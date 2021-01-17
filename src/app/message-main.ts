import {MessagingClient} from "./messaging-client";

let client: MessagingClient = new MessagingClient();
let args = process.argv;
args.shift();
args.shift();

try {
    let msg: string;
    if (2 === args.length) {
        msg = client.createMessage(args[0], args[1]);
    } else {
        // TODO Be more careful with array length
        msg = client.createMessage(args[0], args[1], args[2]);
    }
    client.sendMessage(msg);
} catch (e) {
    console.log(e);
}
