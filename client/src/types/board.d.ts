interface Post {
  board: string,
  thread: number | string,
  subject: string,
  email: string,
  name: string,
  comment: string,
  created?: string
  sage?: boolean,
  bump?: number,
  id?: number,
  password?: string,
  file?: string | undefined,
  fileOrig?: string | undefined,
  fileSize?: number | undefined,
  fileWidth?: string | undefined,
  fileHeight?: string | undefined,
} 
