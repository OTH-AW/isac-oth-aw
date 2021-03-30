var opcua = require("node-opcua");
var async = require("async");

const client = opcua.OPCUAClient.create({
    endpoint_must_exist: false
});

const subscriptionConfig = {
    requestedPublishingInterval: 100,
    requestedLifetimeCount: 10,
    requestedMaxKeepAliveCount: 2,
    maxNotificationsPerPublish: 10,
    publishingEnabled: true,
    priority: 10
};

const monitoredItemConfig = {
    samplingInterval: 1,
    discardOldest: true,
    queueSize: 10
};

let session;
let initSession = endpointUrl => async.series([

    // step 1 : connect to
    function (callback) {
        client.connect(endpointUrl, function (err) {
            if (err) {
                console.log(" cannot connect to endpoint :", endpointUrl);
            } else {
                console.log("connected ! " + endpointUrl);
            }
            callback(err);
        });
    },

    // step 2 : createSession
    function (callback) {
        client.createSession(function (err, s) {
            if (!err) {
                session = s;
            }
            callback(err);
        });
    }
],
	// Error
    function (err) {
        if (err) {
            console.log(" failure ", err);
        }
    });

// step 3: install a subscription and install a monitored item for 10 seconds
let monitorNodes = function (nodes, onDataChange) {
    let subscription = opcua.ClientSubscription.create(session, subscriptionConfig);

    subscription.on("started", function () {
        console.log("subscription started for subscriptionId=", subscription.subscriptionId);
    }).on("keepalive", function () {
        console.log("keepalive");
    }).on("terminated", function () {
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
			monitoredItemConfig,
			opcua.TimestampsToReturn.Both
		);
		
		console.log("-------------------------------------");
		
		monitoredItem.on("changed", onDataChange);
    });

    return subscription;
}

module.exports = {
    initSession,
    monitorNodes,
    terminateSubscription: subscription => {
        console.info("terminating subscription: " + subscription);
        subscription.terminate();
    }
}