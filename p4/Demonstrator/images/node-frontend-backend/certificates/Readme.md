Self-Signed Zertifikate zu Demonstrationszwecken verwendet.

Sehr einfach gehalten:

npx node-opcua-pki certificate -o mycertificate.pem -a www.oth-aw.de -v 36500

oder mit Demo-Daten:

https://github.com/node-opcua/node-opcua-pki

node crypto_create_CA.js demo

Zertifikate dann unter

\PKI\own

zu finden.