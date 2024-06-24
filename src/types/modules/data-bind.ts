// {
//     "id": 253,
//     "targetId": 267,
//     "name": "测试系统变量",
//     "dsId": 115,
//     "intfcDetail": "webrtc://172.19.136.141:6888",
//     "intfcParam": "[]",
//     "frequence": "60",
//     "exampleData": "",
//     "isExample": false,
//     "isUsed": "T",
//     "targetCode": "GJSMK00000164",
//     "targetDataType": "浮点型",
//     "projectId": 1,
//     "businessId": 1
// },

export interface IDataExtract {
  id: number;
  targetId: number;
  name: string;
  dsId: number;
  intfcDetail: string;
  intfcParam: string;
  frequence: string;
  exampleData: string;
  isExample: boolean;
  isUsed: string;
  targetCode: string;
  targetDataType: string;
  projectId: number;
  businessId: number;
}
