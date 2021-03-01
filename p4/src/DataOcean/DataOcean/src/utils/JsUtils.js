class JsUtils{
	static removeIndex(arr, i){
		if(arr[i]) arr.splice(i,1);
	}
	static removeObject(arr, obj){
		if(arr.indexOf(obj) > -1){
			arr.splice(arr.indexOf(obj),1);
		}
	}
}