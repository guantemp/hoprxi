<template>
	<view v-show="node.visible" class="flex padding-tb-xs bg-white align-center text-xl"
		:style="{paddingLeft: node.depth * indent + 'rpx',background:true?'#F5F7FA':'#FFF'}"
		@tap.stop="expandOrCollapse">
		<text class="cuIcon-playfill padding-left-xs margin-right-xs node-expand-icon" :class="[
				{
					'leaf': node.isLeaf, 
					'expended': !node.isLeaf && node.expanded
				}, 
				]">
		</text>
		<template v-if="checkType">
			<template v-if="checkOnlyLeaf">
				<hoprxi-checkbox v-show="node.isLeaf" :type="checkType" :checked="node.checked"
					:indeterminate="node.indeterminate" :disabled="!!node.disabled" @check="check" />
			</template>
			<template v-else>
				<hoprxi-checkbox :type="checkType" :checked="node.checked" :indeterminate="node.indeterminate"
					:disabled="!!node.disabled" @check="check" />
			</template>
		</template>
		<text class="margin-left-xs">{{node.label}}</text>
	</view>
	<template v-if="node.firstChild">
		<hoprxi-tree-item :position='position' :node="child" :checkType="checkType" :indent="indent"
			:checkOnlyLeaf="checkOnlyLeaf" v-for="(child,index) in children" :key="child.id">
		</hoprxi-tree-item>
	</template>
</template>

<script>
	/*
	 * 1、自己引用自己是递归组件的关键,必须在components中声明
	 * 2、需要去pages.json中的globalStyle项使用usingComponents添加此组件，否则小程序中将不会显示
	 */
	import {
		inject,
		reactive,
	} from 'vue'
	import HoprxiCheckbox from './hoprxi-checkbox.vue';
	import HoprxiTreeItem from './hoprxi-tree-item.vue';
	export default {
		name: 'HoprxiTreeItem',
		components: {
			HoprxiCheckbox,
			HoprxiTreeItem
		},
		props: {
			position: {
				type: Number,
				default: 0
			},
			node: {
				type: Object,
				default: {},
				required: true,
			},
			checkType: {
				type: String,
				default: ''
			},
			checkOnlyLeaf: Boolean,
			indent: Number,
		},
		setup(props) {
			let treeList = inject("treeList");
			let content = inject("content");
			const check = () => {
				treeList[props.position].checked(props.node, !props.node.checked, props.checkOnlyLeaf);
				let selected = treeList[props.position].selected;
				content.emit('check', {
					node: props.node,
					selected: selected
				})
			};
			return {
				treeList,
				check,
			}
		},
		computed: {
			children: function() {
				return this.treeList[this.position].children(this.node);
			}
		},
		methods: {
			expandOrCollapse() {
				const _collapse = (children) => {
					for (const child of children) {
						this.$set(child, 'visible', false);
						children = this.treeList[this.position].children(child);
						if (children) _collapse(children);
					}
				};
				const _expand = (children) => {
					for (const child of children) {
						child.visible = true;
						//this.$set(this.treeList[this.position].getNode(child.id),'visible', true)
						if (child.expanded) {
							children = this.treeList[this.position].children(child);
							if (children) _expand(children);
						}
					}
				}
				if (this.node.isLeaf) return;
				let children = this.treeList[this.position].children(this.node);
				if (this.node.expanded) {
					_collapse(children);
					this.$emit('collapse', this.node);
				} else {
					//this.treeList[this.position]._expandOrCollapseChild(this.node,true);
					_expand(children);
					this.$emit('expand', this.node);
				}
				this.node.expanded = !this.node.expanded
			},
			/*
			check(data) {
				//let checkedNodes = this.treeList[this.position].checked(this.node, !this.node.checked, this.checkOnlyLeaf);
				//this.tree.$emit('check',this.node);
				
				this.$emit('checkNode', {
					node: this.node,
					//data: this.node.data,
					checkedNodes: checkedNodes
					//checkedKeys: this.tree.store.getCheckedKeys(),
					//halfCheckedNodes: this.tree.store.getHalfCheckedNodes(),
					//halfCheckedKeys: this.tree.store.getHalfCheckedKeys()
				});
				
			},*/
		}
	}
</script>

<style lang='scss'>
	.node-expand-icon {
		color: #C0C4CC;
		font-size: 28rpx;
		transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;

		&.leaf {
			color: transparent;
		}

		&.expended {
			transform: rotate(90deg)
		}
	}
</style>
