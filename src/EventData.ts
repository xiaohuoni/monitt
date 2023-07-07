// 构造事件对象
// var event = {
//     name: eventName,
//     timestamp: new Date().toISOString(),
//     data: eventData
//   };
interface EventDataProps {
  name: string;
  timestamp?: number;
  data: any;
}
export class EventData {
  name: string;
  timestamp?: number;
  data: any;
  constructor({ name, timestamp, data }: EventDataProps) {
    this.name = name;
    this.timestamp = timestamp || new Date().getTime();
    this.data = data;
  }
}
