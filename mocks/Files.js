const fileDirectory = __dirname + "example_files/";

const files = [
  {
    fileType: "pdf",
    fileName: "sample-file.pdf",
    filePath: fileDirectory + "sample-file.pdf"
  },
  {
    fileType: "docx",
    fileName: "sample-file.docx",
    filePath: fileDirectory + "sample-file.docx"
  },
  {
    fileType: "jpg",
    fileName: "sample-file.jpg",
    filePath: fileDirectory + "sample-file.jpg"
  }
];

export { files };
