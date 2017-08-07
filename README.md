### Classes

#### Farmer
CRUD for targets

* `function farmerClient(host, appKey, appSecret)`
  * `function ping()`
  * `function getTargets()`
  * `function getTargetsCount()`
  * `function createTarget(target)`
  * `function getTarget(targetId)`
  * `function updateTarget(targetId, data)`
  * `function deleteTarget(targetId)`
  * `function similar(image)`
  * `function getDetectionGrade(image)`
  * `function getTrackingGrade(image)`

#### Gateway
Searching of targets

* `function gatewayClient(host, appKey, appSecret)`
  * `function ping()`
  * `function search(image)`
  * `function createTunnel()`
  * `function searchViaTunnel(tunnel, image)`
  * `function searchViaTunnelOnHost(host, tunnel, image)`

### Sample usage

#### Add a target represented by an image
```javascript
var farmer = sdk.farmer('http://localhost:8888', 'test_app_key', 'test_app_secret');

farmer.createTarget({
    'egg': 'spam',
    'image': fs.readFileSync('test.jpg').toString('base64')
})
.then(function(resp) {
    console.log(resp.result.targetId);
})
.fail(function(err) {
    console.log(err);
});
```

#### Search a target by an image
```javascript
var gateway = sdk.gateway('http://localhost:8080', 'test_app_key', 'test_app_secret');

gateway.createTunnel()
.then(function(resp) {
    var tunnel = resp.result.tunnel;
    var image = {
        'foo': 'bar',
        'image': fs.readFileSync('test.jpg')
    };
    return gateway.searchViaTunnel(tunnel, image);
})
.then(function(resp) {
    console.log(resp.result.target.targetId);
})
.fail(function(err) {
    console.log(err);
});
```

### Scripts

#### `addTarget`
```
Usage: addTarget [image] -t [host] -c [keys]

Options:
  -h, --help  Show help                                                [boolean]
  -t, --host                                  [default: "http://localhost:8888"]
  -c, --keys                                              [default: "keys.json"]

copyright 2015, sightp.com
```

#### `getTarget`
```
Usage: getTarget [targetId] -t [host] -c [keys]

Options:
  -h, --help  Show help                                                [boolean]
  -t, --host                                  [default: "http://localhost:8888"]
  -c, --keys                                              [default: "keys.json"]

copyright 2015, sightp.com
```

#### `searchTarget`
```
Usage: searchTarget [image] -t [host] -c [keys]

Options:
  -h, --help  Show help                                                [boolean]
  -t, --host                                  [default: "http://localhost:8080"]
  -c, --keys                                              [default: "keys.json"]

copyright 2015, sightp.com
```

#### `deleteTarget`
```
Usage: deleteTarget [targetId] -t [host] -c [keys]

Options:
  -h, --help  Show help                                                [boolean]
  -t, --host                                  [default: "http://localhost:8888"]
  -c, --keys                                              [default: "keys.json"]

copyright 2015, sightp.com
```
