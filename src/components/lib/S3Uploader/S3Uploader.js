import React, { useState } from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";
import { S3 } from "aws-sdk";
import { useMenu } from "../../../machines/menuMachine";
import { Box, Dialog, IconButton } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const S3Uploader = () => {
  const menu = useMenu();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      // Configure AWS SDK with your credentials
      const s3 = new S3({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      });

      // Specify the S3 bucket and key (filename) for the upload
      const params = {
        Bucket: "box.import",
        Key: file.name,
        Body: file,
      };

      // Upload the file to S3
      await s3.upload(params).promise();
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      alert(
        "Error uploading file. Please try again later." +
          process.env.REACT_APP_AWS_ACCESS_KEY_ID
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <IconButton onClick={menu.handleClick}>
        <UploadFile />
      </IconButton>
      <Dialog {...menu.menuProps}>
        <Box sx={{ p: 2 }}>
          <Input
            type="file"
            accept=".csv, .txt, .xlsx" // Define allowed file types
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default S3Uploader;
