<template>
	<block v-for="(tree,index) in treeList" :key="index">
		<hoprxi-tree-item :position='index' :node="tree.root" :checkType="checkType" :checkOnlyLeaf="checkOnlyLeaf"
			:indent="indent"></hoprxi-tree-item>
	</block>
</template>

<script>
	/*
	 * @property {Array} trees 层级数组，id项目的列不能有重复的值
	 * @property {Number} indent,层级间的缩进
	 * @property {Array} checkedIds,选中id集
	 * @property {Array} expandedIds,展开的id集
	 *  @event {Function} check 选中一个节点事件，返回包含选中节点和所有选中节点的一个对象
	 */
	import {
		reactive,
		onMounted,
		provide
	} from 'vue';
	import {
		getPropertyFromData,
	} from '@/js_sdk/util.js';
	import HoprxiTreeItem from './hoprxi-tree-item.vue';
	import {
		TreeNode,
		Tree
	} from './tree.js';
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
				default: 56
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
					sub: 'children', // 指定子树为节点对象的某个属性值
					label: 'name', // 指定标签为节点对象的某个属性值
					icon: 'icon', // 指定图标为节点对象的某个属性值
				}
			},
			lazy: Function,
		},
		setup(props, content) {
			const treeList = reactive([]);
			const initTreeList = () => {
				const _toTree = (tree = undefined, parent, sub = []) => {
					if (props.expendAll) parent.expanded = true;
					for (const node of sub) {
						const id = getPropertyFromData(node, props.props, 'id');
						const label = getPropertyFromData(node, props.props, 'label');
						const icon = getPropertyFromData(node, props.props, 'icon');
						let child = new TreeNode(id, label, icon);
						if (parent.expanded) child.visible = true;
						if (props.checkedIds.includes(child.id)) child.checked = true;
						if (props.disabledIds.includes(child.id)) child.disabled = true;
						tree.append(parent, child);
						let sub = getPropertyFromData(node, props.props, 'sub');
						if (Array.isArray(sub) && sub.length > 0) {
							_toTree(tree, child, sub);
						}
					}
				}
				for (const tree of props.trees) {
					const id = getPropertyFromData(tree, props.props, 'id');
					const label = getPropertyFromData(tree, props.props, 'label');
					const icon = getPropertyFromData(tree, props.props, 'icon');
					let root = new Tree(new TreeNode(id, label, icon), props.checkOnlyLeaf,props.checkType);
					if (props.disabledIds.includes(root.root.id)) root.root.disabled = true;
					const sub = getPropertyFromData(tree, props.props, 'sub');
					if (Array.isArray(sub) && sub.length > 0) {
						_toTree(root, root.root, sub);
					}
					treeList.push(root);
				}
			}
			onMounted(initTreeList);
			onMounted(() => {
				for (const tree of treeList) {
					if (!props.expendAll) tree.presetExpanded(props.expandedIds);
					tree.presetChecked(props.checkedIds);
					//props.selected = tree.presetChecked(props.checkedIds);
				}
			});	
			provide("treeList", treeList);
			provide("content", content);
			return {
				treeList,
			}
		},
		data() {
			return {
				selected: [],
				buttons: [{
					name: '编辑',
					background: '#00aaff',
					width: 120,
					icon: 'edit.png',
					color: '#fff',
					events: 'edit'
				}, {
					name: '删除',
					width: 120,
					background: '#ff5500',
					icon: 'delete.png',
					color: '#fff',
					events: 'del'
				}],
			}
		},
		/*
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
		*/
		methods: {
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
