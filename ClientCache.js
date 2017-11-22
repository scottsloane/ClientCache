var ClientCache = (function(options) {

	var _Cache = [];
	var _Options = {
		defaultNameSpace : '*',
		defaultTTL : 36000,
		MaintanceInterval : 36000,
		MaxSize : 0,
		MaxNameSpaceSize : 0,
		Persist : false
	};
	var _maintainanceTimer;

	var _init_ = function(_options){
		if(typeof _options.defaultNameSpace !== 'undefined' && _options.defaultNameSpace != null) _Options.defaultNameSpace = _options.defaultNameSpace;
		if(typeof _options.defaultTTL !== 'undefined' && _options.defaultTTL != null) _Options.defaultTTL = _options.defaultTTL;
		if(typeof _options.MaintanceInterval !== 'undefined' && _options.MaintanceInterval != null) _Options.MaintanceInterval = _options.MaintanceInterval;
		if(typeof _options.MaxSize !== 'undefined' && _options.MaxSize != null) _Options.MaxSize = _options.MaxSize;
		if(typeof _options.MaxNameSpaceSize !== 'undefined' && _options.MaxNameSpaceSize != null) _Options.MaxNameSpaceSize = _options.MaxNameSpaceSize;
		if(typeof _options.Persist !== 'undefined' && _options.Persist != null) _Options.Persist = _options.Persist;

		_options = null;
		if(_Options.Persist) _reinstate();
		_maintain_();
		if(_Options.MaintanceInterval > 0) _maintainanceTimer = window.setInterval(_maintain_, _Options.MaintanceInterval);
	}

	var _maintain_ = function(){

		var n = Date.now();

		//Remove Expired
		for(var i in _Cache){
			if(_Cache[i].Exp <= n){
				_Cache.splice(i, 1);
			}
		}

		//Limit size of Cache
		var HashNames = _getNameSpaceList();
		for(var i in HashNames){
			var HashL = _length(HashNames[i]);
			if(HashL > _Options.MaxNameSpaceSize) _removeFromNameSpace(HashNames[i], HashL - _Options.MaxNameSpaceSize);
		}
		if(_Options.MaxSize > 0 && _Cache.length > _Options.MaxSize) _Cache.splice(0, (_Cache.length - _Options.MaxSize));
		if(_Options.Persist) _persist();
	}

	var _removeFromNameSpace = function(NameSpace, n){
		var rem = 0;
		for(var i in _Cache){
			if(_Cache[i].NameSpace == NameSpace) {
				_Cache.splice(i, 1);
				rem++;
				if(rem >= n) return true;
			}
		}
		return true;
	}

	var _add = function(Title, Data, NameSpace, TTL){
		
		//check vars
		if(typeof Title === 'undefined' || Title == '' || typeof Data === 'undefined' || Data.length === 0) return false;	
		if(typeof NameSpace === 'undefined') NameSpace = _Options.defaultNameSpace;
		if(typeof TTL === 'undefined') TTL = _Options.defaultTTL;

		var hash = getHash({
			Title : Title,
			Data : Data,
			NameSpace : NameSpace
		});
		var name = NameSpace+'_'+Title;

		var exists = false;
		for(var i in _Cache){
			if(_Cache[i].Name === name){
				exists = i;
				break
			}
		}

		var obj = {
			Name : name,
			NameSpace : NameSpace,
			Title : Title,
			Data : Data,
			Created : Date.now(),
			Exp : Date.now() + TTL,
			Hash : hash
		}

		if(exists) _Cache[exists] = obj;
		else _Cache.push(obj);
		return true;
	}

	var _remove = function(Title, NameSpace){
		if(typeof Title === 'undefined' || Title == '') return false;
		if(typeof NameSpace === 'undefined' || NameSpace === null) NameSpace = _Options.defaultNameSpace;

		var hash = getHash({
			Title : Title,
			Data : Data,
			NameSpace : NameSpace
		});
		var name = NameSpace+'_'+Title;

		for(var i in _Cache){
			if(_Cache[i].Name === name){
				_Cache.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	var _fetch = function(Title, NameSpace){
		if(typeof Title === 'undefined' || Title == '') return false;
		if(typeof NameSpace === 'undefined' || NameSpace === null) NameSpace = _Options.defaultNameSpace;

		var hash = getHash({
			Title : Title,
			Data : Data,
			NameSpace : NameSpace
		});
		var name = NameSpace+'_'+Title;
		for(var i in _Cache){
			if(_Cache[i].Name === name) return _Cache[i].Data;
		}
		return false; 
	}

	var _clear = function(NameSpace){
		if(typeof NameSpace === 'undefined' || NameSpace === '') NameSpace = _Options.defaultNameSpace;

		if(NameSpace === null) {
			_Cache = [];
			_unpersist();
		}else{
			for(var i in _Cache){
				if(_Cache[i].NameSpace === NameSpace) _Cache.splice(i,1);
			}
			_persist();
		}
	}

	var _persist = function(){
		if (typeof(Storage) !== "undefined") {
	 	   if(_Cache.length > 0) localStorage.setItem("Cache", JSON.stringify(_Cache));
	 	   else _unpersist();
		}
	}

	var _unpersist = function(){
		if (typeof(Storage) !== "undefined") {
	 	   localStorage.removeItem("Cache");
		}
	}

	var _reinstate = function(){
		if (typeof(Storage) !== "undefined") {
	 	   var c = localStorage.getItem("Cache");
	 	   _Cache = (typeof c === 'string' && c !== '') ? JSON.parse(c) : [];
		}
	}

	var _length = function(NameSpace){
		if(typeof NameSpace === 'undefined' || NameSpace === '') NameSpace = _Options.defaultNameSpace;

		if(NameSpace === null) return _Cache.length;
		else{
			var cnt = 0;
			for(var i in _Cache){
				if(_Cache[i].NameSpace === NameSpace) cnt++;
			}
			return cnt;
		}
	}

	var getHash = function(obj){
		var input = '';
		if(typeof obj === 'string') input = obj;
		else if(typeof obj === 'object') input = JSON.stringify(obj);

	    var hash = 0;
	    if (input.length == 0) return hash;
	    for (var i = 0; i < input.length; i++) {
	        char = input.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash;
	    }
	    return hash;
	};

	var _getNameSpaceList = function(){
		var ret = [];
		for(var i in _Cache){
			var found = false;
			for(var j in ret){
				if(_Cache[i].NameSpace == ret[j]) {
					found = true;
				};
			}
			if(!found) ret.push(_Cache[i].NameSpace)
		}
		return ret;
	}

	if(typeof options === 'undefined') options = {};
	_init_(options);

	return {
		add : _add,
		remove : _remove,
		fetch : _fetch,
		length : _length,
		clear : _clear
	}

});