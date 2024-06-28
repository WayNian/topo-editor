// import type { ILink, INode } from "@/types";

// const ActionType = {
//   ADD: "add",
//   DELETE: "delete",
//   UPDATE: "update"
// };

// class OperationRecord {
//   type: string;
//   data: (INode | ILink)[];
//   previousData: (INode | ILink)[];
//   constructor(type: string, data: (INode | ILink)[], previousData = []) {
//     this.type = type;
//     this.data = data;
//     this.previousData = previousData;
//   }
// }

// class NodeManager {
//   data: (INode | ILink)[];

//   constructor() {
//     this.data = [];
//     this.operationStack = [];
//   }

//   addData(newNodes: (INode | ILink)[]) {
//     const addedNodes = newNodes.map((node) => JSON.parse(JSON.stringify(node)));
//     this.data.push(...addedNodes);
//     this.operationStack.push(new OperationRecord(ActionType.ADD, addedNodes));
//   }

//   deleteData(nodeIds: string[]) {
//     const deletedNodes = [];
//     nodeIds.forEach((nodeId) => {
//       const index = this.data.findIndex((node) => node.nodeId === nodeId);
//       if (index !== -1) {
//         deletedNodes.push(this.data[index]);
//         this.data.splice(index, 1);
//       }
//     });
//     this.operationStack.push(new OperationRecord(ActionType.DELETE, deletedNodes));
//   }

//   updateData(updates) {
//     const updatedNodes = [];
//     const previousNodes = [];
//     updates.forEach(({ nodeId, newNodeData }) => {
//       const index = this.data.findIndex((node) => node.nodeId === nodeId);
//       if (index !== -1) {
//         previousNodes.push(JSON.parse(JSON.stringify(this.data[index])));
//         this.data[index] = { ...this.data[index], ...newNodeData };
//         updatedNodes.push(this.data[index]);
//       }
//     });
//     this.operationStack.push(new OperationRecord(ActionType.UPDATE, updatedNodes, previousNodes));
//   }

//   undo() {
//     if (this.operationStack.length === 0) return;

//     const lastOperation = this.operationStack.pop();
//     switch (lastOperation.type) {
//       case ActionType.ADD:
//         lastOperation.data.forEach((node) => {
//           this.data = this.data.filter((n) => n.nodeId !== node.nodeId);
//         });
//         break;
//       case ActionType.DELETE:
//         this.data.push(...lastOperation.data);
//         break;
//       case ActionType.UPDATE:
//         lastOperation.data.forEach((node, idx) => {
//           const index = this.data.findIndex((n) => n.nodeId === node.nodeId);
//           if (index !== -1) {
//             this.data[index] = lastOperation.previousNodes[idx];
//           }
//         });
//         break;
//     }
//   }

//   getNodes() {
//     return JSON.stringify(this.nodes);
//   }
// }

// const nodeManager = new NodeManager();

// // 批量添加节点
// nodeManager.addData([
//   { nodeId: "fcdIlNFVLG", nodeType: "text", nodeText: "冶" },
//   { nodeId: "mHtYHVxrUZ", nodeType: "text", nodeText: "沧州西" }
// ]);
// console.log(nodeManager.getNodes());

// // 批量更新节点
// nodeManager.updateData([
//   { nodeId: "fcdIlNFVLG", newNodeData: { nodeText: "新冶" } },
//   { nodeId: "mHtYHVxrUZ", newNodeData: { nodeText: "新沧州西" } }
// ]);
// console.log(nodeManager.getNodes());

// // 批量删除节点
// nodeManager.deleteData(["fcdIlNFVLG", "mHtYHVxrUZ"]);
// console.log(nodeManager.getNodes());

// // 撤销上一步操作
// nodeManager.undo();
// console.log(nodeManager.getNodes());

// // 再次撤销上一步操作
// nodeManager.undo();
// console.log(nodeManager.getNodes());

// // 再次撤销上一步操作
// nodeManager.undo();
// console.log(nodeManager.getNodes());
