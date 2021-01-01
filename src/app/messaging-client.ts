import * as fs from "fs";

export class MessagingClient {
    static readonly mockNetworkFileName = "/tmp/messaging-client-mock-network.txt";
    static readonly invalidEmailAddress = 'Invalid email address: no at sign';
    static readonly invalidMessageBody = 'Cannot send an email with no body.';

    createMessage(...args: any[]): string {
        if (args.length == 2) {
            return this.createEmailMessage(args);
        } else if (args.length == 3) {
            return this.creatInstantMessage(args);
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

    private creatInstantMessage(args: any[]): string {
        return 'connect chat\n<' + args[1] + '>:-> ' + args[2] + '\ndisconnect\n';
    }

    sendMessage(msg: string) {
        fs.writeFileSync(MessagingClient.mockNetworkFileName, msg);
    }

    validateEmailAddress(email: string): boolean {
        return email.indexOf('@') != -1;
    }
}
