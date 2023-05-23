export class Msg {
  Raw: Buffer;
  Key: string;
  constructor(raw: Buffer, key: string){
    this.Raw = raw;
    this.Key = key;
  }
}
