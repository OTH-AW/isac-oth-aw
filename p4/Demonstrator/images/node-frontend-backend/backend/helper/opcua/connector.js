var opcua = require("node-opcua");
var async = require("async");

class Client {
    constructor(endpoint) {
        this.endpoint = endpoint

        var options = {
            certificateFile : "./certificates/certificate_2021-03-02_1614701495930.pem",
            privateKeyFile: "./certificates/private_key.pem",
            endpoint_must_exist: false
         };

        this.client = opcua.OPCUAClient.create(options);

        this.subscriptionConfig = {
            requestedPublishingInterval: 100,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        };
        
        this.monitoredItemConfig = {
            samplingInterval: 1,
            discardOldest: true,
            queueSize: 10
        };
    }

    initSession (endpoint, callbackInitDone) {
        if (typeof this.session === "undefined")
        {
            var self = this
            async.series([
                // step 1 : connect to                
                function (callback) {
                    self.client.connect(endpoint, function (err) {
                        if (err) {
                            console.log(" cannot connect to endpoint :", endpoint);
                        } else {
                            console.log("connected ! " + endpoint);
                        }
                        callback(err);
                    });
                },
        
                // step 2 : createSession
                function (callback) {
                    self.client.createSession(function (err, s) {
                        if (!err) {
                            self.session = s;
                        }
                        callback(err);
                    });
                }
            ],
            // Error
                function (err, client) {
                    if (err) {
                        console.log(" failure ", err);
                    } else {
                        if (self.session != undefined) {
                            callbackInitDone();
                        }
                    }
                })
        }
        else {
            callbackInitDone();
        }
    };

    call (callback) {
        this.initSession(this.endpoint, callback)
    }

    // step 3: install a subscription and install a monitored item for 10 seconds
    monitorNodes (nodes, onDataChange) {
        let subscription = opcua.ClientSubscription.create(this.session, this.subscriptionConfig);
        subscription.on("started", function () {
            console.log("subscription started for subscriptionId=", subscription.subscriptionId);
        }).on("keepalive", function () {
            // console.log("keepalive ID: " + subscription.subscriptionId);
        }).on("terminated", function () {
            console.log("subscription terminated for subscriptionId=", subscription.subscriptionId);
        });
        
        // install monitored item
        nodes.forEach(n => {
            const itemToMonitor = opcua.ReadValueIdLike = {
                nodeId: opcua.resolveNodeId(n),
                attributeId: opcua.AttributeIds.Value
            };
            
            const monitoredItem = opcua.ClientMonitoredItem.create(
                subscription,
                itemToMonitor,
                this.monitoredItemConfig,
                opcua.TimestampsToReturn.Both
            );
            
            console.log("-------------------------------------");
            
            monitoredItem.on("changed", onDataChange);
        });

        return subscription;
    }

    writeNode (nodeId, dataType, value, callback) {
        var nodesToWrite = [
            {
                nodeId: nodeId,
                attributeId: opcua.AttributeIds.Value,
                value: /*new DataValue(*/{
                    value: {/* Variant */
                    dataType: dataType,
                    value: value
                    }
                }
            }
        ];
        
        this.session.write(nodesToWrite, function (err, statusCodes) {
            if (err) {
                console.log(err)
                console.log(statusCodes)
            }

            if (typeof callback === "function") {
                callback(err);
            }
        });
    }

    readNode (nodeId, callback) {
        var nodeToRead = {
            nodeId: nodeId,
            attributeId: opcua.AttributeIds.Value
        }

        this.session.read(nodeToRead, callback)
    }

    readNodeAsync (nodeId) {
        var nodeToRead = {
            nodeId: nodeId,
            attributeId: opcua.AttributeIds.Value
        }
        
        return this.session.read(nodeToRead)
    }

    buildBrowsePath (namespace, ...pathArgs) {
        let path = "/Objects/"
        pathArgs.forEach((pathPart, index) => {
        if (index != 0) {
            path += "."
        }
    
        path += `${namespace}:${pathPart}`
        })
    
        return path
    }

    async findNodeId (namespace, ...pathArgs) {
        const rootNode = "RootFolder"
        const relativePath = this.buildBrowsePath(namespace, ...pathArgs)
        const browsePath = opcua.makeBrowsePath(rootNode, relativePath);
        const result = await this.session.translateBrowsePath(browsePath);
        const nodeId = result.targets[0].targetId;

        return nodeId.toString()
    }
}

module.exports = {
    Client
}