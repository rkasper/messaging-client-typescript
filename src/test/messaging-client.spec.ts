// Import Chai assertions. See https://www.chaijs.com/guide/styles/ for more info.
import {assert, expect} from 'chai';
import {MessagingClient} from "../app/messaging-client";
import * as fs from "fs";

describe('Hello, TypeScript!', function () {
    // We are using the Mocha test framework. See https://mochajs.org for more info. Write some tests. Enjoy!

    // Here's your first Mocha test: make sure Mocha works properly.
    it('Mocha and Chai are running properly', function() {
        assert.isTrue(true);
    });

    // ## 1) Send a message to a server
    // Build a messaging client that sends a message to a server. For simplicity, the “server” can be a file. The
    // command line should look something like this:
    //
    // ``% message joe@example.com "Hi there!"``
    //
    // The message that gets sent over the “network” must look like this:
    //
    // ````
    // connect smtp
    // To: joe@example.com
    //
    // Hi there!
    //
    // disconnect
    // ````
    it('Creates an email message for one recipient', function() {
        let client: MessagingClient = new MessagingClient();
        let expected: string = 'connect smtp\n' +
            'To: joe@example.com\n' +
            '\n' +
            'Hi there!\n' +
            '\n' +
            'disconnect\n'
        let actual1 = client.createMessage('joe@example.com', 'Hi there!');
        assert.equal(actual1, expected);

        expected = 'connect smtp\n' +
            'To: mary@example.com\n' +
            '\n' +
            'Hello, Mary!\n' +
            '\n' +
            'disconnect\n'
        assert.equal(client.createMessage('mary@example.com', 'Hello, Mary!'), expected);
    });

    // TODO Not a true micro test because it creates and reads from a file
    it('Sends email message across a fake network', function() {
        let client: MessagingClient = new MessagingClient();
        let msg: string = client.createMessage('joe@example.com', 'Hi there!');
        client.sendMessage(msg);
        assert.isTrue(fs.existsSync("/tmp/messaging-client-mock-network.txt"));

        let expected: string = 'connect smtp\n' +
            'To: joe@example.com\n' +
            '\n' +
            'Hi there!\n' +
            '\n' +
            'disconnect\n';
        let actual = fs.readFileSync(MessagingClient.mockNetworkFileName).toString();
        assert.equal(actual, expected);
        fs.unlinkSync(MessagingClient.mockNetworkFileName);
    });

    // 2) Validate email address
    // Make sure it's a valid email address. For simplicity, check for an @. If the email address is invalid, do not
    // send the message over the network. Display text like this on the console:
    //
    // ``Invalid email address: no at sign``
    it('Validates email address', function() {
        let client: MessagingClient = new MessagingClient();
        assert.isTrue(client.validateEmailAddress('joe@example.com'));
        assert.isFalse(client.validateEmailAddress('joeattexample.com'));

        expect(function(){
            let msg = client.createMessage('joeatexample.com', 'Hi there!');
            client.sendMessage(msg);
        }).to.throw(MessagingClient.invalidEmailAddress);
        assert.isFalse(fs.existsSync(MessagingClient.mockNetworkFileName));
    });

    // 3) Ensure message body exists and is not empty
    // Make sure there is a message body and that it is not empty. If the message body doesn't exist or is empty, do
    // not send the message over the network. Display text like this on the console:
    //
    // ``Cannot send an email with no body.``
    it('Ensures message body exists', function() {
        let client: MessagingClient = new MessagingClient();

        expect(function(){
            let msg = client.createMessage('joe@example.com');
            client.sendMessage(msg);
        }).to.throw(MessagingClient.invalidMessageBody);
        assert.isFalse(fs.existsSync(MessagingClient.mockNetworkFileName));
    });

    // 4) Send to multiple recipients
    // Be able to send a message to multiple comma-separated recipients. Given input like:
    //
    // ``% message sally@example.com,joe@example.com "Hi everyone!"``
    //
    // Send this over the network:
    //
    // ````
    // connect smtp
    // To: sally@example.com
    // To: joe@example.com
    //
    // Hi everyone!
    //
    // disconnect
    // ````
    it('Send to multiple recipients', function() {
        let client: MessagingClient = new MessagingClient();
        let msg: string = client.createMessage('sally@example.com,joe@example.com', 'Hi there!');
        let expected: string = 'connect smtp\n' +
            'To: sally@example.com\n' +
            'To: joe@example.com\n' +
            '\n' +
            'Hi there!\n' +
            '\n' +
            'disconnect\n';
        assert.equal(msg, expected);

        client.sendMessage(msg);
        assert.isTrue(fs.existsSync("/tmp/messaging-client-mock-network.txt"));
        let actual = fs.readFileSync(MessagingClient.mockNetworkFileName).toString();
        assert.equal(actual, expected);
        fs.unlinkSync(MessagingClient.mockNetworkFileName);
    });

    // 5) Send an IM
    // Send a message in another format. Given input like:
    //
    // ``% message -im leslie@chat.example.com ":-) hey there!"``
    //
    // Send this over the network:
    //
    // ````
    // connect chat
    // <leslie@chat.example.com>:-> hey there!
    // disconnect
    // ````
    it('Sends an IM', function() {
        let client: MessagingClient = new MessagingClient();
        let msg: string = client.createMessage('-im', 'leslie@chat.example.com', ':-) hey there!');
        let expected: string = 'connect chat\n' +
            '<leslie@chat.example.com>:-> :-) hey there!\n' +
            'disconnect\n';
        assert.equal(msg, expected);

        client.sendMessage(msg);
        assert.isTrue(fs.existsSync("/tmp/messaging-client-mock-network.txt"));
        let actual = fs.readFileSync(MessagingClient.mockNetworkFileName).toString();
        assert.equal(actual, expected);
        fs.unlinkSync(MessagingClient.mockNetworkFileName);
    });
});
