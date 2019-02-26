### Updates
* 2018/08/24 Upgrade with new authentication for EasyAR CRS Cloud 3.0 API, and more APIs are opened for managing databases.

* 2018/08/07 NodeJS SDK v1.0 for EasyAR CRS Cloud.

### Classes

#### Targeter
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

#### Searcher
Searching of targets

* `function gatewayClient(host, appKey, appSecret)`
  * `function ping()`
  * `function search(image)`
  * `function createTunnel()`
  * `function searchViaTunnel(tunnel, image)`
  * `function searchViaTunnelOnHost(host, tunnel, image)`

### Sample usage
To see more examples check bin folder.

#### Add a target represented by an image
```javascript
var farmer = sdk.farmer('http://localhost:8888', 'test_app_key', 'test_app_secret');

farmer.createTarget({
    'image': fs.readFileSync('test.jpg').toString('base64')
    'name':'sdk-test',
    'size':'20',
    'meta':'http://my.com/my-3d-model-example',
    'type':'ImageTarget'
})
.then(function(resp) {
    console.log(resp.result.targetId);
})
.catch(function(err) {
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
.catch(function(err) {
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
