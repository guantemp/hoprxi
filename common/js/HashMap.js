export default function HashMap() {
	//初始大小
	var size = 0;
	//数组
	var table = [];
	//初始数组长度为8
	var length = 2 << 2;
	//加载因子
	var threshold = 0.75 * length;
	//hash值
	this.hash = function(input) {
		let a = 31,
			b = 0,
			c = input.length;
		for (; b < c;) a ^= (a << 5) + (a >> 2) + input.charCodeAt(b++);
		return a & 0x7FFFFFFF;
	}
	//返回HashMap的size
	this.size = function() {
		return size;
	}
	//是否包含某个key
	this.containsKey = function(key) {
		if (key == null || key == undefined) return false;
		let hash = this.hash(key);
		for (var e = table[hash]; e != null && e != undefined; e = e.next) {
			if (e.key === key) {
				return true;
			}
		}
		return false;
	}
	//是否包含某个value
	this.containsValue = function(value) {
		for (const v of table) {
			for (; v != null && v != undefined; v = v.next) {
				if (JSON.stringify(v.value) === JSON.stringify(value)) {
					return true;
				}
			}
		}
		return false;
	}
	//HashMap是否为空
	this.isEmpty = function() {
		return size === 0;
	}
	//向HashMap中存放值
	this.put = function(key, value) {
		if (key == null || key == undefined) return
		let hash = this.hash(key);
		for (let e = table[hash]; e != null && e != undefined; e = e.next) {
			if (e.key === key) {
				let oldValue = e.value;
				e.value = value;
				return oldValue;
			}
		}
		this.addEntry(key, value, hash)
	}
	//添加一个新的桶来保存key和value
	this.addEntry = function(key, value, bucketIndex) {
		// 旧值
		let old = table[bucketIndex];
		// 然后用新的桶套住旧的桶，链表，是个套娃
		table[bucketIndex] = {
			key: key,
			value: value,
			next: old
		}
		// 如果当前size大于等于阈值
		if (size++ >= threshold)
		// 调整容量
		{
			length = length << 1;
			threshold = 0.75 * length;
		}
	}
	//从HashMap中获取值
	this.get = function(key) {
		if (key == null || key == undefined) return undefined
		let hash = this.hash(key);
		//console.log(hash);
		for (let e = table[hash]; e != null && e != undefined; e = e.next) {
			if (e.key === key) {
				return e.value;
			}
		}
		return undefined;
	}
	//从HashMap中删除值
	this.remove = function(key) {
		if (key == null || key == undefined) return undefined
		let hash = this.hash(key);
		let prev = table[hash];
		let e = prev;
		while (e != null && e != undefined) {
			let next = e.next;
			if (e.key === key) {
				size--;
				if (prev == e) {
					table[hash] = next;
				} else {
					prev.next = next;
				}
				return e;
			}
			prev = e;
			e = next;
		}
		return e == null || e == undefined ? undefined : e.value;
	}
	//清空HashMap
	this.clear = function() {
		table = [];
		// 设置size为0
		size = 0;
		length = 2 << 2;
	}
	//获取HashMap中所有的键值对
	this.getEntries = function() {
		let entries = [];
		for (const v of table) {
			for (; v != null && v != undefined; v = v.next) {
				entries.push({
					key: v.key,
					value: v.value
				})
			}
		}
		return entries;
	}
}
