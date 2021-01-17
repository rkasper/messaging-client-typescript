import * as fs from "fs";

export class MessagingClient {
    static readonly mockNetworkFileName = "/tmp/messaging-client-mock-network.txt";
    static readonly invalidEmailAddress = 'Invalid email address: no at sign';
    static readonly invalidMessageBody = 'Cannot send an email with no body.';

    createMessage(...args: any[]): string {
        if (2 === args.length) {
            return this.createEmailMessage(args);
        } else if (3 === args.length) {
            return MessagingClient.creatInstantMessage(args);
        } else {
            throw MessagingClient.invalidMessageBody;
        }
    }

    private createEmailMessage(args: any[]): string {
        let emails: string = args[0];
        let message: string = 'connect smtp\n';
        for (let email of emails.split(',')) {
            if (this.validateEmailAddress(email)) {
                message += 'To: ' + email + '\n';
            } else {
                throw MessagingClient.invalidEmailAddress;
            }
        }
        message += '\n' +
            args[1] + '\n' +
            '\n' +
            'disconnect\n';
        return message;
    }

    private static creatInstantMessage(args: any[]): string {
        return 'connect chat\n<' + args[1] + '>:-> ' + args[2] + '\ndisconnect\n';
    }

    sendMessage(msg: string) {
        fs.writeFileSync(MessagingClient.mockNetworkFileName, msg);
    }

    validateEmailAddress(email: string): boolean {
        return -1 !== email.indexOf('@');
    }
}
