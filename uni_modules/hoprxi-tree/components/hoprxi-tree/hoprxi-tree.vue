<template>
	<view>
		<block v-for="(tree,index) in treesList" :key="index">
			<hoprxi-tree-item :position='index' :node="tree.root" :checkType="checkType"
				:checkOnlyLeaf="checkOnlyLeaf" :indent="indent"></hoprxi-tree-item>
		</block>
	</view>
</template>

<script>
	/*
	 * @property {Array} trees 层级数组，id项目的列不能有重复的值
	 * @property {Number} indent,每层级间的缩进
	 */
	import {
		getPropertyFromData,
	} from '@/common/js/util.js';
	import HoprxiTreeItem from './hoprxi-tree-item.vue';
	import {
		Node,
		Tree
	} from './Tree.js';
	export default {
		name: 'hoprxi-tree',
		components: {
			HoprxiTreeItem
		},
		props: {
			trees: {
				type: Array,
				default: [],
				required: true,
			},
			indent: {
				type: Number,
				default: 48
			},
			checkedIds: {
				type: Array,
				default: []
			},
			expandedIds: {
				type: Array,
				default: []
			},
			disabledIds: {
				type: Array,
				default: []
			},
			expendAll: {
				type: Boolean,
				default: false
			},
			checkOnlyLeaf: {
				type: Boolean,
				default: false
			},
			checkType: {
				type: String,
				default: 'checkbox',
				validator(value) {
					return value === 'radio' || value === 'checkbox' || '' === value
				}
			},
			// 配置选项
			props: {
				type: Object,
				default: {
					id: 'id', // 指定id为节点对象的某个属性值
					sub: 'sub', // 指定子树为节点对象的某个属性值
					label: 'name', // 指定标签为节点对象的某个属性值
					icon: 'icon', // 指定图标为节点对象的某个属性值
				}
			},
			lazy: Function,
		},
		data() {
			return {
				treesList: [],
				selected: [],
				btnArr: [{
					name: '编辑',
					background: '#00aaff',
					width: 120,
					color: '#fff',
					events: 'edit'
				}, {
					name: '删除',
					width: 120,
					background: '#ff5500',
					color: '#fff',
					events: 'del'
				}],
			}
		},
		created() {
			if (typeof this.props !== 'object') throw new Error('props must be of object type.');
			this.toTreeList(this.trees);
			for (const tree of this.treesList) {
				if (!this.expendAll) tree.presetExpanded(this.expandedIds);
				this.selected = tree.presetChecked(this.checkedIds);
				//console.log(tree.depth("4"))
			}
			//let hm = new HashMap();
			//for (let i = 0; i < 16; i++) hm.put(i+'哈哈', i + '是我');
			//for (let i = 0; i < 16; i++) console.log(hm.get('0哈哈'));
		},
		provide() {
			return {
				treesList: this.treesList,
				selected: this.selected,
				trees: this
			}
		},
		watch: {
			checkedIds() {
				for (const tree of this.treesList) {
					tree.presetChecked(this.checkedIds);
					/*多层set设置，第三层后不再响应解决方案
					1、正常修改，不使用set,然后map()将原数组拷贝到一个临时数组，原数组清空（length=0)，设置原数组等于修改后的临时数组
						let temp=source.map((x) => x);
						source.legth=0;
						source=temp;
					2、增加第三层数组为空，foreach设置第三层数组的值
					this.$set(this.obj[level1Index].children[level2Index],'children',[])
					res.items.forEach((item,index)=>{
						this.obj[level1Index].children[level2Index]
						this.$set(this.obj[level1Index].children[level2Index].children,index,item)
					})
					3、自己的设计
						let i=0;
						for(const tree of treesList){
							this.$set(this.treesList[i].nodeHashMap.get(this.checkedIds[0]),'checked',true);
							i++;
						}
				*/
				}
			},
			expandedIds() {
				for (const tree of this.treesList) {
					tree.presetExpanded(this.expandedIds);
				}
			},
			trees() {
				this.toTreeList(this.trees);
			}
		},
		methods: {
			toTreeList(trees) {
				for (const tree of trees) {
					const id = getPropertyFromData(tree, this.props, 'id');
					const label = getPropertyFromData(tree, this.props, 'label');
					const icon = getPropertyFromData(tree, this.props, 'icon');
					let root = new Tree(new Node(id, label, icon), this.checkOnlyLeaf);
					if (this.disabledIds.includes(root.root.id)) root.root.disabled = true;
					const sub = getPropertyFromData(tree, this.props, 'sub');
					if (Array.isArray(sub) && sub.length > 0) {
						this.toTree(root, root.root, sub);
					}
					this.treesList.push(root);
				}
			},
			toTree(tree = undefined, parent, sub = []) {
				if (this.expendAll) parent.expanded = true;
				for (const node of sub) {
					const id = getPropertyFromData(node, this.props, 'id');
					const label = getPropertyFromData(node, this.props, 'label');
					const icon = getPropertyFromData(node, this.props, 'icon');
					let child = new Node(id, label, icon);
					if (parent.expanded) child.visible = true;
					if (this.checkedIds.includes(child.id)) child.checked = true;
					if (this.disabledIds.includes(child.id)) child.disabled = true;
					tree.addChild(parent, child);
					let sub = getPropertyFromData(node, this.props, 'sub');
					if (Array.isArray(sub) && sub.length > 0) {
						this.toTree(tree, child, sub);
					}
				}
				return tree;
			},
			getSelectedNodes(includeHalfChecked) {
				//this.checkedIds=this.checkedIds;
				//console.log(this.selected);
				return this.selected;
			},
			/*
			 * @description 获取节点路径
			 * @method getNodePath
			 * @param {key} data 节点数据
			 * @return {Array} 按照父子顺序排列的路径数组
			 */
			getNodePath(key) {
				return [];
			},
			check(object) {
				//console.log(object);
			},
			checkAll() {},
			uncheckAll() {},
			expandAll() {},
			collapseAll() {},
			search(key) {},
			add(parent, child) {},
			remove(key) {},
		}
	}
</script>

<style lang='scss'>
	.tree {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
