const fileDirectory = "http://localhost:8080/example_files/";

const files = [
  {
    fileType: "pdf",
    fileName: "sample-file.pdf",
    filePath: require("../example_files/pdf.pdf")
  },
  {
    fileType: "docx",
    fileName: "sample-file.docx",
    filePath: require("../example_files/SampleSpec.docx")
  },
  {
    fileType: "jpg",
    fileName: "sample-file.jpg",
    filePath: require("../example_files/picture.jpg")
  }
];


export { files };
