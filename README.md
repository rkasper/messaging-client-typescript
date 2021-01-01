# Messaging Client Kata - in TypeScript - yay!

## 1) Send a message to a server
Build a messaging client that sends a message to a server. For simplicity, the “server” can be a file. The command line should look something like this:

``% message joe@example.com "Hi there!"``

The message that gets sent over the “network” must look like this:

````
connect smtp
To: joe@example.com

Hi there!

disconnect
````

## 2) Validate email address
Make sure it's a valid email address. For simplicity, check for an @. If the email address is invalid, do not send the message over the network. Display text like this on the console:

``Invalid email address: no at sign``

## 3) Ensure message body exists and is not empty
Make sure there is a message body and that it is not empty. If the message body doesn't exist or is empty, do not send the message over the network. Display text like this on the console:

``Cannot send an email with no body.``

## 4) Send to multiple recipients
Be able to send a message to multiple comma-separated recipients. Given input like:

``% message sally@example.com,joe@example.com "Hi everyone!"``

Send this over the network:

````
connect smtp
To: sally@example.com
To: joe@example.com

Hi everyone!

disconnect
````

## 5) Send an IM
Send a message in another format. Given input like:

``% message -im leslie@chat.example.com ":-) hey there!"``

Send this over the network:

````
connect chat
<leslie@chat.example.com>:-> hey there!
disconnect
````