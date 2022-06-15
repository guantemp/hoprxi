<template>
	<view>
		<view v-show="node.visible" class="flex padding-tb-xs bg-white align-center text-xl"
			:style="{paddingLeft: node.depth * indent + 'rpx',background:highlight?'#F5F7FA':'#FFF'}"
			@tap.stop="expandOrCollapse">
			<text class="icon-triangle-arrow padding-left-xs margin-right-xs node-expand-icon" :class="[
				{
					'leaf': node.isLeaf, 
					'expended': !node.isLeaf&&node.expanded
				}, 
				]">
			</text>
			<template v-if="checkType">
				<template v-if="checkOnlyLeaf">
					<hoprxi-checkbox v-show="node.isLeaf" :type="checkType" :checked="node.checked"
						:indeterminate="node.indeterminate" :disabled="!!node.disabled" @check="check" />
				</template>
				<template v-else>
					<hoprxi :type="checkType" :checked="node.checked" :indeterminate="node.indeterminate"
						:disabled="!!node.disabled" @check="check" />
				</template>
			</template>
			<text class="margin-left-xs">{{node.label}}</text>
		</view>
		<template v-if="node.firstChild">
			<hoprxi-tree-item :position='position' :nodeId="child.id" :checkType="checkType" :indent="indent"
				:checkOnlyLeaf="checkOnlyLeaf" v-for="(child,index) in children" :key="index">
			</hoprxi-tree-item>
		</template>
	</view>
</template>

<script>
	/*
	 * 1、自己引用自己是递归组件的关键
	 * 2、否则需要去pages.json中的globalStyle项使用usingComponents添加此组件，小程序中将不会显示
	 */
	import HoprxiCheckbox from './hoprxi-checkbox.vue';
	import HoprxiTreeItem from './hoprxi-tree-item.vue';
	export default {
		name: 'hoprxi-tree-item',
		components: {
			HoprxiCheckbox,
			HoprxiTreeItem
		},
		props: {
			position: {
				type: Number,
				default: 0
			},
			nodeId: {
				type: [String, Number],
				default: '',
				required: true,
			},
			checkType: {
				type: String,
				default: ''
			},
			checkOnlyLeaf: Boolean,
			indent: Number,
		},
		inject: ['treesList', 'selected', 'trees'],
		data() {
			return {
				node: {},
			};
		},
		created() {
			this.$nextTick(function() {
				this.node = this.treesList[this.position].getNode(this.nodeId);
			});
			//this.treesList[this.position].presetExpanded(["-99"]);
			//console.log(this.treesList[this.position]);
		},
		computed: {
			children: function() {
				return this.treesList[this.position].children(this.node);
			}
		},
		methods: {
			expandOrCollapse() {
				if (this.node.isLeaf) return;
				const collapse = (children) => {
					for (const child of children) {
						this.$set(child, 'visible', false);
						child.visible = false;
						children = this.treesList[this.position].children(child);
						if (children) collapse(children);
					}
				};
				const expand = (children) => {
					for (const child of children) {
						this.$set(child, 'visible', true);
						if (child.expanded) {
							children = this.treesList[this.position].children(child);
							if (children) expand(children);
						}
					}
				}
				let children = this.treesList[this.position].children(this.node);
				if (this.node.expanded) {
					collapse(children);
					this.$emit('collapse', this.node);
				} else {
					//this.treesList[this.position]._expandOrCollapseChild(this.node,true);
					expand(children);
					this.$emit('expand', this.node);
				}
				this.node.expanded = !this.node.expanded
			},
			check() {
				let checkedNodes = this.treesList[this.position].checked(this.node, !this.node.checked, this
				.checkOnlyLeaf);
				this.$emit('check', {
					node: this.node,
					//data: this.node.data,c
					checkedNodes: checkedNodes
					//checkedKeys: this.tree.store.getCheckedKeys(),
					//halfCheckedNodes: this.tree.store.getHalfCheckedNodes(),
					//halfCheckedKeys: this.tree.store.getHalfCheckedKeys()
				});
			},
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
