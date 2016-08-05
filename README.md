# Shark Mail

*The simple filesystem-based email client*

 - [Installation](#installation)
 - [Configuration](#configuration)
 - [Receiving email](#receiving-email)
 - [Sending email](#sending-email)

## Installation

```
npm install --global shark-mail
```

## Configuration

Shark Mail relies on a simple filesystem configuration.  The following folders need to exist before launching Shark Mail...

```
~/sharkm
~/sharkm/outbox
~/sharkm/outbox/archive
```

Here's a quick oneliner to create the filesystem structure...

```
cd && mkdir sharkm && mkdir sharkm/outbox && mkdir sharkm/outbox/archive
```

Shark Mail also requires a configuration file for a few things...
 1. Email credential configuration (the *from* email address)
 2. Address book list

```javascript
module.exports = {
  sender: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "you@gmail.com",
      pass: "password"
    }
  },
  addressBook: [
    { name: "Person1", email: "person1@email.com" },
    { name: "Person2", email: "person2@email.com" }
  ]
};
```

This sample uses Gmail's configuration for host and port, but other providers should work as well.

## Receiving email

To receive email, you simply need to run...

```
sharkmail fetch
```

New emails that haven't been received and cached yet are created in `~/sharkm`.  A new file will be created for each email.

## Sending email

Emails will be sent when you run...

```
sharkmail send
```

Emails that are sent will be in files in `~/sharkm/outbox` with the file extension of `*.email`.  All files that match `~/sharkm/outbox/*.email` will attempt to be sent.

The file format for outbound emails is the following...

```
<email-address-or-address-book-name>
<email-subject>
<email-body>
```

In short, email address or address book name on line 1, email subject on line 2, and the rest of the file (lines 3+) is the message body. 

> :bulb: If you have a draft email that you don't want to accidentally send it's a good idea to have a different extension, such as `*.email.draft` and then remove `draft` when you're ready to send the email