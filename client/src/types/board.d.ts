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
  file?: string | null,
  fileOrig?: string | null,
  fileSize?: number | null,
  fileWidth?: string | null,
  fileHeight?: string | null,
} 
