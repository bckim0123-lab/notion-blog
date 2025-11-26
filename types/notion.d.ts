/**
 * Notion 관련 타입 정의
 */

declare module "@notionhq/client" {
  export class Client {
    constructor(options: { auth: string })
    databases: {
      query: (params: any) => Promise<any>
    }
    blocks: {
      children: {
        list: (params: any) => Promise<any>
      }
    }
  }
}
