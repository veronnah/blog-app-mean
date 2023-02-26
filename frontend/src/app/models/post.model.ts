export interface PostModel {
  title: string;
  content: string;
  image: File,
  imagePath: string,
  creator?: string,
  _id?: string;
}
