# ClientCache
Javascript Client-Side persistent Cache

By Scott Sloane (scott@scottsloane.com)

2017

## Description
ClientCache is a Client-Side persistent caching library.  It allows caching of data in the browser during run-time and allows for the cache to be stored in HTML5 Web Storage, if available, for persistence between sessions.  It is intended to be flexible and easy.  It's implementation can allow for a decrease in redundant calls to server resources such as API calls.

## Features
* Add, Fetch and Remove from the cache
* Use Name Spaces to segment cache data
* Interval based maintenance
* TTL for every document
* Maximum cache size and maximum Name Space cache size
* Optional persistence if available in browser 

## Usage
### Include the library
```
<script src='ClientCache.js'></script>
```
### Create Cache
```
var Cache = ClientCache(options);
```
### Options

Options can be passed with the constructor to setup the Cache.  This is completely optional and each setting in the Options object is optional as well.  The Options object may contain one or more of the following.  Any options not passed will retain their default settings.

+ **defaultNameSpace**: Use this string name for a Name Space if one isn't explicitly passed **(Default: '*')**
+ **defaultTTL** : Use this as the Time to Live if one isn't explicitly passed **(Default: 36000)**
+ **MaintanceInterval** : The interval to run maintenance on the Cache **(Default: 36000)**
+ **MaxSize**: Maximum number of items in entire cache, 0 for infinite **(Default: 0)**
+ **MaxNameSpaceSize**: Maximum number of items in a Name Space, 0 for infinite **(Default: 0)**
+ **Persist**: Use Persistence **(Default: false)**

```
var Cache = ClientCache({		
	defaultNameSpace : 'MyApp',
	defaultTTL : 60000*30,
	MaintanceInterval : 30000,
	MaxSize : 5000,
	MaxNameSpaceSize : 500,
	Persist : false
});
```

### Add an Item
Adding an item to the cache is done with the **add** function.  The function takes a *Key*, *Value*, (optional) *Name Space*, and (Optional) *TTL*.  If Optional arguments are left out defaults are used.

**Returns**: *true* if success; *false* if bad data was supplied
```
Cache.add('MyItemKey', myData, 'NameSpace');
```

### Fetching an Item
Fetching an Item from the Cache is done with the **fetch** function.  The function takes a *Key* and *Name Space*.

**Returns**: *Value* if found; *false* if key is not in Cache.
```
Cache.fetch('MyItemKey', 'NameSpace');
```

### Removing an Item
Removing an Item from the Cache is done with the **remove** function. The function takes a *Key* and *Name Space*.

**Returns**: *true* if it was removed; *false* if it was not found 

```
Cache.remove('MyItemKey', 'NameSpace');
```

### Clearing the Cache
To Clear the Cache use the **clear** function.  The function optionally takes a *Name Space* or *null* value.  If no *Name Space* is supplied, the default Name Space is cleared.  If *null* is supplied instead of a Name Space the entire Cache is cleared.  If, after clearing the Cache, and Persistence is being utilized this will remove the Key from Web Storage as well.

**Returns**:  *none*
```
Cache.clear(); //Clear the default Name Space
Cache.clear('NameSpace'); //Clear a specific Name Space
Cache.clear(null); //Clear the entire Cache
```

### Getting the size of the Cache
To get the size of the Cache use the **length** function.  The function optionally takes a *Name Space* or *null* value.  If no *Name Space* is supplied, the default Name Space size is returned.  If *null* is supplied instead of a Name Space the total Cache size is returned.

**Returns**: Number of Items in Cache
```
Cache.length(); //Get the size of the default Name Space
Cache.length('NameSpace'); //Gets the size of a specific Name Space
Cache.length(null); //Get the size of the entire Cache
```

## Performance Notes
### Persistence
Persistence performance is currently limited by JSON.parse and JSON.stringify. 

### For Loops
Most functions contain at least one for loop that iterates the entire cache.  This can become a bottleneck given a large enough Cache.

## ToDo
### Name vs. Hash
Currently a Cache items name is stored in the Hash attribute of the item.  This is incorrect as hashing is intended for calculating a hash of the entire item.

### Hashing
Hashing will be added to the Cache items in order to quickly detect if an item exists in the cache with the same information.  This will allow for optional overwrites.