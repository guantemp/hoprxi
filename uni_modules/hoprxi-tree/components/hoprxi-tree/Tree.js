//节点
export class TreeNode {
	constructor(id, label, icon) {
		this.id = id;
		this.label = label
		this.icon = icon;
		this.parentId = null;
		this.firstChild = null;
		this.next = null;
		this.isLeaf = true;
		this.depth = 0;
		//
		this.visible = false;
		this.expanded = false;
		this.disabled = false;
		this.checked = false;
		this.indeterminate = false;
	}
}
export class Tree {
	constructor(root, isCheckOnlyLeaf, nodeCheckType) {
		if (!root || !root instanceof TreeNode) throw new Error('parent and child required Node class');
		this.root = root;
		this.root.visible = true;
		this.nodeMap = new Map();
		this.isCheckOnlyLeaf = false;
		this.nodeCheckType = 'indeterminate';
		this.nodeMap.set(root.id, this.root);
	}
	/*
	 * @description 增加子元素
	 * @param {parent} 父亲节点
	 * @param {child} 儿子节点
	 */
	addChild(parent, child) {
		if (!parent instanceof TreeNode || !child instanceof TreeNode) throw new Error(
			'parent and child required Node class');
		const _sibling = (previous, next) => {
			let previousNode = this.nodeMap.get(previous);
			if (previousNode) {
				if (previousNode.next) {
					_sibling(previousNode.next, next);
				} else {
					previousNode.next = next;
				}
			}
		}
		child.parentId = parent.id;
		child.depth = parent.depth + 1;
		parent.isLeaf = false;
		this.nodeMap.set(child.id, child);
		if (parent.firstChild) {
			_sibling(parent.firstChild, child.id);
		} else {
			parent.firstChild = child.id;
		}
	}
	/*
	 * @description 获取根节点路径
	 * @return Object 根节点
	 */
	root() {
		return this.root;
	}
	parent(node) {
		if (node) return this.nodeMap.get(node.parentId);
		return null;
	}
	siblings(sibling) {
		if (!sibling instanceof TreeNode) throw new Error('sibling required Node class');
		if (sibling.parentId) {
			let parent = this.nodeMap.get(sibling.parentId);
			return children(parent);
		}
		return [];
	}
	children(parent) {
		if (!parent instanceof TreeNode) throw new Error('parent required Node class');
		const _child = (children, next) => {
			let nextNode = this.nodeMap.get(next);
			children.push(nextNode);
			if (nextNode.next) {
				_child(children, nextNode.next);
			}
		}
		let children = [];
		if (parent.firstChild) {
			_child(children, parent.firstChild);
		}
		return children;
	}
	getNode(id) {
		return this.nodeMap.get(id);
	}
	path(node) {
		let path = [];
		const _path = (path, node) => {
			if (node.parentId) {
				let temp = this.nodeMap.get(node.parentId);
				path.push(temp);
				if (temp.parentId) _path(path, temp);
			}
		}
		_path(path, node);
		return path.reverse();
	}
	traversal(node, fn) {
		if (typeof fn === "function") {}
	}
	depth(key) {
		if (key === null) return 0;
		let a = 0;
		let b = 0;
		let node = this.nodeMap.get(key);
		if (node) {
			a = this.depth(node.firstChild) + 1;
			b = this.depth(node.next);
		}
		return Math.max(a, b);
	}
	filter(value, data) {}
	//展开节点
	expandAll() {
		this.root.expanded = true;
		this._expandOrCollapseChild(this.root, true);
	}
	collapseAll() {
		this.root.expanded = false;
		this._expandOrCollapseChild(this.root, false);
	}
	_expandOrCollapseChild(node, expandOrCollapseSign) {
		if (node) {
			let children = this.children(node);
			for (const child of children) {
				child.visible = expandOrCollapseSign;
				child.expanded = expandOrCollapseSign;
				if (child.isLeaf) continue;
				this._expandOrCollapseChild(child, expandOrCollapseSign)
			};
		}
	}
	presetExpanded(expandIds = []) {
		const _sibling = (node) => {
			if (node) {
				node.visible = true;
				_sibling(this.nodeMap.get(node.next));
			}
		}
		const _primordial = (node) => {
			let parent = this.nodeMap.get(node.parentId);
			if (parent) {
				//console.log(parent.label + ":" + parent.expanded + ":" + parent.visible);
				if (parent.expanded && parent.visible) return; //兄弟节点处理过
				parent.expanded = true; //控制展开，收缩图标
				parent.visible = true; //控制显示隐藏
				_sibling(this.nodeMap.get(parent.firstChild)); //兄弟节点显示，不处理兄弟的字节点
				_primordial(parent);
			}
		}
		for (const id of expandIds) {
			let node = this.nodeMap.get(id);
			//本节点已显示的不在处理,并不处理子节点
			if (node && !node.visible) {
				//console.log(this.root.label + ":" + (!node.visible || id === this.root.id));
				node.visible = true;
				_primordial(node); //展开父节点
			}
		}
	}
	//与直接check有些区别
	presetChecked(checkedIds = []) {
		const _child = (selected, node) => {
			if (node) {
				node.checked = true;
				selected.push(node);
				if (node.isLeaf) return;
				let children = this.children(node);
				for (const child of children) _child(selected, child);
			}
		}
		const _primordial = (selected, node) => {
			let parent = this.nodeMap.get(node.parentId);
			if (parent) {
				let children = this.children(parent);
				for (const child of children) {
					if (!child.checked) {
						parent.indeterminate = true;
						break;
					}
				}
				if (!parent.indeterminate) {
					parent.checked = true;
					selected.push(parent);
				}
				_primordial(selected, parent);
			}
		}
		let selected = [];
		for (const id of checkedIds) {
			let basic = this.nodeMap.get(id);
			if (basic) {
				_child(selected, basic);
				_primordial(selected, basic);
			}
		}
		return Array.from(new Set(selected)); //去重
	}
	
	checked(node, isChecked, isCheckOnlyLeaf) {
		const _child = (selected, node) => {
			if (node) {
				let children = this.children(node);
				for (const child of children) {
					if (child.indeterminate) child.indeterminate = false;
					child.checked = node.checked;
					if (child.checked) selected.push(child);
					if (child.isLeaf) continue;
					_child(selected, child)
				};
			}
		}
		const _primordial = (selected, node) => {
			let parent = this.nodeMap.get(node.parentId);
			if (parent) {
				parent.indeterminate = false; //init
				let children = this.children(parent);
				let noCheckSign, checkSign = false;
				for (const child of children) {
					if (child.indeterminate) parent.indeterminate = true;
					if (child.checked) checkSign = true;
					else noCheckSign = true;
				}
				if (checkSign && noCheckSign) {
					parent.indeterminate = true;
				} else if (checkSign && !noCheckSign) {
					parent.checked = true;
					selected.push(parent);
				} else {
					parent.checked = false;
				}
				_primordial(selected, parent);
			}
		}
		let selected = [];
		if (node && isCheckOnlyLeaf) {
			node.checked = isChecked;
			if (node.checked) return [node];
			return selected
		}
		if (node) {
			node.indeterminate = false;
			node.checked = isChecked;
			if (node.checked) selected.push(node);
			_child(selected, node);
			_primordial(selected, node);
		}
		return selected;
	}
	
	remove(node) {
		if (node.firstChild) {}
	}
}
